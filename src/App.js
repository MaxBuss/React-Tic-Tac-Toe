import { useState } from 'react';

function Square({ value, onSquareClick, isWinning }) {
  return (
    <button className={!isWinning ? "square" : "square-win"} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
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
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  }
  else if (!squares.includes(null)) {
    status = "Draw"
  }
  else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  function getBoardSquares(squares, onSquareClick) {
    const boardSquares = [];
    for (let i = 0; i < 3; i++) {
      const row = [];
      for (let j = 0; j < 3; j++) {
        const index = i * 3 + j;
        row.push(
          <Square
            key={index}
            value={squares[index]}
            onSquareClick={() => onSquareClick(index)}
            isWinning={winner && winner.includes(squares[index])}
          />
        );
      }
      boardSquares.push(
        <div key={i} className="board-row">
          {row}
        </div>
      );
    }
    return boardSquares;
  }

  return (
    <>
      <div className="status">{status}</div>
      {getBoardSquares(squares, handleClick)}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), moveLocation: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [ascending, setAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares) {
    const nextHistory = history.slice(0, currentMove + 1);
    const lastMove = history[currentMove];
    const newMoveLocation = calculateMoveLocation(lastMove.squares, nextSquares);

    nextHistory.push({ squares: nextSquares, moveLocation: newMoveLocation });
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function calculateMoveLocation(prevSquares, nextSquares) {
    for (let i = 0; i < prevSquares.length; i++) {
      if (prevSquares[i] !== nextSquares[i]) {
        const row = Math.floor(i / 3);
        const col = i % 3;
        return { row, col };
      }
    }
    return null;
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((moveData, move) => {
    const description = moveData.moveLocation
      ? `Go to move #${move} (${moveData.moveLocation.row + 1}, ${moveData.moveLocation.col + 1})`
      : move === 0
        ? 'Go to game start'
        : `Go to move #${move}`;
    return (
      <li key={move}>
        {currentMove !== move ? (
          <button onClick={() => jumpTo(move)}>{description}</button>
        ) : (
          <h3>You are at move # {move}</h3>
        )}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{ascending ? moves : moves.reverse()}</ol>
        <button onClick={() => setAscending(!ascending)}>Toggle Sort Order</button>
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
      return squares[a];
    }
  }
  return null;
}
