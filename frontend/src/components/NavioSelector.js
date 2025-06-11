import React from 'react';
import styled from 'styled-components';

const SelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const NavioCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  border: 2px solid ${props => {
    if (props.selected) return '#FFD700';
    if (props.completed) return '#4CAF50';
    return 'rgba(255, 255, 255, 0.2)';
  }};
  transition: all 0.3s ease;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.6 : 1};
  
  &:hover:not([disabled]) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    border-color: ${props => props.selected ? '#FFD700' : '#667eea'};
  }
  
  .navio-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
    
    .navio-info {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .navio-icon {
        font-size: 2rem;
      }
      
      .navio-details {
        h4 {
          color: white;
          font-size: 1.2rem;
          margin-bottom: 4px;
        }
        
        p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
          margin: 0;
        }
      }
    }
    
    .navio-status {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      
      .count {
        background: ${props => {
          if (props.completed) return '#4CAF50';
          if (props.selected) return '#FFD700';
          return '#667eea';
        }};
        color: white;
        padding: 8px 12px;
        border-radius: 20px;
        font-weight: bold;
        font-size: 0.9rem;
        min-width: 60px;
        text-align: center;
      }
      
      .status-text {
        color: ${props => {
          if (props.completed) return '#4CAF50';
          if (props.selected) return '#FFD700';
          return 'rgba(255, 255, 255, 0.7)';
        }};
        font-size: 0.8rem;
        font-weight: bold;
      }
    }
  }
  
  .matrix-representation {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    padding: 15px;
    
    h5 {
      color: #FFD700;
      margin-bottom: 10px;
      text-align: center;
    }
    
    .matrix-example {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 5px;
      
      .cell-example {
        width: 25px;
        height: 25px;
        background: #8BC34A;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.7rem;
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.3);
      }
      
      .arrow {
        color: #FFD700;
        font-size: 1.2rem;
        margin: 0 10px;
      }
      
      .coordinates {
        color: rgba(255, 255, 255, 0.9);
        font-size: 0.8rem;
        background: rgba(255, 255, 255, 0.1);
        padding: 5px 10px;
        border-radius: 8px;
      }
    }
    
    .positioning-tip {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.8rem;
      text-align: center;
      margin-top: 10px;
      font-style: italic;
    }
  }
  
  .selection-indicator {
    text-align: center;
    margin-top: 15px;
    padding: 10px;
    border-radius: 8px;
    background: ${props => {
      if (props.selected) return 'rgba(255, 215, 0, 0.2)';
      if (props.completed) return 'rgba(76, 175, 80, 0.2)';
      return 'transparent';
    }};
    
    .indicator-text {
      color: ${props => {
        if (props.selected) return '#FFD700';
        if (props.completed) return '#4CAF50';
        return 'rgba(255, 255, 255, 0.6)';
      }};
      font-weight: bold;
      font-size: 0.9rem;
    }
  }
`;

const InstructionsPanel = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  
  h4 {
    color: #FFD700;
    text-align: center;
    margin-bottom: 15px;
  }
  
  .step {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 12px;
    
    .step-number {
      background: #667eea;
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: bold;
      flex-shrink: 0;
    }
    
    .step-text {
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.9rem;
      line-height: 1.4;
    }
  }
`;

const ProgressSummary = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  
  h4 {
    color: white;
    margin-bottom: 15px;
  }
  
  .progress-bar {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    height: 12px;
    margin-bottom: 15px;
    overflow: hidden;
    
    .progress-fill {
      background: linear-gradient(45deg, #4CAF50, #8BC34A);
      height: 100%;
      transition: width 0.3s ease;
      border-radius: 10px;
    }
  }
  
  .progress-text {
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.9rem;
    
    .completed {
      color: #4CAF50;
      font-weight: bold;
    }
  }
`;

function NavioSelector({ navios, navioSelecionado, onSelectNavio }) {
  const naviosData = [
    {
      tipo: 'submarino',
      nome: 'Submarino',
      icon: '🛥️',
      tamanho: 1,
      quantidade: 3,
      exemplo: ['🛥️'],
      coordenadas: '(2,3)'
    },
    {
      tipo: 'torpedeiro',
      nome: 'Torpedeiro',
      icon: '🚤',
      tamanho: 2,
      quantidade: 2,
      exemplo: ['🚤', '🚤'],
      coordenadas: '(1,2) → (1,3)'
    },
    {
      tipo: 'portaAvioes',
      nome: 'Porta-Aviões',
      icon: '🛩️',
      tamanho: 3,
      quantidade: 1,
      exemplo: ['🛩️', '🛩️', '🛩️'],
      coordenadas: '(0,1) → (0,2) → (0,3)'
    }
  ];

  const getTotalNaviosPosicionados = () => {
    return Object.values(navios).reduce((total, navio) => {
      return total + (navio.quantidade - navio.restantes);
    }, 0);
  };

  const getTotalNavios = () => {
    return Object.values(navios).reduce((total, navio) => {
      return total + navio.quantidade;
    }, 0);
  };

  const getProgressPercentage = () => {
    const total = getTotalNavios();
    const posicionados = getTotalNaviosPosicionados();
    return (posicionados / total) * 100;
  };

  const handleNavioClick = (tipo) => {
    const navio = navios[tipo];
    if (navio.restantes <= 0) return;
    
    onSelectNavio(navioSelecionado === tipo ? null : tipo);
  };

  return (
    <SelectorContainer>
      <InstructionsPanel>
        <h4>📋 Como Posicionar Navios</h4>
        <div className="step">
          <div className="step-number">1</div>
          <div className="step-text">Clique em um tipo de navio abaixo para selecioná-lo</div>
        </div>
        <div className="step">
          <div className="step-number">2</div>
          <div className="step-text">Clique nas posições do seu tabuleiro para posicionar o navio</div>
        </div>
        <div className="step">
          <div className="step-number">3</div>
          <div className="step-text">Navios devem ficar em linha reta (horizontal ou vertical)</div>
        </div>
        <div className="step">
          <div className="step-number">4</div>
          <div className="step-text">Repita até posicionar todos os navios</div>
        </div>
      </InstructionsPanel>

      <ProgressSummary>
        <h4>🎯 Progresso do Posicionamento</h4>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
        <div className="progress-text">
          <span className="completed">{getTotalNaviosPosicionados()}</span> de {getTotalNavios()} navios posicionados
        </div>
      </ProgressSummary>

      {naviosData.map(navioData => {
        const navioInfo = navios[navioData.tipo];
        const isSelected = navioSelecionado === navioData.tipo;
        const isCompleted = navioInfo.restantes === 0;
        const isDisabled = navioInfo.restantes === 0;

        return (
          <NavioCard
            key={navioData.tipo}
            selected={isSelected}
            completed={isCompleted}
            disabled={isDisabled}
            onClick={() => handleNavioClick(navioData.tipo)}
          >
            <div className="navio-header">
              <div className="navio-info">
                <div className="navio-icon">{navioData.icon}</div>
                <div className="navio-details">
                  <h4>{navioData.nome}</h4>
                  <p>Ocupa {navioData.tamanho} casa{navioData.tamanho > 1 ? 's' : ''}</p>
                </div>
              </div>
              
              <div className="navio-status">
                <div className="count">
                  {navioInfo.restantes}/{navioData.quantidade}
                </div>
                <div className="status-text">
                  {isCompleted ? 'Completo' : isSelected ? 'Selecionado' : 'Disponível'}
                </div>
              </div>
            </div>

            <div className="matrix-representation">
              <h5>🧮 Representação na Matriz</h5>
              <div className="matrix-example">
                <div style={{ display: 'flex', gap: '2px' }}>
                  {navioData.exemplo.map((icon, index) => (
                    <div key={index} className="cell-example">
                      {icon}
                    </div>
                  ))}
                </div>
                <div className="arrow">→</div>
                <div className="coordinates">
                  {navioData.coordenadas}
                </div>
              </div>
              <div className="positioning-tip">
                Clique {navioData.tamanho} posição{navioData.tamanho > 1 ? 'ões consecutivas' : ''} no tabuleiro
              </div>
            </div>

            <div className="selection-indicator">
              <div className="indicator-text">
                {isCompleted && '✅ Todos os navios deste tipo foram posicionados'}
                {isSelected && !isCompleted && '👆 Clique no tabuleiro para posicionar'}
                {!isSelected && !isCompleted && '👈 Clique aqui para selecionar'}
              </div>
            </div>
          </NavioCard>
        );
      })}
    </SelectorContainer>
  );
}

export default NavioSelector; 