import { useState, useRef } from "react";

const useTimer = (initialState = 0) => {
  const [timer, setTimer] = useState(initialState);
  const timerRef = useRef(null);

  const handleStart = () => {
    timerRef.current = setInterval(() => {
      setTimer((timer) => timer + 1);
    }, 1000);
  };

  const handlePause = () => {
    clearInterval(timerRef.current);
  };

  const handleReset = () => {
    clearInterval(timerRef.current);
    setTimer(0);
  };

  return {
    timer,
    handleStart,
    handlePause,
    handleReset,
  };
};

export default useTimer;
