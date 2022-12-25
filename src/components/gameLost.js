import React from "react";
import Stats from "./stats";

export default function GameLost({
  dispatchGameState,
  gameState,
  setCurrentDisplay,
}) {
  return (
    <div className="App" id="gameOver-display">
      <Stats
        reputation={0}
        maxReputation={gameState.maxReputation}
        gold={gameState.gold}
        maxGold={gameState.maxGold}
      />
      <div className="description">{`Reputation: 0\n\nEven your pride has its limits. With what little reputation you have left, you flee the town.`}</div>
      <div id="non-navigation-buttons" className="buttons">
        <button
          className="close"
          onClick={() => {
            dispatchGameState({ action: "newGame" });
            setCurrentDisplay("location");
          }}
        >
          PLAY AGAIN
        </button>
      </div>
    </div>
  );
}
