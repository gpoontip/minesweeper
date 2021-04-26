import React, { useEffect, useState } from "react";
import { useStateValue } from "../context/StateProvider";
import styles from "./Scores.module.scss";
import { getAllScores } from "../api/scores";
import { ACTIONS } from "../context/reducer";

export default function HighScores() {
  const [{ scores }, dispatch] = useStateValue();
  const [sortedScores, setSortedScores] = useState(scores);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await getAllScores();
        if (response && response.status === 200) {
          dispatch({
            type: ACTIONS.FETCH_SCORES,
            payload: { scores: response.data },
          });
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchScores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const sorted = scores.sort((a, b) =>
      a.score > b.score ? 1 : b.score > a.score ? -1 : 0
    );
    setSortedScores(sorted);
  }, [scores]);

  return (
    <div className={scores.length ? styles.container : styles.hide}>
      <div className={styles.scores}>
        <h1>High Scores</h1>
        {sortedScores.map((row, index) => (
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
