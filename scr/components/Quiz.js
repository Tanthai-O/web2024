import React, { useState } from "react";

function Quiz({ subject, onComplete, onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleAnswer = (index, answer) => {
    setAnswers({ ...answers, [index]: answer });
    if (currentIndex + 1 < subject.questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const score = subject.questions.reduce((total, question, i) => {
        return total + (question.answer === answers[i] ? 1 : 0);
      }, 0);
      onComplete(score);
      onFinish();
    }
  };

  return (
    <div className="container">
      <h2>{subject.name}</h2>
      <div>
        <p>{subject.questions[currentIndex].title}</p>
        {subject.questions[currentIndex].options.map((option, idx) => (
          <button key={idx} className="btn btn-outline-primary m-2" onClick={() => handleAnswer(currentIndex, idx + 1)}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Quiz;
