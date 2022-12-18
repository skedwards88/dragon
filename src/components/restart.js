import React from "react";

export default function Restart({ setCurrentDisplay, dispatchGameState }) {
  return (
    <div className="App">
      <div className="description">Restart?</div>
      <div id="non-navigation-buttons" className="buttons">
        <button
          className="close"
          onClick={() => {
            dispatchGameState({ action: "newGame" });
            setCurrentDisplay("location");
          }}
        >
          Yes
        </button>

        <button className="close" onClick={() => setCurrentDisplay("location")}>
          No
        </button>
      </div>
    </div>
  );
}
