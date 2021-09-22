import React from "react";
import { locations } from "../../src/locations";
import Stats from "./stats";

function LocationItems({ itemsAtLocation, handleTake, items }) {
  return Array.from(itemsAtLocation).map((item) => {
    return (
      <button onClick={() => handleTake(item)} className="item" key={item}>
        {items[item].displayName || item}
      </button>
    );
  });
}

function Connections({
  connections,
  handleMovePlayer,
  itemLocations,
  gameState,
}) {
  return connections.map((connection) => {
    return (
      <button
        className="connection"
        key={connection}
        onClick={() => handleMovePlayer(connection)}
      >
        {locations[connection].getDisplayName({
          gameState: gameState,
          itemLocations: itemLocations,
        })}
      </button>
    );
  });
}

export default function Location({
  handleTake,
  items,
  handleMovePlayer,
  itemLocations,
  gameState,
  playerLocation,
  setCurrentDisplay,
  locationConsequenceText,
}) {
  console.log(`in loc ${playerLocation}`);
  return (
    <div className="App">
      <div className="description">
        {locations[playerLocation].getDescription({
          playerLocation: playerLocation,
          gameState: gameState,
          itemLocations: itemLocations,
        })}
        {locationConsequenceText}
      </div>
      <div className="buttons">
        <LocationItems
          itemsAtLocation={itemLocations[playerLocation]}
          handleTake={handleTake}
          items={items}
        />
        <Connections
          connections={locations[playerLocation].getConnections({
            playerLocation: playerLocation,
            gameState: gameState,
            itemLocations: itemLocations,
          })}
          handleMovePlayer={handleMovePlayer}
          itemLocations={itemLocations}
          gameState={gameState}
          locations={locations}
        />
        <button
          className="inventory"
          onClick={() => setCurrentDisplay("inventory")}
        >
          Inventory
        </button>
      </div>
      <Stats
        reputation={gameState.reputation}
        maxReputation={gameState.maxReputation}
        gold={gameState.gold}
        maxGold={gameState.maxGold}
      />
    </div>
  );
}
