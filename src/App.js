import React, { Component } from "react";
import "./App.scss";

const height = 16;
const width = 16;
const mines = 40;
const initialState = {
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
    let mines = 0;
    const { x, y } = cell;
    mines += this.hasMine({ x: x - 1, y: y - 1 }); // top left
    mines += this.hasMine({ x, y: y - 1 }); // top
    mines += this.hasMine({ x: x + 1, y: y - 1 }); // top right
    mines += this.hasMine({ x: x - 1, y }); // left
    mines += this.hasMine({ x: x + 1, y }); // right
    mines += this.hasMine({ x: x - 1, y: y + 1 }); // bottom left
    mines += this.hasMine({ x, y: y + 1 }); // bottom
    mines += this.hasMine({ x: x + 1, y: y + 1 }); // bottom right
    return mines;
  };

  handleClick = (cell) => {
    if (cell.revealed) return;
    const { x, y } = cell;
    const grid = JSON.parse(JSON.stringify(this.state.grid));
    const currentCell = grid[y][x];
    currentCell.revealed = true;

    if (cell.mine === true) {
      console.log("Game Over");
    } else {
      currentCell.neighbours = this.calculateMines(cell);
    }
    grid[y][x] = currentCell;
    this.setState({ grid });
  };

  handleContextMenu = (e, cell) => {
    e.preventDefault();
    const { x, y } = cell;
    const grid = JSON.parse(JSON.stringify(this.state.grid));
    const currentCell = grid[y][x];
    currentCell.revealed = !currentCell.revealed;
    currentCell.flagged = !currentCell.flagged;
    grid[y][x] = currentCell;
    this.setState({ grid });
  };

  handleReset = () => {
    this.placeMines();
  };

  render() {
    return (
      <div className="board">
        {this.state.grid.map((row, i) => (
          <div className="row" key={`row-${i}`}>
            {row.map((cell) => (
              <div
                className="cell"
                key={cell.id}
                onClick={() => this.handleClick(cell)}
                onContextMenu={(e) => this.handleContextMenu(e, cell)}
              >
                {cell.revealed
                  ? cell.flagged
                    ? "F"
                    : cell.mine
                    ? "*"
                    : cell.neighbours
                  : "-"}
              </div>
            ))}
          </div>
        ))}
        <button onClick={() => this.handleReset()}>Reset</button>
      </div>
    );
  }
}

export default App;
