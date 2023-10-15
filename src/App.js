import { useState } from 'react';

function Square({ isHighlight, value, onSquareClick }) {
  return (
    <div className={ isHighlight ? 'square--highlight square' : 'square' } onClick={onSquareClick}>
      {value}
    </div>
  );
}

function Board({ xIsNext, squares, onPlay, rows, cols }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares, i);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + squares[winner[0]];
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }
  if (squares.every((square) => square !== null) && !winner) {
    status = 'Result: Draw';
  }

  const board = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      const index = i * cols + j;
      row.push(
        <Square
          isHighlight={winner && winner.includes(index)}
          key={index}
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
        />
      );
    }
    board.push(<div className="board-row">{row}</div>);
  }

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sortAsc, setSortAsc] = useState(false);
  const [positions, setPositions] = useState([Array(9).fill(null)]); 
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares, index) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    const nextPositions = [...positions.slice(0, currentMove + 1), index];
    setPositions(nextPositions);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move + '. Played at ' + '(' + Math.floor(positions[move] / 3) + ', ' + positions[move] % 3  + ')';
    } else {
      description = 'Go to game start';
    }
    return (
        <li key={move}>
            {currentMove !== move
              ? <button onClick={() => jumpTo(move)}>{description}</button>
              : <span>
            You are at move #{move} {move !== 0
              ? '. Played at ' + '(' + Math.floor(positions[move] / 3) + ', ' + positions[move] % 3 + ')'
              : ''}</span>}
        </li>
    );
  });

  if (sortAsc) {
    moves.reverse();
  }

  const sortButton = (
    <div style={{ marginLeft: '24px' }}>
      <button onClick={() => {
        setSortAsc(!sortAsc)
      }}>
        {sortAsc ? 'Sort Ascending' : 'Sort Descending'}
      </button>
    </div>
  );

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} rows={3} cols={3} />
      </div>
      <div className="game-info">
        {sortButton}
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

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
      return lines[i];
    }
  }
  return null;
}
