import React from "react";
import { useStateValue } from "../context/StateProvider";
import { ACTIONS } from "../context/reducer";
import { calculateMines, revealNeighbours, checkSuccess } from "../helpers";
import styles from "./Board.module.scss";
import NameEntry from "./NameEntry";

export default function Board() {
  const [state, dispatch] = useStateValue();

  const handleClick = (cell) => {
    if (cell.revealed || cell.flagged || state.gameOver || state.success)
      return;
    const { x, y } = cell;
    let grid = JSON.parse(JSON.stringify(state.grid));

    grid[y][x].revealed = true;

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
      grid[y][x].neighbours = calculateMines(cell, grid);
      if (grid[y][x].neighbours === 0) {
        grid = revealNeighbours(cell, grid);
      }
    }

    let success = false;
    if (state.flags === state.gameOptions.mines) {
      success = checkSuccess(grid);
      if (success)
        dispatch({
          type: ACTIONS.UPDATE_IS_ACTIVE,
          payload: { isActive: false },
        });
    }

    dispatch({ type: ACTIONS.UPDATE_GRID, payload: { grid } });
    dispatch({ type: ACTIONS.UPDATE_SUCCESS, payload: { success } });
  };

  const handleContextMenu = (e, cell) => {
    e.preventDefault();
    if (state.gameOver || state.success || (cell.revealed && !cell.flagged))
      return;
    const { x, y } = cell;
    const grid = JSON.parse(JSON.stringify(state.grid));
    let flags = state.flags;

    if (grid[y][x].flagged) {
      grid[y][x].flagged = false;
      flags--;
    } else if (flags < state.gameOptions.mines) {
      grid[y][x].flagged = true;
      flags++;
    }

    let success = false;
    if (flags === state.gameOptions.mines) {
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
    <div className={styles.board}>
      {state.grid.map((row, i) => (
        <div className={styles.row} key={`row-${i}`}>
          {row.map((cell) => (
            <div
              className={`${styles.cell} ${
                cell.mine ? styles.mine + " mine" : ""
              } ${
                cell.flagged
                  ? styles.flagged
                  : cell.revealed
                  ? styles.revealed
                  : ""
              } ${
                cell.neighbours === 1
                  ? styles.blue
                  : cell.neighbours === 2
                  ? styles.green
                  : cell.neighbours === 3
                  ? styles.red
                  : styles.black
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
      <NameEntry show={state.success} />
    </div>
  );
}
