import { init } from "./init.js";
import { items } from "./items.js";
import { locations } from "./locations.js";

function appendConsequenceToDescription({
  gameEffect,
  description,
  newGameState,
}) {
  if (gameEffect && gameEffect.reputation) {
    const reputationDiff = gameEffect.reputation - newGameState.reputation;
    description += `\n\nReputation ${
      reputationDiff > 0 ? "+" : ""
    }${reputationDiff}`;
  }

  if (gameEffect && gameEffect.gold) {
    const goldDiff = gameEffect.gold - newGameState.gold;
    description += `\n\nGold ${goldDiff > 0 ? "+" : ""}${goldDiff}`;
  }

  return description;
}

function updateLocations({ itemMovements, newGameState }) {
  let itemLocations = newGameState.itemLocations;

  for (let index = 0; index < itemMovements.length; index++) {
    const { item, oldLocation, newLocation } = itemMovements[index];
    if (oldLocation === newLocation) continue;

    let updatedItemsAtOld = new Set(itemLocations[oldLocation]);
    updatedItemsAtOld.delete(item);
    updatedItemsAtOld = Array.from(updatedItemsAtOld);

    let updatedItemsAtNew = new Set(itemLocations[newLocation]);
    updatedItemsAtNew.add(item);
    updatedItemsAtNew = Array.from(updatedItemsAtNew);

    itemLocations = {
      ...itemLocations,
      [oldLocation]: updatedItemsAtOld,
      [newLocation]: updatedItemsAtNew,
    };
  }

  return itemLocations;
}

export function reducer(currentGameState, payload) {
  if (payload.action === "newGame") {
    return init();
  } else if (payload.action === "resume") {
    return {
      ...currentGameState,
      ...payload.savedState.gameState,
    };
  } else if (payload.action === "takeItem") {
    const item = payload.item;
    const playerLocation = currentGameState.playerLocation;
    let newGameState = JSON.parse(JSON.stringify(currentGameState));

    let { gameEffect, description, targetItemDestination, itemMovements } =
      items[item].getCustomTake(newGameState);

    itemMovements.push({
      item: item,
      oldLocation: playerLocation,
      newLocation: targetItemDestination || "inventory",
    });

    if (!description) {
      description = `You now have ${
        ["a", "e", "i", "o", "u"].includes(
          items[item].getDescription(newGameState)[0].toLowerCase()
        )
          ? "an"
          : "a"
      } ${items[item].getDescription(newGameState)}.`;
    }

    description = appendConsequenceToDescription({
      gameEffect: gameEffect,
      description: description,
      newGameState: newGameState,
    });

    let itemLocations = updateLocations({
      itemMovements: itemMovements,
      newGameState: newGameState,
    });

    return {
      ...currentGameState,
      ...gameEffect,
      itemLocations: itemLocations,
      consequenceText: description,
      locationConsequenceText: "",
    };
  } else if (payload.action === "useItem") {
    const item = payload.item;
    let newGameState = JSON.parse(JSON.stringify(currentGameState));

    let { gameEffect, description, targetItemDestination, itemMovements } =
      items[item].getCustomUse(newGameState);

    itemMovements.push({
      item: item,
      oldLocation: "inventory",
      newLocation: targetItemDestination || "inventory",
    });

    if (!description) {
      description = `You use the ${items[item].displayName.toLowerCase()}.`;
    }

    description = appendConsequenceToDescription({
      gameEffect: gameEffect,
      description: description,
      newGameState: newGameState,
    });

    let itemLocations = updateLocations({
      itemMovements: itemMovements,
      newGameState: newGameState,
    });

    return {
      ...currentGameState,
      ...gameEffect,
      itemLocations: itemLocations,
      consequenceText: description,
      locationConsequenceText: "",
    };
  } else if (payload.action === "dropItem") {
    const item = payload.item;
    const playerLocation = currentGameState.playerLocation;
    let newGameState = JSON.parse(JSON.stringify(currentGameState));

    let { gameEffect, description, targetItemDestination, itemMovements } =
      items[item].getCustomDrop(newGameState);
    itemMovements.push({
      item: item,
      oldLocation: "inventory",
      newLocation: targetItemDestination || playerLocation,
    });

    if (!description) {
      description = `You drop the ${item} ${
        locations[playerLocation].dropPreposition
      } the ${locations[playerLocation]
        .getDisplayName(newGameState)
        .toLowerCase()}.`;
    }

    description = appendConsequenceToDescription({
      gameEffect: gameEffect,
      description: description,
      newGameState: newGameState,
    });

    let itemLocations = updateLocations({
      itemMovements: itemMovements,
      newGameState: newGameState,
    });
    return {
      ...currentGameState,
      ...gameEffect,
      itemLocations: itemLocations,
      consequenceText: description,
      locationConsequenceText: "",
    };
  } else if (payload.action === "pay") {
    const playerLocation = currentGameState.playerLocation;
    let newGameState = JSON.parse(JSON.stringify(currentGameState));

    let { gameEffect, description, itemMovements } =
      locations[playerLocation].getCustomPay(newGameState);

    if (description) {
      // no change if we already have a description
    } else if (gameEffect || itemMovements.length) {
      description = `You pay the ${locations[playerLocation]
        .getDisplayName(newGameState)
        .toLowerCase()}.`;
    } else {
      description = `The ${locations[playerLocation]
        .getDisplayName(newGameState)
        .toLowerCase()} is not interested in your gold.`;
    }

    description = appendConsequenceToDescription({
      gameEffect: gameEffect,
      description: description,
      newGameState: newGameState,
    });

    let itemLocations = updateLocations({
      itemMovements: itemMovements,
      newGameState: newGameState,
    });

    return {
      ...currentGameState,
      ...gameEffect,
      itemLocations: itemLocations,
      consequenceText: description,
      locationConsequenceText: "",
    };
  } else if (payload.action === "giveItem") {
    const item = payload.item;
    const playerLocation = currentGameState.playerLocation;
    let newGameState = JSON.parse(JSON.stringify(currentGameState));

    let { gameEffect, description, targetItemDestination, itemMovements } =
      items[item].getCustomGive(newGameState);

    itemMovements.push({
      item: item,
      oldLocation: "inventory",
      newLocation: targetItemDestination || playerLocation,
    });

    if (description) {
      // no change if we already have a description
    } else if (targetItemDestination === "outOfPlay") {
      // if item goes out of play
      description = `You give the ${item} to the ${locations[playerLocation]
        .getDisplayName(newGameState)
        .toLowerCase()}.`;
    } else if (locations[playerLocation].getHuman(newGameState)) {
      // if giving to human
      description = `The ${locations[playerLocation]
        .getDisplayName(newGameState)
        .toLowerCase()} does not want your ${items[item].getDescription(
        newGameState
      )} but agrees to hold it for you.`;
    } else {
      description = `The ${locations[playerLocation]
        .getDisplayName(newGameState)
        .toLowerCase()} does not want your ${items[item].getDescription(
        newGameState
      )}.`;
    }

    description = appendConsequenceToDescription({
      gameEffect: gameEffect,
      description: description,
      newGameState: newGameState,
    });

    let itemLocations = updateLocations({
      itemMovements: itemMovements,
      newGameState: newGameState,
    });

    return {
      ...currentGameState,
      ...gameEffect,
      itemLocations: itemLocations,
      consequenceText: description,
      locationConsequenceText: "",
    };
  } else if (payload.action === "movePlayer") {
    const newLocation = payload.newLocation;
    const oldLocation = currentGameState.playerLocation;
    let newGameState = JSON.parse(JSON.stringify(currentGameState));

    // update game state
    let gameStateChanges = {};

    const customExitStateEffect =
      locations[oldLocation].onExitGameStateEffect &&
      locations[oldLocation].onExitGameStateEffect(newGameState);
    gameStateChanges = { ...gameStateChanges, ...customExitStateEffect };

    const customEnterStateEffect =
      locations[newLocation].onEnterGameStateEffect &&
      locations[newLocation].onEnterGameStateEffect(newGameState);
    gameStateChanges = { ...gameStateChanges, ...customEnterStateEffect };

    // update location consequence text
    let consequence = "";
    if (gameStateChanges && gameStateChanges.reputation) {
      const reputationDiff =
        gameStateChanges.reputation - newGameState.reputation;
      consequence += `\n\nReputation ${
        reputationDiff >= 0 ? "+" : ""
      }${reputationDiff}`;
    }
    if (gameStateChanges && gameStateChanges.gold) {
      const goldDiff = gameStateChanges.gold - newGameState.gold;
      consequence += `\n\nGold ${goldDiff >= 0 ? "+" : ""}${goldDiff}`;
    }

    // update item locations
    let itemMovements = [];
    const customEnterItemLocationEffect =
      locations[newLocation].onEnterItemLocationEffect &&
      locations[newLocation].onEnterItemLocationEffect(newGameState);

    const customExitItemLocationEffect =
      locations[oldLocation].onExitItemLocationEffect &&
      locations[oldLocation].onExitItemLocationEffect(newGameState);

    if (customEnterItemLocationEffect) {
      itemMovements = [...itemMovements, customEnterItemLocationEffect];
    }

    if (customExitItemLocationEffect) {
      itemMovements = [...itemMovements, customExitItemLocationEffect];
    }

    let itemLocations = updateLocations({
      itemMovements: itemMovements,
      newGameState: newGameState,
    });

    return {
      ...currentGameState,
      ...gameStateChanges,
      locationConsequenceText: consequence,
      itemLocations: itemLocations,
      playerLocation: newLocation,
    };
  } else if (payload.action === "readJournal") {
    if (currentGameState.journalEntry) {
      const newConsequenceText =
        "As you read the text, words and memories whirl around you. When you reach the end of the entry, you know that you are in an earlier time. ";
      return {
        ...currentGameState,
        ...currentGameState.journalEntry,
        journalEntry: currentGameState.journalEntry,
        journalPagesRemaining: currentGameState.journalPagesRemaining,
        consequenceText: newConsequenceText,
      };
    } else {
      const newConsequenceText =
        "The previous entries are faded. You get the feeling that if you could read them, you would be transported to another time. ";
      return { ...currentGameState, consequenceText: newConsequenceText };
    }
  } else if (payload.action === "writeJournal") {
    let text = "You record everything you can recall about your adventure. ";
    if (currentGameState.journalEntry) {
      text +=
        "As you write, the previous entry fades, as if it was lost to time. ";
    }
    return {
      ...currentGameState,
      journalPagesRemaining: currentGameState.journalPagesRemaining - 1,
      consequenceText: text,
      journalEntry: JSON.parse(JSON.stringify(currentGameState)),
    };
  } else {
    console.error("unknown action");
  }
}
