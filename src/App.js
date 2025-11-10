import React from "react";
import Inventory from "./components/inventory";
import Location from "./components/location";
import Consequence from "./components/consequence";
import GameWon from "./components/gameWon";
import GameLost from "./components/gameLost";
import Info from "./components/info";
import Restart from "./components/restart";
import Resume from "./components/resume";
import {reducer} from "./reducer";
import {init} from "./init";
import {
  handleAppInstalled,
  handleBeforeInstallPrompt,
} from "@skedwards88/shared-components/src/logic/handleInstall";
import InstallOverview from "@skedwards88/shared-components/src/components/InstallOverview";
import PWAInstall from "@skedwards88/shared-components/src/components/PWAInstall";
import {sendAnalyticsCF} from "@skedwards88/shared-components/src/logic/sendAnalyticsCF";
import {inferKeyEvents} from "./inferKeyEvents";
import {useMetadataContext} from "@skedwards88/shared-components/src/components/MetadataContextProvider";

function App() {
  // *****
  // Install handling setup
  // *****
  // Set up states that will be used by the handleAppInstalled and handleBeforeInstallPrompt listeners
  const [installPromptEvent, setInstallPromptEvent] = React.useState();
  const [showInstallButton, setShowInstallButton] = React.useState(true);

  React.useEffect(() => {
    // Need to store the function in a variable so that
    // the add and remove actions can reference the same function
    const listener = (event) =>
      handleBeforeInstallPrompt(
        event,
        setInstallPromptEvent,
        setShowInstallButton,
      );

    window.addEventListener("beforeinstallprompt", listener);

    return () => window.removeEventListener("beforeinstallprompt", listener);
  }, []);

  React.useEffect(() => {
    // Need to store the function in a variable so that
    // the add and remove actions can reference the same function
    const listener = () =>
      handleAppInstalled(setInstallPromptEvent, setShowInstallButton);

    window.addEventListener("appinstalled", listener);

    return () => window.removeEventListener("appinstalled", listener);
  }, []);
  // *****
  // End install handling setup
  // *****

  const [gameState, dispatchGameState] = React.useReducer(reducer, {}, init);

  const [currentDisplay, setCurrentDisplay] = React.useState("location"); // location | inventory | consequence | info | restart | resume
  const [showMap, setShowMap] = React.useState(true);
  const [showPhoto, setShowPhoto] = React.useState(true);

  React.useLayoutEffect(() => {
    // Check if saved state is available and if has all info
    //   locationConsequenceText and consequenceText may be empty, so don't check those
    const savedState = JSON.parse(localStorage.getItem("dragonHeroState"));
    if (
      !(
        (
          savedState &&
          savedState.gameState &&
          savedState.gameState.playerLocation &&
          savedState.gameState.itemLocations
        )
        // todo should also check for existence of all other values, keeping in mind 0/false values
      )
    ) {
      return;
    }

    // If yes, update state
    dispatchGameState({action: "resume", savedState: savedState});
    setShowMap(savedState.showMap ?? true);
    setShowPhoto(savedState.showPhoto ?? true);

    // Ask if want to continue from last point or start a new game
    // todo It seems hacky to 1) make new game 2) overwrite with saved state 3) ask for input, then potentially overwrite with new game.
    setCurrentDisplay("resume");
  }, []);

  React.useEffect(() => {
    const stateToSave = {
      gameState: gameState,
      currentDisplay: currentDisplay,
      showMap: showMap,
      showPhoto: showPhoto,
    };

    window.localStorage.setItem("dragonHeroState", JSON.stringify(stateToSave));
  }, [gameState, currentDisplay, showMap, showPhoto]);

  // ******
  // Start analytics setup
  // ******

  // Store the previous state so that we can infer which analytics events to send
  const previousStateRef = React.useRef(gameState);

  const {userId, sessionId} = useMetadataContext();

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
        gameState={gameState}
        setCurrentDisplay={setCurrentDisplay}
      />
    );
  }

  if (gameState.playerLocation === "gate" && gameState.treasureLevel) {
    return (
      <GameWon
        result="win"
        dispatchGameState={dispatchGameState}
        gameState={gameState}
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
          setDisplay={setCurrentDisplay}
          setInstallPromptEvent={setInstallPromptEvent}
          showInstallButton={showInstallButton}
          installPromptEvent={installPromptEvent}
          googleAppLink={
            "https://play.google.com/store/apps/details?id=dragon.io.github.skedwards88.twa&hl=en_US"
          }
          userId={userId}
          sessionId={sessionId}
        ></InstallOverview>
      );

    case "pwaInstall":
      return (
        <PWAInstall
          setDisplay={setCurrentDisplay}
          googleAppLink={
            "https://play.google.com/store/apps/details?id=dragon.io.github.skedwards88.twa&hl=en_US"
          }
          pwaLink={"https://skedwards88.github.io/dragon"}
        ></PWAInstall>
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
