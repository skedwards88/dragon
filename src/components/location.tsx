import {type Connections, type Direction, locations} from "../logic/locations";
import Stats from "./stats";
import {type ItemName, items} from "../logic/items";
import Share from "@skedwards88/shared-components/src/components/Share";
import {isRunningStandalone} from "@skedwards88/shared-components/src/logic/isRunningStandalone";
import {useMetadataContext} from "@skedwards88/shared-components/src/components/MetadataContextProvider";
import type {GameState} from "../logic/init";
import type {DisplayState} from "./App";
import type {ReducerPayload} from "../logic/reducer";

function LocationItems({
  itemsAtLocation,
  dispatchGameState,
  setCurrentDisplay,
}: {
  itemsAtLocation: ItemName[];
  dispatchGameState: React.Dispatch<ReducerPayload>;
  setCurrentDisplay: React.Dispatch<React.SetStateAction<DisplayState>>;
}): React.JSX.Element {
  return (
    <>
      {itemsAtLocation.map((item) => {
        return (
          <button
            onClick={() => {
              dispatchGameState({action: "takeItem", item});
              setCurrentDisplay("consequence");
            }}
            className="item"
            key={item}
          >
            {items[item].displayName || item}
          </button>
        );
      })}
    </>
  );
}

function NavigationList({
  showPhoto,
  gameState,
  dispatchGameState,
  setCurrentDisplay,
  backgroundName,
}: {
  showPhoto: boolean;
  gameState: GameState;
  dispatchGameState: React.Dispatch<ReducerPayload>;
  setCurrentDisplay: React.Dispatch<React.SetStateAction<DisplayState>>;
  backgroundName: string;
}): React.JSX.Element {
  return (
    <div id="navigation" className="navigation-list">
      {showPhoto ? (
        <div className={`listNavigationImage ${backgroundName}`} />
      ) : null}
      <LocationItems
        itemsAtLocation={gameState.itemLocations[gameState.playerLocation]}
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

function Connections({
  gameState,
  dispatchGameState,
}: {
  gameState: GameState;
  dispatchGameState: React.Dispatch<ReducerPayload>;
}): React.JSX.Element {
  const connections =
    locations[gameState.playerLocation].getConnections(gameState);

  const connectionValues = Object.values(connections)
    .flatMap((i) => i)
    .filter((connection) => connection !== "");

  return (
    <>
      {connectionValues.map((connection) => {
        <button
          className="connection"
          key={connection}
          onClick={() => {
            dispatchGameState({action: "movePlayer", newLocation: connection});
          }}
        >
          {locations[connection].getDisplayName(gameState)}
        </button>;
      })}
    </>
  );
}

function MapInteractions({
  connections,
  itemsAtLocation,
  dispatchGameState,
  setCurrentDisplay,
}: {
  connections: Connections;
  itemsAtLocation: ItemName[];
  dispatchGameState: React.Dispatch<ReducerPayload>;
  setCurrentDisplay: React.Dispatch<React.SetStateAction<DisplayState>>;
}): React.JSX.Element {
  const interactionDivs = connections.A.map((interaction) => {
    <button
      className="connection"
      onClick={() => {
        dispatchGameState({
          action: "movePlayer",
          newLocation: interaction,
        });
      }}
      id={interaction}
      key={interaction}
    />;
  });

  const itemDivs = itemsAtLocation.map((item) => {
    return (
      <button
        onClick={() => {
          dispatchGameState({action: "takeItem", item});
          setCurrentDisplay("consequence");
        }}
        className="item"
        key={item}
        id={item}
      />
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
  dispatchGameState,
}: {
  direction: Direction;
  connections: Connections;
  gameState: GameState;
  dispatchGameState: React.Dispatch<ReducerPayload>;
}): React.JSX.Element {
  const connection = connections[direction];

  if (!connection) {
    return <button className="connection" id={direction} disabled />;
  }

  const name = locations[connection].getDisplayName(gameState);

  return (
    <button
      className="connection"
      onClick={() => {
        dispatchGameState({
          action: "movePlayer",
          newLocation: connection,
        });
      }}
      id={direction}
    >
      <p>{name}</p>
    </button>
  );
}

function Map({
  gameState,
  dispatchGameState,
  setCurrentDisplay,
  showPhoto,
}: {
  gameState: GameState;
  dispatchGameState: React.Dispatch<ReducerPayload>;
  setCurrentDisplay: React.Dispatch<React.SetStateAction<DisplayState>>;
  showPhoto: boolean;
}): React.JSX.Element {
  const connections =
    locations[gameState.playerLocation].getConnections(gameState);

  const itemsAtLocation = gameState.itemLocations[gameState.playerLocation];
  const backgroundName =
    locations[gameState.playerLocation].getBackgroundName(gameState);
  return (
    <div id="navigation" className="navigation-map">
      <div id="map">
        <MapLocation
          direction="N"
          connections={connections}
          gameState={gameState}
          dispatchGameState={dispatchGameState}
        />
        <MapLocation
          direction="W"
          connections={connections}
          gameState={gameState}
          dispatchGameState={dispatchGameState}
        />
        <div id="A" className={showPhoto ? backgroundName : ""}>
          <MapInteractions
            connections={connections}
            dispatchGameState={dispatchGameState}
            itemsAtLocation={itemsAtLocation}
            setCurrentDisplay={setCurrentDisplay}
          />
        </div>
        <MapLocation
          direction="E"
          connections={connections}
          gameState={gameState}
          dispatchGameState={dispatchGameState}
        />
        <MapLocation
          direction="S"
          connections={connections}
          gameState={gameState}
          dispatchGameState={dispatchGameState}
        />
      </div>
    </div>
  );
}

export default function Location({
  gameState,
  dispatchGameState,
  setCurrentDisplay,
  showMap,
  setShowMap,
  showPhoto,
  setShowPhoto,
}: {
  gameState: GameState;
  dispatchGameState: React.Dispatch<ReducerPayload>;
  setCurrentDisplay: React.Dispatch<React.SetStateAction<DisplayState>>;
  showMap: boolean;
  setShowMap: React.Dispatch<React.SetStateAction<boolean>>;
  showPhoto: boolean;
  setShowPhoto: React.Dispatch<React.SetStateAction<boolean>>;
}): React.JSX.Element {
  const {userId, sessionId} = useMetadataContext();

  const backgroundName =
    locations[gameState.playerLocation].getBackgroundName(gameState);

  return (
    <div className="App" id="location-display">
      <div id="controls">
        <button
          id="showMap"
          className={`showMap ${String(showMap)}`}
          onClick={() => {
            setShowMap(!showMap);
          }}
        />
        <button
          id="showPhoto"
          className={`showPhoto ${String(showPhoto)}`}
          onClick={() => {
            setShowPhoto(!showPhoto);
          }}
        />
        <button
          id="info"
          onClick={() => {
            setCurrentDisplay("info");
          }}
        />
        <button
          id="restart"
          onClick={() => {
            setCurrentDisplay("restart");
          }}
        />
        <Share
          appName="Dragon Hero"
          text="Check out this text adventure puzzle!"
          url="https://dragon.twistedtrailgames.com/"
          origin="control bar"
          id="share"
          userId={userId}
          sessionId={sessionId}
        />
        {!isRunningStandalone() ? (
          <button
            id="install"
            onClick={() => {
              setCurrentDisplay("installOverview");
            }}
          />
        ) : null}
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
          backgroundName={backgroundName}
        />
      )}
      <div id="non-navigation-buttons" className="buttons">
        <button
          className="inventory"
          onClick={() => {
            setCurrentDisplay("inventory");
          }}
        >
          Inventory
        </button>
      </div>
    </div>
  );
}
