import { useState, useRef } from "react";

const useTimer = (initialState = 0) => {
  const [timer, setTimer] = useState(initialState);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef(null);

  const handleStart = () => {
    setIsActive(true);
    timerRef.current = setInterval(() => {
      setTimer((timer) => timer + 1);
    }, 1000);
  };

  const handlePause = () => {
    clearInterval(timerRef.current);
  };

  const handleReset = () => {
    clearInterval(timerRef.current);
    setIsActive(false);
    setTimer(0);
  };

  return {
    timer,
    isActive,
    handleStart,
    handlePause,
    handleReset,
  };
};

export default useTimer;
