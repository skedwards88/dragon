import React from "react";

export default function Resume({ setCurrentDisplay, handleNewGame }) {
  return (
    <div className="App">
      <div className="description">
        {`Continue from last point?`}
      </div>
      <button className="close" onClick={() => setCurrentDisplay("location")}>
        Continue
      </button>
      <button className="close" onClick={() => handleNewGame()}>
        Restart
      </button>
    </div>
  );
}
