import React from "react";

export default function Consequence({
  consequenceText,
  setCurrentDisplay,
  locations,
  playerLocation,
  gameState,
  itemLocations,
}) {
  return (
    <div className="App">
      <div className="description">{consequenceText}</div>
      <button className="close" onClick={() => setCurrentDisplay("location")}>
        Back to{" "}
        {locations[playerLocation].getDisplayName({
          playerLocation: playerLocation,
          gameState: gameState,
          itemLocations: itemLocations,
        }) || playerLocation}
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
