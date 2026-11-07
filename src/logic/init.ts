import {
  type AlterItemLocationName,
  type LocationName,
  locations,
} from "./locations";
import {type ItemName, type ItemInfo, items} from "./items";
import {getFromStorage} from "@skedwards88/shared-components/src/logic/safeStorage";

export type GameState = {
  reputation: number;
  gold: number;
  timeInCave: number;
  swordCost: number;
  maxSwordCost: number;
  ownSword: boolean;
  manorFire: boolean;
  naked: boolean;
  squirrelDead: boolean;
  horseDead: boolean;
  horseTethered: boolean;
  horseMounted: boolean;
  playerPoisoned: boolean;
  clothesPoopy: boolean;
  handkerchiefDamp: boolean;
  playerMasked: boolean;
  babyCough: boolean;
  playerCough: boolean;
  savedBaby: boolean;
  receivedBabyReward: boolean;
  playedForYouth: boolean;
  offeredHandkerchiefToYouth: boolean;
  cursed: boolean;
  firstCourtyardEntry: boolean;
  dragonPoisoned: boolean;
  dragonAsleep: boolean;
  dragonDead: boolean;
  treasureAmount: number;
  treasureLevel: number;
  preCreditTreasureLevel: number;
  singeCount: number;
  gotScoreByCredit: boolean;
  paidDebt: boolean;
  gotScoreByTrade: boolean;
  maxReputation: number;
  maxGold: number;
  appleBitesRemaining: number;
  playerLocation: LocationName;
  consequenceText: string;
  locationConsequenceText: string;
  itemLocations: ItemLocations;
  journalPagesRemaining: number;
  journalEntry: GameState | null;
  resumedFromSaved: boolean;
};

type ItemLocations = Record<LocationName | AlterItemLocationName, ItemName[]>;

const allLocations = [
  ...(Object.keys(locations) as LocationName[]),
  "inventory",
  "outOfPlay",
] as const;

function buildStartingLocations(): ItemLocations {
  const startingItemLocations = Object.fromEntries(
    allLocations.map((key) => [key, [] as ItemName[]]),
  ) as ItemLocations;

  for (const [itemName, itemInfo] of Object.entries(items) as [
    ItemName,
    ItemInfo,
  ][]) {
    startingItemLocations[itemInfo.spawnLocation].push(itemName);
  }

  return startingItemLocations;
}

function savedStateValidQ(
  savedState: GameState,
  checkJournalEntry: boolean = true,
): boolean {
  if (typeof savedState !== "object" || savedState === null) {
    return false;
  }

  // All number fields must be numbers and finite
  for (const key of [
    "reputation",
    "gold",
    "timeInCave",
    "swordCost",
    "maxSwordCost",
    "treasureAmount",
    "treasureLevel",
    "preCreditTreasureLevel",
    "singeCount",
    "maxReputation",
    "maxGold",
    "appleBitesRemaining",
    "journalPagesRemaining",
  ] as const) {
    if (
      typeof savedState[key] !== "number" ||
      !Number.isFinite(savedState[key])
    ) {
      return false;
    }
  }

  // all bool fields must be bools
  for (const key of [
    "ownSword",
    "manorFire",
    "naked",
    "squirrelDead",
    "horseDead",
    "horseTethered",
    "horseMounted",
    "playerPoisoned",
    "clothesPoopy",
    "handkerchiefDamp",
    "playerMasked",
    "babyCough",
    "playerCough",
    "savedBaby",
    "receivedBabyReward",
    "playedForYouth",
    "offeredHandkerchiefToYouth",
    "cursed",
    "firstCourtyardEntry",
    "dragonPoisoned",
    "dragonAsleep",
    "dragonDead",
    "gotScoreByCredit",
    "paidDebt",
    "gotScoreByTrade",
    "resumedFromSaved",
  ] as const) {
    if (typeof savedState[key] !== "boolean") return false;
  }

  // all string fields must be strings
  for (const key of ["consequenceText", "locationConsequenceText"] as const) {
    if (typeof savedState[key] !== "string") return false;
  }

  // player must be in valid location
  if (!Object.keys(locations).includes(savedState.playerLocation)) {
    return false;
  }

  const itemLocations = savedState.itemLocations;
  if (typeof itemLocations !== "object" || itemLocations === null) {
    return false;
  }

  // There must be an items entry for every location, and only known items at each location
  for (const locationName of allLocations) {
    const itemsAtLocation = itemLocations[locationName];
    if (!Array.isArray(itemsAtLocation)) {
      return false;
    }
    for (const itemAtLocation of itemsAtLocation) {
      if (
        typeof itemAtLocation !== "string" ||
        !Object.keys(items).includes(itemAtLocation)
      )
        return false;
    }
  }

  // There can't be unknown locations in the item locations entry
  for (const savedLocation of Object.keys(itemLocations)) {
    if (!(allLocations as readonly string[]).includes(savedLocation)) {
      return false;
    }
  }

  // journal entry must be valid if exists (but don't need the journal entry of the journal entry to be valid since it doesn't get used)
  if (
    checkJournalEntry &&
    savedState.journalEntry !== null &&
    !savedStateValidQ(savedState.journalEntry, false)
  ) {
    return false;
  }

  return true;
}

export function init({useSaved}: {useSaved: boolean}): GameState {
  if (useSaved) {
    const savedState = getFromStorage<GameState>("dragonHeroGameState");

    if (savedState && savedStateValidQ(savedState)) {
      return {...savedState, resumedFromSaved: true};
    }
  }

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
    preCreditTreasureLevel: 0,
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
    resumedFromSaved: false,
  };
}
