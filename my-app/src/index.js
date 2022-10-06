import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

const boardSize = 3;

function Board(props) {
  const squaresToRender = [];

  props.squares.forEach((_item, index, array) => {
    if (index % boardSize === 0) {
      squaresToRender.push(array.slice(index, index + boardSize));
    }
  })

  return (
    <div>
      {squaresToRender.map((row, rowIndex) => <div key={rowIndex} className="board-row">
        {row.map((_cell, cellIndex) => {
          const index = rowIndex * boardSize + cellIndex;
          return <Square key={index} value={props.squares[index]} onClick={() => props.onClick(index)} />
        })}
      </div>)}
    </div>
  );

}

function Game() {
  const [history, setHistory] = useState([{
    squares: Array(9).fill(null)
  }]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);

  const handleClick = (i) => {
    const historyUpdated = history.slice(0, stepNumber + 1);
    const current = historyUpdated[historyUpdated.length - 1];
    const squares = current.squares.slice();

    if ( calculateWinner(squares) || squares[i] ) {
      return;
    }

    squares[i] = xIsNext ? 'X' : 'O';

    setHistory(historyUpdated.concat([
      {
        squares: squares
      }
    ]));
    setStepNumber(historyUpdated.length);
    setXIsNext(!xIsNext);
  }

  const jumpTo = (step) => {
    setStepNumber(step);
    setXIsNext((step % 2) === 0);
  }

  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);

  const moves = history.map((step, move) => {
    const desc = move ?
      'Go to move #' + move :
      'Go to game start!';

    return (
      <li key={move}>
          <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  let status;
  if (winner) {
    status = `${winner} is winner! 🥳`;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <div className="game">

      <div className="game-board">
        <Board
          squares={current.squares}
          onClick={(i) => handleClick(i)}
        />
      </div>

      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>

    </div>
  )
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}