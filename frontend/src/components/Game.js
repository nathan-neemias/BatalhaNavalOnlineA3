import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useGame } from '../contexts/GameContext';
import Tabuleiro from './Tabuleiro';
import NavioSelector from './NavioSelector';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
`;

const GameHeader = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  h2 {
    color: white;
    font-size: 1.8rem;
    margin-bottom: 10px;
  }
  
  .game-info {
    display: flex;
    justify-content: center;
    gap: 30px;
    flex-wrap: wrap;
    margin-bottom: 15px;
    
    .info-item {
      color: rgba(255, 255, 255, 0.9);
      font-size: 1rem;
      
      strong {
        color: white;
      }
    }
  }
  
  .turn-indicator {
    padding: 10px 20px;
    border-radius: 25px;
    font-weight: bold;
    font-size: 1.1rem;
    
    &.my-turn {
      background: #4CAF50;
      color: white;
      animation: pulse 2s infinite;
    }
    
    &.enemy-turn {
      background: #f44336;
      color: white;
    }
    
    &.positioning {
      background: #FF9800;
      color: white;
    }
  }
`;

const GameContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 20px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const TabuleiroSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  h3 {
    color: white;
    text-align: center;
    margin-bottom: 20px;
    font-size: 1.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  
  .coordinates-info {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 20px;
    text-align: center;
    
    h4 {
      color: #FFD700;
      margin-bottom: 8px;
    }
    
    p {
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.9rem;
      margin-bottom: 5px;
    }
  }
`;

const PositioningPanel = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  h3 {
    color: white;
    text-align: center;
    margin-bottom: 20px;
    font-size: 1.4rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 20px;
  
  button {
    padding: 12px 25px;
    border-radius: 25px;
    font-size: 1rem;
    font-weight: bold;
    transition: all 0.3s ease;
    
    &.primary {
      background: linear-gradient(45deg, #667eea, #764ba2);
      color: white;
    }
    
    &.success {
      background: #4CAF50;
      color: white;
    }
    
    &.danger {
      background: #f44336;
      color: white;
    }
    
    &.warning {
      background: #FF9800;
      color: white;
    }
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
    }
  }
`;

const MessagePanel = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  z-index: 1000;
  border: 2px solid #FFD700;
  min-width: 300px;
  
  &.success {
    border-color: #4CAF50;
  }
  
  &.error {
    border-color: #f44336;
  }
  
  h3 {
    color: white;
    margin-bottom: 15px;
    font-size: 1.5rem;
  }
  
  p {
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 20px;
    line-height: 1.6;
  }
  
  button {
    background: linear-gradient(45deg, #667eea, #764ba2);
    color: white;
    padding: 10px 20px;
    border-radius: 25px;
    font-weight: bold;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
    }
  }
`;

const HistoryPanel = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  margin-top: 20px;
  max-height: 200px;
  overflow-y: auto;
  
  h4 {
    color: white;
    margin-bottom: 15px;
    text-align: center;
  }
  
  .history-item {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 8px;
    font-size: 0.9rem;
    
    .turn {
      color: #FFD700;
      font-weight: bold;
    }
    
    .coordinate {
      color: white;
      font-weight: bold;
    }
    
    .result {
      &.agua { color: #4FC3F7; }
      &.acerto { color: #4CAF50; }
      &.afundado { color: #f44336; }
    }
  }
`;

function Game() {
  const navigate = useNavigate();
  const { state, actions } = useGame();
  const [hoveredCell, setHoveredCell] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (state.jogo.fase === 'menu') {
      navigate('/');
    }
  }, [state.jogo.fase, navigate]);

  useEffect(() => {
    if (state.ui.erro) {
      setMessage({ type: 'error', text: state.ui.erro });
    } else if (state.ui.sucesso) {
      setMessage({ type: 'success', text: state.ui.sucesso });
    }
  }, [state.ui.erro, state.ui.sucesso]);

  useEffect(() => {
    if (state.jogo.vencedor) {
      const isVitoria = state.jogo.vencedor === state.jogo.minhaTurma;
      setMessage({
        type: isVitoria ? 'success' : 'error',
        text: isVitoria ? 
          '🎉 Parabéns! Sua turma venceu!' : 
          '😢 Sua turma foi derrotada.',
        persistent: true
      });
    }
  }, [state.jogo.vencedor, state.jogo.minhaTurma]);

  const handleCellClick = (linha, coluna) => {
    if (state.jogo.fase === 'posicionamento') {
      handlePositioningClick(linha, coluna);
    } else if (state.jogo.fase === 'jogando' && state.jogo.minhaVez) {
      handleAttackClick(linha, coluna);
    }
  };

  const handlePositioningClick = (linha, coluna) => {
    if (!state.jogo.navioSelecionado) {
      setMessage({ type: 'error', text: 'Selecione um navio primeiro!' });
      return;
    }

    const navio = state.jogo.navios[state.jogo.navioSelecionado];
    if (navio.restantes <= 0) {
      setMessage({ type: 'error', text: 'Todos os navios deste tipo já foram posicionados!' });
      return;
    }

    const novasPosicoes = [...state.jogo.posicoesTemp, { linha, coluna }];
    
    if (novasPosicoes.length === navio.tamanho) {
      // Posicionar o navio
      actions.posicionarNavio(state.jogo.navioSelecionado, novasPosicoes);
    } else {
      // Adicionar posição temporária
      actions.setPosicoesTemp(novasPosicoes);
    }
  };

  const handleAttackClick = (linha, coluna) => {
    if (state.jogo.tabuleiroInimigo[linha][coluna].atingido) {
      setMessage({ type: 'error', text: 'Esta posição já foi atacada!' });
      return;
    }
    
    actions.atacar(linha, coluna);
  };

  const clearMessage = () => {
    setMessage(null);
    actions.limparMensagens();
  };

  const limparPosicionamento = () => {
    actions.setPosicoesTemp([]);
    actions.selecionarNavio(null);
  };

  const voltarLobby = () => {
    actions.resetJogo();
    navigate('/lobby');
  };

  const getGameStatus = () => {
    if (state.jogo.fase === 'posicionamento') {
      return 'Posicione seus navios na matriz';
    } else if (state.jogo.fase === 'jogando') {
      return state.jogo.minhaVez ? 'Sua vez de atacar!' : 'Aguarde sua vez...';
    } else if (state.jogo.fase === 'finalizado') {
      return state.jogo.vencedor === state.jogo.minhaTurma ? 'Vitória!' : 'Derrota';
    }
    return 'Carregando...';
  };

  const getTurnIndicatorClass = () => {
    if (state.jogo.fase === 'posicionamento') return 'positioning';
    if (state.jogo.fase === 'jogando') return state.jogo.minhaVez ? 'my-turn' : 'enemy-turn';
    return '';
  };

  const todosNaviosPosicionados = () => {
    return Object.values(state.jogo.navios).every(navio => navio.restantes === 0);
  };

  return (
    <Container className="fade-in">
      <GameHeader>
        <h2>🚢 Batalha Naval - {state.jogo.minhaTurma}</h2>
        <div className="game-info">
          <div className="info-item">
            <strong>Fase:</strong> {state.jogo.fase === 'posicionamento' ? 'Posicionamento' : 'Ataque'}
          </div>
          <div className="info-item">
            <strong>Turma Inimiga:</strong> {state.jogo.turmaInimiga}
          </div>
          {hoveredCell && (
            <div className="info-item">
              <strong>Posição:</strong> ({hoveredCell.linha}, {hoveredCell.coluna})
            </div>
          )}
        </div>
        <div className={`turn-indicator ${getTurnIndicatorClass()}`}>
          {getGameStatus()}
        </div>
      </GameHeader>

      <GameContent>
        <TabuleiroSection>
          <h3>
            🏠 Seu Tabuleiro
            {state.jogo.fase === 'posicionamento' && ' (Posicionamento)'}
          </h3>
          
          {state.jogo.fase === 'posicionamento' && (
            <div className="coordinates-info">
              <h4>🧮 Sistema de Coordenadas</h4>
              <p>Cada célula tem coordenadas (linha, coluna)</p>
              <p>Linha: 0-5 (vertical) | Coluna: 0-5 (horizontal)</p>
            </div>
          )}
          
          <Tabuleiro
            tabuleiro={state.jogo.tabuleiro}
            tipo="proprio"
            onCellClick={handleCellClick}
            onCellHover={setHoveredCell}
            posicoesTemp={state.jogo.posicoesTemp}
            habilitado={state.jogo.fase === 'posicionamento'}
          />
        </TabuleiroSection>

        {state.jogo.fase === 'posicionamento' ? (
          <PositioningPanel>
            <h3>🎯 Selecionar Navios</h3>
            <NavioSelector
              navios={state.jogo.navios}
              navioSelecionado={state.jogo.navioSelecionado}
              onSelectNavio={actions.selecionarNavio}
            />
            
            <ActionButtons>
              <button 
                className="warning" 
                onClick={limparPosicionamento}
                disabled={state.jogo.posicoesTemp.length === 0}
              >
                🗑️ Limpar Seleção
              </button>
              
              {todosNaviosPosicionados() && (
                <button className="success">
                  ✅ Todos os navios posicionados!
                </button>
              )}
            </ActionButtons>
          </PositioningPanel>
        ) : (
          <TabuleiroSection>
            <h3>
              🎯 Tabuleiro Inimigo
              {state.jogo.minhaVez && ' (Clique para atacar)'}
            </h3>
            
            <div className="coordinates-info">
              <h4>🎯 Seus Ataques</h4>
              <p>💥 Acerto | 🌊 Água | ⚫ Afundado</p>
            </div>
            
            <Tabuleiro
              tabuleiro={state.jogo.tabuleiroInimigo}
              tipo="inimigo"
              onCellClick={handleCellClick}
              onCellHover={setHoveredCell}
              habilitado={state.jogo.minhaVez && state.jogo.fase === 'jogando'}
            />
            
            <HistoryPanel>
              <h4>📜 Histórico de Ataques</h4>
              {state.jogo.historico.slice(-5).reverse().map((ataque, index) => (
                <div key={index} className="history-item">
                  <span className="turn">Turno {ataque.turno}:</span>{' '}
                  <span className="coordinate">({ataque.linha}, {ataque.coluna})</span>{' '}
                  - <span className={`result ${ataque.resultado}`}>
                    {ataque.resultado === 'agua' ? '🌊 Água' : 
                     ataque.resultado === 'acerto' ? '💥 Acerto' : '⚫ Afundado'}
                  </span>
                </div>
              ))}
              {state.jogo.historico.length === 0 && (
                <p style={{color: 'rgba(255,255,255,0.6)', textAlign: 'center'}}>
                  Nenhum ataque realizado ainda
                </p>
              )}
            </HistoryPanel>
          </TabuleiroSection>
        )}
      </GameContent>

      <ActionButtons>
        <button className="danger" onClick={voltarLobby}>
          🚪 Sair do Jogo
        </button>
        
        <button className="primary" onClick={() => navigate('/tutorial')}>
          📚 Ver Regras
        </button>
      </ActionButtons>

      {message && (
        <MessagePanel className={message.type}>
          <h3>
            {message.type === 'success' ? '✅' : '❌'} 
            {message.type === 'success' ? 'Sucesso!' : 'Atenção!'}
          </h3>
          <p>{message.text}</p>
          {!message.persistent && (
            <button onClick={clearMessage}>OK</button>
          )}
          {message.persistent && (
            <button onClick={voltarLobby}>Voltar ao Lobby</button>
          )}
        </MessagePanel>
      )}
    </Container>
  );
}

export default Game; 