import React, { useEffect } from "react";
import { useStateValue } from "../context/StateProvider";
import { ACTIONS } from "../context/reducer";
import useTimer from "../hooks/useTimer";
import { setup } from "../helpers/setup";
import { initialState } from "../context/reducer";
import styles from "./Header.module.scss";

export default function Header() {
  const [{ flags, gameOptions, isActive }, dispatch] = useStateValue();
  const { timer, handleReset, handleStart, handlePause } = useTimer();

  useEffect(() => {
    // stop timer on unmount
    return handleReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isActive) {
      // start timer
      handleStart();
    } else {
      // pause timer
      handlePause();

      // save time
      dispatch({ type: ACTIONS.UPDATE_SECONDS, payload: { seconds: timer } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  const handleRestart = () => {
    // restart timer
    handleReset();

    // reset grid
    const { grid } = setup(initialState);

    // reset game
    dispatch({ type: ACTIONS.RESET });
    dispatch({ type: ACTIONS.UPDATE_GRID, payload: { grid } });
  };

  return (
    <div className={styles.header}>
      <div className="mines">
        <div className={styles.clock}>{gameOptions.mines - flags}</div>
      </div>
      <div className={styles.smiley}>
        <button
          aria-label="Restart"
          onClick={() => handleRestart()}
          className={`${styles.restart} restart`}
        ></button>
      </div>
      <div className={styles.timer}>
        <div className={styles.clock}>{timer}</div>
      </div>
    </div>
  );
}
