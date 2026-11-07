import {
  type AlterItemLocationName,
  type LocationName,
  locations,
} from "./locations";
import {type ItemName, type ItemInfo, items} from "./items";

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
};

type ItemLocations = Record<LocationName | AlterItemLocationName, ItemName[]>;

function buildStartingLocations(): ItemLocations {
  const allLocations = [
    ...(Object.keys(locations) as LocationName[]),
    "inventory",
    "outOfPlay",
  ] as const;

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

export function init(): GameState {
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
  };
}
