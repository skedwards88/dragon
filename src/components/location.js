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
  playerLocation,
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
            playerLocation: playerLocation,
          })}
        </button>
      );
    }
  });
}

function MapInteractions({
  connections,
  handleMovePlayer,
  itemsAtLocation,
  handleTake,
}) {
  let interactionDivs = <></>;
  if (connections["A"].length) {
    const interactions = connections["A"];

    interactionDivs = Array.from(interactions).map((interaction) => {
      return (
        <button
          className="connection"
          onClick={() => handleMovePlayer(interaction)}
          id={interaction}
          key={interaction}
        ></button>
      );
    });
  }

  const itemDivs = Array.from(itemsAtLocation).map((item) => {
    return (
      <button
        onClick={() => handleTake(item)}
        className="item"
        key={item}
        id={item}
      ></button>
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
  playerLocation,
}) {
  if (!connections[direction]) {
    return <button className="connection" id={direction} disabled></button>;
  }

  const name = locations[connections[direction]].getDisplayName({
    gameState: gameState,
    itemLocations: itemLocations,
    playerLocation: playerLocation,
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
  playerLocation,
}) {
  return (
    <div id="map">
      {MapLocation({
        direction: "N",
        connections: connections,
        gameState: gameState,
        itemLocations: itemLocations,
        handleMovePlayer: handleMovePlayer,
        playerLocation: playerLocation,
      })}
      {MapLocation({
        direction: "W",
        connections: connections,
        gameState: gameState,
        itemLocations: itemLocations,
        handleMovePlayer: handleMovePlayer,
        playerLocation: playerLocation,
      })}
      <div id="A">
        {MapInteractions({
          connections: connections,
          handleMovePlayer: handleMovePlayer,
          itemsAtLocation,
          handleTake,
          playerLocation: playerLocation,
        })}
      </div>
      {MapLocation({
        direction: "E",
        connections: connections,
        gameState: gameState,
        itemLocations: itemLocations,
        handleMovePlayer: handleMovePlayer,
        playerLocation: playerLocation,
      })}
      {MapLocation({
        direction: "S",
        connections: connections,
        gameState: gameState,
        itemLocations: itemLocations,
        handleMovePlayer: handleMovePlayer,
        playerLocation: playerLocation,
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
    <div className="App" id="location-screen">
      <div className="description">
        {locations[playerLocation].getDescription({
          playerLocation: playerLocation,
          gameState: gameState,
          itemLocations: itemLocations,
        })}
        {locationConsequenceText}
      </div>
      <div id="non-description">
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
            playerLocation={playerLocation}
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
              playerLocation={playerLocation}
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
    </div>
  );
}
