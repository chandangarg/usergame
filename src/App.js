import React from 'react';
import './App.css';
import GameElements from './GameElements';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <div className="game">
              <GameElements />
              
            
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
