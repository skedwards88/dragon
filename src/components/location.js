import React from "react";
import {locations} from "../../src/locations";
import Stats from "./stats";
import {items} from "../items";
import Share from "@skedwards88/shared-components/src/components/Share";

function LocationItems({gameState, dispatchGameState, setCurrentDisplay}) {
  const itemsAtLocation = gameState.itemLocations[gameState.playerLocation];
  return Array.from(itemsAtLocation).map((item) => {
    return (
      <button
        onClick={() => {
          dispatchGameState({action: "takeItem", item: item});
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

function NavigationList({
  showPhoto,
  gameState,
  dispatchGameState,
  setCurrentDisplay,
  locationName,
}) {
  return (
    <div id="navigation" className="navigation-list">
      {showPhoto ? (
        <div className={"listNavigationImage " + locationName}></div>
      ) : (
        <></>
      )}
      <LocationItems
        gameState={gameState}
        dispatchGameState={dispatchGameState}
        setCurrentDisplay={setCurrentDisplay}
      />
      <Connections
        dispatchGameState={dispatchGameState}
        gameState={gameState}
      />
    </div>
  );
}

function Connections({gameState, dispatchGameState}) {
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
            dispatchGameState({action: "movePlayer", newLocation: connection})
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
          dispatchGameState({action: "takeItem", item: item});
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

function MapLocation({direction, connections, gameState, dispatchGameState}) {
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

function Map({gameState, dispatchGameState, setCurrentDisplay, showPhoto}) {
  const connections =
    locations[gameState.playerLocation].getConnections(gameState);

  const itemsAtLocation = gameState.itemLocations[gameState.playerLocation];
  const locationName =
    locations[gameState.playerLocation].getBackgroundName(gameState);
  return (
    <div id="navigation" className="navigation-map">
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
        <div id="A" className={showPhoto ? locationName : ""}>
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
    </div>
  );
}

async function handleInstall(installPromptEvent, setInstallPromptEvent) {
  console.log("handling install");
  console.log(installPromptEvent);
  installPromptEvent.prompt();
  const result = await installPromptEvent.userChoice;
  console.log(result);
  setInstallPromptEvent(null);
  try {
    window.gtag("event", "install", {});
  } catch (error) {
    console.log("tracking error", error);
  }
}

export default function Location({
  gameState,
  dispatchGameState,
  setCurrentDisplay,
  showMap,
  setShowMap,
  showPhoto,
  setShowPhoto,
  installPromptEvent,
  showInstallButton,
  setInstallPromptEvent,
}) {
  const locationName =
    locations[gameState.playerLocation].getBackgroundName(gameState);

  return (
    <div className="App" id="location-display">
      <div id="controls">
        <button
          id="showMap"
          className={"showMap " + showMap}
          onClick={() => setShowMap(!showMap)}
        ></button>
        <button
          id="showPhoto"
          className={"showPhoto " + showPhoto}
          onClick={() => setShowPhoto(!showPhoto)}
        ></button>
        <button id="info" onClick={() => setCurrentDisplay("info")}></button>
        <button
          id="restart"
          onClick={() => setCurrentDisplay("restart")}
        ></button>
        <Share
          appName="Dragon Hero"
          text="Check out this text adventure puzzle!"
          url="https://skedwards88.github.io/dragon/"
          origin="control bar"
          id="share"
        ></Share>
        {showInstallButton && installPromptEvent ? (
          <button
            id="install"
            onClick={() =>
              handleInstall(installPromptEvent, setInstallPromptEvent)
            }
          ></button>
        ) : (
          <></>
        )}
      </div>
      <Stats
        reputation={gameState.reputation}
        maxReputation={gameState.maxReputation}
        gold={gameState.gold}
        maxGold={gameState.maxGold}
      />
      <div className="description">
        {locations[gameState.playerLocation].getDescription(gameState)}
        {gameState.locationConsequenceText}
      </div>
      {showMap ? (
        <Map
          gameState={gameState}
          dispatchGameState={dispatchGameState}
          setCurrentDisplay={setCurrentDisplay}
          showPhoto={showPhoto}
        />
      ) : (
        <NavigationList
          gameState={gameState}
          dispatchGameState={dispatchGameState}
          setCurrentDisplay={setCurrentDisplay}
          showPhoto={showPhoto}
          locationName={locationName}
        />
      )}
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
