import React, { Component } from "react";
import "./App.scss";

const height = 16;
const width = 16;
const mines = 40;
const initialState = {
  gameOver: false,
  success: false,
  flags: mines,
  timer: 0,
  clicks: 0,
  grid: [...Array(height).keys()].map((y) =>
    [...Array(width).keys()].map((x) => {
      return {
        id: `cell-${x}-${y}`,
        x,
        y,
        flagged: false,
        mine: false,
        revealed: false,
        neighbours: 0,
      };
    })
  ),
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    this.placeMines();
  }

  placeMines = () => {
    let minesPlaced = 0;
    const grid = JSON.parse(JSON.stringify(initialState.grid));
    while (minesPlaced < mines) {
      const randomRow = Math.floor(Math.random() * height);
      const randomCol = Math.floor(Math.random() * width);

      const currentCell = grid[randomRow][randomCol];
      if (currentCell.mine === false) {
        currentCell.mine = true;
        grid[randomRow][randomCol] = currentCell;
        minesPlaced++;
      }
    }
    this.setState({ grid });
  };

  hasMine = ({ x, y }) => {
    if (x >= height || y >= height || x < 0 || y < 0) return 0;

    const cell = this.state.grid[y][x];
    return cell && cell.mine ? 1 : 0;
  };

  calculateMines = (cell) => {
    const neighbours = this.getNeighbours(cell);
    return neighbours.reduce((count, row) => {
      return count + this.hasMine(row);
    }, 0);
  };

  getNeighbours = ({ x, y }) => {
    return [
      { x: x - 1, y: y - 1 }, // top left
      { x: x, y: y - 1 }, // top
      { x: x + 1, y: y - 1 }, // top right
      { x: x - 1, y: y }, // left
      { x: x + 1, y: y }, // right
      { x: x - 1, y: y + 1 }, // bottom left
      { x: x, y: y + 1 }, // bottom
      { x: x + 1, y: y + 1 }, // bottom right
    ];
  };

  revealNeighbours = (cell) => {
    const neighboursToReveal = [cell];
    let grid = JSON.parse(JSON.stringify(this.state.grid));

    while (neighboursToReveal.length > 0) {
      let { x, y } = neighboursToReveal[0];
      const neighbours = this.getNeighbours({ x, y });

      neighbours.forEach((row) => {
        const { x, y } = row;
        if (
          x >= height ||
          y >= height ||
          x < 0 ||
          y < 0 ||
          grid[y][x].revealed === true
        )
          return;

        grid[y][x].revealed = true;
        grid[y][x].neighbours = this.calculateMines(row);

        if (grid[y][x].neighbours === 0) {
          neighboursToReveal.push(row);
        }
      });
      neighboursToReveal.shift();
    }

    return grid;
  };

  handleClick = (cell) => {
    if (
      cell.revealed ||
      cell.flagged ||
      this.state.gameOver ||
      this.state.success
    )
      return;
    const { x, y } = cell;
    let grid = JSON.parse(JSON.stringify(this.state.grid));
    const currentCell = grid[y][x];
    let clicks = this.state.clicks;

    currentCell.revealed = true;

    if (clicks === 0) {
      this.startTimer();
    }

    if (cell.mine === true) {
      this.stopTimer();
      this.setState({ gameOver: true });
    } else {
      clicks++;
      currentCell.neighbours = this.calculateMines(cell);
      if (currentCell.neighbours === 0) {
        grid = this.revealNeighbours(cell);
      }
    }

    let success = false;
    if (this.state.flags === 0) {
      success = this.checkSuccess(grid);
    }

    grid[y][x] = currentCell;
    this.setState({ grid, clicks, success });
  };

  handleContextMenu = (e, cell) => {
    e.preventDefault();
    if (
      this.state.gameOver ||
      this.state.success ||
      (cell.revealed && !cell.flagged)
    )
      return;
    const { x, y } = cell;
    const grid = JSON.parse(JSON.stringify(this.state.grid));
    const currentCell = grid[y][x];
    let flags = this.state.flags;

    if (currentCell.flagged) {
      currentCell.flagged = false;
      flags++;
    } else if (flags > 0) {
      currentCell.flagged = true;
      flags--;
    }
    grid[y][x] = currentCell;

    let success = false;
    if (flags === 0) {
      success = this.checkSuccess(grid);
    }

    this.setState({ grid, flags, success });
  };

  handleReset = () => {
    this.stopTimer();
    this.setState(initialState);
    this.placeMines();
  };

  setTime = () => {
    let timer = this.state.timer;
    timer++;
    this.setState({ timer });
  };

  startTimer = () => {
    this.timer = setInterval(this.setTime, 1000);
  };

  stopTimer = () => {
    clearInterval(this.timer);
  };

  checkSuccess = (grid) => {
    let revealed = 0;
    let correct = 0;
    grid.forEach((row) => {
      row.forEach((cell) => {
        if (cell.revealed) revealed++;
        if (cell.flagged && cell.mine) correct++;
      });
    });
    if (revealed === height * width - mines && correct === mines) {
      this.stopTimer();
      return true;
    }
  };

  render() {
    return (
      <div
        className={`app ${
          this.state.gameOver
            ? "game-over"
            : this.state.success
            ? "success"
            : ""
        }`}
      >
        <div className="header">
          <div className="mines">
            <div className="clock">{this.state.flags}</div>
          </div>
          <div className="smiley">
            <button
              onClick={() => this.handleReset()}
              className="reset"
            ></button>
          </div>
          <div className="timer">
            <div className="clock">{this.state.timer}</div>
          </div>
        </div>
        <div className="board">
          {this.state.grid.map((row, i) => (
            <div className="row" key={`row-${i}`}>
              {row.map((cell) => (
                <div
                  className={`cell ${cell.mine ? "mine" : ""} ${
                    cell.flagged ? "flagged" : cell.revealed ? "revealed" : ""
                  } ${
                    cell.neighbours === 1
                      ? "blue"
                      : cell.neighbours === 2
                      ? "green"
                      : cell.neighbours === 3
                      ? "red"
                      : "black"
                  }`}
                  key={cell.id}
                  onClick={() => this.handleClick(cell)}
                  onContextMenu={(e) => this.handleContextMenu(e, cell)}
                >
                  {cell.revealed && !cell.flagged && cell.neighbours
                    ? cell.neighbours
                    : ""}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
