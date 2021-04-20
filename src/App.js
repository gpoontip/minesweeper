import React, { Component } from "react";
import "./App.scss";

const height = 16;
const width = 16;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [...Array(height)].map((y) =>
        [...Array(width)].map((x) => {
          return {
            id: `cell-${x}-${y}`,
            x,
            y,
            flagged: false,
            mine: false,
            revealed: false,
          };
        })
      ),
    };
  }

  render() {
    return (
      <div className="board">
        {this.state.grid.map((row, i) => (
          <div className="row" key={`row-${i}`}>
            {row.map((cell) => (
              <div className="cell" key={cell.id}>
                0
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
}

export default App;
