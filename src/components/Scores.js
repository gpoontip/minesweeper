import React, { useEffect } from "react";
import { useStateValue } from "../context/StateProvider";
import styles from "./Scores.module.scss";
import { getAllScores } from "../api/scores";
import { ACTIONS } from "../context/reducer";

export default function HighScores() {
  const [{ scores }, dispatch] = useStateValue();

  useEffect(() => {
    getAllScores().then((scores) => {
      dispatch({
        type: ACTIONS.FETCH_SCORES,
        payload: { scores: scores.data },
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={scores.length ? styles.container : styles.hide}>
      <div className={styles.scores}>
        <h1>High Scores</h1>
        {scores.map((row, index) => (
          <div className={styles.row} key={index}>
            <div className={styles.rank}>{index + 1}</div>
            <div className={styles.name}>{row.name}</div>
            <div className={styles.score}>{row.score}s</div>
          </div>
        ))}
      </div>
    </div>
  );
}
