import React from "react";
import styles from "./Cell.module.scss";

export default function Cell({ onClick, onContextMenu, cell }) {
  return (
    <div
      data-testid={cell.mine ? "mine" : "cell"}
      className={`${styles.cell} ${cell.mine ? styles.mine + " mine" : ""} ${
        cell.flagged ? styles.flagged : cell.revealed ? styles.revealed : ""
      } ${
        cell.neighbours === 1
          ? styles.blue
          : cell.neighbours === 2
          ? styles.green
          : cell.neighbours === 3
          ? styles.red
          : styles.black
      }`}
      onClick={() => onClick(cell)}
      onContextMenu={(e) => onContextMenu(e, cell)}
    >
      {cell.revealed && !cell.flagged && cell.neighbours ? cell.neighbours : ""}
    </div>
  );
}
