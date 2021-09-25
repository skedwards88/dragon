import React from "react";

export default function Restart({
  setCurrentDisplay,
  handleNewGame
}) {
 
  return (
    <div className="App">
      <div className="description">Restart?</div>
      <button className="close" onClick={() => handleNewGame()}>
        Yes
      </button>

      <button className="close" onClick={() => setCurrentDisplay("location")}>
        No
      </button>
    </div>
  );
}
