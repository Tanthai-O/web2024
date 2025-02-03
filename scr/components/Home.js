import React, { useState, useEffect } from "react";

function Home({ onStart }) {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetch("questions.json")
      .then((response) => response.json())
      .then((data) => setSubjects(data.subjects));
  }, []);

  return (
    <div className="container text-center">
      <h1>Welcome to the Online Quiz</h1>
      <p>Select a subject to begin:</p>
      {subjects.map((subject) => (
        <button key={subject.name} className="btn btn-primary m-2" onClick={() => onStart(subject)}>
          {subject.name}
        </button>
      ))}
    </div>
  );
}

export default Home;
