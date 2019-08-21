import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  function Square(props) {

    const clsName = 'square' + (props.currentMove ? ' square-current-move' : '');

      return (
        <button className={clsName} onClick={() => props.onClick()}>
          {props.value}
        </button>
      );
  }

  function getRowNum(i) {

    if (i < 3) {
        return 0;
    } else if (i < 6) {
        return 1;
    } else {
        return 2;
    }
}

function getColNum(i) {
    return (i % 3);
}

class Board extends React.Component {

    renderSquare(i) {

      const rowMatches = this.props.row === getRowNum(i);
      const colMatches = this.props.col === getColNum(i);

      return (
        <Square 
            currentMove={rowMatches && colMatches}
            value={this.props.squares[i]} 
            onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    render() {

      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [
                { squares: Array(9).fill(null), }
            ],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    calculateWinner(squares) {

        const sqrState = squares.slice();

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
          
          if (sqrState[a] && sqrState[a] === sqrState[b] && sqrState[a] === sqrState[c]) {
            return sqrState[a];
          }
        }

        return null;
    }

    getNextPlayer() {
        return (this.state.xIsNext ? 'X' : 'O');
    }

    // getRowNum(i) {

    //     if (i < 3) {
    //         return 0;
    //     } else if (i < 6) {
    //         return 1;
    //     } else {
    //         return 2;
    //     }
    // }

    // getColNum(i) {
    //     return (i % 3);
    // }

    handleClick(i) {

        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const newSquares = current.squares.slice();
        const rowNum = getRowNum(i);
        const colNum = getColNum(i);

        // Don't allow clicks in areas if the games already over or 
        // if the square has already been clicked on
        if (this.calculateWinner(newSquares) || newSquares[i]) {
            return;
        }

        newSquares[i] = this.getNextPlayer();
        
        this.setState({
            history: history.concat([{
                squares: newSquares,
                row: rowNum,
                col: colNum,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(e) {

        let step;

        step = e.target.value;

        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {

        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = this.calculateWinner(current.squares);

        // debugger;

        const moves = history.map((step, move) => {
            const desc  = move ? 'Go to move #' + move + ' (' + history[move].row + ', ' + history[move].col + ')' 
                               : 'Go to game start';
            return (
                <option key={move} value={move}>{desc}</option>
            );
        });

        let status;

        if (winner) {
          status = 'Winner: ' + winner;
        } else {
          status = 'Next player: ' + this.getNextPlayer();
        }

        return (
          <div className="game">
            <div className="game-board">
              <Board
                row={current.row}
                col={current.col}
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
              />
    
            </div>
            <div className="game-info">
              <div>{status}</div>
              <select id="move_list" onChange={e => this.jumpTo(e)} value={this.state.stepNumber}>{moves}</select>
            </div>
          </div>
        );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  