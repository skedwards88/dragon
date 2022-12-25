import React from "react";

export default function Stats({ reputation, maxReputation, gold, maxGold }) {
  return (
    <div id="stats">
      <div className="stat">
        <div className="statName">Reputation: </div>
        <div>
          {reputation} / {maxReputation}
        </div>
      </div>
      <div className="stat">
        <div className="statName">Gold: </div>
        <div>
          {gold} / {maxGold}
        </div>
      </div>
    </div>
  );
}
