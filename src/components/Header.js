import React, { useEffect } from "react";
import { useStateValue } from "../context/StateProvider";
import { ACTIONS } from "../context/reducer";
import useTimer from "../hooks/useTimer";
import { setup } from "../helpers/setup";
import { initialState } from "../context/reducer";

export default function Header() {
  const [{ flags, gameOptions, isActive }, dispatch] = useStateValue();
  const { timer, handleReset, handleStart, handlePause } = useTimer(0);

  useEffect(() => {
    if (isActive) handleStart();
    else handlePause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  const handleRestart = () => {
    handleReset();
    const { grid } = setup(initialState);

    dispatch({ type: ACTIONS.RESET });
    dispatch({ type: ACTIONS.UPDATE_GRID, payload: { grid } });
  };

  return (
    <div className="header">
      <div className="mines">
        <div className="clock">{gameOptions.mines - flags}</div>
      </div>
      <div className="smiley">
        <button onClick={() => handleRestart()} className="restart"></button>
      </div>
      <div className="timer">
        <div className="clock">{timer}</div>
      </div>
    </div>
  );
}
