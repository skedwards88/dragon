import React from "react";
import Inventory from "./inventory";
import Location from "./location";
import Consequence from "./consequence";
import GameWon from "./gameWon";
import GameLost from "./gameLost";
import Info from "./info";
import Restart from "./restart";
import Resume from "./resume";
import {reducer} from "../logic/reducer";
import {init} from "../logic/init";
import {useInstallPrompt} from "@skedwards88/shared-components/src/logic/handleInstall";
import InstallOverview from "@skedwards88/shared-components/src/components/InstallOverview";
import PWAInstall from "@skedwards88/shared-components/src/components/PWAInstall";
import {sendAnalyticsCF} from "@skedwards88/shared-components/src/logic/sendAnalyticsCF";
import {inferKeyEvents} from "../logic/inferKeyEvents";
import {useMetadataContext} from "@skedwards88/shared-components/src/components/MetadataContextProvider";
import {
  getFromStorage,
  saveToStorage,
} from "@skedwards88/shared-components/src/logic/safeStorage";

export type DisplayState =
  | "location"
  | "inventory"
  | "consequence"
  | "info"
  | "restart"
  | "resume"
  | "installOverview"
  | "pwaInstall";

function App(): React.JSX.Element {
  const {userId, sessionId} = useMetadataContext();

  // This must live at the top level component, not in InstallOverview where it is used, since the InstallOverview is not rendered initially and therefore misses its chance to attach the listeners
  const {installPromptEvent, showInstallButton, handleInstall} =
    useInstallPrompt({userId, sessionId});

  const [gameState, dispatchGameState] = React.useReducer(
    reducer,
    {useSaved: true},
    init,
  );

  const [currentDisplay, setCurrentDisplay] = React.useState<DisplayState>(
    gameState.resumedFromSaved ? "resume" : "location",
  );

  const [showMap, setShowMap] = React.useState(() => {
    return getFromStorage<boolean>("dragonHeroShowMap") ?? true;
  });

  const [showPhoto, setShowPhoto] = React.useState(() => {
    return getFromStorage<boolean>("dragonHeroShowPhoto") ?? true;
  });

  React.useEffect(() => {
    saveToStorage("dragonHeroShowMap", showMap);
  }, [showMap]);

  React.useEffect(() => {
    saveToStorage("dragonHeroShowPhoto", showPhoto);
  }, [showPhoto]);

  React.useEffect(() => {
    saveToStorage("dragonHeroGameState", gameState);
  }, [gameState]);

  // ******
  // Start analytics setup
  // ******

  // Store the previous state so that we can infer which analytics events to send
  const previousStateRef = React.useRef(gameState);

  // Send analytics following reducer updates, if needed
  React.useEffect(() => {
    const previousState = previousStateRef.current;

    const analyticsToLog = inferKeyEvents(previousState, gameState);

    if (analyticsToLog.length) {
      sendAnalyticsCF({userId, sessionId, analyticsToLog});
    }

    previousStateRef.current = gameState;
    // Intentionally excluding sessionId, userId
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  // ******
  // End analytics setup
  // ******

  if (gameState.reputation <= 0) {
    return (
      <GameLost
        dispatchGameState={dispatchGameState}
        maxReputation={gameState.maxReputation}
        gold={gameState.gold}
        maxGold={gameState.maxGold}
        setCurrentDisplay={setCurrentDisplay}
      />
    );
  }

  if (gameState.playerLocation === "gate" && gameState.treasureLevel) {
    return (
      <GameWon
        dispatchGameState={dispatchGameState}
        horseMounted={gameState.horseMounted}
        naked={gameState.naked}
        clothesPoopy={gameState.clothesPoopy}
        playerPoisoned={gameState.playerPoisoned}
        singeCount={gameState.singeCount}
        cursed={gameState.cursed}
        dragonDead={gameState.dragonDead}
        reputation={gameState.reputation}
        maxReputation={gameState.maxReputation}
        gold={gameState.gold}
        maxGold={gameState.maxGold}
        setCurrentDisplay={setCurrentDisplay}
      />
    );
  }

  switch (currentDisplay) {
    case "consequence":
      return (
        <Consequence
          setCurrentDisplay={setCurrentDisplay}
          gameState={gameState}
        />
      );
    case "inventory":
      return (
        <Inventory
          gameState={gameState}
          setCurrentDisplay={setCurrentDisplay}
          dispatchGameState={dispatchGameState}
        />
      );
    case "info":
      return <Info setCurrentDisplay={setCurrentDisplay} />;
    case "restart":
      return (
        <Restart
          setCurrentDisplay={setCurrentDisplay}
          dispatchGameState={dispatchGameState}
        />
      );
    case "resume":
      return (
        <Resume
          setCurrentDisplay={setCurrentDisplay}
          dispatchGameState={dispatchGameState}
        />
      );

    case "installOverview":
      return (
        <InstallOverview
          closeAction={() => {
            setCurrentDisplay("location");
          }}
          pwaInstallAction={() => {
            setCurrentDisplay("pwaInstall");
          }}
          installPromptEvent={installPromptEvent}
          showInstallButton={showInstallButton}
          handleInstall={handleInstall}
          googleAppLink="https://play.google.com/store/apps/details?id=dragon.io.github.skedwards88.twa&hl=en_US"
          userId={userId}
          sessionId={sessionId}
        />
      );

    case "pwaInstall":
      return (
        <PWAInstall
          closeAction={() => {
            setCurrentDisplay("location");
          }}
          googleAppLink="https://play.google.com/store/apps/details?id=dragon.io.github.skedwards88.twa&hl=en_US"
          pwaLink="https://dragon.twistedtrailgames.com/"
          userId={userId}
          sessionId={sessionId}
        />
      );

    case "location":
      return (
        <Location
          gameState={gameState}
          dispatchGameState={dispatchGameState}
          setCurrentDisplay={setCurrentDisplay}
          showMap={showMap}
          setShowMap={setShowMap}
          showPhoto={showPhoto}
          setShowPhoto={setShowPhoto}
        />
      );

    default:
      return (
        <Location
          gameState={gameState}
          dispatchGameState={dispatchGameState}
          setCurrentDisplay={setCurrentDisplay}
          showMap={showMap}
          setShowMap={setShowMap}
          showPhoto={showPhoto}
          setShowPhoto={setShowPhoto}
        />
      );
  }
}

export default App;
