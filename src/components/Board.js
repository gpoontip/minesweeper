import React from "react";
import { useStateValue } from "../context/StateProvider";
import { ACTIONS } from "../context/reducer";
import { calculateMines, revealNeighbours, checkSuccess } from "../helpers";
import styles from "./Board.module.scss";
import NameEntry from "./NameEntry";
import Cell from "./Cell";

export default function Board() {
  const [state, dispatch] = useStateValue();

  const handleClick = (cell) => {
    // ignore click if it's already revealed or flagged or if game is over
    if (cell.revealed || cell.flagged || state.gameOver || state.success)
      return;

    const { x, y } = cell;

    // deep clone grid
    let grid = JSON.parse(JSON.stringify(state.grid));

    // reveal current cell
    grid[y][x].revealed = true;

    // if game is not active, start the game
    if (!state.isActive) {
      dispatch({ type: ACTIONS.UPDATE_IS_ACTIVE, payload: { isActive: true } });
    }

    if (cell.mine === true) {
      // if cell has a mine, game is over
      dispatch({
        type: ACTIONS.UPDATE_IS_ACTIVE,
        payload: { isActive: false },
      });
      dispatch({ type: ACTIONS.GAME_OVER });
    } else {
      // calculate number of neighbouring mines
      grid[y][x].neighbours = calculateMines(cell, grid, state.gameOptions);

      if (grid[y][x].neighbours === 0) {
        // if there are no surrounding mines, reveal all nearby empty cells
        grid = revealNeighbours(cell, grid, state.gameOptions);
      }
    }

    // if there are no flags left, check if game is won
    let success = false;
    if (state.flags === state.gameOptions.mines) {
      success = checkSuccess(grid, state.gameOptions);
      if (success)
        dispatch({
          type: ACTIONS.UPDATE_IS_ACTIVE,
          payload: { isActive: false },
        });
    }

    // update grid and success status
    dispatch({ type: ACTIONS.UPDATE_GRID, payload: { grid } });
    dispatch({ type: ACTIONS.UPDATE_SUCCESS, payload: { success } });
  };

  const handleContextMenu = (e, cell) => {
    e.preventDefault();

    // ignore click if game over or it's already revealed
    if (state.gameOver || state.success || (cell.revealed && !cell.flagged))
      return;

    const { x, y } = cell;

    // deep clone grid
    const grid = JSON.parse(JSON.stringify(state.grid));

    let flags = state.flags;

    // determine if to flag or unflag
    if (grid[y][x].flagged) {
      grid[y][x].flagged = false;
      flags--;
    } else if (flags < state.gameOptions.mines) {
      grid[y][x].flagged = true;
      flags++;
    }

    // if there are no flags left, check if game is won
    let success = false;
    if (flags === state.gameOptions.mines) {
      success = checkSuccess(grid, state.gameOptions);
      if (success)
        dispatch({
          type: ACTIONS.UPDATE_IS_ACTIVE,
          payload: { isActive: false },
        });
    }

    // update grid, flag count and success status
    dispatch({ type: ACTIONS.UPDATE_GRID, payload: { grid } });
    dispatch({ type: ACTIONS.UPDATE_FLAGS, payload: { flags } });
    dispatch({ type: ACTIONS.UPDATE_SUCCESS, payload: { success } });
  };

  return (
    <div className={styles.board}>
      {state.grid.map((row, i) => (
        <div className={styles.row} key={`row-${i}`}>
          {row.map((cell) => (
            <Cell
              key={cell.id}
              onClick={(cell) => handleClick(cell)}
              onContextMenu={(e, cell) => handleContextMenu(e, cell)}
              cell={cell}
            />
          ))}
        </div>
      ))}
      <NameEntry show={state.success} />
    </div>
  );
}
