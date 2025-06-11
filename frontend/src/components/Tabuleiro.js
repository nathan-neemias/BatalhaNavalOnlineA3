import React from 'react';
import styled from 'styled-components';

const TabuleiroContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const TabuleiroGrid = styled.div`
  display: grid;
  grid-template-columns: 30px repeat(6, 50px);
  grid-template-rows: 30px repeat(6, 50px);
  gap: 2px;
  background: rgba(0, 0, 0, 0.2);
  padding: 10px;
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.2);
`;

const Cell = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-weight: bold;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  position: relative;
  
  &.header {
    background: #FFD700;
    color: #000;
    font-weight: bold;
    font-size: 0.9rem;
  }
  
  &.water {
    background: #4FC3F7;
    color: white;
    
    &:hover {
      background: ${props => props.clickable ? '#29B6F6' : '#4FC3F7'};
      transform: ${props => props.clickable ? 'scale(1.05)' : 'none'};
    }
  }
  
  &.ship {
    background: #8BC34A;
    color: white;
    
    &.hit {
      background: #f44336;
      animation: hit-flash 0.5s ease-in-out;
    }
  }
  
  &.temp {
    background: #FF9800;
    color: white;
    animation: pulse 1s infinite;
  }
  
  &.enemy-hit {
    background: #f44336;
    color: white;
  }
  
  &.enemy-miss {
    background: #9E9E9E;
    color: white;
  }
  
  &.enemy-unknown {
    background: #607D8B;
    color: white;
    
    &:hover {
      background: ${props => props.clickable ? '#546E7A' : '#607D8B'};
      transform: ${props => props.clickable ? 'scale(1.05)' : 'none'};
    }
  }
  
  @keyframes hit-flash {
    0%, 100% { background: #f44336; }
    50% { background: #FF5722; }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  
  .coordinate-label {
    position: absolute;
    top: -2px;
    right: -2px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    font-size: 0.6rem;
    padding: 1px 3px;
    border-radius: 3px;
    display: none;
  }
  
  &:hover .coordinate-label {
    display: ${props => props.showCoordinates ? 'block' : 'none'};
  }
`;

const Legend = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 10px;
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.9rem;
    
    .legend-color {
      width: 20px;
      height: 20px;
      border-radius: 4px;
    }
  }
`;

function Tabuleiro({ 
  tabuleiro, 
  tipo, 
  onCellClick, 
  onCellHover, 
  posicoesTemp = [], 
  habilitado = false 
}) {
  const isProprioTabuleiro = tipo === 'proprio';
  
  const getCellClass = (linha, coluna) => {
    if (linha === -1 || coluna === -1) return 'header';
    
    const isPosicaoTemp = posicoesTemp.some(pos => pos.linha === linha && pos.coluna === coluna);
    if (isPosicaoTemp) return 'temp';
    
    if (isProprioTabuleiro) {
      const celula = tabuleiro[linha][coluna];
      if (celula.tipo === 'navio') {
        return celula.atingido ? 'ship hit' : 'ship';
      }
      return celula.atingido ? 'enemy-miss' : 'water';
    } else {
      // Tabuleiro inimigo
      const celula = tabuleiro[linha][coluna];
      if (celula.atingido) {
        if (celula.resultado === 'agua') return 'enemy-miss';
        if (celula.resultado === 'acerto') return 'enemy-hit';
        if (celula.resultado === 'afundado') return 'enemy-hit';
      }
      return 'enemy-unknown';
    }
  };
  
  const getCellContent = (linha, coluna) => {
    if (linha === -1) {
      return coluna === -1 ? '' : coluna.toString();
    }
    if (coluna === -1) {
      return linha.toString();
    }
    
    const isPosicaoTemp = posicoesTemp.some(pos => pos.linha === linha && pos.coluna === coluna);
    if (isPosicaoTemp) return '📍';
    
    if (isProprioTabuleiro) {
      const celula = tabuleiro[linha][coluna];
      if (celula.tipo === 'navio') {
        if (celula.atingido) return '💥';
        
        // Diferentes ícones para diferentes tipos de navio
        if (celula.navio?.tipo === 'submarino') return '🛥️';
        if (celula.navio?.tipo === 'torpedeiro') return '🚤';
        if (celula.navio?.tipo === 'portaAvioes') return '🛩️';
        return '🚢';
      }
      return celula.atingido ? '🌊' : '💧';
    } else {
      // Tabuleiro inimigo
      const celula = tabuleiro[linha][coluna];
      if (celula.atingido) {
        if (celula.resultado === 'agua') return '🌊';
        if (celula.resultado === 'acerto') return '💥';
        if (celula.resultado === 'afundado') return '⚫';
      }
      return '❓';
    }
  };
  
  const handleCellClick = (linha, coluna) => {
    if (!habilitado || linha === -1 || coluna === -1) return;
    if (onCellClick) onCellClick(linha, coluna);
  };
  
  const handleCellHover = (linha, coluna) => {
    if (linha === -1 || coluna === -1) return;
    if (onCellHover) onCellHover({ linha, coluna });
  };
  
  const renderCells = () => {
    const cells = [];
    
    // Primeira linha com números das colunas
    for (let col = -1; col < 6; col++) {
      cells.push(
        <Cell 
          key={`header-col-${col}`}
          className="header"
        >
          {col === -1 ? '' : col}
        </Cell>
      );
    }
    
    // Linhas do tabuleiro
    for (let linha = 0; linha < 6; linha++) {
      // Número da linha
      cells.push(
        <Cell 
          key={`header-row-${linha}`}
          className="header"
        >
          {linha}
        </Cell>
      );
      
      // Células da linha
      for (let coluna = 0; coluna < 6; coluna++) {
        const cellClass = getCellClass(linha, coluna);
        const isClickable = habilitado && cellClass !== 'header';
        
        cells.push(
          <Cell
            key={`cell-${linha}-${coluna}`}
            className={cellClass}
            clickable={isClickable}
            showCoordinates={habilitado}
            onClick={() => handleCellClick(linha, coluna)}
            onMouseEnter={() => handleCellHover(linha, coluna)}
          >
            {getCellContent(linha, coluna)}
            {habilitado && (
              <div className="coordinate-label">
                ({linha},{coluna})
              </div>
            )}
          </Cell>
        );
      }
    }
    
    return cells;
  };
  
  const getLegendItems = () => {
    if (isProprioTabuleiro) {
      return [
        { color: '#4FC3F7', label: '💧 Água' },
        { color: '#8BC34A', label: '🚢 Navio' },
        { color: '#f44336', label: '💥 Navio Atingido' },
        { color: '#9E9E9E', label: '🌊 Água Atingida' },
        ...(posicoesTemp.length > 0 ? [{ color: '#FF9800', label: '📍 Posição Temporária' }] : [])
      ];
    } else {
      return [
        { color: '#607D8B', label: '❓ Desconhecido' },
        { color: '#f44336', label: '💥 Acerto' },
        { color: '#9E9E9E', label: '🌊 Erro' }
      ];
    }
  };
  
  return (
    <TabuleiroContainer>
      <TabuleiroGrid>
        {renderCells()}
      </TabuleiroGrid>
      
      <Legend>
        {getLegendItems().map((item, index) => (
          <div key={index} className="legend-item">
            <div 
              className="legend-color" 
              style={{ backgroundColor: item.color }}
            />
            <span>{item.label}</span>
          </div>
        ))}
      </Legend>
    </TabuleiroContainer>
  );
}

export default Tabuleiro; 