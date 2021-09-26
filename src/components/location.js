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
  const connectionValues = Object.values(connections).flatMap((i) => i);
  return connectionValues.map((connection) => {
    if (connection) {
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
    }
  });
}

function MapInteractions({
  connections,
  gameState,
  itemLocations,
  handleMovePlayer,
  itemsAtLocation,
  handleTake,
  items,
}) {
  let interactionDivs = <></>;
  if (connections["A"].length) {
    const interactions = connections["A"];

    interactionDivs = Array.from(interactions).map((interaction) => {
      const name = locations[interaction].getDisplayName({
        gameState: gameState,
        itemLocations: itemLocations,
      });

      return (
        <button
          className="connection"
          onClick={() => handleMovePlayer(interaction)}
          id={interaction}
          key={interaction}
        >
          <p>{name}</p>
        </button>
      );
    });
  }

  console.log(itemsAtLocation);
  const itemDivs = Array.from(itemsAtLocation).map((item) => {
    return (
      <button onClick={() => handleTake(item)} className="item" key={item}>
        {items[item].displayName || item}
      </button>
    );
  });

  return (
    <>
      {interactionDivs}
      {itemDivs}
    </>
  );
}

function MapLocation({
  direction,
  connections,
  gameState,
  itemLocations,
  handleMovePlayer,
}) {
  if (!connections[direction]) {
    return <></>;
  }

  const name = locations[connections[direction]].getDisplayName({
    gameState: gameState,
    itemLocations: itemLocations,
  });

  return (
    <button
      className="connection"
      onClick={() => handleMovePlayer(connections[direction])}
      id={direction}
    >
      <p>{name}</p>
    </button>
  );
}

function Map({
  connections,
  handleMovePlayer,
  itemLocations,
  gameState,
  itemsAtLocation,
  handleTake,
  items,
}) {
  return (
    <div id="map">
      {MapLocation({
        direction: "N",
        connections: connections,
        gameState: gameState,
        itemLocations: itemLocations,
        handleMovePlayer: handleMovePlayer,
      })}
      {MapLocation({
        direction: "W",
        connections: connections,
        gameState: gameState,
        itemLocations: itemLocations,
        handleMovePlayer: handleMovePlayer,
      })}
      <div id="A">
        {MapInteractions({
          connections: connections,
          gameState: gameState,
          itemLocations: itemLocations,
          handleMovePlayer: handleMovePlayer,

          itemsAtLocation,
          handleTake,
          items,
        })}
      </div>
      {MapLocation({
        direction: "E",
        connections: connections,
        gameState: gameState,
        itemLocations: itemLocations,
        handleMovePlayer: handleMovePlayer,
      })}
      {MapLocation({
        direction: "S",
        connections: connections,
        gameState: gameState,
        itemLocations: itemLocations,
        handleMovePlayer: handleMovePlayer,
      })}
    </div>
  );
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
  showMap,
  setShowMap,
}) {
  console.log(`in location ${playerLocation}`);

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
      {showMap ? (
        <Map
          connections={locations[playerLocation].getConnections({
            playerLocation: playerLocation,
            gameState: gameState,
            itemLocations: itemLocations,
          })}
          handleMovePlayer={handleMovePlayer}
          itemLocations={itemLocations}
          gameState={gameState}
          locations={locations}
          itemsAtLocation={itemLocations[playerLocation]}
          handleTake={handleTake}
          items={items}
        />
      ) : (
        <>
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
        </>
      )}
      <div className="buttons">
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
      <div id="non-game">
        <button
          id="showMap"
          className={"showMap " + showMap}
          onClick={() => setShowMap(!showMap)}
        ></button>
        <button id="info" onClick={() => setCurrentDisplay("info")}></button>
        <button
          id="restart"
          onClick={() => setCurrentDisplay("restart")}
        ></button>
      </div>
    </div>
  );
}