import { init } from "./init.js";
import { items } from "./items.js";
import { locations } from "./locations.js";

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
    ////
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

    let itemLocations = newGameState.itemLocations;
    for (let index = 0; index < itemMovements.length; index++) {
      const { item, oldLocation, newLocation } = itemMovements[index];
      const updatedItemsAtOld = Array.from(
        new Set(itemLocations[oldLocation]).delete(item)
      );
      const updatedItemsAtNew = Array.from(
        new Set(itemLocations[newLocation]).add(item)
      );
      itemLocations = {
        ...itemLocations,
        [oldLocation]: updatedItemsAtOld,
        [newLocation]: updatedItemsAtNew,
      };
    }
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

    /////
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

    let itemLocations = newGameState.itemLocations;
    for (let index = 0; index < itemMovements.length; index++) {
      const { item, oldLocation, newLocation } = itemMovements[index];
      const updatedItemsAtOld = Array.from(
        new Set(itemLocations[oldLocation]).delete(item)
      );
      const updatedItemsAtNew = Array.from(
        new Set(itemLocations[newLocation]).add(item)
      );
      itemLocations = {
        ...itemLocations,
        [oldLocation]: updatedItemsAtOld,
        [newLocation]: updatedItemsAtNew,
      };
    }

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

    ////
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

    let itemLocations = newGameState.itemLocations;
    for (let index = 0; index < itemMovements.length; index++) {
      const { item, oldLocation, newLocation } = itemMovements[index];
      const updatedItemsAtOld = Array.from(
        new Set(itemLocations[oldLocation]).delete(item)
      );
      const updatedItemsAtNew = Array.from(
        new Set(itemLocations[newLocation]).add(item)
      );
      itemLocations = {
        ...itemLocations,
        [oldLocation]: updatedItemsAtOld,
        [newLocation]: updatedItemsAtNew,
      };
    }
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

    ////
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

    let itemLocations = newGameState.itemLocations;
    for (let index = 0; index < itemMovements.length; index++) {
      const { item, oldLocation, newLocation } = itemMovements[index];
      const updatedItemsAtOld = Array.from(
        new Set(itemLocations[oldLocation]).delete(item)
      );
      const updatedItemsAtNew = Array.from(
        new Set(itemLocations[newLocation]).add(item)
      );
      itemLocations = {
        ...itemLocations,
        [oldLocation]: updatedItemsAtOld,
        [newLocation]: updatedItemsAtNew,
      };
    }
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
      )} item.`;
    }

    /////
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

    let itemLocations = newGameState.itemLocations;
    for (let index = 0; index < itemMovements.length; index++) {
      const { item, oldLocation, newLocation } = itemMovements[index];
      const updatedItemsAtOld = Array.from(
        new Set(itemLocations[oldLocation]).delete(item)
      );
      const updatedItemsAtNew = Array.from(
        new Set(itemLocations[newLocation]).add(item)
      );
      itemLocations = {
        ...itemLocations,
        [oldLocation]: updatedItemsAtOld,
        [newLocation]: updatedItemsAtNew,
      };
    }

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
    let itemLocations = newGameState.itemLocations;

    const customEnterItemLocationEffect =
      locations[newLocation].onEnterItemLocationEffect &&
      locations[newLocation].onEnterItemLocationEffect(newGameState);

    if (customEnterItemLocationEffect) {
      const { item, oldLocation, newLocation } = customEnterItemLocationEffect;
      const updatedItemsAtOld = Array.from(
        new Set(itemLocations[oldLocation]).delete(item)
      );
      const updatedItemsAtNew = Array.from(
        new Set(itemLocations[newLocation]).add(item)
      );
      itemLocations = {
        ...itemLocations,
        [oldLocation]: updatedItemsAtOld,
        [newLocation]: updatedItemsAtNew,
      };
    }

    const customExitItemLocationEffect =
      locations[oldLocation].onExitItemLocationEffect &&
      locations[oldLocation].onExitItemLocationEffect(newGameState);

    if (customExitItemLocationEffect) {
      const { item, oldLocation, newLocation } = customExitItemLocationEffect;
      const updatedItemsAtOld = Array.from(
        new Set(itemLocations[oldLocation]).delete(item)
      );
      const updatedItemsAtNew = Array.from(
        new Set(itemLocations[newLocation]).add(item)
      );
      itemLocations = {
        ...itemLocations,
        [oldLocation]: updatedItemsAtOld,
        [newLocation]: updatedItemsAtNew,
      };
    }

    return {
      ...currentGameState,
      ...gameStateChanges,
      locationConsequenceText: consequence,
      itemLocations: itemLocations,
      playerLocation: newLocation,
    };
  } else {
    console.error("unknown action");
  }
}
