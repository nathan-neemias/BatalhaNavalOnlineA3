import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { GameProvider } from './contexts/GameContext';
import Home from './components/Home';
import Lobby from './components/Lobby';
import Game from './components/Game';
import Tutorial from './components/Tutorial';
import GlobalStyle from './styles/GlobalStyle';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Arial', sans-serif;
`;

const Header = styled.header`
  background: rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  backdrop-filter: blur(10px);
  
  h1 {
    color: white;
    margin: 0;
    font-size: 2.5rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  p {
    color: rgba(255, 255, 255, 0.9);
    margin: 10px 0 0 0;
    font-size: 1.1rem;
  }
`;

function App() {
  return (
    <Router>
      <GameProvider>
        <GlobalStyle />
        <AppContainer>
          <Header>
            <h1>🚢 Batalha Naval Educativa</h1>
            <p>Aprendendo Matrizes de forma Divertida - UniRitter</p>
          </Header>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tutorial" element={<Tutorial />} />
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/jogo" element={<Game />} />
          </Routes>
        </AppContainer>
      </GameProvider>
    </Router>
  );
}

export default App; 