# 🚢 Batalha Naval Educativa - UniRitter

Um jogo educativo de Batalha Naval desenvolvido em React + Node.js para ensinar conceitos de **matrizes** de forma divertida e interativa. Duas turmas competem em uma emocionante batalha naval online!

## 🎯 Objetivos

### Objetivo Geral
Desenvolver um software educativo que utilize o jogo Batalha Naval para ensinar conceitos de matrizes, promovendo a competição saudável entre duas turmas das escolas ao redor da UniRitter.

### Objetivos Específicos
- ✅ Compreender os conceitos teóricos de matrizes e suas aplicações
- ✅ Desenvolver habilidades de programação e design de software  
- ✅ Fomentar o trabalho em equipe e a colaboração entre alunos
- ✅ Preparar apresentações eficavas para eventos acadêmicos

## 🎮 Características do Jogo

### 📐 Especificações
- **Tabuleiro**: Matriz 6x6 (6 linhas × 6 colunas)
- **Navios disponíveis**:
  - 🛥️ **3 Submarinos**: Ocupam 1 casa cada
  - 🚤 **2 Torpedeiros**: Ocupam 2 casas cada  
  - 🛩️ **1 Porta-Aviões**: Ocupa 3 casas

### 🧮 Conceitos de Matrizes Ensinados
- **Sistema de Coordenadas**: Cada posição identificada por (linha, coluna)
- **Indexação**: Linhas e colunas numeradas de 0 a 5
- **Posicionamento**: Navios devem ser colocados em sequências lineares
- **Operações**: Busca e marcação em estruturas bidimensionais

## 🏗️ Arquitetura do Sistema

### Frontend (React)
- **Framework**: React 18 com Hooks
- **Estilização**: Styled Components
- **Roteamento**: React Router DOM
- **Comunicação**: Socket.io Client
- **Estado**: Context API + useReducer

### Backend (Node.js)
- **Runtime**: Node.js
- **Framework**: Express
- **Comunicação Real-time**: Socket.io
- **Gerenciamento**: Salas e jogos em memória

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 16+)
- npm ou yarn

### Instalação Completa
```bash
# Clonar o repositório
git clone <seu-repositorio>
cd FrontBatalhaNaval

# Instalar todas as dependências (raiz, backend e frontend)
npm run install-all
```

### Executar em Desenvolvimento
```bash
# Rodar frontend e backend simultaneamente
npm run dev

# OU rodar separadamente:

# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
npm run client
```

### URLs de Acesso
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **API Status**: http://localhost:5000/api/status

## 🎯 Como Jogar

### 1. 🏠 Entrada no Lobby
1. Acesse http://localhost:3000
2. Digite o nome da sua turma
3. Digite seu nome
4. Clique em "Entrar no Jogo"

### 2. 🤝 Preparação
1. Aguarde outras turmas se juntarem
2. Clique em "Marcar como Pronto"
3. Aguarde todas as turmas ficarem prontas

### 3. 🚢 Posicionamento dos Navios
1. Selecione um tipo de navio
2. Clique nas posições do tabuleiro para posicionar
3. Navios devem ficar em linha reta (horizontal ou vertical)
4. Repita até posicionar todos os navios

### 4. ⚔️ Fase de Ataque
1. Clique nas posições do tabuleiro inimigo para atacar
2. **💥 Acerto**: Você atingiu um navio (ataque novamente)
3. **🌊 Água**: Você errou (passa a vez)
4. **⚫ Afundado**: Navio completamente destruído

### 5. 🏆 Vitória
A primeira turma a afundar todos os 6 navios inimigos vence!

## 📚 Aspectos Educativos

### 🧮 Conceitos de Matrizes Trabalhados

1. **Definição de Matriz**
   - Arranjo retangular de elementos
   - Organização em linhas e colunas
   - Dimensão 6×6 (36 elementos)

2. **Sistema de Coordenadas**
   - Indexação começando em (0,0)
   - Notação (linha, coluna)
   - Navegação bidimensional

3. **Operações com Matrizes**
   - Acesso a elementos: matriz[i][j]
   - Busca em estruturas bidimensionais
   - Marcação e modificação de estados

4. **Aplicações Práticas**
   - Jogos digitais
   - Sistemas de posicionamento
   - Estruturas de dados

## 🛠️ Estrutura do Projeto

```
FrontBatalhaNaval/
├── package.json                 # Scripts principais
├── README.md                   # Documentação
├── backend/                    # Servidor Node.js
│   ├── package.json
│   └── server.js              # Servidor principal com Socket.io
└── frontend/                  # Aplicação React
    ├── package.json
    ├── public/
    └── src/
        ├── App.js             # Componente principal
        ├── contexts/
        │   └── GameContext.js # Estado global do jogo
        ├── components/
        │   ├── Home.js        # Tela inicial
        │   ├── Tutorial.js    # Explicações e regras
        │   ├── Lobby.js       # Sala de espera
        │   ├── Game.js        # Jogo principal
        │   ├── Tabuleiro.js   # Matriz 6x6
        │   └── NavioSelector.js # Seleção de navios
        └── styles/
            └── GlobalStyle.js # Estilos globais
```

## 🌐 Funcionalidades Online

### Multiplayer Real-time
- ✅ Salas automáticas por turma
- ✅ Sincronização em tempo real
- ✅ Sistema de turnos
- ✅ Reconexão automática

### Gerenciamento de Salas
- ✅ Criação automática de salas
- ✅ Múltiplos jogadores por turma
- ✅ Sistema de "pronto"
- ✅ Limpeza automática de salas vazias

## 🎨 Interface do Usuário

### Design Moderno
- 🎨 Gradientes e efeitos glassmorphism
- 🎯 Interface intuitiva e responsiva
- 🌊 Animações suaves
- 📱 Compatível com dispositivos móveis

### Feedback Visual
- ✅ Indicadores de status em tempo real
- 🎯 Coordenadas visíveis ao passar o mouse
- 📊 Progresso de posicionamento
- 📜 Histórico de ataques

## 🔧 Tecnologias Utilizadas

### Frontend
- **React 18**: Biblioteca para interfaces
- **React Router DOM**: Roteamento
- **Styled Components**: Estilização
- **Socket.io Client**: Comunicação real-time

### Backend
- **Node.js**: Runtime JavaScript
- **Express**: Framework web
- **Socket.io**: WebSockets para tempo real
- **UUID**: Geração de IDs únicos

### DevOps
- **Concurrently**: Execução simultânea
- **Nodemon**: Auto-reload do servidor

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Autores

- **UniRitter** - Desenvolvimento inicial

## 🎓 Uso Educacional

Este projeto foi desenvolvido especificamente para fins educacionais, sendo ideal para:

- 📚 Aulas de Matemática (Matrizes)
- 💻 Cursos de Programação  
- 🎮 Projetos interdisciplinares
- 🏫 Competições entre turmas
- 📊 Demonstrações de conceitos abstratos

## 📞 Suporte

Para dúvidas ou suporte, entre em contato:
- 📧 Email: suporte@uniritter.edu.br
- 🌐 Website: https://www.uniritter.edu.br

---

**Desenvolvido com ❤️ para educação - UniRitter 2024** 