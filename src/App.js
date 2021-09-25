import React, { useState } from "react";
import "./App.css";
import { items } from "./items.js";
import { locations } from "./locations.js";
import Inventory from "./components/inventory";
import Location from "./components/location";
import Consequence from "./components/consequence";
import GameOver from "./components/gameOver";
import Info from "./components/info";
import Restart from "./components/restart";

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
    playerCough: false,
    savedBaby: false,
    receivedBabyReward: false,
    playedForYouth: false,
    promisedTreasure: false,
    cursed: false,
    firstCourtyardEntry: true,
    dragonPoisoned: false,
    dragonAsleep: false,
    dragonDead: false,
    treasureAmount: 300,
    treasureLevel: 0,
    singeCount: 0,
    ownScore: false,
    maxReputation: 17,
    maxGold: 310,
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

  const startingLocation = "room";

  const startingItemLocations = buildStartingLocations();
  const [itemLocations, setItemLocations] = useState(startingItemLocations);
  const [gameState, setGameState] = useState(startingState);
  const [playerLocation, setPlayerLocation] = useState(startingLocation);
  const [consequenceText, setConsequenceText] = useState("");
  const [locationConsequenceText, setLocationConsequenceText] = useState("");
  const [currentDisplay, setCurrentDisplay] = useState("location"); // location | inventory | consequence | info | restart

  function handleNewGame() {
    console.log("new game");
    setItemLocations(startingItemLocations);
    setGameState(startingState);
    setPlayerLocation(startingLocation);
    setLocationConsequenceText("");
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
    const oldLocation = playerLocation;
    console.log(`moving player from ${oldLocation} to ${newLocation}`);

    // update game state

    let gameStateChanges = {};

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

    // update location consequence text

    let consequence = "";

    if (gameStateChanges && gameStateChanges.reputation) {
      const reputationDiff = gameStateChanges.reputation - gameState.reputation;
      consequence += `\n\nReputation ${
        reputationDiff >= 0 ? "+" : ""
      }${reputationDiff}`;
    }
    if (gameStateChanges && gameStateChanges.gold) {
      const goldDiff = gameStateChanges.gold - gameState.gold;
      consequence += `\n\nGold ${goldDiff >= 0 ? "+" : ""}${goldDiff}`;
    }
    console.log(consequence);
    setLocationConsequenceText(consequence);

    // update item locations

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

    // update player location

    setPlayerLocation(newLocation);
  }

  function handleItemInteraction({ gameEffect, description, itemMovements }) {
    if (gameEffect && gameEffect.reputation) {
      const reputationDiff = gameEffect.reputation - gameState.reputation;
      description += `\n\nReputation ${
        reputationDiff > 0 ? "+" : ""
      }${reputationDiff}`;
    }
    if (gameEffect && gameEffect.gold) {
      const goldDiff = gameEffect.gold - gameState.gold;
      description += `\n\nGold ${goldDiff > 0 ? "+" : ""}${goldDiff}`;
    }
    setConsequenceText(description);

    if (gameEffect) {
      console.log(`updating game state: ${JSON.stringify(gameEffect)}`);
      setGameState({ ...gameState, ...gameEffect });
    }

    if (itemMovements) {
      itemMovements.forEach((itemMovement) => moveItem(itemMovement));
    }

    setCurrentDisplay("consequence");
  }

  function handleTake(item) {
    console.log(`taking ${item} at ${playerLocation}`);

    const customInteraction = items[item].getCustomTake({
      playerLocation: playerLocation,
      gameState: gameState,
      itemLocations: itemLocations,
    });

    customInteraction.itemMovements.push({
      item: item,
      oldLocation: playerLocation,
      newLocation: customInteraction.targetItemDestination || "inventory",
    });

    if (!customInteraction.description) {
      customInteraction.description = `You now have ${
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
    }

    handleItemInteraction(customInteraction);
  }

  function handleUse(item) {
    console.log(`using ${item} at ${playerLocation}`);

    const customInteraction = items[item].getCustomUse({
      playerLocation: playerLocation,
      gameState: gameState,
      itemLocations: itemLocations,
    });

    customInteraction.itemMovements.push({
      item: item,
      oldLocation: "inventory",
      newLocation: customInteraction.targetItemDestination || "inventory",
    });

    if (!customInteraction.description) {
      customInteraction.description = `You use the ${items[
        item
      ].displayName.toLowerCase()}.`;
    }

    handleItemInteraction(customInteraction);
  }

  function handleDrop(item) {
    console.log(`dropping ${item} at ${playerLocation}`);

    const customInteraction = items[item].getCustomDrop({
      dropPreposition: locations[playerLocation].dropPreposition,
      playerLocation: playerLocation,
      gameState: gameState,
      itemLocations: itemLocations,
    });

    customInteraction.itemMovements.push({
      item: item,
      oldLocation: "inventory",
      newLocation: customInteraction.targetItemDestination || playerLocation,
    });

    if (!customInteraction.description) {
      customInteraction.description = `You drop the ${item} ${
        locations[playerLocation].dropPreposition
      } the ${locations[playerLocation]
        .getDisplayName({
          gameState: gameState,
          itemLocations: itemLocations,
        })
        .toLowerCase()}.`;
    }

    handleItemInteraction(customInteraction);
  }

  function handlePay() {
    console.log(`paying ${playerLocation}`);

    const customInteraction = locations[playerLocation].getCustomPay({
      playerLocation: playerLocation,
      gameState: gameState,
      itemLocations: itemLocations,
    });

    if (customInteraction.description) {
      // no change if we already have a description
    } else if (
      customInteraction.gameEffect ||
      customInteraction.itemMovements.length
    ) {
      customInteraction.description = `You pay the ${locations[playerLocation]
        .getDisplayName({
          gameState: gameState,
          itemLocations: itemLocations,
        })
        .toLowerCase()}.`;
    } else {
      customInteraction.description = `The ${locations[playerLocation]
        .getDisplayName({
          gameState: gameState,
          itemLocations: itemLocations,
        })
        .toLowerCase()} is not interested in your gold.`;
    }

    handleItemInteraction(customInteraction);
  }

  function handleGive(item) {
    console.log(`giving ${item} to ${playerLocation}`);

    const customInteraction = items[item].getCustomGive({
      playerLocation: playerLocation,
      gameState: gameState,
      itemLocations: itemLocations,
    });

    customInteraction.itemMovements.push({
      item: item,
      oldLocation: "inventory",
      newLocation: customInteraction.targetItemDestination || playerLocation,
    });

    if (customInteraction.description) {
      // no change if we already have a description
    } else if (customInteraction.targetItemDestination === "outOfPlay") {
      // if item goes out of play
      customInteraction.description = `You give the ${item} to the ${locations[
        playerLocation
      ]
        .getDisplayName({
          gameState: gameState,
          itemLocations: itemLocations,
        })
        .toLowerCase()}.`;
    } else if (
      locations[playerLocation].getHuman({
        gameState: gameState,
        playerLocation: playerLocation,
        itemLocations: itemLocations,
      })
    ) {
      // if giving to human
      customInteraction.description = `The ${locations[playerLocation]
        .getDisplayName({
          gameState: gameState,
          itemLocations: itemLocations,
        })
        .toLowerCase()} does not want your ${items[item].getDescription({
          playerLocation: playerLocation,
          gameState: gameState,
          itemLocations: itemLocations,
        })} but agrees to hold it for you.`;
    } else {
      customInteraction.description = `The ${locations[playerLocation]
        .getDisplayName({
          gameState: gameState,
          itemLocations: itemLocations,
        })
        .toLowerCase()} does not want your ${items[item].getDescription({
          playerLocation: playerLocation,
          gameState: gameState,
          itemLocations: itemLocations,
        })} item.`;
    }

    handleItemInteraction(customInteraction);
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

  if (playerLocation === "gate" && gameState.treasureLevel) {
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
    case "info":
      return <Info setCurrentDisplay={setCurrentDisplay} />;
    case "restart":
      return (
        <Restart
          setCurrentDisplay={setCurrentDisplay}
          handleNewGame={handleNewGame}
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
          locationConsequenceText={locationConsequenceText}
        />
      );
  }
}

export default App;
