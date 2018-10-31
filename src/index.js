import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  createTable = () => {
    const boardSize = this.props.boardSize;
    let table = []
    for (let i = 0; i < boardSize; i++) {
      let children = []
      for (let j = 0; j < boardSize; j++) {
        children.push(this.renderSquare(i*boardSize + j));
      }
      table.push(<div className="board-row">{children}</div>)
    }
    return table;
  }

  render() {
    return (
      <div>
        {this.createTable()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        movelocation: { col: null, row: null },
      }],
      stepNumber: 0,
      xIsNext: true,
      boardSize: 5,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber +1);
    const current = history[history.length -1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const movelocation = {
      col: i % this.state.boardSize,
      row: parseInt(i / this.state.boardSize),
    }
    this.setState({
      history: history.concat([{
        squares: squares,
        movelocation: movelocation,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner= calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        `Show board at move #${move} -- Col: ${step.movelocation.col}, Row: ${step.movelocation.row}` :
        `Go to game start`;
      return (
        <li key={move}>
          <button className={move === this.state.stepNumber ? 'bold' : ''}onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = `Winner: ${winner}`;
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            boardSize={this.state.boardSize}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
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
  for (let i=0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ====================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
