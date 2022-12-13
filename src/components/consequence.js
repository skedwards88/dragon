import React from "react";
import { locations } from "../locations";

export default function Consequence({ setCurrentDisplay, gameState }) {
  return (
    <div className="App">
      <div className="description">{gameState.consequenceText}</div>
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
  );
}
