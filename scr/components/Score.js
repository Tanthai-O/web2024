import React from "react";

function Score({ score, onRestart }) {
  return (
    <div className="container text-center">
      <h1>Your Score</h1>
      <p>You scored {score} points!</p>
      <button className="btn btn-primary" onClick={onRestart}>
        Restart Quiz
      </button>
    </div>
  );
}

export default Score;
