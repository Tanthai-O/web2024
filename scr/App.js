import React, { useState } from "react";
import Home from "scr\components\Home.js";
import Quiz from "scr\components\Quiz.js";
import Score from "scr\components\Score.js";

function App() {
  const [status, setStatus] = useState("home");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [score, setScore] = useState(0);

  const handleStart = (subject) => {
    setSelectedSubject(subject);
    setStatus("quiz");
  };

  return (
    <div>
      {status === "home" && <Home onStart={handleStart} />}
      {status === "quiz" && <Quiz subject={selectedSubject} onComplete={setScore} onFinish={() => setStatus("score")} />}
      {status === "score" && <Score score={score} onRestart={() => setStatus("home")} />}
    </div>
  );
}

export default App;
