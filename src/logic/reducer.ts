import {type GameState, init} from "./init";
import {type ItemMovement, type ItemName, items} from "./items";
import {type LocationName, locations} from "./locations";

function appendConsequenceToDescription({
  gameEffect,
  description,
  newGameState,
}: {
  gameEffect: Partial<GameState>;
  description: string;
  newGameState: GameState;
}): string {
  let updatedDescription = description;

  if (gameEffect.reputation != null) {
    const reputationDiff = gameEffect.reputation - newGameState.reputation;
    updatedDescription += `\n\nReputation ${
      reputationDiff > 0 ? "+" : ""
    }${String(reputationDiff)}`;
  }

  if (gameEffect.gold != null) {
    const goldDiff = gameEffect.gold - newGameState.gold;
    updatedDescription += `\n\nGold ${goldDiff > 0 ? "+" : ""}${String(goldDiff)}`;
  }

  return updatedDescription;
}

function updateLocations({
  itemMovements,
  newGameState,
}: {
  itemMovements: ItemMovement[];
  newGameState: GameState;
}): GameState["itemLocations"] {
  let itemLocations = newGameState.itemLocations;

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
      const newGameState = structuredClone(currentGameState);

      const customTakeResult = items[item].getCustomTake(newGameState);

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
            items[item].getDescription(newGameState)[0].toLowerCase(),
          )
            ? "an"
            : "a"
        } ${items[item].getDescription(newGameState)}.`;
      }
      description = appendConsequenceToDescription({
        gameEffect,
        description,
        newGameState,
      });

      const itemLocations = updateLocations({
        itemMovements,
        newGameState,
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
      const newGameState = structuredClone(currentGameState);

      const customUseResult = items[item].getCustomUse(newGameState);

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
        newGameState,
      });

      const itemLocations = updateLocations({
        itemMovements,
        newGameState,
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
      const newGameState = structuredClone(currentGameState);

      const customDropResult = items[item].getCustomDrop(newGameState);

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
          .getDisplayName(newGameState)
          .toLowerCase()}.`;
      }

      description = appendConsequenceToDescription({
        gameEffect,
        description,
        newGameState,
      });

      const itemLocations = updateLocations({
        itemMovements,
        newGameState,
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
      const newGameState = structuredClone(currentGameState);

      const customPayResult =
        locations[playerLocation].getCustomPay(newGameState);

      const {gameEffect, itemMovements} = customPayResult;
      let {description} = customPayResult;

      if (description) {
        // no change if we already have a description
      } else if (Object.keys(gameEffect).length || itemMovements.length) {
        description = `You pay the ${locations[playerLocation]
          .getDisplayName(newGameState)
          .toLowerCase()}.`;
      } else {
        description = `The ${locations[playerLocation]
          .getDisplayName(newGameState)
          .toLowerCase()} is not interested in your gold.`;
      }

      description = appendConsequenceToDescription({
        gameEffect,
        description,
        newGameState,
      });

      const itemLocations = updateLocations({
        itemMovements,
        newGameState,
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
      const newGameState = structuredClone(currentGameState);

      const customGiveResult = items[item].getCustomGive(newGameState);

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
          .getDisplayName(newGameState)
          .toLowerCase()}.`;
      } else if (locations[playerLocation].getHuman()) {
        // if giving to human
        description = `The ${locations[playerLocation]
          .getDisplayName(newGameState)
          .toLowerCase()} does not want your ${items[item].getDescription(
          newGameState,
        )} but agrees to hold it for you.`;
      } else {
        description = `The ${locations[playerLocation]
          .getDisplayName(newGameState)
          .toLowerCase()} does not want your ${items[item].getDescription(
          newGameState,
        )}.`;
      }

      description = appendConsequenceToDescription({
        gameEffect,
        description,
        newGameState,
      });

      const itemLocations = updateLocations({
        itemMovements,
        newGameState,
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
      const newGameState = structuredClone(currentGameState);

      // update game state
      let gameStateChanges: Partial<GameState> = {};

      const customExitStateEffect =
        locations[oldLocation].onExitGameStateEffect?.(newGameState);
      gameStateChanges = {...gameStateChanges, ...customExitStateEffect};

      const customEnterStateEffect =
        locations[newLocation].onEnterGameStateEffect?.(newGameState);
      gameStateChanges = {...gameStateChanges, ...customEnterStateEffect};

      // update location consequence text
      let consequence = "";
      if (gameStateChanges.reputation != null) {
        const reputationDiff =
          gameStateChanges.reputation - newGameState.reputation;
        consequence += `\n\nReputation ${
          reputationDiff >= 0 ? "+" : ""
        }${String(reputationDiff)}`;
      }
      if (gameStateChanges.gold != null) {
        const goldDiff = gameStateChanges.gold - newGameState.gold;
        consequence += `\n\nGold ${goldDiff >= 0 ? "+" : ""}${String(goldDiff)}`;
      }

      // update item locations
      const itemMovements: ItemMovement[] = [];
      const customEnterItemLocationEffect =
        locations[newLocation].onEnterItemLocationEffect?.(newGameState);

      const customExitItemLocationEffect =
        locations[oldLocation].onExitItemLocationEffect?.(newGameState);

      if (customEnterItemLocationEffect) {
        itemMovements.push(customEnterItemLocationEffect);
      }

      if (customExitItemLocationEffect) {
        itemMovements.push(customExitItemLocationEffect);
      }

      const itemLocations = updateLocations({
        itemMovements,
        newGameState,
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
