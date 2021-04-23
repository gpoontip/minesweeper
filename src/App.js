import React, { useEffect, useReducer } from "react";
import useTimer from "./hooks/useTimer";
import "./App.scss";

const height = 16;
const width = 16;
const mines = 40;
const initialState = {
  gameOver: false,
  success: false,
  flags: mines,
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

const ACTIONS = {
  GAME_OVER: "game-over",
  UPDATE_SUCCESS: "update-success",
  UPDATE_FLAGS: "update-flags",
  UPDATE_GRID: "update-grid",
  RESET: "reset",
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.GAME_OVER:
      return { ...state, gameOver: true };
    case ACTIONS.UPDATE_SUCCESS:
      return { ...state, success: action.payload.success };
    case ACTIONS.UPDATE_FLAGS:
      return { ...state, flags: action.payload.flags };
    case ACTIONS.UPDATE_GRID:
      return { ...state, grid: action.payload.grid };
    case ACTIONS.RESET:
      return { ...initialState };
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { timer, isActive, handleStart, handlePause, handleReset } = useTimer(
    0
  );

  const placeMines = () => {
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
    return grid;
  };

  const hasMine = ({ x, y }) => {
    if (x >= height || y >= height || x < 0 || y < 0) return 0;

    const cell = state.grid[y][x];
    return cell && cell.mine ? 1 : 0;
  };

  const getNeighbours = ({ x, y }) => {
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

  const calculateMines = (cell) => {
    const neighbours = getNeighbours(cell);
    return neighbours.reduce((count, row) => {
      return count + hasMine(row);
    }, 0);
  };

  const revealNeighbours = (cell, grid) => {
    const neighboursToReveal = [cell];

    while (neighboursToReveal.length > 0) {
      let { x, y } = neighboursToReveal[0];
      const neighbours = getNeighbours({ x, y });

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
        grid[y][x].neighbours = calculateMines(row);

        if (grid[y][x].neighbours === 0) {
          neighboursToReveal.push(row);
        }
      });
      neighboursToReveal.shift();
    }

    return grid;
  };

  const handleClick = (cell) => {
    if (cell.revealed || cell.flagged || state.gameOver || state.success)
      return;
    const { x, y } = cell;
    let grid = JSON.parse(JSON.stringify(state.grid));
    const currentCell = grid[y][x];

    currentCell.revealed = true;

    if (!isActive) {
      handleStart();
    }

    if (cell.mine === true) {
      handlePause();
      dispatch({ type: ACTIONS.GAME_OVER });
    } else {
      currentCell.neighbours = calculateMines(cell);
      if (currentCell.neighbours === 0) {
        grid = revealNeighbours(cell, grid);
      }
    }

    let success = false;
    if (state.flags === 0) {
      success = checkSuccess(grid);
    }

    grid[y][x] = currentCell;

    dispatch({ type: ACTIONS.UPDATE_GRID, payload: { grid } });
    dispatch({ type: ACTIONS.SUCCESS, payload: { success } });
  };

  const handleContextMenu = (e, cell) => {
    e.preventDefault();
    if (state.gameOver || state.success || (cell.revealed && !cell.flagged))
      return;
    const { x, y } = cell;
    const grid = JSON.parse(JSON.stringify(state.grid));
    const currentCell = grid[y][x];
    let flags = state.flags;

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
      success = checkSuccess(grid);
    }

    dispatch({ type: ACTIONS.UPDATE_GRID, payload: { grid } });
    dispatch({ type: ACTIONS.UPDATE_FLAGS, payload: { flags } });
    dispatch({ type: ACTIONS.UPDATE_SUCCESS, payload: { success } });
  };

  const handleRestart = () => {
    handleReset();
    const grid = placeMines();

    dispatch({ type: ACTIONS.RESET });
    dispatch({ type: ACTIONS.UPDATE_GRID, payload: { grid } });
  };

  const checkSuccess = (grid) => {
    let revealed = 0;
    let correct = 0;
    grid.forEach((row) => {
      row.forEach((cell) => {
        if (cell.revealed) revealed++;
        if (cell.flagged && cell.mine) correct++;
      });
    });
    if (revealed === height * width - mines && correct === mines) {
      handlePause();
      return true;
    }
  };

  useEffect(() => {
    const grid = placeMines();
    dispatch({ type: ACTIONS.UPDATE_GRID, payload: { grid } });

    return handleReset();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`app ${
        state.gameOver ? "game-over" : state.success ? "success" : ""
      }`}
    >
      <div className="header">
        <div className="mines">
          <div className="clock">{state.flags}</div>
        </div>
        <div className="smiley">
          <button onClick={() => handleRestart()} className="restart"></button>
        </div>
        <div className="timer">
          <div className="clock">{timer}</div>
        </div>
      </div>
      <div className="board">
        {state.grid.map((row, i) => (
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
                onClick={() => handleClick(cell)}
                onContextMenu={(e) => handleContextMenu(e, cell)}
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
