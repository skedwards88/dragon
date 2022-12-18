import React from "react";

export default function Resume({ setCurrentDisplay, dispatchGameState }) {
  return (
    <div className="App">
      <div className="description">{`Continue from last point?`}</div>
      <div id="non-navigation-buttons" className="buttons">
        <button className="close" onClick={() => setCurrentDisplay("location")}>
          Continue
        </button>
        <button
          className="close"
          onClick={() => {
            dispatchGameState({ action: "newGame" });
            setCurrentDisplay("location");
          }}
        >
          Restart
        </button>
      </div>
    </div>
  );
}
