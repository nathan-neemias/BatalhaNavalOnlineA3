import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
    overflow-x: hidden;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    transition: all 0.3s ease;
    font-family: inherit;
  }

  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  input {
    border: none;
    outline: none;
    font-family: inherit;
  }

  .tabuleiro-cell {
    transition: all 0.2s ease;
  }

  .tabuleiro-cell:hover {
    transform: scale(1.05);
  }

  .fade-in {
    animation: fadeIn 0.5s ease-in;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .slide-in {
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }

  .pulse {
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(102, 126, 234, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(102, 126, 234, 0);
    }
  }
`;

export default GlobalStyle; 