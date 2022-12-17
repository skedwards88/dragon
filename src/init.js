import { locations } from "./locations.js";
import { items } from "./items.js";

function buildStartingLocations() {
  const startingItemLocations = {
    inventory: [],
    outOfPlay: [],
  };

  Object.keys(locations).forEach(
    (location) => (startingItemLocations[location] = [])
  );

  for (const [item, itemInfo] of Object.entries(items)) {
    startingItemLocations[itemInfo.spawnLocation].push(item);
  }

  return startingItemLocations;
}

export function init() {
  const startingItemLocations = buildStartingLocations();

  return {
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
    offeredHandkerchiefToYouth: false,
    cursed: false,
    firstCourtyardEntry: true,
    dragonPoisoned: false,
    dragonAsleep: false,
    dragonDead: false,
    treasureAmount: 300,
    treasureLevel: 0,
    singeCount: 0,
    gotScoreByCredit: false,
    paidDebt: false,
    gotScoreByTrade: false,
    maxReputation: 17,
    maxGold: 310,
    appleBitesRemaining: 5,

    playerLocation: "room",

    consequenceText: "",

    locationConsequenceText: "",

    itemLocations: startingItemLocations,

    journalPagesRemaining: 3,
    journalEntry: null,
  };
}
