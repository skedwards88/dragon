import React, { useState } from "react";
import "./App.css";
import Inventory from "./components/inventory";
import Location from "./components/location";
import Consequence from "./components/consequence";
import GameOver from "./components/gameOver";
import Info from "./components/info";
import Restart from "./components/restart";
import Resume from "./components/resume";
import { reducer } from "./reducer";
import { init } from "./init";

function App() {
  const [gameState, dispatchGameState] = React.useReducer(reducer, {}, init);

  const [currentDisplay, setCurrentDisplay] = useState("location"); // location | inventory | consequence | info | restart | resume
  const [showMap, setShowMap] = useState(true);

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
    dispatchGameState({ action: "resume", savedState: savedState });
    setShowMap(savedState.showMap ?? true);

    // Ask if want to continue from last point or start a new game
    // todo It seems hacky to 1) make new game 2) overwrite with saved state 3) ask for input, then potentially overwrite with new game.
    setCurrentDisplay("resume");
  }, []);

  React.useEffect(() => {
    const stateToSave = {
      gameState: gameState,
      currentDisplay: currentDisplay,
      showMap: showMap,
    };

    window.localStorage.setItem("dragonHeroState", JSON.stringify(stateToSave));
  }, [gameState, currentDisplay, showMap]);

  if (gameState.reputation <= 0) {
    return (
      <GameOver
        result="lose"
        dispatchGameState={dispatchGameState}
        gameState={gameState}
        setCurrentDisplay={setCurrentDisplay}
      />
    );
  }

  if (gameState.playerLocation === "gate" && gameState.treasureLevel) {
    return (
      <GameOver
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
    default:
      return (
        <Location
          gameState={gameState}
          dispatchGameState={dispatchGameState}
          setCurrentDisplay={setCurrentDisplay}
          showMap={showMap}
          setShowMap={setShowMap}
        />
      );
  }
}

export default App;
