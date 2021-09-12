import React, { useState } from "react";
import "./App.css";
import { items } from "./items.js";
import { locations } from "./locations.js";
import Inventory from "./components/inventory";
import Location from "./components/location";
import Consequence from "./components/consequence";
import GameOver from "./components/gameOver";

function App() {
  const startingState = {
    reputation: 10,
    gold: 0,
    timeInCave: 0,
    swordCost: 40,
    maxSwordCost: 50,
    ownSword: false,
    manorFire: true,
    naked: true,
    squirrelDead: false,
    horseDead: false,
    horseTethered: false,
    horseMounted: false,
    playerPoisoned: false,
    clothesPoopy: false,
    handkerchiefDamp: false,
    playerMasked: false,
    babyCough: false,
    savedBaby: false,
    receivedBabyReward: false,
    playedForYouth: false,
    promisedTreasure: false,
    cursed: false,
    firstCourtyardEntry: true,
    dragonPoisoned: false,
    dragonAsleep: false,
    dragonDead: false,
    treasureAmount: 200,
    earnedTreasureAmount: 0,
    singeCount: 0,
    ownScore: false,
    maxReputation: "todo",
    maxGold: "todo",
  };

  function buildStartingLocations() {
    const startingItemLocations = {
      inventory: new Set([]),
      outOfPlay: new Set([]),
    };

    Object.keys(locations).forEach(
      (location) => (startingItemLocations[location] = new Set())
    );

    for (const [item, itemInfo] of Object.entries(items)) {
      startingItemLocations[itemInfo.spawnLocation].add(item);
    }

    return startingItemLocations;
  }

  const startingItemLocations = buildStartingLocations();
  const [itemLocations, setItemLocations] = useState(startingItemLocations);
  const [gameState, setGameState] = useState(startingState);
  const [playerLocation, setPlayerLocation] = useState("room");
  const [consequenceText, setConsequenceText] = useState("");
  const [currentDisplay, setCurrentDisplay] = useState("location"); // location | inventory | consequence

  function handleNewGame() {
    console.log("new game");
    setItemLocations(startingItemLocations);
    setGameState(startingState);
    setPlayerLocation("room");
    setConsequenceText("");
    setCurrentDisplay("location");
  }

  function moveItem({ item, oldLocation, newLocation }) {
    if (oldLocation === newLocation) return;

    console.log(`moving ${item} from ${oldLocation} to ${newLocation}`);
    itemLocations[oldLocation].delete(item);
    itemLocations[newLocation].add(item);
    setItemLocations(itemLocations);
  }

  function handleMovePlayer(newLocation) {
    let gameStateChanges = {};

    const oldLocation = playerLocation;
    console.log(`moving player from ${oldLocation} to ${newLocation}`);

    const customExitStateEffect =
      locations[oldLocation].onExitGameStateEffect &&
      locations[oldLocation].onExitGameStateEffect({
        gameState: gameState,
        playerLocation: playerLocation,
        itemLocations: itemLocations,
      });
    gameStateChanges = { ...gameStateChanges, ...customExitStateEffect };

    const customEnterStateEffect =
      locations[newLocation].onEnterGameStateEffect &&
      locations[newLocation].onEnterGameStateEffect({
        gameState: gameState,
        playerLocation: playerLocation,
        itemLocations: itemLocations,
      });
    gameStateChanges = { ...gameStateChanges, ...customEnterStateEffect };

    console.log(`updating game state: ${JSON.stringify(gameStateChanges)}`);
    if (Object.keys(gameStateChanges).length) {
      setGameState({
        ...gameState,
        ...gameStateChanges,
      });
    }

    const customEnterItemLocationEffect =
      locations[newLocation].onEnterItemLocationEffect &&
      locations[newLocation].onEnterItemLocationEffect({
        gameState: gameState,
        playerLocation: playerLocation,
        itemLocations: itemLocations,
      });

    if (customEnterItemLocationEffect) {
      moveItem(customEnterItemLocationEffect);
    }

    const customExitItemLocationEffect =
      locations[oldLocation].onExitItemLocationEffect &&
      locations[oldLocation].onExitItemLocationEffect({
        gameState: gameState,
        playerLocation: playerLocation,
        itemLocations: itemLocations,
      });

    if (customExitItemLocationEffect) {
      moveItem(customExitItemLocationEffect);
    }

    setPlayerLocation(newLocation);
  }

  function handleTake(item) {
    console.log(`taking ${item} at ${playerLocation}`);

    const customInteraction = items[item].getCustomTake({
      playerLocation: playerLocation,
      gameState: gameState,
      itemLocations: itemLocations,
    });

    const description =
      customInteraction.description ||
      `You now have ${
        ["a", "e", "i", "o", "u"].includes(
          items[item]
            .getDescription({
              playerLocation: playerLocation,
              gameState: gameState,
              itemLocations: itemLocations,
            })[0]
            .toLowerCase()
        )
          ? "an"
          : "a"
      } ${items[item].getDescription({
        playerLocation: playerLocation,
        gameState: gameState,
        itemLocations: itemLocations,
      })}.`;
    setConsequenceText(description);

    const endItemLocation = customInteraction.targetItemLocation || "inventory";
    moveItem({
      item: item,
      oldLocation: playerLocation,
      newLocation: endItemLocation,
    });

    if (customInteraction.gameEffect) {
      console.log(
        `updating game state: ${JSON.stringify(customInteraction.gameEffect)}`
      );
      setGameState({ ...gameState, ...customInteraction.gameEffect });
    }

    if (customInteraction.otherItemLocations) {
      moveItem(customInteraction.otherItemLocations);
    }

    setCurrentDisplay("consequence");
  }

  function handleUse(item) {
    console.log(`using ${item} at ${playerLocation}`);

    const customInteraction = items[item].getCustomUse({
      playerLocation: playerLocation,
      gameState: gameState,
      itemLocations: itemLocations,
    });

    const description =
      customInteraction.description ||
      `You use the ${items[item].displayName.toLowerCase()}.`;
    setConsequenceText(description);

    const endItemLocation = customInteraction.targetItemLocation || "inventory";
    moveItem({
      item: item,
      oldLocation: "inventory",
      newLocation: endItemLocation,
    });

    if (customInteraction.gameEffect) {
      console.log(
        `updating game state: ${JSON.stringify(customInteraction.gameEffect)}`
      );
      setGameState({ ...gameState, ...customInteraction.gameEffect });
    }

    if (customInteraction.otherItemLocations) {
      moveItem(customInteraction.otherItemLocations);
    }

    setCurrentDisplay("consequence");
  }

  function handleDrop(item) {
    console.log(`dropping ${item} at ${playerLocation}`);

    const customInteraction = items[item].getCustomDrop({
      dropPreposition: locations[playerLocation].dropPreposition,
      playerLocation: playerLocation,
      gameState: gameState,
      itemLocations: itemLocations,
    });

    const description =
      customInteraction.description ||
      `You drop the ${item} ${locations[playerLocation].dropPreposition} the ${playerLocation}.`;
    setConsequenceText(description);

    const endItemLocation =
      customInteraction.targetItemLocation || playerLocation;
    moveItem({
      item: item,
      oldLocation: "inventory",
      newLocation: endItemLocation,
    });

    if (customInteraction.gameEffect) {
      console.log(
        `updating game state: ${JSON.stringify(customInteraction.gameEffect)}`
      );
      setGameState({ ...gameState, ...customInteraction.gameEffect });
    }

    if (customInteraction.otherItemLocations) {
      moveItem(customInteraction.otherItemLocations);
    }

    setCurrentDisplay("consequence");
  }

  function handlePay() {
    console.log(`paying ${playerLocation}`);

    // todo not checking yet if you have enough gold to buy

    const customInteraction = locations[playerLocation].getCustomPay({
      playerLocation: playerLocation,
      gameState: gameState,
      itemLocations: itemLocations,
    });

    if (
      customInteraction.description ||
      customInteraction.gameEffect ||
      customInteraction.otherItemLocations
    ) {
      handleAcceptedPay(customInteraction);
    } else {
      handleUnwantedPay();
    }
  }

  function handleUnwantedPay() {
    setConsequenceText(`The ${playerLocation} is not interested in your gold.`);
    setCurrentDisplay("consequence");
  }

  function handleAcceptedPay(customInteraction) {
    const description =
      customInteraction.description || `You pay the ${playerLocation}.`;
    setConsequenceText(description);

    if (customInteraction.gameEffect) {
      console.log(
        `updating game state: ${JSON.stringify(customInteraction.gameEffect)}`
      );
      setGameState({ ...gameState, ...customInteraction.gameEffect });
    }

    if (customInteraction.otherItemLocations) {
      moveItem(customInteraction.otherItemLocations);
    }

    setCurrentDisplay("consequence");
  }

  function handleGive(item) {
    console.log(`giving ${item} to ${playerLocation}`);

    const customInteraction = items[item].getCustomGive({
      playerLocation: playerLocation,
      gameState: gameState,
      itemLocations: itemLocations,
    });

    if (
      customInteraction.description ||
      customInteraction.gameEffect ||
      customInteraction.targetItemLocation ||
      customInteraction.otherItemLocations
    ) {
      handleAcceptedGive(item, customInteraction);
    } else {
      handleUnwantedGive(item);
    }
  }

  function handleUnwantedGive(item) {
    if (
      locations[playerLocation].getHuman({
        gameState: gameState,
        playerLocation: playerLocation,
        itemLocations: itemLocations,
      })
    ) {
      setConsequenceText(
        `The ${playerLocation} does not want this item but agrees to hold it for you.`
      );
      moveItem({
        item: item,
        oldLocation: "inventory",
        newLocation: playerLocation,
      });
    } else {
      setConsequenceText(`The ${playerLocation} does not want this item.`);
    }

    setCurrentDisplay("consequence");
  }

  function handleAcceptedGive(item, customInteraction) {
    // todo could consolidate item interactions to single function (give, drop...)
    const description =
      customInteraction.description ||
      `You give the ${item} to the ${playerLocation}.`;
    setConsequenceText(description);

    const endItemLocation = customInteraction.targetItemLocation || "outOfPlay";
    moveItem({
      item: item,
      oldLocation: "inventory",
      newLocation: endItemLocation,
    });

    if (customInteraction.gameEffect) {
      console.log(
        `updating game state: ${JSON.stringify(customInteraction.gameEffect)}`
      );
      setGameState({ ...gameState, ...customInteraction.gameEffect });
    }

    if (customInteraction.otherItemLocations) {
      moveItem(customInteraction.otherItemLocations);
    }

    setCurrentDisplay("consequence");
  }

  if (gameState.reputation <= 0) {
    return (
      <GameOver
        result="lose"
        handleNewGame={handleNewGame}
        gameState={gameState}
      />
    );
  }

  if (playerLocation === "gate" && gameState.earnedTreasureAmount) {
    return (
      <GameOver
        result="win"
        handleNewGame={handleNewGame}
        gameState={gameState}
      />
    );
  }

  switch (currentDisplay) {
    case "consequence":
      return (
        <Consequence
          consequenceText={consequenceText}
          setCurrentDisplay={setCurrentDisplay}
          locations={locations}
          playerLocation={playerLocation}
          gameState={gameState}
          itemLocations={itemLocations}
        />
      );
    case "inventory":
      return (
        <Inventory
          items={items}
          itemLocations={itemLocations}
          gameState={gameState}
          locations={locations}
          playerLocation={playerLocation}
          setCurrentDisplay={setCurrentDisplay}
          handleUse={handleUse}
          handleDrop={handleDrop}
          handleGive={handleGive}
          handlePay={handlePay}
        />
      );
    default:
      return (
        <Location
          items={items}
          itemLocations={itemLocations}
          gameState={gameState}
          playerLocation={playerLocation}
          handleTake={handleTake}
          handleMovePlayer={handleMovePlayer}
          setCurrentDisplay={setCurrentDisplay}
        />
      );
  }
}

export default App;
