import {type GameState} from "./init";

type KeyEvent = {
  eventName: "keyEvent";
  eventInfo: {
    milestone: string;
    // any other fields besides milestone are allowed
    [key: string]: string | number | boolean;
  };
};

export function inferKeyEvents(
  oldState: GameState,
  newState: GameState,
): KeyEvent[] {
  const keyEvents: KeyEvent[] = [];

  // game progressed beyond inn
  if (oldState.firstCourtyardEntry && !newState.firstCourtyardEntry) {
    keyEvents.push({
      eventName: "keyEvent",
      eventInfo: {milestone: "firstCourtyardEntry"},
    });
  }

  // handkerchief damp
  if (!oldState.handkerchiefDamp && newState.handkerchiefDamp) {
    keyEvents.push({
      eventName: "keyEvent",
      eventInfo: {milestone: "handkerchiefDamp"},
    });
  }

  // baby saved
  if (!oldState.receivedBabyReward && newState.receivedBabyReward) {
    keyEvents.push({
      eventName: "keyEvent",
      eventInfo: {
        milestone: "savedBaby",
        // dropped baby out of window
        throughWindow: !newState.babyCough,
        // Wore damp handkerchief in fire
        woreDampMask: !newState.playerCough,
      },
    });
  }

  // clothes poopy
  if (!oldState.clothesPoopy && newState.clothesPoopy) {
    keyEvents.push({
      eventName: "keyEvent",
      eventInfo: {milestone: "clothesPoopy"},
    });
  }

  // clothes washed
  if (oldState.clothesPoopy && !newState.clothesPoopy) {
    keyEvents.push({
      eventName: "keyEvent",
      eventInfo: {milestone: "clothesWashed"},
    });
  }

  // dragon poisoned
  if (!oldState.dragonPoisoned && newState.dragonPoisoned) {
    keyEvents.push({
      eventName: "keyEvent",
      eventInfo: {milestone: "dragonPoisoned"},
    });
  }

  // dragon asleep
  if (!oldState.dragonAsleep && newState.dragonAsleep) {
    keyEvents.push({
      eventName: "keyEvent",
      eventInfo: {milestone: "dragonAsleep"},
    });
  }

  // dragon killed
  if (!oldState.dragonDead && newState.dragonDead) {
    keyEvents.push({
      eventName: "keyEvent",
      eventInfo: {milestone: "dragonDead"},
    });
  }

  // journal used
  if (oldState.journalPagesRemaining > newState.journalPagesRemaining) {
    keyEvents.push({
      eventName: "keyEvent",
      eventInfo: {
        milestone: "writeJournal",
        journalPagesRemaining: newState.journalPagesRemaining,
      },
    });
  }

  if (
    newState.playerLocation === "gate" &&
    oldState.treasureLevel &&
    oldState.playerLocation != "gate"
  ) {
    keyEvents.push({
      eventName: "keyEvent",
      eventInfo: {
        milestone: "completed_game",
        reputation: newState.reputation,
        gold: newState.gold,
      },
    });
  }

  return keyEvents;
}
