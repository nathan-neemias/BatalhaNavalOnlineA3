import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Section = styled.section`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  h2 {
    color: white;
    font-size: 1.8rem;
    margin-bottom: 20px;
    text-align: center;
  }
  
  h3 {
    color: #FFD700;
    font-size: 1.3rem;
    margin: 20px 0 15px 0;
  }
  
  p, li {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 10px;
  }
  
  ul {
    padding-left: 20px;
    margin-bottom: 15px;
  }
`;

const MatrixExample = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  padding: 20px;
  margin: 20px 0;
  text-align: center;
  
  h4 {
    color: #FFD700;
    margin-bottom: 15px;
  }
  
  .matrix-grid {
    display: inline-grid;
    grid-template-columns: repeat(7, 40px);
    grid-template-rows: repeat(7, 40px);
    gap: 2px;
    margin: 20px;
    border: 2px solid #FFD700;
    border-radius: 8px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.1);
  }
  
  .cell {
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    font-weight: bold;
    font-size: 0.8rem;
  }
  
  .header {
    background: #FFD700;
    color: #000;
  }
  
  .water {
    background: #4FC3F7;
    color: white;
  }
  
  .ship {
    background: #8BC34A;
    color: white;
  }
  
  .hit {
    background: #F44336;
    color: white;
  }
  
  .miss {
    background: #9E9E9E;
    color: white;
  }
`;

const GamePhases = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 20px 0;
  
  .phase-card {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    padding: 20px;
    text-align: center;
    border: 2px solid transparent;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: #FFD700;
      transform: translateY(-5px);
    }
    
    .phase-icon {
      font-size: 3rem;
      margin-bottom: 15px;
    }
    
    .phase-title {
      color: #FFD700;
      font-size: 1.2rem;
      font-weight: bold;
      margin-bottom: 10px;
    }
    
    .phase-description {
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.9rem;
    }
  }
`;

const Button = styled.button`
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 15px 30px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: bold;
  transition: all 0.3s ease;
  display: block;
  margin: 30px auto 0 auto;
  
  &:hover {
    background: linear-gradient(45deg, #764ba2, #667eea);
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
`;

function Tutorial() {
  const navigate = useNavigate();

  const createMatrixExample = () => {
    const headers = ['', '0', '1', '2', '3', '4', '5'];
    const cells = [];
    
    // Cabeçalho
    headers.forEach((header, index) => {
      cells.push(
        <div key={`header-${index}`} className="cell header">
          {header}
        </div>
      );
    });
    
    // Linhas da matriz
    for (let i = 0; i < 6; i++) {
      // Número da linha
      cells.push(
        <div key={`row-${i}`} className="cell header">
          {i}
        </div>
      );
      
      // Células da linha
      for (let j = 0; j < 6; j++) {
        let className = 'cell water';
        let content = '💧';
        
        // Alguns navios de exemplo
        if ((i === 1 && j === 2) || (i === 1 && j === 3)) {
          className = 'cell ship';
          content = '🚤';
        } else if (i === 3 && j === 1) {
          className = 'cell ship';
          content = '🛥️';
        } else if ((i === 4 && j === 4) || (i === 4 && j === 5) || (i === 5 && j === 4)) {
          className = 'cell ship';
          content = '🛩️';
        } else if (i === 0 && j === 0) {
          className = 'cell hit';
          content = '💥';
        } else if (i === 2 && j === 3) {
          className = 'cell miss';
          content = '🌊';
        }
        
        cells.push(
          <div key={`cell-${i}-${j}`} className={className}>
            {content}
          </div>
        );
      }
    }
    
    return cells;
  };

  return (
    <Container className="fade-in">
      <Section>
        <h2>📚 Como Jogar Batalha Naval</h2>
        
        <h3>🎯 Objetivo do Jogo</h3>
        <p>
          O objetivo é afundar todos os navios da turma adversária antes que ela afunde os seus. 
          Cada turma posiciona seus navios em uma matriz 6x6 e tenta descobrir onde estão os navios inimigos.
        </p>

        <h3>🚢 Navios Disponíveis</h3>
        <ul>
          <li><strong>3 Submarinos (🛥️):</strong> Ocupam 1 casa cada</li>
          <li><strong>2 Torpedeiros (🚤):</strong> Ocupam 2 casas cada</li>
          <li><strong>1 Porta-Aviões (🛩️):</strong> Ocupa 3 casas</li>
        </ul>
      </Section>

      <Section>
        <h2>🧮 Conceitos de Matrizes</h2>
        
        <h3>📊 O que é uma Matriz?</h3>
        <p>
          Uma matriz é um arranjo retangular de elementos organizados em linhas e colunas. 
          No nosso jogo, o tabuleiro 6x6 é uma matriz com 6 linhas e 6 colunas, totalizando 36 posições.
        </p>

        <h3>📍 Sistema de Coordenadas</h3>
        <p>
          Cada posição no tabuleiro é identificada por um par de coordenadas (linha, coluna):
        </p>
        <ul>
          <li><strong>Linha:</strong> número de 0 a 5 (eixo vertical)</li>
          <li><strong>Coluna:</strong> número de 0 a 5 (eixo horizontal)</li>
          <li><strong>Exemplo:</strong> A posição (2,3) está na linha 2, coluna 3</li>
        </ul>

        <MatrixExample>
          <h4>Exemplo de Tabuleiro (Matriz 6x6)</h4>
          <div className="matrix-grid">
            {createMatrixExample()}
          </div>
          <p style={{color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem'}}>
            💧 Água | 🚤 Torpedeiro | 🛥️ Submarino | 🛩️ Porta-Aviões | 💥 Acerto | 🌊 Erro
          </p>
        </MatrixExample>
      </Section>

      <Section>
        <h2>🎮 Fases do Jogo</h2>
        
        <GamePhases>
          <div className="phase-card">
            <div className="phase-icon">🏠</div>
            <div className="phase-title">1. Lobby</div>
            <div className="phase-description">
              Turmas se reúnem e marcam "Pronto" para iniciar
            </div>
          </div>
          
          <div className="phase-card">
            <div className="phase-icon">🚢</div>
            <div className="phase-title">2. Posicionamento</div>
            <div className="phase-description">
              Cada turma posiciona seus navios secretamente
            </div>
          </div>
          
          <div className="phase-card">
            <div className="phase-icon">💥</div>
            <div className="phase-title">3. Ataque</div>
            <div className="phase-description">
              Turmas se alternam atacando posições inimigas
            </div>
          </div>
          
          <div className="phase-card">
            <div className="phase-icon">🏆</div>
            <div className="phase-title">4. Vitória</div>
            <div className="phase-description">
              Primeira turma a afundar todos os navios vence
            </div>
          </div>
        </GamePhases>
      </Section>

      <Section>
        <h2>⚡ Regras Importantes</h2>
        
        <h3>🎯 Posicionamento de Navios</h3>
        <ul>
          <li>Navios devem ser posicionados em linha reta (horizontal ou vertical)</li>
          <li>Navios não podem se tocar ou se sobrepor</li>
          <li>Todos os navios devem estar dentro do tabuleiro 6x6</li>
        </ul>

        <h3>💥 Sistema de Ataques</h3>
        <ul>
          <li><strong>Acerto (🔴):</strong> Você atingiu um navio inimigo</li>
          <li><strong>Água (🔵):</strong> Você atingiu uma posição vazia</li>
          <li><strong>Afundado (⚫):</strong> Você destruiu completamente um navio</li>
          <li>Se acertar, você ataca novamente. Se errar, passa a vez</li>
        </ul>

        <h3>🏆 Condições de Vitória</h3>
        <ul>
          <li>A primeira turma a afundar todos os 6 navios inimigos vence</li>
          <li>O jogo termina imediatamente quando todos os navios são afundados</li>
        </ul>
      </Section>

      <Button onClick={() => navigate('/')}>
        🚀 Voltar ao Menu Principal
      </Button>
    </Container>
  );
}

export default Tutorial; 