import React from "react";
import { locations } from "../locations";

export default function Consequence({ setCurrentDisplay, gameState }) {
  return (
    <div className="App" id="consequence-display">
      <div className="description">{gameState.consequenceText}</div>
      <div id="non-navigation-buttons" className="buttons">
        <button className="close" onClick={() => setCurrentDisplay("location")}>
          Back to{" "}
          {locations[gameState.playerLocation].getDisplayName({
            playerLocation: gameState.playerLocation,
            gameState: gameState,
          }) || gameState.playerLocation}
        </button>
        <button
          className="inventory"
          onClick={() => setCurrentDisplay("inventory")}
        >
          Inventory
        </button>
      </div>
    </div>
  );
}
