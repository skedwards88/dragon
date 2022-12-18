import React from "react";

export default function Stats({ gameState }) {
  return (
    <div id="stats">
      <div className="stat">
        <div className="statName">Reputation: </div>
        <div>
          {gameState.reputation} / {gameState.maxReputation}
        </div>
      </div>
      <div className="stat">
        <div className="statName">Gold: </div>
        <div>
          {gameState.gold} / {gameState.maxGold}
        </div>
      </div>
    </div>
  );
}
