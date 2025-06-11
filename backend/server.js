const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Armazenamento em memória para salas e jogos
const salas = new Map();
const jogadores = new Map();

// Configurações do jogo
const NAVIOS = {
  submarino: { tamanho: 1, quantidade: 3 },
  torpedeiro: { tamanho: 2, quantidade: 2 },
  portaAvioes: { tamanho: 3, quantidade: 1 }
};

class Jogo {
  constructor(salaId, turma1, turma2) {
    this.id = salaId;
    this.turma1 = turma1;
    this.turma2 = turma2;
    this.jogadorAtual = 1;
    this.fase = 'posicionamento'; // posicionamento, jogando, finalizado
    this.tabuleiros = {
      1: this.criarTabuleiro(),
      2: this.criarTabuleiro()
    };
    this.navios = {
      1: { ...NAVIOS },
      2: { ...NAVIOS }
    };
    this.naviosRestantes = {
      1: 6, // 3 submarinos + 2 torpedeiros + 1 porta-aviões
      2: 6
    };
    this.historico = [];
  }

  criarTabuleiro() {
    return Array(6).fill().map(() => Array(6).fill({
      tipo: 'agua',
      atingido: false,
      navio: null
    }));
  }

  posicionarNavio(jogador, tipo, posicoes) {
    if (this.navios[jogador][tipo].quantidade <= 0) {
      return { sucesso: false, erro: 'Todos os navios deste tipo já foram posicionados' };
    }

    const tamanhoEsperado = NAVIOS[tipo].tamanho;
    if (posicoes.length !== tamanhoEsperado) {
      return { sucesso: false, erro: `${tipo} deve ocupar ${tamanhoEsperado} casa(s)` };
    }

    // Verificar se as posições são válidas
    for (let pos of posicoes) {
      if (pos.linha < 0 || pos.linha >= 6 || pos.coluna < 0 || pos.coluna >= 6) {
        return { sucesso: false, erro: 'Posição fora do tabuleiro' };
      }
      if (this.tabuleiros[jogador][pos.linha][pos.coluna].tipo !== 'agua') {
        return { sucesso: false, erro: 'Posição já ocupada' };
      }
    }

    // Verificar se as posições são consecutivas (horizontal ou vertical)
    if (posicoes.length > 1) {
      const horizontal = posicoes.every(pos => pos.linha === posicoes[0].linha);
      const vertical = posicoes.every(pos => pos.coluna === posicoes[0].coluna);
      
      if (!horizontal && !vertical) {
        return { sucesso: false, erro: 'Navio deve ser posicionado em linha reta' };
      }

      if (horizontal) {
        posicoes.sort((a, b) => a.coluna - b.coluna);
        for (let i = 1; i < posicoes.length; i++) {
          if (posicoes[i].coluna - posicoes[i-1].coluna !== 1) {
            return { sucesso: false, erro: 'Posições devem ser consecutivas' };
          }
        }
      } else {
        posicoes.sort((a, b) => a.linha - b.linha);
        for (let i = 1; i < posicoes.length; i++) {
          if (posicoes[i].linha - posicoes[i-1].linha !== 1) {
            return { sucesso: false, erro: 'Posições devem ser consecutivas' };
          }
        }
      }
    }

    // Posicionar o navio
    const navioId = uuidv4();
    for (let pos of posicoes) {
      this.tabuleiros[jogador][pos.linha][pos.coluna] = {
        tipo: 'navio',
        atingido: false,
        navio: { tipo, id: navioId }
      };
    }

    this.navios[jogador][tipo].quantidade--;
    return { sucesso: true };
  }

  atacar(jogadorAtacante, linha, coluna) {
    if (this.fase !== 'jogando') {
      return { sucesso: false, erro: 'Jogo não está na fase de ataque' };
    }

    if (this.jogadorAtual !== jogadorAtacante) {
      return { sucesso: false, erro: 'Não é sua vez de atacar' };
    }

    const jogadorDefensor = jogadorAtacante === 1 ? 2 : 1;
    const celula = this.tabuleiros[jogadorDefensor][linha][coluna];

    if (celula.atingido) {
      return { sucesso: false, erro: 'Posição já foi atacada' };
    }

    celula.atingido = true;
    let resultado = 'agua';

    if (celula.tipo === 'navio') {
      resultado = 'acerto';
      
      // Verificar se o navio foi afundado
      const navioAfundado = this.verificarNavioAfundado(jogadorDefensor, celula.navio.id);
      if (navioAfundado) {
        resultado = 'afundado';
        this.naviosRestantes[jogadorDefensor]--;
      }
    }

    const ataque = {
      jogador: jogadorAtacante,
      linha,
      coluna,
      resultado,
      turno: this.historico.length + 1
    };

    this.historico.push(ataque);

    // Verificar vitória
    if (this.naviosRestantes[jogadorDefensor] === 0) {
      this.fase = 'finalizado';
      ataque.vencedor = jogadorAtacante;
    } else if (resultado === 'agua') {
      // Só troca de jogador se errou
      this.jogadorAtual = jogadorDefensor;
    }

    return { sucesso: true, ataque };
  }

  verificarNavioAfundado(jogador, navioId) {
    for (let linha = 0; linha < 6; linha++) {
      for (let coluna = 0; coluna < 6; coluna++) {
        const celula = this.tabuleiros[jogador][linha][coluna];
        if (celula.navio && celula.navio.id === navioId && !celula.atingido) {
          return false;
        }
      }
    }
    return true;
  }

  podeIniciarJogo(jogador) {
    return Object.values(this.navios[jogador]).every(navio => navio.quantidade === 0);
  }
}

// Rotas da API
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'online',
    salas: salas.size,
    jogadores: jogadores.size
  });
});

// Socket.io
io.on('connection', (socket) => {
  console.log('Jogador conectado:', socket.id);

  socket.on('entrar-sala', ({ nomeTurma, nomeJogador }) => {
    let sala = Array.from(salas.values()).find(s => 
      s.turma1.nome === nomeTurma || s.turma2.nome === nomeTurma
    );

    if (!sala) {
      // Criar nova sala
      const salaId = uuidv4();
      sala = {
        id: salaId,
        turma1: { nome: nomeTurma, jogadores: [], pronto: false },
        turma2: { nome: '', jogadores: [], pronto: false },
        jogo: null,
        criada: new Date()
      };
      salas.set(salaId, sala);
    }

    // Adicionar jogador à turma
    let turma = sala.turma1.nome === nomeTurma ? sala.turma1 : sala.turma2;
    if (turma.nome === '') {
      turma.nome = nomeTurma;
    }

    if (!turma.jogadores.find(j => j.nome === nomeJogador)) {
      turma.jogadores.push({ 
        id: socket.id, 
        nome: nomeJogador,
        pronto: false
      });
    }

    jogadores.set(socket.id, {
      salaId: sala.id,
      turma: nomeTurma,
      nome: nomeJogador
    });

    socket.join(sala.id);
    socket.emit('sala-info', sala);
    socket.to(sala.id).emit('jogador-entrou', { turma: nomeTurma, jogador: nomeJogador });
  });

  socket.on('entrar-sala-por-id', ({ salaId, nomeJogador }) => {
    const sala = salas.get(salaId);
    
    if (!sala) {
      socket.emit('erro-sala', 'Sala não encontrada. Verifique o ID da sala.');
      return;
    }

    // Determinar em qual turma adicionar o jogador
    let turma;
    let nomeTurma;

    if (sala.turma2.nome === '' || sala.turma2.jogadores.length === 0) {
      // Adicionar à turma 2 se estiver vazia
      turma = sala.turma2;
      nomeTurma = sala.turma2.nome || 'Turma Convidada';
      sala.turma2.nome = nomeTurma;
    } else if (sala.turma1.jogadores.length <= sala.turma2.jogadores.length) {
      // Adicionar à turma com menos jogadores
      turma = sala.turma1;
      nomeTurma = sala.turma1.nome;
    } else {
      turma = sala.turma2;
      nomeTurma = sala.turma2.nome;
    }

    // Verificar se o jogador já existe na sala
    const jogadorExistente = turma.jogadores.find(j => j.nome === nomeJogador);
    if (jogadorExistente) {
      socket.emit('erro-sala', 'Já existe um jogador com este nome nesta turma.');
      return;
    }

    // Adicionar jogador à turma
    turma.jogadores.push({ 
      id: socket.id, 
      nome: nomeJogador,
      pronto: false
    });

    jogadores.set(socket.id, {
      salaId: sala.id,
      turma: nomeTurma,
      nome: nomeJogador
    });

    socket.join(sala.id);
    socket.emit('sala-info', sala);
    socket.to(sala.id).emit('jogador-entrou', { turma: nomeTurma, jogador: nomeJogador });
  });

  socket.on('marcar-pronto', () => {
    const jogador = jogadores.get(socket.id);
    if (!jogador) return;

    const sala = salas.get(jogador.salaId);
    if (!sala) return;

    const turma = sala.turma1.nome === jogador.turma ? sala.turma1 : sala.turma2;
    const jogadorInfo = turma.jogadores.find(j => j.id === socket.id);
    if (jogadorInfo) {
      jogadorInfo.pronto = !jogadorInfo.pronto;
    }

    // Verificar se a turma está pronta (pelo menos 1 jogador pronto)
    turma.pronto = turma.jogadores.some(j => j.pronto);

    io.to(sala.id).emit('sala-atualizada', sala);

    // Iniciar jogo se ambas as turmas estão prontas
    if (sala.turma1.pronto && sala.turma2.pronto && sala.turma2.nome !== '') {
      sala.jogo = new Jogo(sala.id, sala.turma1.nome, sala.turma2.nome);
      io.to(sala.id).emit('jogo-iniciado', {
        navios: NAVIOS,
        turmas: [sala.turma1.nome, sala.turma2.nome]
      });
    }
  });

  socket.on('posicionar-navio', ({ tipo, posicoes }) => {
    const jogador = jogadores.get(socket.id);
    if (!jogador) return;

    const sala = salas.get(jogador.salaId);
    if (!sala || !sala.jogo) return;

    const numeroJogador = sala.turma1.nome === jogador.turma ? 1 : 2;
    const resultado = sala.jogo.posicionarNavio(numeroJogador, tipo, posicoes);

    socket.emit('resultado-posicionamento', resultado);

    if (resultado.sucesso) {
      // Verificar se todos os navios foram posicionados
      if (sala.jogo.podeIniciarJogo(numeroJogador)) {
        socket.emit('posicionamento-completo');
        
        // Verificar se ambos os jogadores terminaram o posicionamento
        if (sala.jogo.podeIniciarJogo(1) && sala.jogo.podeIniciarJogo(2)) {
          sala.jogo.fase = 'jogando';
          io.to(sala.id).emit('fase-ataque', {
            jogadorAtual: sala.jogo.jogadorAtual,
            turmas: [sala.turma1.nome, sala.turma2.nome]
          });
        }
      }
    }
  });

  socket.on('atacar', ({ linha, coluna }) => {
    const jogador = jogadores.get(socket.id);
    if (!jogador) return;

    const sala = salas.get(jogador.salaId);
    if (!sala || !sala.jogo) return;

    const numeroJogador = sala.turma1.nome === jogador.turma ? 1 : 2;
    const resultado = sala.jogo.atacar(numeroJogador, linha, coluna);

    if (resultado.sucesso) {
      io.to(sala.id).emit('ataque-realizado', {
        ataque: resultado.ataque,
        proximoJogador: sala.jogo.jogadorAtual,
        fase: sala.jogo.fase
      });

      if (sala.jogo.fase === 'finalizado') {
        const vencedor = resultado.ataque.vencedor === 1 ? sala.turma1.nome : sala.turma2.nome;
        io.to(sala.id).emit('jogo-finalizado', { vencedor });
      }
    } else {
      socket.emit('erro-ataque', resultado.erro);
    }
  });

  socket.on('disconnect', () => {
    console.log('Jogador desconectado:', socket.id);
    
    const jogador = jogadores.get(socket.id);
    if (jogador) {
      const sala = salas.get(jogador.salaId);
      if (sala) {
        // Remover jogador da turma
        const turma = sala.turma1.nome === jogador.turma ? sala.turma1 : sala.turma2;
        turma.jogadores = turma.jogadores.filter(j => j.id !== socket.id);
        
        socket.to(sala.id).emit('jogador-saiu', { 
          turma: jogador.turma, 
          jogador: jogador.nome 
        });

        // Remover sala se vazia
        if (sala.turma1.jogadores.length === 0 && sala.turma2.jogadores.length === 0) {
          salas.delete(sala.id);
        }
      }
      jogadores.delete(socket.id);
    }
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Frontend deve estar em http://localhost:3000`);
}); 