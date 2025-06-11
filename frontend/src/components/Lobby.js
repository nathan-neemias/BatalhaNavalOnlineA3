import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useGame } from '../contexts/GameContext';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const LobbyInfo = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  
  h2 {
    color: white;
    font-size: 2rem;
    margin-bottom: 15px;
  }
  
  p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.1rem;
    margin-bottom: 10px;
  }
`;

const SalaIdCard = styled.div`
  background: rgba(255, 193, 7, 0.2);
  border: 2px solid #FFC107;
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  margin: 20px 0;
  
  h3 {
    color: #FFC107;
    margin-bottom: 15px;
    font-size: 1.2rem;
  }
  
  .sala-id-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    flex-wrap: wrap;
  }
  
  .sala-id {
    font-family: 'Courier New', monospace;
    font-size: 1.1rem;
    font-weight: bold;
    color: white;
    background: rgba(0, 0, 0, 0.3);
    padding: 12px 20px;
    border-radius: 8px;
    word-break: break-all;
    user-select: all;
    cursor: text;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(0, 0, 0, 0.5);
      border-color: #FFC107;
    }
  }
  
  .copy-button {
    background: #FFC107;
    color: #000;
    padding: 10px 15px;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: bold;
    transition: all 0.3s ease;
    
    &:hover {
      background: #FFD54F;
      transform: translateY(-2px);
    }
    
    &:active {
      background: #FF8F00;
    }
  }
  
  .share-text {
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.9rem;
    margin-top: 10px;
  }
  
  .copy-success {
    color: #4CAF50;
    font-size: 0.8rem;
    margin-top: 5px;
    opacity: 0;
    transition: opacity 0.3s ease;
    
    &.show {
      opacity: 1;
    }
  }
`;

const TeamsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TeamCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 25px;
  border: 2px solid ${props => props.ready ? '#4CAF50' : 'rgba(255, 255, 255, 0.2)'};
  transition: all 0.3s ease;
  
  &.my-team {
    border-color: #FFD700;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
  }
  
  .team-header {
    text-align: center;
    margin-bottom: 20px;
    
    h3 {
      color: white;
      font-size: 1.5rem;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    
    .status {
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: bold;
      
      &.ready {
        background: #4CAF50;
        color: white;
      }
      
      &.waiting {
        background: #FF9800;
        color: white;
      }
      
      &.empty {
        background: #9E9E9E;
        color: white;
      }
    }
  }
  
  .players-list {
    .player-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 15px;
      margin-bottom: 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      
      .player-name {
        color: white;
        font-weight: bold;
      }
      
      .player-status {
        padding: 3px 10px;
        border-radius: 15px;
        font-size: 0.8rem;
        
        &.ready {
          background: #4CAF50;
          color: white;
        }
        
        &.not-ready {
          background: #f44336;
          color: white;
        }
      }
    }
    
    .no-players {
      text-align: center;
      color: rgba(255, 255, 255, 0.6);
      padding: 20px;
      font-style: italic;
    }
  }
`;

const ActionButton = styled.button`
  background: ${props => props.ready ? '#f44336' : '#4CAF50'};
  color: white;
  padding: 15px 30px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: bold;
  transition: all 0.3s ease;
  display: block;
  margin: 20px auto;
  min-width: 200px;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 1rem;
  transition: all 0.3s ease;
  margin-bottom: 20px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

const WaitingMessage = styled.div`
  background: rgba(255, 193, 7, 0.2);
  border: 2px solid #FFC107;
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  margin: 20px 0;
  
  .icon {
    font-size: 3rem;
    margin-bottom: 15px;
  }
  
  h4 {
    color: #FFC107;
    margin-bottom: 10px;
  }
  
  p {
    color: rgba(255, 255, 255, 0.9);
  }
`;

function Lobby() {
  const navigate = useNavigate();
  const { state, actions } = useGame();
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (!state.sala) {
      navigate('/');
      return;
    }
    
    if (state.fase === 'posicionando') {
      navigate('/game');
    }
  }, [state.sala, state.fase, navigate]);

  const handleBack = () => {
    navigate('/');
  };

  const handleToggleReady = () => {
    actions.marcarPronto();
  };

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(state.sala.id);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      // Fallback para navegadores que não suportam clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = state.sala.id;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const getPlayerReadyStatus = () => {
    if (!state.jogador) return false;
    
    const myTeam = state.sala.turma1.nome === state.jogador.turma ? 
      state.sala.turma1 : state.sala.turma2;
    
    const myPlayer = myTeam.jogadores.find(p => p.nome === state.jogador.nome);
    return myPlayer ? myPlayer.pronto : false;
  };

  const renderTeamCard = (team, isMyTeam) => {
    const getTeamStatus = () => {
      if (team.jogadores.length === 0) return { status: 'empty', text: 'Aguardando Turma' };
      if (team.pronto) return { status: 'ready', text: 'Pronto' };
      return { status: 'waiting', text: 'Aguardando' };
    };

    const teamStatus = getTeamStatus();

    return (
      <TeamCard key={team.nome} ready={team.pronto} className={isMyTeam ? 'my-team' : ''}>
        <div className="team-header">
          <h3>
            {isMyTeam ? '👑' : '🏆'} {team.nome || 'Aguardando...'}
          </h3>
          <span className={`status ${teamStatus.status}`}>
            {teamStatus.text}
          </span>
        </div>
        
        <div className="players-list">
          {team.jogadores.length > 0 ? (
            team.jogadores.map((player, index) => (
              <div key={index} className="player-item">
                <span className="player-name">
                  {player.nome} {isMyTeam && player.nome === state.jogador?.nome ? '(Você)' : ''}
                </span>
                <span className={`player-status ${player.pronto ? 'ready' : 'not-ready'}`}>
                  {player.pronto ? 'Pronto' : 'Não Pronto'}
                </span>
              </div>
            ))
          ) : (
            <div className="no-players">Nenhum jogador nesta turma</div>
          )}
        </div>
      </TeamCard>
    );
  };

  if (!state.sala) {
    return <div>Carregando...</div>;
  }

  const isReady = getPlayerReadyStatus();
  const myTeam = state.sala.turma1.nome === state.jogador?.turma ? 
    state.sala.turma1 : state.sala.turma2;
  const otherTeam = state.sala.turma1.nome === state.jogador?.turma ? 
    state.sala.turma2 : state.sala.turma1;

  return (
    <Container className="fade-in">
      <BackButton onClick={handleBack}>
        ← Voltar ao Início
      </BackButton>

      <LobbyInfo>
        <h2>🏠 Lobby da Partida</h2>
        <p>Sala: <strong>{state.sala.id.substr(0, 8)}...</strong></p>
        <p>Aguardando todas as turmas ficarem prontas para começar</p>
      </LobbyInfo>

      <SalaIdCard>
        <h3>🔗 ID da Sala</h3>
        <div className="sala-id-container">
          <span className="sala-id">{state.sala.id}</span>
          <button className="copy-button" onClick={handleCopyId}>
            📋 Copiar
          </button>
        </div>
        <div className="share-text">Compartilhe este ID com outros jogadores para entrarem na sala</div>
        <div className={`copy-success ${copySuccess ? 'show' : ''}`}>
          ✅ ID copiado para a área de transferência!
        </div>
      </SalaIdCard>

      <TeamsContainer>
        {renderTeamCard(myTeam, true)}
        {renderTeamCard(otherTeam, false)}
      </TeamsContainer>

      {myTeam.jogadores.length > 0 && (
        <ActionButton 
          ready={isReady} 
          onClick={handleToggleReady}
        >
          {isReady ? '❌ Cancelar Pronto' : '✅ Marcar como Pronto'}
        </ActionButton>
      )}

      {state.sala.turma1.jogadores.length === 0 || state.sala.turma2.jogadores.length === 0 ? (
        <WaitingMessage>
          <div className="icon">⏳</div>
          <h4>Aguardando Mais Jogadores</h4>
          <p>
            É necessário pelo menos um jogador em cada turma para começar a partida.
            Compartilhe o ID da sala para convidar outros jogadores!
          </p>
        </WaitingMessage>
      ) : null}
    </Container>
  );
}

export default Lobby; 