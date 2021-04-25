import React from "react";
import Header from "./components/Header";
import Board from "./components/Board";
import Scores from "./components/Scores";
import { useStateValue } from "./context/StateProvider";
import "./App.scss";

export default function App() {
  const [{ gameOver, success }] = useStateValue();

  return (
    <div className={`app ${gameOver ? "game-over" : success ? "success" : ""}`}>
      <Header />
      <Board />
      <Scores />
    </div>
  );
}
