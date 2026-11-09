import {type GameState, init} from "./init";
import {type ItemMovement, type ItemName, items} from "./items";
import {type LocationName, locations} from "./locations";

function appendConsequenceToDescription({
  gameEffect,
  description,
  gameState,
}: {
  gameEffect: Partial<GameState>;
  description: string;
  gameState: GameState;
}): string {
  let updatedDescription = description;

  if (gameEffect.reputation != null) {
    const reputationDiff = gameEffect.reputation - gameState.reputation;
    updatedDescription += `\n\nReputation ${
      reputationDiff > 0 ? "+" : ""
    }${String(reputationDiff)}`;
  }

  if (gameEffect.gold != null) {
    const goldDiff = gameEffect.gold - gameState.gold;
    updatedDescription += `\n\nGold ${goldDiff > 0 ? "+" : ""}${String(goldDiff)}`;
  }

  return updatedDescription;
}

function updateLocations({
  itemMovements,
  gameState,
}: {
  itemMovements: ItemMovement[];
  gameState: GameState;
}): GameState["itemLocations"] {
  let itemLocations = structuredClone(gameState.itemLocations);

  for (const {item, oldLocation, newLocation} of itemMovements) {
    if (oldLocation === newLocation) continue;

    const updatedItemsAtOld = new Set(itemLocations[oldLocation]);
    updatedItemsAtOld.delete(item);

    const updatedItemsAtNew = new Set(itemLocations[newLocation]);
    updatedItemsAtNew.add(item);

    itemLocations = {
      ...itemLocations,
      [oldLocation]: Array.from(updatedItemsAtOld),
      [newLocation]: Array.from(updatedItemsAtNew),
    };
  }

  return itemLocations;
}

export type ReducerPayload =
  | {action: "newGame"}
  | {action: "takeItem"; item: ItemName}
  | {action: "useItem"; item: ItemName}
  | {action: "dropItem"; item: ItemName}
  | {action: "giveItem"; item: ItemName}
  | {action: "pay"}
  | {action: "movePlayer"; newLocation: LocationName}
  | {action: "readJournal"}
  | {action: "writeJournal"};

export function reducer(
  currentGameState: GameState,
  payload: ReducerPayload,
): GameState {
  switch (payload.action) {
    case "newGame": {
      return init({useSaved: false});
    }

    case "takeItem": {
      const item = payload.item;
      const playerLocation = currentGameState.playerLocation;

      const customTakeResult = items[item].getCustomTake(currentGameState);

      const {gameEffect, targetItemDestination, itemMovements} =
        customTakeResult;
      let {description} = customTakeResult;

      itemMovements.push({
        item,
        oldLocation: playerLocation,
        newLocation: targetItemDestination ?? "inventory",
      });

      if (description === "") {
        description = `You now have ${
          ["a", "e", "i", "o", "u"].includes(
            items[item].getDescription(currentGameState)[0].toLowerCase(),
          )
            ? "an"
            : "a"
        } ${items[item].getDescription(currentGameState)}.`;
      }
      description = appendConsequenceToDescription({
        gameEffect,
        description,
        gameState: currentGameState,
      });

      const itemLocations = updateLocations({
        itemMovements,
        gameState: currentGameState,
      });

      return {
        ...currentGameState,
        ...gameEffect,
        itemLocations,
        consequenceText: description,
        locationConsequenceText: "",
      };
    }
    case "useItem": {
      const item = payload.item;

      const customUseResult = items[item].getCustomUse(currentGameState);

      const {gameEffect, targetItemDestination, itemMovements} =
        customUseResult;
      let {description} = customUseResult;

      itemMovements.push({
        item,
        oldLocation: "inventory",
        newLocation: targetItemDestination ?? "inventory",
      });

      if (description === "") {
        description = `You use the ${items[item].displayName.toLowerCase()}.`;
      }

      description = appendConsequenceToDescription({
        gameEffect,
        description,
        gameState: currentGameState,
      });

      const itemLocations = updateLocations({
        itemMovements,
        gameState: currentGameState,
      });

      return {
        ...currentGameState,
        ...gameEffect,
        itemLocations,
        consequenceText: description,
        locationConsequenceText: "",
      };
    }
    case "dropItem": {
      const item = payload.item;
      const playerLocation = currentGameState.playerLocation;

      const customDropResult = items[item].getCustomDrop(currentGameState);

      const {gameEffect, targetItemDestination, itemMovements} =
        customDropResult;
      let {description} = customDropResult;

      itemMovements.push({
        item,
        oldLocation: "inventory",
        newLocation: targetItemDestination ?? playerLocation,
      });

      if (description === "") {
        description = `You drop the ${item} ${
          locations[playerLocation].dropPreposition
        } the ${locations[playerLocation]
          .getDisplayName(currentGameState)
          .toLowerCase()}.`;
      }

      description = appendConsequenceToDescription({
        gameEffect,
        description,
        gameState: currentGameState,
      });

      const itemLocations = updateLocations({
        itemMovements,
        gameState: currentGameState,
      });

      return {
        ...currentGameState,
        ...gameEffect,
        itemLocations,
        consequenceText: description,
        locationConsequenceText: "",
      };
    }
    case "pay": {
      const playerLocation = currentGameState.playerLocation;

      const customPayResult =
        locations[playerLocation].getCustomPay(currentGameState);

      const {gameEffect, itemMovements} = customPayResult;
      let {description} = customPayResult;

      if (description) {
        // no change if we already have a description
      } else if (Object.keys(gameEffect).length || itemMovements.length) {
        description = `You pay the ${locations[playerLocation]
          .getDisplayName(currentGameState)
          .toLowerCase()}.`;
      } else {
        description = `The ${locations[playerLocation]
          .getDisplayName(currentGameState)
          .toLowerCase()} is not interested in your gold.`;
      }

      description = appendConsequenceToDescription({
        gameEffect,
        description,
        gameState: currentGameState,
      });

      const itemLocations = updateLocations({
        itemMovements,
        gameState: currentGameState,
      });

      return {
        ...currentGameState,
        ...gameEffect,
        itemLocations,
        consequenceText: description,
        locationConsequenceText: "",
      };
    }
    case "giveItem": {
      const item = payload.item;
      const playerLocation = currentGameState.playerLocation;

      const customGiveResult = items[item].getCustomGive(currentGameState);

      const {gameEffect, targetItemDestination, itemMovements} =
        customGiveResult;
      let {description} = customGiveResult;

      itemMovements.push({
        item,
        oldLocation: "inventory",
        newLocation: targetItemDestination ?? playerLocation,
      });

      if (description) {
        // no change if we already have a description
      } else if (targetItemDestination === "outOfPlay") {
        // if item goes out of play
        description = `You give the ${item} to the ${locations[playerLocation]
          .getDisplayName(currentGameState)
          .toLowerCase()}.`;
      } else if (locations[playerLocation].getHuman()) {
        // if giving to human
        description = `The ${locations[playerLocation]
          .getDisplayName(currentGameState)
          .toLowerCase()} does not want your ${items[item].getDescription(
          currentGameState,
        )} but agrees to hold it for you.`;
      } else {
        description = `The ${locations[playerLocation]
          .getDisplayName(currentGameState)
          .toLowerCase()} does not want your ${items[item].getDescription(
          currentGameState,
        )}.`;
      }

      description = appendConsequenceToDescription({
        gameEffect,
        description,
        gameState: currentGameState,
      });

      const itemLocations = updateLocations({
        itemMovements,
        gameState: currentGameState,
      });

      return {
        ...currentGameState,
        ...gameEffect,
        itemLocations,
        consequenceText: description,
        locationConsequenceText: "",
      };
    }
    case "movePlayer": {
      const newLocation = payload.newLocation;
      const oldLocation = currentGameState.playerLocation;

      // update game state
      let gameStateChanges: Partial<GameState> = {};

      const customExitStateEffect =
        locations[oldLocation].onExitGameStateEffect?.(currentGameState);
      gameStateChanges = {...gameStateChanges, ...customExitStateEffect};

      const customEnterStateEffect =
        locations[newLocation].onEnterGameStateEffect?.(currentGameState);
      gameStateChanges = {...gameStateChanges, ...customEnterStateEffect};

      // update location consequence text
      let consequence = "";
      if (gameStateChanges.reputation != null) {
        const reputationDiff =
          gameStateChanges.reputation - currentGameState.reputation;
        consequence += `\n\nReputation ${
          reputationDiff >= 0 ? "+" : ""
        }${String(reputationDiff)}`;
      }
      if (gameStateChanges.gold != null) {
        const goldDiff = gameStateChanges.gold - currentGameState.gold;
        consequence += `\n\nGold ${goldDiff >= 0 ? "+" : ""}${String(goldDiff)}`;
      }

      // update item locations
      const itemMovements: ItemMovement[] = [];
      const customEnterItemLocationEffect =
        locations[newLocation].onEnterItemLocationEffect?.(currentGameState);

      const customExitItemLocationEffect =
        locations[oldLocation].onExitItemLocationEffect?.(currentGameState);

      if (customEnterItemLocationEffect) {
        itemMovements.push(customEnterItemLocationEffect);
      }

      if (customExitItemLocationEffect) {
        itemMovements.push(customExitItemLocationEffect);
      }

      const itemLocations = updateLocations({
        itemMovements,
        gameState: currentGameState,
      });

      return {
        ...currentGameState,
        ...gameStateChanges,
        locationConsequenceText: consequence,
        itemLocations,
        playerLocation: newLocation,
      };
    }
    case "readJournal": {
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
      }
      const newConsequenceText =
        "The previous entries are faded. You get the feeling that if you could read them, you would be transported to another time. ";
      return {...currentGameState, consequenceText: newConsequenceText};
    }
    case "writeJournal": {
      let text = "You record everything you can recall about your adventure. ";
      if (currentGameState.journalEntry) {
        text +=
          "As you write, the previous entry fades, as if it was lost to time. ";
      }
      return {
        ...currentGameState,
        journalPagesRemaining: currentGameState.journalPagesRemaining - 1,
        consequenceText: text,
        journalEntry: structuredClone(currentGameState),
      };
    }

    default: {
      const unknownAction: never = payload;
      console.warn(
        `unknown action: ${(unknownAction as {action: string}).action}`,
      );
      return currentGameState;
    }
  }
}
