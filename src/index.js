import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  function Square(props) {
      return (
        <button className="square" onClick={() => props.onClick()}>
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

    handleClick(i) {

        const history = this.state.history;
        const current = history[history.length - 1];
        const newSquares = current.squares.slice();

        // Don't allow clicks in areas if the games already over or 
        // if the square has already been clicked on
        if (this.calculateWinner(newSquares) || newSquares[i]) {
            return;
        }

        newSquares[i] = this.getNextPlayer();
        
        this.setState({
            history: history.concat([{
                squares: newSquares,
            }]),
            xIsNext: !this.state.xIsNext,
        });
    }

    render() {

        const history = this.state.history;
        const current = history[history.length - 1];
        const winner = this.calculateWinner(current.squares);
    
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
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
              />
    
            </div>
            <div className="game-info">
              <div>{status}</div>
              <ol>{/* TODO */}</ol>
            </div>
          </div>
        );

    //   return (
    //     <div className="game">
    //       <div className="game-board">
    //         <Board />
    //       </div>
    //       <div className="game-info">
    //         <div>{/* status */}</div>
    //         <ol>{/* TODO */}</ol>
    //       </div>
    //     </div>
    //   );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  