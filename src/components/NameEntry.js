import React, { useState, useEffect } from "react";
import styles from "./NameEntry.module.scss";
import { addScore, getAllScores } from "../api/scores";
import { useStateValue } from "../context/StateProvider";
import { ACTIONS } from "../context/reducer";

export default function NameEntry({ show }) {
  const [{ seconds }, dispatch] = useStateValue();
  const [submitting, setSubmitting] = useState(false);
  const [initials, setInitials] = useState(false);
  const [displayForm, setDisplayForm] = useState(false);

  useEffect(() => {
    setInitials("");
    setDisplayForm(show);
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const name = initials;
      const score = seconds;
      const response = await addScore({ name, score });
      if (response.data && response.data.status === "success") {
        const scores = await getAllScores();
        dispatch({
          type: ACTIONS.FETCH_SCORES,
          payload: { scores: scores.data },
        });
        setDisplayForm(false);
      }
    } catch (error) {
      console.error(error);
    }
    setSubmitting(false);
  };

  return (
    <div className={displayForm ? styles.container : styles.hide}>
      <div className={styles.form}>
        {submitting ? (
          <div>Submitting...</div>
        ) : (
          <>
            <h2>New High Score!</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="initials">Enter your initials:</label>
              <input
                type="text"
                id="initials"
                placeholder="Initals"
                required
                maxLength="3"
                ref={(input) => input && input.focus()}
                onChange={(e) => setInitials(e.target.value)}
              />
              <button>OK</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
