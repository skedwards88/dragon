import React, { useState } from "react";
import "./App.css";
import { items } from "./items.js";
import { locations } from "./locations.js";

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

  function moveItem({ item, oldLocation, newLocation }) {
    if (oldLocation === newLocation) return;

    console.log(`moving' ${item} from ${oldLocation} to ${newLocation}`);
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

    console.log(`updating game state: ${gameStateChanges}`);
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

    const customTake = items[item].getCustomTake({
      playerLocation: playerLocation,
      gameState: gameState,
      itemLocations: itemLocations,
    });

    const description =
      customTake.description ||
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

    const endItemLocation = customTake.targetItemLocation || "inventory";
    moveItem({
      item: item,
      oldLocation: playerLocation,
      newLocation: endItemLocation,
    });

    if (customTake.gameEffect) {
      console.log(
        `updating game state: ${JSON.stringify(customTake.gameEffect)}`
      );
      setGameState({ ...gameState, ...customTake.gameEffect });
    }

    if (customTake.otherItemLocations) {
      moveItem(customTake.otherItemLocations);
    }
    // set show consequence to true
    setCurrentDisplay("consequence");
  }

  function handleUse(item) {
    console.log(`using ${item} at ${playerLocation}`);

    // Get the "use"" description for the item -- this will be the consequence text
    const customDescription =
      items[item].getCustomUseDescription &&
      items[item].getCustomUseDescription({
        playerLocation: playerLocation,
        gameState: gameState,
        itemLocations: itemLocations,
      });

    const description =
      customDescription ||
      `You use the ${items[item].displayName.toLowerCase()}.`;

    // Get any effect on the game state
    const customGameEffect =
      items[item].getCustomUseGameEffect &&
      items[item].getCustomUseGameEffect({
        playerLocation: playerLocation,
        gameState: gameState,
        itemLocations: itemLocations,
      });

    // Update game state with any custom effect
    console.log(`updating game state: ${customGameEffect}`);
    if (customGameEffect) {
      setGameState({ ...gameState, ...customGameEffect });
    }

    // set the consequence text to the use description text
    setConsequenceText(description);

    // show consequence
    setCurrentDisplay("consequence");
  }

  function handleDrop(item) {
    console.log(`dropping ${item} at ${playerLocation}`);

    const customDrop = items[item].getCustomDrop({
      dropPreposition: locations[playerLocation].dropPreposition,
      playerLocation: playerLocation,
      gameState: gameState,
      itemLocations: itemLocations,
    });

    const description =
      customDrop.description ||
      `You drop the ${item} ${locations[playerLocation].dropPreposition} the ${playerLocation}.`;
    setConsequenceText(description);

    const endItemLocation = customDrop.targetItemLocation || playerLocation;
    moveItem({
      item: item,
      oldLocation: "inventory",
      newLocation: endItemLocation,
    });

    if (customDrop.gameEffect) {
      console.log(
        `updating game state: ${JSON.stringify(customDrop.gameEffect)}`
      );
      setGameState({ ...gameState, ...customDrop.gameEffect });
    }

    if (customDrop.otherItemLocations) {
      moveItem(customDrop.otherItemLocations);
    }

    setCurrentDisplay("consequence");
  }

  function handlePay() {
    console.log(`paying ${playerLocation}`);

    // todo not checking yet if you have enough gold to buy
    if (
      (locations[playerLocation].payDescription &&
        locations[playerLocation].payDescription({
          playerLocation: playerLocation,
          gameState: gameState,
          itemLocations: itemLocations,
        })) ||
      (locations[playerLocation].payGameStateEffect &&
        locations[playerLocation].payGameStateEffect({
          playerLocation: playerLocation,
          gameState: gameState,
          itemLocations: itemLocations,
        })) ||
      (locations[playerLocation].payItemLocationEffect &&
        locations[playerLocation].payItemLocationEffect({
          playerLocation: playerLocation,
          gameState: gameState,
          itemLocations: itemLocations,
        }))
    ) {
      handleAcceptedPay();
    } else {
      handleUnwantedPay();
    }
  }

  function handleUnwantedPay() {
    // set the consequence text to the give description text
    setConsequenceText(`The ${playerLocation} is not interested in your gold.`);

    // set show consequence to true
    setCurrentDisplay("consequence");
  }

  function handleAcceptedPay() {
    // Get the "give" description for the item -- this will be the consequence text
    const customDescription =
      locations[playerLocation].payDescription &&
      locations[playerLocation].payDescription({
        playerLocation: playerLocation,
        gameState: gameState,
        itemLocations: itemLocations,
      });

    const description = customDescription || `You pay the ${playerLocation}.`;

    // Get any effect on the game state
    const customGameEffect =
      locations[playerLocation].payGameStateEffect &&
      locations[playerLocation].payGameStateEffect({
        playerLocation: playerLocation,
        gameState: gameState,
        itemLocations: itemLocations,
      });

    console.log(`updating game state: ${customGameEffect}`);
    if (customGameEffect) {
      setGameState({ ...gameState, ...customGameEffect });
    }

    const locationEffect =
      locations[playerLocation].payItemLocationEffect &&
      locations[playerLocation].payItemLocationEffect({
        playerLocation: playerLocation,
        gameState: gameState,
        itemLocations: itemLocations,
      });

    if (locationEffect) {
      moveItem(locationEffect);
    }

    // set the consequence text to the give description text
    setConsequenceText(description);

    // set show consequence to true
    setCurrentDisplay("consequence");
  }

  function handleGive(item) {
    console.log(`giving ${item} to ${playerLocation}`);

    const customGive = items[item].getCustomGive({
      dropPreposition: locations[playerLocation].dropPreposition,
      playerLocation: playerLocation,
      gameState: gameState,
      itemLocations: itemLocations,
    });

    if (
      customGive.description ||
      customGive.gameEffect ||
      customGive.targetItemLocation ||
      customGive.otherItemLocations
    ) {
      handleAcceptedGive(item, customGive);
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

    // set show consequence to true
    setCurrentDisplay("consequence");
  }

  function handleAcceptedGive(item, customGive) {
    // todo could consolidate item interactions to single function (give, drop...)
    const description =
      customGive.description ||
      `You give the ${item} to the ${playerLocation}.`;
    setConsequenceText(description);

    const endItemLocation = customGive.targetItemLocation || "outOfPlay";
    moveItem({
      item: item,
      oldLocation: "inventory",
      newLocation: endItemLocation,
    });

    if (customGive.gameEffect) {
      console.log(
        `updating game state: ${JSON.stringify(customGive.gameEffect)}`
      );
      setGameState({ ...gameState, ...customGive.gameEffect });
    }

    if (customGive.otherItemLocations) {
      moveItem(customGive.otherItemLocations);
    }

    setCurrentDisplay("consequence");
  }

  function LocationItems({ itemsAtLocation }) {
    return Array.from(itemsAtLocation).map((item) => {
      return (
        <button onClick={() => handleTake(item)} className="item" key={item}>
          {items[item].displayName || item}
        </button>
      );
    });
  }

  function InventoryItems({ itemsInInventory }) {
    return Array.from(itemsInInventory).map((item) => {
      return (
        <div className="inventoryItem" key={item}>
          <div key={item}>
            {items[item].getDescription({
              playerLocation: playerLocation,
              gameState: gameState,
              itemLocations: itemLocations,
            })}
          </div>
          <button
            onClick={() => handleUse(item)}
            className="item-action"
            key={item + "-use"}
          >
            {items[item].getUseVerb({
              playerLocation: playerLocation,
              gameState: gameState,
              itemLocations: itemLocations,
            })}
          </button>
          <button
            onClick={() => handleDrop(item)}
            className="item-action"
            key={item + "-drop"}
          >
            Drop
          </button>
          <button
            disabled={
              !locations[playerLocation].getSentient({
                gameState: gameState,
                playerLocation: playerLocation,
                itemLocations: itemLocations,
              })
            }
            onClick={() => handleGive(item)}
            className="item-action"
            key={item + "-give"}
          >
            Give
          </button>
        </div>
      );
    });
  }

  function Connections({ connections }) {
    return connections.map((connection) => {
      return (
        <button
          className="connection"
          key={connection}
          onClick={() => handleMovePlayer(connection)}
        >
          {locations[connection].getDisplayName({
            playerLocation: playerLocation,
            gameState: gameState,
            itemLocations: itemLocations,
          }) || connection}
        </button>
      );
    });
  }

  function Location() {
    return (
      <div className="App">
        <div className="description">
          {locations[playerLocation].getDescription({
            playerLocation: playerLocation,
            gameState: gameState,
            itemLocations: itemLocations,
          })}
        </div>
        <div className="buttons">
          <LocationItems itemsAtLocation={itemLocations[playerLocation]} />
          <Connections
            connections={locations[playerLocation].getConnections({
              playerLocation: playerLocation,
              gameState: gameState,
              itemLocations: itemLocations,
            })}
          />
          <button
            className="inventory"
            onClick={() => setCurrentDisplay("inventory")}
          >
            Inventory
          </button>
        </div>
        <Stats />
      </div>
    );
  }

  function Stats() {
    return (
      <table className="stats">
        <tbody>
          <tr className="stat">
            <td className="statName">Reputation: </td>
            <td>{gameState.reputation}</td>
          </tr>
          <tr className="stat">
            <td className="statName">Gold: </td>
            <td>{gameState.gold}</td>
          </tr>
        </tbody>
      </table>
    );
  }

  function Consequence() {
    return (
      <div className="App">
        <div className="description">{consequenceText}</div>
        <button className="close" onClick={() => setCurrentDisplay("location")}>
          Back to{" "}
          {locations[playerLocation].getDisplayName({
            playerLocation: playerLocation,
            gameState: gameState,
            itemLocations: itemLocations,
          }) || playerLocation}
        </button>
        <button
          className="inventory"
          onClick={() => setCurrentDisplay("inventory")}
        >
          Inventory
        </button>
      </div>
    );
  }

  function Inventory() {
    return (
      <div className="App">
        <div className="description" key="description">
          Inventory
        </div>
        <div className="inventoryItems">
          <InventoryItems itemsInInventory={itemLocations.inventory} />
          <div className="inventoryItem" key="gold">
            <div key="gold">{gameState.gold + " gold"}</div>
            <button
              disabled={
                !locations[playerLocation].getSentient({
                  gameState: gameState,
                  playerLocation: playerLocation,
                  itemLocations: itemLocations,
                })
              }
              onClick={() => handlePay()}
              className="item-action"
              key={"gold-give"}
            >
              Pay
            </button>
          </div>
        </div>
        <button
          key="back"
          className="close"
          onClick={() => setCurrentDisplay("location")}
        >
          Close Inventory
        </button>
      </div>
    );
  }

  if (gameState.reputation <= 0) {
    const gameEndText =
      "Even your pride has its limits. With what little reputation you have left, you flee the town.";
    return (
      <div className="App">
        <div className="description">{gameEndText}</div>
        <button
          className="close" // todo make this reset the game
        >
          PLAY AGAIN
        </button>
        <Stats />
      </div>
    );
  }

  if (playerLocation === "gate" && gameState.earnedTreasureAmount) {
    const gameEndText = `You arrive at the city gates ${
      gameState.horseMounted
        ? "proudly mounted on your horse"
        : "weary from the long walk"
    }. A crowd has gathered, curious about the fate of the person who willingly entered the dragon's lair. ${
      gameState.naked ? `\n\nThe townsfolk jeer at your lack of clothes. ` : ""
    }${
      gameState.clothesPoopy && !gameState.naked
        ? "\n\nThe townsfolk gag at the horrid smell emanating from you clothes and give you a wide berth. "
        : ""
    }${
      gameState.playerPoisoned
        ? "\n\nYour face is still splotchy and swollen from eating the berries. "
        : ""
    }${
      gameState.singeCount
        ? `\n\nYou have ${gameState.singeCount} singe marks and no eyebrows, courtesy of the dragon's flame. `
        : ""
    }${
      gameState.cursed
        ? "\n\nAlthough the curse is not visible, a forbidding aura hangs around you. You wonder what effect the curse will have on your life. "
        : ""
    }${
      gameState.dragonDead
        ? `\n\nThe townsfolk see the gore on your sword. You hear whispers of "dragon slayer" and "hero" before the town erupts into cheers. ${
            gameState.reputation > 10
              ? "Thanks to your flawless reputation and heroism, they appoint you mayor on the spot."
              : ""
          }`
        : `\n\nInitially excited about your successful return, the towns folk cower as a huge roar erupts from the cave. It seems that the dragon is no longer incapacitated. You hear whispers of "provoked" and "doomed" as the townsfolk glare angrily at you. \n\nEager to escape the wrath of the dragon and townsfolk, you flee town.`
    }`;

    let finalReputation = gameState.reputation;
    if (gameState.horseMounted) finalReputation += 1;
    if (gameState.dragonDead) finalReputation += 2;
    if (gameState.naked) finalReputation -= 1;
    if (gameState.clothesPoopy) finalReputation -= 1;
    if (gameState.cursed) finalReputation -= 1;
    // Not losing reputation for being poisoned or singed since that happens when the event occurs

    return (
      <div className="App">
        <div className="description">{gameEndText}</div>
        <button
          className="close" // todo make this reset the game
        >
          PLAY AGAIN
        </button>
        <table className="stats">
          <tbody>
            <tr className="stat">
              <td className="statName">Reputation: </td>
              <td>{finalReputation}</td>
              <td className="statName">Max: </td>
              <td>TODO </td>
            </tr>
            <tr className="stat">
              <td className="statName">Gold: </td>
              <td>{gameState.gold}</td>
              <td className="statName">Max: </td>
              <td>TODO </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  switch (currentDisplay) {
    case "consequence":
      return <Consequence />;
    case "inventory":
      return <Inventory />;
    default:
      return <Location />;
  }
}

export default App;
