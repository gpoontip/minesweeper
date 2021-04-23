import React from "react";
import { useStateValue } from "../context/StateProvider";
import { ACTIONS } from "../context/reducer";
import { calculateMines, revealNeighbours, checkSuccess } from "../helpers";

export default function Board() {
  const [state, dispatch] = useStateValue();

  const handleClick = (cell) => {
    if (cell.revealed || cell.flagged || state.gameOver || state.success)
      return;
    const { x, y } = cell;
    let grid = JSON.parse(JSON.stringify(state.grid));
    const currentCell = grid[y][x];

    currentCell.revealed = true;

    if (!state.isActive) {
      dispatch({ type: ACTIONS.UPDATE_IS_ACTIVE, payload: { isActive: true } });
    }

    if (cell.mine === true) {
      dispatch({
        type: ACTIONS.UPDATE_IS_ACTIVE,
        payload: { isActive: false },
      });
      dispatch({ type: ACTIONS.GAME_OVER });
    } else {
      currentCell.neighbours = calculateMines(cell, grid);
      if (currentCell.neighbours === 0) {
        grid = revealNeighbours(cell, grid);
      }
    }

    let success = false;
    if (state.flags === 0) {
      success = checkSuccess(grid);
      if (success)
        dispatch({
          type: ACTIONS.UPDATE_IS_ACTIVE,
          payload: { isActive: false },
        });
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
      flags--;
    } else if (flags < state.gameOptions.mines) {
      currentCell.flagged = true;
      flags++;
    }
    grid[y][x] = currentCell;

    let success = false;
    if (flags === 0) {
      success = checkSuccess(grid);
      if (success)
        dispatch({
          type: ACTIONS.UPDATE_IS_ACTIVE,
          payload: { isActive: false },
        });
    }

    dispatch({ type: ACTIONS.UPDATE_GRID, payload: { grid } });
    dispatch({ type: ACTIONS.UPDATE_FLAGS, payload: { flags } });
    dispatch({ type: ACTIONS.UPDATE_SUCCESS, payload: { success } });
  };

  return (
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
  );
}
