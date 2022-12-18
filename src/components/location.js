import React from "react";
import { locations } from "../../src/locations";
import Stats from "./stats";
import { items } from "../items";

function LocationItems({ gameState, dispatchGameState, setCurrentDisplay }) {
  const itemsAtLocation = gameState.itemLocations[gameState.playerLocation];
  return Array.from(itemsAtLocation).map((item) => {
    return (
      <button
        onClick={() => {
          dispatchGameState({ action: "takeItem", item: item });
          setCurrentDisplay("consequence");
        }}
        className="item"
        key={item}
      >
        {items[item].displayName || item}
      </button>
    );
  });
}

function Connections({ gameState, dispatchGameState }) {
  const connections =
    locations[gameState.playerLocation].getConnections(gameState);
  const connectionValues = Object.values(connections).flatMap((i) => i);
  return connectionValues.map((connection) => {
    if (connection) {
      return (
        <button
          className="connection"
          key={connection}
          onClick={() =>
            dispatchGameState({ action: "movePlayer", newLocation: connection })
          }
        >
          {locations[connection].getDisplayName(gameState)}
        </button>
      );
    }
  });
}

function MapInteractions({
  connections,
  itemsAtLocation,
  dispatchGameState,
  setCurrentDisplay,
}) {
  let interactionDivs = <></>;
  if (connections["A"].length) {
    const interactions = connections["A"];

    interactionDivs = Array.from(interactions).map((interaction) => {
      return (
        <button
          className="connection"
          onClick={() =>
            dispatchGameState({
              action: "movePlayer",
              newLocation: interaction,
            })
          }
          id={interaction}
          key={interaction}
        ></button>
      );
    });
  }

  const itemDivs = Array.from(itemsAtLocation).map((item) => {
    return (
      <button
        onClick={() => {
          dispatchGameState({ action: "takeItem", item: item });
          setCurrentDisplay("consequence");
        }}
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

function MapLocation({ direction, connections, gameState, dispatchGameState }) {
  if (!connections[direction]) {
    return <button className="connection" id={direction} disabled></button>;
  }

  const name = locations[connections[direction]].getDisplayName(gameState);

  return (
    <button
      className="connection"
      onClick={() =>
        dispatchGameState({
          action: "movePlayer",
          newLocation: connections[direction],
        })
      }
      id={direction}
    >
      <p>{name}</p>
    </button>
  );
}

function Map({ gameState, dispatchGameState, setCurrentDisplay }) {
  const connections =
    locations[gameState.playerLocation].getConnections(gameState);

  const itemsAtLocation = gameState.itemLocations[gameState.playerLocation];
  return (
    <div id="map">
      {MapLocation({
        direction: "N",
        connections: connections,
        gameState: gameState,
        dispatchGameState: dispatchGameState,
      })}
      {MapLocation({
        direction: "W",
        connections: connections,
        gameState: gameState,
        dispatchGameState: dispatchGameState,
      })}
      <div id="A">
        {MapInteractions({
          connections: connections,
          dispatchGameState: dispatchGameState,
          itemsAtLocation: itemsAtLocation,
          setCurrentDisplay: setCurrentDisplay,
        })}
      </div>
      {MapLocation({
        direction: "E",
        connections: connections,
        gameState: gameState,
        dispatchGameState: dispatchGameState,
      })}
      {MapLocation({
        direction: "S",
        connections: connections,
        gameState: gameState,
        dispatchGameState: dispatchGameState,
      })}
    </div>
  );
}

function handleShare() {
  const url = "https://skedwards88.github.io/dragon/";

  let text = "Check out this text adventure puzzle!";

  navigator
    .share({
      title: "Dragon Hero",
      text: `${text}\n\n`,
      url: url,
    })
    .then(() => console.log("Successful share"))
    .catch((error) => {
      // copy to clipboard as backup
      console.log("Error sharing", error);
      try {
        navigator.clipboard.writeText(`${text}\n\n${url}`);
      } catch (error) {
        console.log("Error copying", error);
      }
    });
}

export default function Location({
  gameState,
  dispatchGameState,
  setCurrentDisplay,
  showMap,
  setShowMap,
}) {
  return (
    <div className="App" id="location-display">
      <div id="controls">
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
        {navigator.canShare ? (
          <button id="share" onClick={() => handleShare()}></button>
        ) : (
          <></>
        )}
      </div>
      <Stats gameState={gameState} />
      <div className="description">
        {locations[gameState.playerLocation].getDescription(gameState)}
        {gameState.locationConsequenceText}
      </div>
      <div id="navigation" className={showMap ? "navigation-map" : "navigation-list"}>
        {showMap ? (
          <Map
            gameState={gameState}
            dispatchGameState={dispatchGameState}
            setCurrentDisplay={setCurrentDisplay}
          />
        ) : (
          <>
            <LocationItems
              gameState={gameState}
              dispatchGameState={dispatchGameState}
              setCurrentDisplay={setCurrentDisplay}
            />
            <Connections
              dispatchGameState={dispatchGameState}
              gameState={gameState}
            />
          </>
        )}
      </div>
      <div id="non-navigation-buttons" className="buttons">
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
