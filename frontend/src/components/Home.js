import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useGame } from '../contexts/GameContext';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
`;

const Welcome = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  h2 {
    color: white;
    font-size: 2rem;
    margin-bottom: 20px;
  }
  
  p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 15px;
  }
`;

const GameInfo = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  h3 {
    color: white;
    font-size: 1.5rem;
    margin-bottom: 20px;
  }
  
  .ships-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .ship-card {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 15px;
    
    .ship-icon {
      font-size: 2rem;
      margin-bottom: 10px;
    }
    
    .ship-name {
      font-weight: bold;
      color: white;
      margin-bottom: 5px;
    }
    
    .ship-details {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.9rem;
    }
  }
  
  .matrix-info {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    padding: 20px;
    margin-top: 20px;
    
    h4 {
      color: #FFD700;
      margin-bottom: 10px;
    }
    
    p {
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.95rem;
    }
  }
`;

const FormsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Form = styled.form`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  h3 {
    color: white;
    margin-bottom: 20px;
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  
  .form-group {
    margin-bottom: 20px;
    text-align: left;
    
    label {
      display: block;
      color: white;
      margin-bottom: 8px;
      font-weight: bold;
    }
    
    input {
      width: 100%;
      padding: 12px 15px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.3);
      font-size: 1rem;
      transition: all 0.3s ease;
      
      &:focus {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        background: white;
      }
    }
  }
  
  .description {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 20px;
    
    p {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.9rem;
      margin: 0;
      text-align: center;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 15px 30px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: bold;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  
  &.primary {
    background: linear-gradient(45deg, #667eea, #764ba2);
    color: white;
    
    &:hover {
      background: linear-gradient(45deg, #764ba2, #667eea);
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    }
  }
  
  &.secondary {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.5);
    }
  }
  
  &.success {
    background: #4CAF50;
    color: white;
    
    &:hover {
      background: #45a049;
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    }
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
`;

const ConnectionStatus = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  
  &.connected {
    background: #4CAF50;
    color: white;
  }
  
  &.disconnected {
    background: #f44336;
    color: white;
  }
`;

const SalaIdDisplay = styled.div`
  background: rgba(255, 193, 7, 0.2);
  border: 2px solid #FFC107;
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  margin: 20px 0;
  
  h4 {
    color: #FFC107;
    margin-bottom: 10px;
  }
  
  .sala-id {
    font-family: 'Courier New', monospace;
    font-size: 1.2rem;
    font-weight: bold;
    color: white;
    background: rgba(0, 0, 0, 0.3);
    padding: 10px 15px;
    border-radius: 8px;
    margin: 10px 0;
    word-break: break-all;
  }
  
  p {
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(244, 67, 54, 0.2);
  border: 2px solid #f44336;
  border-radius: 15px;
  padding: 15px;
  text-align: center;
  margin: 20px 0;
  color: white;
  
  .error-icon {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }
`;

function Home() {
  const navigate = useNavigate();
  const { state, actions } = useGame();
  const [formData, setFormData] = useState({
    nomeTurma: '',
    nomeJogador: '',
    salaId: ''
  });

  // Navegação automática quando entrar na sala
  useEffect(() => {
    if (state.sala && !state.erro) {
      navigate('/lobby');
    }
  }, [state.sala, state.erro, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (formData.nomeTurma.trim() && formData.nomeJogador.trim()) {
      actions.entrarSala(formData.nomeTurma.trim(), formData.nomeJogador.trim());
    }
  };

  const handleJoinById = (e) => {
    e.preventDefault();
    if (formData.salaId.trim() && formData.nomeJogador.trim()) {
      actions.entrarSalaPorId(formData.salaId.trim(), formData.nomeJogador.trim());
    }
  };

  return (
    <Container className="fade-in">
      <ConnectionStatus className={state.connected ? 'connected' : 'disconnected'}>
        {state.connected ? '🟢 Conectado' : '🔴 Desconectado'}
      </ConnectionStatus>

      <Welcome>
        <h2>Bem-vindos ao Batalha Naval Educativa!</h2>
        <p>
          Um jogo desenvolvido para ensinar conceitos de <strong>matrizes</strong> de forma divertida e interativa.
        </p>
        <p>
          Duas turmas competem em uma emocionante batalha naval, onde cada jogada é uma oportunidade de aprender!
        </p>
      </Welcome>

      {state.erro && (
        <ErrorMessage>
          <div className="error-icon">⚠️</div>
          <p>{state.erro}</p>
        </ErrorMessage>
      )}

      <GameInfo>
        <h3>🚢 Navios do Jogo</h3>
        <div className="ships-info">
          <div className="ship-card">
            <div className="ship-icon">🛥️</div>
            <div className="ship-name">3 Submarinos</div>
            <div className="ship-details">Ocupam 1 casa cada</div>
          </div>
          <div className="ship-card">
            <div className="ship-icon">🚤</div>
            <div className="ship-name">2 Torpedeiros</div>
            <div className="ship-details">Ocupam 2 casas cada</div>
          </div>
          <div className="ship-card">
            <div className="ship-icon">🛩️</div>
            <div className="ship-name">1 Porta-Aviões</div>
            <div className="ship-details">Ocupa 3 casas</div>
          </div>
        </div>
        
        <div className="matrix-info">
          <h4>🧮 Conceitos de Matrizes</h4>
          <p>
            O tabuleiro 6x6 é uma matriz real! Cada posição é identificada por coordenadas (linha, coluna), 
            ensinando conceitos fundamentais de álgebra linear de forma prática e divertida.
          </p>
        </div>
      </GameInfo>

      <FormsContainer>
        <Form onSubmit={handleCreateRoom}>
          <h3>🏠 Criar Nova Sala</h3>
          <div className="description">
            <p>Crie uma nova sala para sua turma e convide outras turmas para jogar</p>
          </div>
          
          <div className="form-group">
            <label htmlFor="nomeTurma">Nome da Turma:</label>
            <input
              type="text"
              id="nomeTurma"
              name="nomeTurma"
              value={formData.nomeTurma}
              onChange={handleInputChange}
              placeholder="Ex: Turma A, 3º Ano..."
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="nomeJogador1">Seu Nome:</label>
            <input
              type="text"
              id="nomeJogador1"
              name="nomeJogador"
              value={formData.nomeJogador}
              onChange={handleInputChange}
              placeholder="Digite seu nome"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="primary"
            disabled={!state.connected || !formData.nomeTurma.trim() || !formData.nomeJogador.trim()}
          >
            🎮 Criar Sala
          </Button>
        </Form>

        <Form onSubmit={handleJoinById}>
          <h3>🔗 Entrar por ID da Sala</h3>
          <div className="description">
            <p>Já tem o ID de uma sala? Entre diretamente e junte-se à batalha!</p>
          </div>
          
          <div className="form-group">
            <label htmlFor="salaId">ID da Sala:</label>
            <input
              type="text"
              id="salaId"
              name="salaId"
              value={formData.salaId}
              onChange={handleInputChange}
              placeholder="Cole o ID da sala aqui"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="nomeJogador2">Seu Nome:</label>
            <input
              type="text"
              id="nomeJogador2"
              name="nomeJogador"
              value={formData.nomeJogador}
              onChange={handleInputChange}
              placeholder="Digite seu nome"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="success"
            disabled={!state.connected || !formData.salaId.trim() || !formData.nomeJogador.trim()}
          >
            🚀 Entrar na Sala
          </Button>
        </Form>
      </FormsContainer>

      {state.sala && !state.erro && (
        <SalaIdDisplay>
          <h4>🏠 Sala Criada com Sucesso!</h4>
          <div className="sala-id">{state.sala.id}</div>
          <p>📋 Compartilhe este ID com outras turmas para que possam se juntar à batalha!</p>
          <p>💡 <strong>Dica:</strong> Você pode copiar este ID clicando nele ou no lobby da partida</p>
        </SalaIdDisplay>
      )}

      <ButtonGroup>
        <Button 
          type="button" 
          className="secondary"
          onClick={() => navigate('/tutorial')}
        >
          📚 Como Jogar
        </Button>
      </ButtonGroup>
    </Container>
  );
}

export default Home; 