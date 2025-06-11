import React, { createContext, useContext, useReducer, useEffect } from 'react';
import io from 'socket.io-client';

const GameContext = createContext();

const initialState = {
  socket: null,
  connected: false,
  sala: null,
  jogador: {
    nome: '',
    turma: ''
  },
  jogo: {
    fase: 'menu', // menu, lobby, posicionamento, jogando, finalizado
    tabuleiro: Array(6).fill().map(() => Array(6).fill({
      tipo: 'agua',
      atingido: false,
      navio: null
    })),
    tabuleiroInimigo: Array(6).fill().map(() => Array(6).fill({
      atingido: false,
      resultado: null
    })),
    navios: {
      submarino: { tamanho: 1, quantidade: 3, restantes: 3 },
      torpedeiro: { tamanho: 2, quantidade: 2, restantes: 2 },
      portaAvioes: { tamanho: 3, quantidade: 1, restantes: 1 }
    },
    navioSelecionado: null,
    posicoesTemp: [],
    minhaTurma: '',
    turmaInimiga: '',
    turnoAtual: null,
    minhaVez: false,
    vencedor: null,
    historico: []
  },
  ui: {
    loading: false,
    erro: '',
    sucesso: '',
    tutorial: false
  }
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_SOCKET':
      return { ...state, socket: action.payload };
    
    case 'SET_CONNECTED':
      return { ...state, connected: action.payload };
    
    case 'SET_JOGADOR':
      return { 
        ...state, 
        jogador: { ...state.jogador, ...action.payload }
      };
    
    case 'SET_SALA':
      return { ...state, sala: action.payload };
    
    case 'SET_FASE':
      return { 
        ...state, 
        jogo: { ...state.jogo, fase: action.payload }
      };
    
    case 'INICIAR_JOGO':
      return {
        ...state,
        jogo: {
          ...state.jogo,
          fase: 'posicionamento',
          minhaTurma: action.payload.minhaTurma,
          turmaInimiga: action.payload.turmaInimiga
        }
      };
    
    case 'SELECIONAR_NAVIO':
      return {
        ...state,
        jogo: {
          ...state.jogo,
          navioSelecionado: action.payload,
          posicoesTemp: []
        }
      };
    
    case 'SET_POSICOES_TEMP':
      return {
        ...state,
        jogo: {
          ...state.jogo,
          posicoesTemp: action.payload
        }
      };
    
    case 'POSICIONAR_NAVIO':
      const { tipo, posicoes } = action.payload;
      const novoTabuleiro = [...state.jogo.tabuleiro];
      const navioId = `${tipo}_${Date.now()}`;
      
      posicoes.forEach(pos => {
        novoTabuleiro[pos.linha][pos.coluna] = {
          tipo: 'navio',
          atingido: false,
          navio: { tipo, id: navioId }
        };
      });
      
      const novosNavios = { ...state.jogo.navios };
      novosNavios[tipo].restantes--;
      
      return {
        ...state,
        jogo: {
          ...state.jogo,
          tabuleiro: novoTabuleiro,
          navios: novosNavios,
          navioSelecionado: null,
          posicoesTemp: []
        }
      };
    
    case 'FASE_ATAQUE':
      return {
        ...state,
        jogo: {
          ...state.jogo,
          fase: 'jogando',
          turnoAtual: action.payload.jogadorAtual,
          minhaVez: action.payload.minhaVez
        }
      };
    
    case 'ATAQUE_REALIZADO':
      const { ataque, proximoJogador } = action.payload;
      const novoTabuleiroInimigo = [...state.jogo.tabuleiroInimigo];
      
      novoTabuleiroInimigo[ataque.linha][ataque.coluna] = {
        atingido: true,
        resultado: ataque.resultado
      };
      
      const novoHistorico = [...state.jogo.historico, ataque];
      
      return {
        ...state,
        jogo: {
          ...state.jogo,
          tabuleiroInimigo: novoTabuleiroInimigo,
          turnoAtual: proximoJogador,
          minhaVez: state.jogo.minhaTurma === (proximoJogador === 1 ? action.payload.turmas[0] : action.payload.turmas[1]),
          historico: novoHistorico
        }
      };
    
    case 'ATAQUE_RECEBIDO':
      const { linha, coluna, resultado } = action.payload;
      const tabuleiroAtualizado = [...state.jogo.tabuleiro];
      tabuleiroAtualizado[linha][coluna].atingido = true;
      
      return {
        ...state,
        jogo: {
          ...state.jogo,
          tabuleiro: tabuleiroAtualizado
        }
      };
    
    case 'JOGO_FINALIZADO':
      return {
        ...state,
        jogo: {
          ...state.jogo,
          fase: 'finalizado',
          vencedor: action.payload.vencedor
        }
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        ui: { ...state.ui, loading: action.payload }
      };
    
    case 'SET_ERRO':
      return {
        ...state,
        ui: { ...state.ui, erro: action.payload }
      };
    
    case 'SET_SUCESSO':
      return {
        ...state,
        ui: { ...state.ui, sucesso: action.payload }
      };
    
    case 'LIMPAR_MENSAGENS':
      return {
        ...state,
        ui: { ...state.ui, erro: '', sucesso: '' }
      };
    
    case 'RESET_JOGO':
      return {
        ...initialState,
        socket: state.socket,
        connected: state.connected
      };
    
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    const socket = io('http://localhost:5001');
    dispatch({ type: 'SET_SOCKET', payload: socket });

    socket.on('connect', () => {
      dispatch({ type: 'SET_CONNECTED', payload: true });
    });

    socket.on('disconnect', () => {
      dispatch({ type: 'SET_CONNECTED', payload: false });
    });

    socket.on('sala-info', (sala) => {
      dispatch({ type: 'SET_SALA', payload: sala });
      dispatch({ type: 'SET_ERRO', payload: null });
    });

    socket.on('sala-atualizada', (sala) => {
      dispatch({ type: 'SET_SALA', payload: sala });
    });

    socket.on('jogo-iniciado', ({ turmas }) => {
      const minhaTurma = state.jogador.turma;
      const turmaInimiga = turmas.find(t => t !== minhaTurma);
      
      dispatch({ 
        type: 'INICIAR_JOGO', 
        payload: { minhaTurma, turmaInimiga }
      });
    });

    socket.on('resultado-posicionamento', (resultado) => {
      if (resultado.sucesso) {
        dispatch({ type: 'SET_SUCESSO', payload: 'Navio posicionado com sucesso!' });
      } else {
        dispatch({ type: 'SET_ERRO', payload: resultado.erro });
      }
    });

    socket.on('fase-ataque', ({ jogadorAtual, turmas }) => {
      const minhaTurma = state.jogador.turma;
      const minhaVez = minhaTurma === turmas[jogadorAtual - 1];
      
      dispatch({ 
        type: 'FASE_ATAQUE', 
        payload: { jogadorAtual, minhaVez }
      });
    });

    socket.on('ataque-realizado', (dados) => {
      dispatch({ type: 'ATAQUE_REALIZADO', payload: dados });
    });

    socket.on('jogo-finalizado', ({ vencedor }) => {
      dispatch({ type: 'JOGO_FINALIZADO', payload: { vencedor } });
    });

    socket.on('erro-ataque', (erro) => {
      dispatch({ type: 'SET_ERRO', payload: erro });
    });

    socket.on('erro-sala', (erro) => {
      dispatch({ type: 'SET_ERRO', payload: erro });
    });

    socket.on('jogador-entrou', ({ turma, jogador }) => {
      console.log(`${jogador} entrou na turma ${turma}`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const actions = {
    entrarSala: (nomeTurma, nomeJogador) => {
      if (state.socket) {
        dispatch({ type: 'SET_JOGADOR', payload: { nome: nomeJogador, turma: nomeTurma } });
        state.socket.emit('entrar-sala', { nomeTurma, nomeJogador });
      }
    },

    entrarSalaPorId: (salaId, nomeJogador) => {
      if (state.socket) {
        dispatch({ type: 'SET_JOGADOR', payload: { nome: nomeJogador, turma: 'Convidado' } });
        state.socket.emit('entrar-sala-por-id', { salaId, nomeJogador });
      }
    },

    marcarPronto: () => {
      if (state.socket) {
        state.socket.emit('marcar-pronto');
      }
    },

    selecionarNavio: (tipo) => {
      dispatch({ type: 'SELECIONAR_NAVIO', payload: tipo });
    },

    setPosicoesTemp: (posicoes) => {
      dispatch({ type: 'SET_POSICOES_TEMP', payload: posicoes });
    },

    posicionarNavio: (tipo, posicoes) => {
      if (state.socket) {
        state.socket.emit('posicionar-navio', { tipo, posicoes });
        dispatch({ type: 'POSICIONAR_NAVIO', payload: { tipo, posicoes } });
      }
    },

    atacar: (linha, coluna) => {
      if (state.socket && state.jogo.minhaVez) {
        state.socket.emit('atacar', { linha, coluna });
      }
    },

    limparMensagens: () => {
      dispatch({ type: 'LIMPAR_MENSAGENS' });
    },

    resetJogo: () => {
      dispatch({ type: 'RESET_JOGO' });
    }
  };

  return (
    <GameContext.Provider value={{ state, actions }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame deve ser usado dentro de um GameProvider');
  }
  return context;
} 