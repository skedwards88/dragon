import { init } from "./init";
import { reducer } from "./reducer";

const newGameState = init();

test("New game resets state", () => {
  const output = reducer({ madeUpKey: true }, { action: "newGame" });

  expect(output).toMatchInlineSnapshot(`
    {
      "appleBitesRemaining": 5,
      "babyCough": false,
      "clothesPoopy": false,
      "consequenceText": "",
      "cursed": false,
      "dragonAsleep": false,
      "dragonDead": false,
      "dragonPoisoned": false,
      "firstCourtyardEntry": true,
      "gold": 0,
      "gotScoreByCredit": false,
      "gotScoreByTrade": false,
      "handkerchiefDamp": false,
      "horseDead": false,
      "horseMounted": false,
      "horseTethered": false,
      "itemLocations": {
        "blacksmith": [],
        "caveEntrance": [],
        "clearing": [
          "berries",
        ],
        "cliff": [],
        "courtyard": [
          "handkerchief",
        ],
        "crevice": [],
        "defecatory": [],
        "dung": [],
        "fountain": [],
        "gate": [],
        "inn": [
          "apple",
        ],
        "inventory": [],
        "lair": [
          "treasure",
        ],
        "manor": [],
        "mirror": [],
        "nursery": [
          "baby",
        ],
        "nurseryWindow": [],
        "outOfPlay": [],
        "pasture": [
          "horse",
        ],
        "puddle": [],
        "road1": [],
        "road2": [],
        "road3": [],
        "room": [
          "lute",
        ],
        "smithy": [
          "sword",
        ],
        "squirrel": [],
        "stream": [],
        "wardrobe": [
          "clothes",
        ],
        "window": [],
        "wizard": [
          "score",
        ],
        "youth": [],
      },
      "locationConsequenceText": "",
      "manorFire": true,
      "maxGold": 310,
      "maxReputation": 17,
      "maxSwordCost": 50,
      "naked": true,
      "offeredHandkerchiefToYouth": false,
      "ownSword": false,
      "paidDebt": false,
      "playedForYouth": false,
      "playerCough": false,
      "playerLocation": "room",
      "playerMasked": false,
      "playerPoisoned": false,
      "receivedBabyReward": false,
      "reputation": 10,
      "savedBaby": false,
      "singeCount": 0,
      "squirrelDead": false,
      "swordCost": 40,
      "timeInCave": 0,
      "treasureAmount": 300,
      "treasureLevel": 0,
    }
  `);
});

test("Resuming will apply saved state over new game state", () => {
  const output = reducer(newGameState, {
    action: "resume",
    savedState: {
      currentDisplay: "location",
      showMap: false,
      gameState: {
        babyCough: true,
        clothesPoopy: true,
        consequenceText: "This happened",
        itemLocations: {
          blacksmith: [],
          caveEntrance: [],
          clearing: ["berries"],
          cliff: [],
          courtyard: ["handkerchief"],
          crevice: [],
          defecatory: [],
          dung: [],
          fountain: [],
          gate: [],
          inn: ["apple"],
          inventory: [],
          lair: ["treasure"],
          manor: ["lute"],
          mirror: [],
          nursery: ["baby"],
          nurseryWindow: [],
          outOfPlay: [],
          pasture: ["horse"],
          puddle: [],
          road1: [],
          road2: [],
          road3: [],
          room: [],
          smithy: ["sword"],
          squirrel: [],
          stream: [],
          wardrobe: ["clothes"],
          window: [],
          wizard: ["score"],
          youth: [],
        },
        locationConsequenceText: "You are here",
        manorFire: false,
      },
    },
  });

  expect(output).toMatchInlineSnapshot(`
    {
      "appleBitesRemaining": 5,
      "babyCough": true,
      "clothesPoopy": true,
      "consequenceText": "This happened",
      "cursed": false,
      "dragonAsleep": false,
      "dragonDead": false,
      "dragonPoisoned": false,
      "firstCourtyardEntry": true,
      "gold": 0,
      "gotScoreByCredit": false,
      "gotScoreByTrade": false,
      "handkerchiefDamp": false,
      "horseDead": false,
      "horseMounted": false,
      "horseTethered": false,
      "itemLocations": {
        "blacksmith": [],
        "caveEntrance": [],
        "clearing": [
          "berries",
        ],
        "cliff": [],
        "courtyard": [
          "handkerchief",
        ],
        "crevice": [],
        "defecatory": [],
        "dung": [],
        "fountain": [],
        "gate": [],
        "inn": [
          "apple",
        ],
        "inventory": [],
        "lair": [
          "treasure",
        ],
        "manor": [
          "lute",
        ],
        "mirror": [],
        "nursery": [
          "baby",
        ],
        "nurseryWindow": [],
        "outOfPlay": [],
        "pasture": [
          "horse",
        ],
        "puddle": [],
        "road1": [],
        "road2": [],
        "road3": [],
        "room": [],
        "smithy": [
          "sword",
        ],
        "squirrel": [],
        "stream": [],
        "wardrobe": [
          "clothes",
        ],
        "window": [],
        "wizard": [
          "score",
        ],
        "youth": [],
      },
      "locationConsequenceText": "You are here",
      "manorFire": false,
      "maxGold": 310,
      "maxReputation": 17,
      "maxSwordCost": 50,
      "naked": true,
      "offeredHandkerchiefToYouth": false,
      "ownSword": false,
      "paidDebt": false,
      "playedForYouth": false,
      "playerCough": false,
      "playerLocation": "room",
      "playerMasked": false,
      "playerPoisoned": false,
      "receivedBabyReward": false,
      "reputation": 10,
      "savedBaby": false,
      "singeCount": 0,
      "squirrelDead": false,
      "swordCost": 40,
      "timeInCave": 0,
      "treasureAmount": 300,
      "treasureLevel": 0,
    }
  `);
});

test("Taking the sword from the smithy increases sword cost (once) and reduces reputation (every time)", () => {
  const item = "sword";
  const location = "smithy";
  const output = reducer(
    { ...newGameState, playerLocation: location },
    {
      action: "takeItem",
      item: item,
    }
  );

  expect(output.reputation).toMatchInlineSnapshot(`9`);
  expect(output.swordCost).toMatchInlineSnapshot(`50`);
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );

  expect(output.consequenceText).toMatchInlineSnapshot(`
    "You grab the sword and place it in your bag. "Hey! Are you stealing my sword?" The blacksmith grabs the sword from you and returns it to the table. 

    Reputation -1"
  `);

  const output2 = reducer(output, {
    action: "takeItem",
    item: item,
  });

  expect(output2.reputation).toMatchInlineSnapshot(`8`);
  expect(output2.swordCost).toMatchInlineSnapshot(`50`);
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output2.consequenceText).toMatchInlineSnapshot(`
    "You grab the sword and place it in your bag. "Hey! Are you stealing my sword?" The blacksmith grabs the sword from you and returns it to the table. 

    Reputation -1"
  `);
});

test("Playing the lute for the youth will boost reputation only once", () => {
  const item = "lute";
  const location = "youth";
  const output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      itemLocations: { ...newGameState.itemLocations, inventory: [item] },
    },
    {
      action: "useItem",
      item: item,
    }
  );

  expect(output.reputation).toMatchInlineSnapshot(`11`);
  expect(output.playedForYouth).toMatchInlineSnapshot(`true`);
  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.consequenceText).toMatchInlineSnapshot(`
    "You play a song for the crying youth. The music seems to cheer the youth up. 

    Reputation +1"
  `);

  const output2 = reducer(output, {
    action: "useItem",
    item: item,
  });

  expect(output2.reputation).toMatchInlineSnapshot(`11`);
  expect(output2.playedForYouth).toMatchInlineSnapshot(`true`);
  expect(output2.consequenceText).toMatchInlineSnapshot(
    `"They appreciate the music, but don't seem keen to listen all day. "`
  );
});

test("Removing your clothes in the presence of a person (besides the wizard) will lose reputation", () => {
  const item = "clothes";
  let location = "youth";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      naked: false,
      itemLocations: { ...newGameState.itemLocations, inventory: [item] },
    },
    {
      action: "useItem",
      item: item,
    }
  );

  expect(output.reputation).toMatchInlineSnapshot(`9`);
  expect(output.naked).toMatchInlineSnapshot(`true`);
  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.consequenceText).toMatchInlineSnapshot(`
    "You strip down. The youth eyes you suspiciously.

    Reputation -1"
  `);

  location = "blacksmith";
  output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      naked: false,
      itemLocations: { ...newGameState.itemLocations, inventory: [item] },
    },
    {
      action: "useItem",
      item: item,
    }
  );

  expect(output.reputation).toMatchInlineSnapshot(`9`);
  expect(output.naked).toMatchInlineSnapshot(`true`);
  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.consequenceText).toMatchInlineSnapshot(`
    "You strip down. The blacksmith eyes you suspiciously.

    Reputation -1"
  `);

  location = "inn";
  output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      naked: false,
      itemLocations: { ...newGameState.itemLocations, inventory: [item] },
    },
    {
      action: "useItem",
      item: item,
    }
  );

  expect(output.reputation).toMatchInlineSnapshot(`9`);
  expect(output.naked).toMatchInlineSnapshot(`true`);
  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.consequenceText).toMatchInlineSnapshot(`
    "You strip down. The innkeeper eyes you suspiciously.

    Reputation -1"
  `);

  location = "wizard";
  output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      naked: false,
      itemLocations: { ...newGameState.itemLocations, inventory: [item] },
    },
    {
      action: "useItem",
      item: item,
    }
  );

  expect(output.reputation).toMatchInlineSnapshot(`10`);
  expect(output.naked).toMatchInlineSnapshot(`true`);
  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.consequenceText).toMatchInlineSnapshot(`"You strip down. "`);

  location = "fountain";
  output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      naked: false,
      itemLocations: { ...newGameState.itemLocations, inventory: [item] },
    },
    {
      action: "useItem",
      item: item,
    }
  );

  expect(output.reputation).toMatchInlineSnapshot(`10`);
  expect(output.naked).toMatchInlineSnapshot(`true`);
  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.consequenceText).toMatchInlineSnapshot(`"You strip down. "`);
});

test("Dropping your clothes in the presence of a person (besides the wizard) will lose reputation", () => {
  const item = "clothes";
  let location = "youth";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      naked: false,
      itemLocations: { ...newGameState.itemLocations, inventory: [item] },
    },
    {
      action: "dropItem",
      item: item,
    }
  );

  expect(output.reputation).toMatchInlineSnapshot(`9`);
  expect(output.naked).toMatchInlineSnapshot(`true`);
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.consequenceText).toMatchInlineSnapshot(`
    "You strip down and drop your clothes by the youth. The youth eyes you suspiciously.

    Reputation -1"
  `);

  location = "blacksmith";
  output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      naked: false,
      itemLocations: { ...newGameState.itemLocations, inventory: [item] },
    },
    {
      action: "dropItem",
      item: item,
    }
  );

  expect(output.reputation).toMatchInlineSnapshot(`9`);
  expect(output.naked).toMatchInlineSnapshot(`true`);
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.consequenceText).toMatchInlineSnapshot(`
    "You strip down and drop your clothes by the blacksmith. The blacksmith eyes you suspiciously.

    Reputation -1"
  `);

  location = "inn";
  output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      naked: false,
      itemLocations: { ...newGameState.itemLocations, inventory: [item] },
    },
    {
      action: "dropItem",
      item: item,
    }
  );

  expect(output.reputation).toMatchInlineSnapshot(`9`);
  expect(output.naked).toMatchInlineSnapshot(`true`);
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.consequenceText).toMatchInlineSnapshot(`
    "You strip down and drop your clothes in the inn. The innkeeper eyes you suspiciously.

    Reputation -1"
  `);

  location = "wizard";
  output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      naked: false,
      itemLocations: { ...newGameState.itemLocations, inventory: [item] },
    },
    {
      action: "dropItem",
      item: item,
    }
  );

  expect(output.reputation).toMatchInlineSnapshot(`10`);
  expect(output.naked).toMatchInlineSnapshot(`true`);
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You strip down and drop your clothes by the wizard. "`
  );

  location = "fountain";
  output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      naked: false,
      itemLocations: { ...newGameState.itemLocations, inventory: [item] },
    },
    {
      action: "dropItem",
      item: item,
    }
  );

  expect(output.reputation).toMatchInlineSnapshot(`10`);
  expect(output.naked).toMatchInlineSnapshot(`true`);
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You strip down and drop your clothes in the fountain. Your clothes look much cleaner now. "`
  );
});

test("Dropping clothes in the dung pile will make them poopy", () => {
  const item = "clothes";
  const location = "dung";
  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      itemLocations: { ...newGameState.itemLocations, inventory: [item] },
    },
    {
      action: "dropItem",
      item: item,
    }
  );

  expect(output.reputation).toMatchInlineSnapshot(`10`);
  expect(output.clothesPoopy).toMatchInlineSnapshot(`true`);
  expect(output.naked).toMatchInlineSnapshot(`true`);
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You drop your clothes in the dung. "`
  );

  output = reducer(
    { ...newGameState, playerLocation: location, clothesPoopy: true },
    {
      action: "dropItem",
      item: item,
    }
  );

  expect(output.reputation).toMatchInlineSnapshot(`10`);
  expect(output.clothesPoopy).toMatchInlineSnapshot(`true`);
  expect(output.naked).toMatchInlineSnapshot(`true`);
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You drop your clothes in the dung. "`
  );
});

test("Dropping clothes in water will make them not poopy", () => {
  const item = "clothes";
  let location = "fountain";
  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      itemLocations: { ...newGameState.itemLocations, inventory: [item] },
    },
    {
      action: "dropItem",
      item: item,
    }
  );

  expect(output.reputation).toMatchInlineSnapshot(`10`);
  expect(output.clothesPoopy).toMatchInlineSnapshot(`false`);
  expect(output.naked).toMatchInlineSnapshot(`true`);
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );

  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You drop your clothes in the fountain. Your clothes look much cleaner now. "`
  );

  location = "stream";
  output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      itemLocations: { ...newGameState.itemLocations, inventory: [item] },
    },
    {
      action: "dropItem",
      item: item,
    }
  );

  expect(output.reputation).toMatchInlineSnapshot(`10`);
  expect(output.clothesPoopy).toMatchInlineSnapshot(`false`);
  expect(output.naked).toMatchInlineSnapshot(`true`);
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );

  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You drop your clothes in the stream. Your clothes look much cleaner now. "`
  );

  location = "puddle";
  output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      itemLocations: { ...newGameState.itemLocations, inventory: [item] },
    },
    {
      action: "dropItem",
      item: item,
    }
  );

  expect(output.reputation).toMatchInlineSnapshot(`10`);
  expect(output.clothesPoopy).toMatchInlineSnapshot(`false`);
  expect(output.naked).toMatchInlineSnapshot(`true`);
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );

  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You drop your clothes in the puddle. Your clothes look much cleaner now. "`
  );

  location = "puddle";
  output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      itemLocations: { ...newGameState.itemLocations, inventory: [item] },
    },
    {
      action: "dropItem",
      item: item,
    }
  );

  expect(output.reputation).toMatchInlineSnapshot(`10`);
  expect(output.clothesPoopy).toMatchInlineSnapshot(`false`);
  expect(output.naked).toMatchInlineSnapshot(`true`);
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );

  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You drop your clothes in the puddle. Your clothes look much cleaner now. "`
  );
});

test("Eating the apple does not remove it from inventory", () => {
  const item = "apple";
  let biteNumber = 1;
  let output = reducer(
    {
      ...newGameState,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [item],
        inn: [],
      },
    },
    {
      action: "useItem",
      item: item,
    }
  );

  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations["inn"]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.appleBitesRemaining).toEqual(
    newGameState.appleBitesRemaining - biteNumber
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You take a bite from the apple, feeling refreshed. "`
  );

  biteNumber++;
  output = reducer(output, {
    action: "useItem",
    item: item,
  });

  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations["inn"]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.appleBitesRemaining).toEqual(
    newGameState.appleBitesRemaining - biteNumber
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You take a bite from the apple, feeling refreshed. It looks like there are a few bites remaining. "`
  );

  biteNumber++;
  output = reducer(output, {
    action: "useItem",
    item: item,
  });

  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations["inn"]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.appleBitesRemaining).toEqual(
    newGameState.appleBitesRemaining - biteNumber
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You take a bite from the apple, feeling refreshed. It looks like there are a couple of bites remaining. "`
  );

  biteNumber++;
  output = reducer(output, {
    action: "useItem",
    item: item,
  });

  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations["inn"]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.appleBitesRemaining).toEqual(
    newGameState.appleBitesRemaining - biteNumber
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You take a bite from the apple, wondering if you'll be able to find another apple. It looks like there is one bite remaining. "`
  );

  biteNumber++;
  output = reducer(output, {
    action: "useItem",
    item: item,
  });

  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations["inn"]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.appleBitesRemaining).toEqual(
    newGameState.appleBitesRemaining - biteNumber
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You take the last bite from the apple, feeling regret that there isn't any more. "`
  );

  biteNumber++;
  output = reducer(output, {
    action: "useItem",
    item: item,
  });

  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations["inn"]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.appleBitesRemaining).toEqual(0);
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You nibble at the core, but there isn't much flesh remaining. "`
  );

  biteNumber++;
  output = reducer(output, {
    action: "useItem",
    item: item,
  });

  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations["inn"]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.appleBitesRemaining).toEqual(0);
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You nibble at the core, but there isn't much flesh remaining. "`
  );
});

test("Dropping the apple will give you the horse if the horse is present and if the apple is not eaten. The apple will go out of game.", () => {
  const item = "apple";
  let location = "pasture";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [item],
        inn: [],
      },
    },
    {
      action: "dropItem",
      item: item,
    }
  );

  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations["outOfPlay"]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining(["horse"])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.not.arrayContaining(["horse"])
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"This horse seems very interested in food. The horse walks over to eat the apple that you dropped. While he is preoccupied, you grab the reins. You now have a horse."`
  );
});

test("Giving the apple will give you the horse if the horse is present and if the apple is not eaten. The apple will go out of game.", () => {
  const item = "apple";
  let location = "pasture";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [item],
        inn: [],
      },
    },
    {
      action: "giveItem",
      item: item,
    }
  );

  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations["outOfPlay"]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining(["horse"])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.not.arrayContaining(["horse"])
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"This horse seems very interested in food. The horse walks over to eat the apple that you offered. While he is preoccupied, you grab the reins. You now have a horse."`
  );
});

test("Dropping the apple will give you the horse if the horse is present and if the apple is partially eaten. The apple will go out of game.", () => {
  const item = "apple";
  let location = "pasture";

  let output = reducer(
    {
      ...newGameState,
      appleBitesRemaining: 2,
      playerLocation: location,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [item],
        inn: [],
      },
    },
    {
      action: "dropItem",
      item: item,
    }
  );

  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations["outOfPlay"]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining(["horse"])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.not.arrayContaining(["horse"])
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"This horse seems very interested in food. The horse walks over to eat the partially eaten apple that you dropped. While he is preoccupied, you grab the reins. You now have a horse."`
  );
});

test("Giving the apple will give you the horse if the horse is present and if the apple is partially eaten. The apple will go out of game.", () => {
  const item = "apple";
  let location = "pasture";

  let output = reducer(
    {
      ...newGameState,
      appleBitesRemaining: 2,
      playerLocation: location,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [item],
        inn: [],
      },
    },
    {
      action: "giveItem",
      item: item,
    }
  );

  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations["outOfPlay"]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining(["horse"])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.not.arrayContaining(["horse"])
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"This horse seems very interested in food. The horse walks over to eat the partially eaten apple that you offered. While he is preoccupied, you grab the reins. You now have a horse."`
  );
});

test("Dropping the apple will not give you the horse if the apple is fully eaten. The apple will just be dropped at location.", () => {
  const item = "apple";
  let location = "pasture";

  let output = reducer(
    {
      ...newGameState,
      appleBitesRemaining: 0,
      playerLocation: location,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [item],
        inn: [],
      },
    },
    {
      action: "dropItem",
      item: item,
    }
  );

  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations["outOfPlay"]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining(["horse"])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining(["horse"])
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"This horse seems very interested in food. The horse walks over to eat the apple core that you dropped but the paltry amount remaining doesn't occupy him for long. He trots away as you try to grab the reins."`
  );
});

test("Giving the apple will not give you the horse if the apple is fully eaten. The apple will just be dropped at location.", () => {
  const item = "apple";
  let location = "pasture";

  let output = reducer(
    {
      ...newGameState,
      appleBitesRemaining: 0,
      playerLocation: location,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [item],
        inn: [],
      },
    },
    {
      action: "giveItem",
      item: item,
    }
  );

  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations["outOfPlay"]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining(["horse"])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining(["horse"])
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"The horse does not want your apple core."`
  );
});

test("Dropping the apple at the pasture will not matter if the horse is not at the pasture.", () => {
  const item = "apple";
  let location = "pasture";

  let output = reducer(
    {
      ...newGameState,
      appleBitesRemaining: 0,
      playerLocation: location,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [item],
        inn: [],
        pasture: [],
      },
    },
    {
      action: "dropItem",
      item: item,
    }
  );

  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations["outOfPlay"]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining(["horse"])
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You drop the apple at the pasture."`
  );
});

test("Giving the apple to the squirrel will effectively drop it.", () => {
  const item = "apple";
  let location = "squirrel";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [item],
        inn: [],
      },
    },
    {
      action: "giveItem",
      item: item,
    }
  );

  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"The squirrel does not want your fresh apple."`
  );
});

test("Wearing handkerchief, not damp, in manor", () => {
  const item = "handkerchief";
  let location = "manor";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      handkerchiefDamp: false,
      playerMasked: false,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: ["handkerchief"],
      },
    },
    {
      action: "useItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You tie the handkerchief around your nose and mouth. On its own, the handkerchief does little to block the smoke. "`
  );
  expect(output.playerMasked).toBe(true);
});

test("Wearing handkerchief, not damp, in nursery", () => {
  const item = "handkerchief";
  let location = "nursery";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      handkerchiefDamp: false,
      playerMasked: false,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: ["handkerchief"],
      },
    },
    {
      action: "useItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You tie the handkerchief around your nose and mouth. On its own, the handkerchief does little to block the smoke. "`
  );
  expect(output.playerMasked).toBe(true);
});

test("Wearing handkerchief, not damp, in nurseryWindow", () => {
  const item = "handkerchief";
  let location = "nurseryWindow";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      handkerchiefDamp: false,
      playerMasked: false,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: ["handkerchief"],
      },
    },
    {
      action: "useItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You tie the handkerchief around your nose and mouth. On its own, the handkerchief does little to block the smoke. "`
  );
  expect(output.playerMasked).toBe(true);
});

test("Wearing handkerchief, not damp, in inn", () => {
  const item = "handkerchief";
  let location = "inn";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      handkerchiefDamp: false,
      playerMasked: false,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: ["handkerchief"],
      },
    },
    {
      action: "useItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You tie the handkerchief around your nose and mouth. "`
  );
  expect(output.playerMasked).toBe(true);
});

test("Wearing handkerchief, damp, in manor", () => {
  const item = "handkerchief";
  let location = "manor";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      handkerchiefDamp: true,
      playerMasked: false,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: ["handkerchief"],
      },
    },
    {
      action: "useItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You tie the handkerchief around your nose and mouth. The damp handkerchief lets you breath more easily. "`
  );
  expect(output.playerMasked).toBe(true);
});

test("Wearing handkerchief, damp, in nursery", () => {
  const item = "handkerchief";
  let location = "nursery";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      handkerchiefDamp: true,
      playerMasked: false,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: ["handkerchief"],
      },
    },
    {
      action: "useItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You tie the handkerchief around your nose and mouth. The damp handkerchief lets you breath more easily. "`
  );
  expect(output.playerMasked).toBe(true);
});

test("Wearing handkerchief, damp, in nurseryWindow", () => {
  const item = "handkerchief";
  let location = "nurseryWindow";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      handkerchiefDamp: true,
      playerMasked: false,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: ["handkerchief"],
      },
    },
    {
      action: "useItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You tie the handkerchief around your nose and mouth. The damp handkerchief lets you breath more easily. "`
  );
  expect(output.playerMasked).toBe(true);
});

test("Wearing handkerchief, damp, in inn", () => {
  const item = "handkerchief";
  let location = "inn";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      handkerchiefDamp: true,
      playerMasked: false,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: ["handkerchief"],
      },
    },
    {
      action: "useItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You tie the handkerchief around your nose and mouth. "`
  );
  expect(output.playerMasked).toBe(true);
});

test("Removing handkerchief, not damp, in manor", () => {
  const item = "handkerchief";
  let location = "manor";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      handkerchiefDamp: false,
      playerMasked: true,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: ["handkerchief"],
      },
    },
    {
      action: "useItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You remove the handkerchief from your nose and mouth. "`
  );
  expect(output.playerMasked).toBe(false);
});

test("Removing handkerchief, damp, in manor", () => {
  const item = "handkerchief";
  let location = "manor";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      handkerchiefDamp: true,
      playerMasked: true,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: ["handkerchief"],
      },
    },
    {
      action: "useItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You remove the handkerchief from your nose and mouth. The smoke fills your lungs, making you cough. "`
  );
  expect(output.playerMasked).toBe(false);
});

test("Wearing handkerchief, not damp, in manor, no fire", () => {
  const item = "handkerchief";
  let location = "manor";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      handkerchiefDamp: false,
      playerMasked: false,
      manorFire: false,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: ["handkerchief"],
      },
    },
    {
      action: "useItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You tie the handkerchief around your nose and mouth. "`
  );
  expect(output.playerMasked).toBe(true);
});

test("Wearing handkerchief, damp, in manor, no fire", () => {
  const item = "handkerchief";
  let location = "manor";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      handkerchiefDamp: true,
      playerMasked: false,
      manorFire: false,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: ["handkerchief"],
      },
    },
    {
      action: "useItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You tie the handkerchief around your nose and mouth. "`
  );
  expect(output.playerMasked).toBe(true);
});

test("Wearing handkerchief in cave", () => {
  const item = "handkerchief";
  let location = "crevice";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      handkerchiefDamp: false,
      playerMasked: false,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: ["handkerchief"],
      },
    },
    {
      action: "useItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You tie the handkerchief around your nose and mouth. "`
  );
  expect(output.playerMasked).toBe(true);
});

test("Removing handkerchief in cave", () => {
  const item = "handkerchief";
  let location = "crevice";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      handkerchiefDamp: false,
      playerMasked: true,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: ["handkerchief"],
      },
    },
    {
      action: "useItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You remove the handkerchief from your nose and mouth. "`
  );
  expect(output.playerMasked).toBe(false);
});

test("Dropping handkerchief when wearing it in fire", () => {
  const item = "handkerchief";
  let location = "manor";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      handkerchiefDamp: true,
      playerMasked: true,
      manorFire: true,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: ["handkerchief"],
      },
    },
    {
      action: "dropItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You remove the handkerchief from your nose and mouth and drop it in the manor. The smoke fills your lungs, making you cough. "`
  );
  expect(output.playerMasked).toBe(false);
});

test("Dropping handkerchief when wearing it in cave", () => {
  const item = "handkerchief";
  let location = "crevice";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      handkerchiefDamp: false,
      playerMasked: true,
      manorFire: true,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: ["handkerchief"],
      },
    },
    {
      action: "dropItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You remove the handkerchief from your nose and mouth and drop it in the crevice. "`
  );
  expect(output.playerMasked).toBe(false);
  expect(output.handkerchiefDamp).toBe(false);
});

test("Dropping handkerchief when wearing it in fountain", () => {
  const item = "handkerchief";
  let location = "fountain";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      handkerchiefDamp: false,
      playerMasked: true,
      manorFire: true,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: ["handkerchief"],
      },
    },
    {
      action: "dropItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You remove the handkerchief from your nose and mouth and drop it in the fountain. "`
  );
  expect(output.playerMasked).toBe(false);
  expect(output.handkerchiefDamp).toBe(true);
});

test("Giving the handkerchief to youth once increases reputation and gives plot details. Giving again does nothing.", () => {
  const item = "handkerchief";
  let location = "youth";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      handkerchiefDamp: true,
      playerMasked: true,
      offeredHandkerchiefToYouth: false,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: ["handkerchief"],
      },
    },
    {
      action: "giveItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(`
    "You offer the handkerchief that you saw the youth drop. "Th-thank you," they sob, "but I don't want it back. You keep it; perhaps you will find a use for it." 

    The youth tells you that they were meant to be sacrificed to the dragon in exchange for another year of safety for the town. In retaliation, they set the mayor's house on fire, not realizing that the baby was trapped inside. 

    Reputation +1"
  `);
  expect(output.playerMasked).toBe(true);
  expect(output.offeredHandkerchiefToYouth).toBe(true);
  expect(output.reputation).toEqual(newGameState.reputation + 1);
  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations.youth).toEqual(
    expect.not.arrayContaining([item])
  );

  output = reducer(output, {
    action: "giveItem",
    item: item,
  });
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"The youth does not want your damp handkerchief but agrees to hold it for you."`
  );
  expect(output.playerMasked).toBe(true);
  expect(output.offeredHandkerchiefToYouth).toBe(true);
  expect(output.reputation).toEqual(newGameState.reputation + 1);
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations.youth).toEqual(expect.arrayContaining([item]));
});

test("The baby has no use", () => {
  const item = "baby";
  let location = "manor";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [item],
        nursery: [],
      },
    },
    {
      action: "useItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"It's unclear what use this baby has. "`
  );
});

test("Dropping the baby in the nursery returns it to the crib and un-saves it", () => {
  const item = "baby";
  let location = "nursery";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      savedBaby: true,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [item],
        nursery: [],
      },
    },
    {
      action: "dropItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You place the baby back in the crib. "`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.savedBaby).toBe(false);
});

test("Dropping the baby out the window saves it and removes it from game", () => {
  const item = "baby";
  let location = "nurseryWindow";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      savedBaby: true,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [item],
        nursery: [],
      },
    },
    {
      action: "dropItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You drop the baby out of the open window. The crowd below catches the baby. "`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations.outOfPlay).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.savedBaby).toBe(true);
});

test("Dropping the baby away from the nursery/window just makes it cry more", () => {
  const item = "baby";
  let location = "manor";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      savedBaby: true,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [item],
        nursery: [],
      },
    },
    {
      action: "dropItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You drop the crying baby. It cries even louder. "`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.savedBaby).toBe(false);
});

test("Taking the baby from nursery gives cough hint", () => {
  const item = "baby";
  let location = "nursery";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [],
        nursery: [item],
      },
    },
    {
      action: "takeItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You pick up the baby from the crib. The baby coughs as you move it away from the open window. "`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.not.arrayContaining([item])
  );
});

test("Taking the baby from somewhere besides nursery does not give cough hint", () => {
  const item = "baby";
  let location = "manor";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [],
        [location]: [item],
      },
    },
    {
      action: "takeItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You now have a crying baby."`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.not.arrayContaining([item])
  );
});

test("Using the sword to on sleeping dragon", () => {
  const item = "sword";
  let location = "lair";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      dragonAsleep: true,
      dragonDead: false,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [item],
      },
    },
    {
      action: "useItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(`
    "You cut off the head of the dragon, freeing the town from the dragon's tyrannical rule. 

    Reputation +2"
  `);
  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.dragonAsleep).toBe(true);
  expect(output.dragonDead).toBe(true);
  expect(output.reputation).toEqual(newGameState.reputation + 2);
});

test("Using the sword to on poisoned not sleeping dragon", () => {
  const item = "sword";
  let location = "lair";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      dragonAsleep: false,
      dragonPoisoned: true,
      dragonDead: false,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [item],
      },
    },
    {
      action: "useItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(`
    "Despite the poison, the dragon is still able to singe you once you get near enough to cut off its head. 

    Reputation -1"
  `);
  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.dragonAsleep).toBe(false);
  expect(output.dragonPoisoned).toBe(true);
  expect(output.dragonDead).toBe(false);
  expect(output.reputation).toEqual(newGameState.reputation - 1);
  expect(output.singeCount).toEqual(1);
});

test("Using the sword to on not poisoned not sleeping dragon", () => {
  const item = "sword";
  let location = "lair";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      dragonAsleep: false,
      dragonPoisoned: false,
      dragonDead: false,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [item],
      },
    },
    {
      action: "useItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(`
    "You try to cut off the dragon's head, but it singes you as soon as you get close enough. 

    Reputation -1"
  `);
  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.dragonAsleep).toBe(false);
  expect(output.dragonPoisoned).toBe(false);
  expect(output.dragonDead).toBe(false);
  expect(output.reputation).toEqual(newGameState.reputation - 1);
  expect(output.singeCount).toEqual(1);
});

test("Using the sword not on dragon", () => {
  const item = "sword";
  let location = "inn";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      dragonAsleep: false,
      dragonPoisoned: false,
      dragonDead: false,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [item],
      },
    },
    {
      action: "useItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You slash the sword through the air, looking a bit foolish. "`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.dragonAsleep).toBe(false);
  expect(output.dragonPoisoned).toBe(false);
  expect(output.dragonDead).toBe(false);
  expect(output.reputation).toEqual(newGameState.reputation);
  expect(output.singeCount).toEqual(0);
});

test("Taking the sword from the blacksmith if you haven't paid will lose reputation (every time) and increase cose (once)", () => {
  const item = "sword";
  let location = "smithy";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      ownSword: false,
    },
    {
      action: "takeItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(`
    "You grab the sword and place it in your bag. "Hey! Are you stealing my sword?" The blacksmith grabs the sword from you and returns it to the table. 

    Reputation -1"
  `);
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.reputation).toEqual(newGameState.reputation - 1);
  expect(output.swordCost).toEqual(newGameState.swordCost + 10);

  output = reducer(output, {
    action: "takeItem",
    item: item,
  });
  expect(output.consequenceText).toMatchInlineSnapshot(`
    "You grab the sword and place it in your bag. "Hey! Are you stealing my sword?" The blacksmith grabs the sword from you and returns it to the table. 

    Reputation -1"
  `);
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.reputation).toEqual(newGameState.reputation - 2);
  expect(output.swordCost).toEqual(newGameState.swordCost + 10);
});

test("Taking the sword from the blacksmith if you have paid is a normal take", () => {
  const item = "sword";
  let location = "smithy";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      ownSword: true,
    },
    {
      action: "takeItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You now have a sword."`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.reputation).toEqual(newGameState.reputation);
  expect(output.swordCost).toEqual(newGameState.swordCost);
});

test("You can't take the sword from the wizard if you traded it to the wizard", () => {
  const item = "sword";
  let location = "wizard";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      gotScoreByTrade: true,
      itemLocations: {
        ...newGameState.itemLocations,
        [location]: [item],
      },
    },
    {
      action: "takeItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"Ah you would like to exchange? You must first give me the score."`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
});

test("You can take the sword from the wizard if you didn't trade it to the wizard", () => {
  const item = "sword";
  let location = "wizard";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      gotScoreByTrade: false,
      itemLocations: {
        ...newGameState.itemLocations,
        [location]: [item],
      },
    },
    {
      action: "takeItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You now have a sword."`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.not.arrayContaining([item])
  );
});

test("Give the sword to the wizard for the score as long as you haven't bargained yet. You can't take the sword back directly.", () => {
  const item = "sword";
  let location = "wizard";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      gotScoreByTrade: false,
      gotScoreByCredit: false,
      itemLocations: {
        ...newGameState.itemLocations,
        [location]: ["score"],
      },
    },
    {
      action: "giveItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You give your sword to the wizard. In exchange, they give you the musical score. "`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining(["score"])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.gotScoreByTrade).toBe(true);

  // trade back
  output = reducer(output, {
    action: "takeItem",
    item: item,
  });
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"Ah you would like to exchange? You must first give me the score."`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining(["score"])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.gotScoreByTrade).toBe(true);
});

test("If you paid for the score, you can't trade for the score; giving the sword is a normal give and taking back is a normal take.", () => {
  const item = "sword";
  let location = "wizard";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      gotScoreByTrade: false,
      gotScoreByCredit: true,
      itemLocations: {
        ...newGameState.itemLocations,
        [location]: ["score"],
      },
    },
    {
      action: "giveItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"The wizard does not want your sword but agrees to hold it for you."`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining(["score"])
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.gotScoreByTrade).toBe(false);
  expect(output.gotScoreByCredit).toBe(true);

  output = reducer(output, {
    action: "takeItem",
    item: item,
  });
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You now have a sword."`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining(["score"])
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.gotScoreByTrade).toBe(false);
  expect(output.gotScoreByCredit).toBe(true);
});

test("If the wizard doesn't have the score, giving the sword is a normal give.", () => {
  const item = "sword";
  let location = "wizard";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      gotScoreByTrade: false,
      gotScoreByCredit: false,
      itemLocations: {
        ...newGameState.itemLocations,
        [location]: [],
      },
    },
    {
      action: "giveItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"The wizard does not want your sword but agrees to hold it for you."`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining(["score"])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.not.arrayContaining(["score"])
  );
  expect(output.gotScoreByTrade).toBe(false);
  expect(output.gotScoreByCredit).toBe(false);

  // take back
  output = reducer(output, {
    action: "takeItem",
    item: item,
  });
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You now have a sword."`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining(["score"])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.not.arrayContaining(["score"])
  );
  expect(output.gotScoreByTrade).toBe(false);
  expect(output.gotScoreByCredit).toBe(false);
});

test("You can't take the horse if it is dead", () => {
  const item = "horse";
  let location = "stream";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      horseDead: true,
      horseTethered: true,
      itemLocations: {
        ...newGameState.itemLocations,
        [location]: [item],
      },
    },
    {
      action: "takeItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"This dead horse is too heavy to carry. "`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.horseDead).toBe(true);
});

test("You can't take the horse directly", () => {
  const item = "horse";
  let location = "stream";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      horseDead: false,
      horseTethered: false,
      horseMounted: false,
      itemLocations: {
        ...newGameState.itemLocations,
        [location]: [item],
        inventory: ["apple", "berries"],
      },
    },
    {
      action: "takeItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You try to grab the horse's reins, but it evades you. It seems more interested in foraging for food than carrying you around. "`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.horseDead).toBe(false);
  expect(output.horseMounted).toBe(false);
  expect(output.horseTethered).toBe(false);
});

test("If the horse is tethered, you can take it", () => {
  const item = "horse";
  let location = "stream";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      horseDead: false,
      horseTethered: true,
      horseMounted: false,
      itemLocations: {
        ...newGameState.itemLocations,
        [location]: [item],
      },
    },
    {
      action: "takeItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You take back the horse's reins. "`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.horseDead).toBe(false);
  expect(output.horseMounted).toBe(false);
  expect(output.horseTethered).toBe(true);
});

test("When you give the horse, you automatically unmount but the horse is still tethered", () => {
  const item = "horse";
  let location = "wizard";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      horseDead: false,
      horseTethered: false,
      horseMounted: true,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [item],
      },
    },
    {
      action: "giveItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"The wizard does not want your voracious horse but agrees to hold it for you."`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.horseDead).toBe(false);
  expect(output.horseMounted).toBe(false);
  expect(output.horseTethered).toBe(true);
});

test("If you drop the horse, it is no longer tethered", () => {
  const item = "horse";
  let location = "wizard";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      horseDead: false,
      horseTethered: true,
      horseMounted: false,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [item],
      },
    },
    {
      action: "dropItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You let go of the horse's reins. The horse shakes its mane, glad to have a free head. It starts nosing around for food to munch. "`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.horseDead).toBe(false);
  expect(output.horseMounted).toBe(false);
  expect(output.horseTethered).toBe(false);
});

test("If you  drop the horse when mounted, it is no longer tethered", () => {
  const item = "horse";
  let location = "wizard";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      horseDead: false,
      horseTethered: true,
      horseMounted: true,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [item],
      },
    },
    {
      action: "dropItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You unmount the horse and let go of the horse's reins. The horse shakes its mane, glad to have a free head. It starts nosing around for food to munch. "`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.horseDead).toBe(false);
  expect(output.horseMounted).toBe(false);
  expect(output.horseTethered).toBe(false);
});

test("If you drop the horse at the same place as the berries are, it dies. The berries are still available.", () => {
  const item = "horse";
  let location = "gate";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      horseDead: false,
      horseTethered: true,
      horseMounted: true,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [item],
        [location]: ["berries"],
      },
    },
    {
      action: "dropItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You unmount the horse and let go of the horse's reins. The horse starts to eat the berries. After a few mouthfuls, it foams at the mouth and falls over dead. "`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining(["berries"])
  );
  expect(output.horseDead).toBe(true);
  expect(output.horseMounted).toBe(false);
  expect(output.horseTethered).toBe(false);
});

test("If you drop the horse at the clearing, it doesn't die if the berries are no longer there", () => {
  const item = "horse";
  let location = "clearing";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      horseDead: false,
      horseTethered: true,
      horseMounted: true,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [item],
        [location]: [],
      },
    },
    {
      action: "dropItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You unmount the horse and let go of the horse's reins. The horse shakes its mane, glad to have a free head. It starts nosing around for food to munch. "`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.horseDead).toBe(false);
  expect(output.horseMounted).toBe(false);
  expect(output.horseTethered).toBe(false);
});

test("Using the horse will mount if unmounted", () => {
  const item = "horse";
  let location = "clearing";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      horseDead: false,
      horseTethered: false,
      horseMounted: false,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [item],
        [location]: [],
      },
    },
    {
      action: "useItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You mount the horse. Much easier than walking!"`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.horseDead).toBe(false);
  expect(output.horseMounted).toBe(true);
  expect(output.horseTethered).toBe(true);
});

test("Using the horse will unmount if mounted but will keep the horse tethered", () => {
  const item = "horse";
  let location = "clearing";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      horseDead: false,
      horseTethered: false,
      horseMounted: true,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [item],
        [location]: [],
      },
    },
    {
      action: "useItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You unmount the horse, keeping hold of the horse's reins. "`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.horseDead).toBe(false);
  expect(output.horseMounted).toBe(false);
  expect(output.horseTethered).toBe(true);
});

test("Eating the berries will lose reputation and get poisoned but berries will still be available. Eating again will do the same.", () => {
  const item = "berries";
  let location = "stream";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      playerPoisoned: false,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [item],
        [location]: [],
      },
    },
    {
      action: "useItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(`
    "You pop some berries into your mouth. Immediately, your mouth starts to tingle, so you spit out the berries. You narrowly avoided death, but your face is splotchy and swollen, and your lips are a nasty shade of purple. 

    Reputation -1"
  `);
  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.reputation).toEqual(newGameState.reputation - 1);
  expect(output.playerPoisoned).toBe(true);

  output = reducer(output, {
    action: "useItem",
    item: item,
  });
  expect(output.consequenceText).toMatchInlineSnapshot(`
    "You pop some berries into your mouth. Immediately, your mouth starts to tingle, so you spit out the berries. You narrowly avoided death, but your face is splotchy and swollen, and your lips are a nasty shade of purple. 

    Reputation -1"
  `);
  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.reputation).toEqual(newGameState.reputation - 2);
  expect(output.playerPoisoned).toBe(true);
});

test("If you drop the berries at the squirrel, it dies, but it won't die twice", () => {
  const item = "berries";
  let location = "squirrel";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      squirrelDead: false,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [item],
        [location]: [],
      },
    },
    {
      action: "dropItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"The squirrel eats the berries that you dropped. After a few seconds, it foams at the mouth and rolls over, dead. Oh dear. "`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.squirrelDead).toBe(true);

  output = reducer(output, {
    action: "dropItem",
    item: item,
  });
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You drop the berries by the dead squirrel."`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.squirrelDead).toBe(true);
});

test("If you drop the berries at the horse, it dies, but it won't die twice", () => {
  const item = "berries";
  let location = "stream";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      horseDead: false,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [item],
        [location]: ["horse"],
      },
    },
    {
      action: "dropItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"The horse eats the berries that you dropped. After a few seconds, it foams at the mouth and falls over, dead. Oh dear. "`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.horseDead).toBe(true);

  output = reducer(output, {
    action: "dropItem",
    item: item,
  });
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You drop the berries in the stream."`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.horseDead).toBe(true);
});

test("If you drop the berries at the horse, it won't die if it is tethered", () => {
  const item = "berries";
  let location = "stream";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      horseDead: false,
      horseTethered: true,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [item],
        [location]: ["horse"],
      },
    },
    {
      action: "dropItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You drop the berries in the stream."`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.horseDead).toBe(false);
});

test("If you drop the berries at the horse and squirrel, they both die, but not twice", () => {
  const item = "berries";
  let location = "squirrel";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      squirrelDead: false,
      horseDead: false,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [item],
        [location]: ["horse"],
      },
    },
    {
      action: "dropItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"The squirrel eats the berries that you dropped. After a few seconds, it foams at the mouth and rolls over, dead. Oh dear. The horse eats the berries that you dropped. After a few seconds, it foams at the mouth and falls over, dead. Oh dear. "`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.horseDead).toBe(true);
  expect(output.squirrelDead).toBe(true);

  output = reducer(output, {
    action: "dropItem",
    item: item,
  });
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You drop the berries by the dead squirrel."`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.horseDead).toBe(true);
  expect(output.squirrelDead).toBe(true);
});

test("If you give the berries to the squirrel, it dies, but it won't die twice", () => {
  const item = "berries";
  let location = "squirrel";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      squirrelDead: false,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [item],
        [location]: [],
      },
    },
    {
      action: "giveItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"The squirrel eats the berries that you offered. After a few seconds, it foams at the mouth and rolls over, dead. Oh dear. "`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.squirrelDead).toBe(true);

  output = reducer(output, {
    action: "giveItem",
    item: item,
  });
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"The dead squirrel does not want your handful of berries."`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.squirrelDead).toBe(true);
});

test("If you give the berries to the horse, it dies, but it won't die twice", () => {
  const item = "berries";
  let location = "pasture";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      horseDead: false,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [item],
        [location]: ["horse"],
      },
    },
    {
      action: "giveItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"The horse eats the berries that you offered. After a few seconds, it foams at the mouth and falls over, dead. Oh dear. "`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.horseDead).toBe(true);

  // giving isn't technically allowed anymore since the pasture is not sentient without the horse
  // but this is what would happen if it was
  output = reducer(output, {
    action: "giveItem",
    item: item,
  });
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"The pasture does not want your handful of berries."`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.horseDead).toBe(true);
});

test("If you give the berries to the horse, it won't die even if it is tethered", () => {
  const item = "berries";
  let location = "stream";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      horseDead: false,
      horseTethered: true,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [item],
        [location]: ["horse"],
      },
    },
    {
      action: "giveItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"The stream does not want your handful of berries."`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.horseDead).toBe(false);
});

test("If you give the berries to the squirrel and the horse is present, only the squirrel dies", () => {
  const item = "berries";
  let location = "squirrel";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      squirrelDead: false,
      horseDead: false,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [item],
        [location]: ["horse"],
      },
    },
    {
      action: "giveItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"The squirrel eats the berries that you offered. After a few seconds, it foams at the mouth and rolls over, dead. Oh dear. "`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.horseDead).toBe(false);
  expect(output.squirrelDead).toBe(true);

  // giving to the horse is not enabled since the dead squirrel is not sentient
  // but here's what would happen if it was
  output = reducer(output, {
    action: "giveItem",
    item: item,
  });
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"The horse eats the berries that you offered. After a few seconds, it foams at the mouth and falls over, dead. Oh dear. "`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.horseDead).toBe(true);
  expect(output.squirrelDead).toBe(true);

  output = reducer(output, {
    action: "giveItem",
    item: item,
  });
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"The dead squirrel does not want your handful of berries."`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.horseDead).toBe(true);
  expect(output.squirrelDead).toBe(true);
});

test("The wizard refuses the berries", () => {
  const item = "berries";
  let location = "wizard";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      squirrelDead: false,
      horseDead: false,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [item],
        [location]: [],
      },
    },
    {
      action: "giveItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"The wizard politely refuses the berries. "Those will give you a life changing experience," he says."`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.horseDead).toBe(false);
  expect(output.squirrelDead).toBe(false);
});

test("Other sentients will just hold the berries", () => {
  const item = "berries";
  let location = "blacksmith";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      squirrelDead: false,
      horseDead: false,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [item],
        [location]: [],
      },
    },
    {
      action: "giveItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"The blacksmith does not want your handful of berries but agrees to hold it for you."`
  );
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.horseDead).toBe(false);
  expect(output.squirrelDead).toBe(false);
});

test("If the dragon is dead, you take all the treasure", () => {
  const item = "treasure";
  let location = "lair";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      dragonDead: true,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [],
        [location]: [item],
      },
    },
    {
      action: "takeItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(`
    "You scoop all of the treasure into your bag, avoiding the gore from the severed dragon head. 

    Gold +300"
  `);
  expect(output.treasureLevel).toBe(3);
  expect(output.gold).toBe(newGameState.gold + 300);
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations.outOfPlay).toEqual(
    expect.arrayContaining([item])
  );
});

test("If the dragon is asleep but not dead lets you take some treasure but not all, even on second try. Treasure still remains in lair. You get singed each time.", () => {
  const item = "treasure";
  let location = "lair";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      dragonDead: false,
      dragonAsleep: true,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [],
        [location]: [item],
      },
    },
    {
      action: "takeItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(`
    "Giving a wide berth to the snoring dragon, you scoop as much treasure as possible into your bag. The dragon's head rests on the last of the treasure, and a snore of fire singes you as you try to take it. 

    Reputation -1

    Gold +200"
  `);
  expect(output.treasureLevel).toBe(2);
  expect(output.gold).toBe(newGameState.gold + 200);
  expect(output.singeCount).toBe(newGameState.singeCount + 1);
  expect(output.reputation).toBe(newGameState.reputation - 1);
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations.outOfPlay).toEqual(
    expect.not.arrayContaining([item])
  );

  output = reducer(output, {
    action: "takeItem",
    item: item,
  });
  expect(output.consequenceText).toMatchInlineSnapshot(`
    "You already took the treasure that you can safely reach. As you edge closer to take more, the dragon snores, releasing a burst of flame that singes your eyebrows. 

    Reputation -1

    Gold 0"
  `);
  expect(output.treasureLevel).toBe(2);
  expect(output.gold).toBe(newGameState.gold + 200);
  expect(output.singeCount).toBe(newGameState.singeCount + 2);
  expect(output.reputation).toBe(newGameState.reputation - 2);
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations.outOfPlay).toEqual(
    expect.not.arrayContaining([item])
  );
});

test("If the dragon is poisoned but not asleep/dead, you can take some treasure", () => {
  const item = "treasure";
  let location = "lair";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      dragonDead: false,
      dragonAsleep: false,
      dragonPoisoned: true,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [],
        [location]: [item],
      },
    },
    {
      action: "takeItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(`
    "With the dragon slower from the poison, you can now reach the edge of the treasure pile. You scoop all of the treasure within reach into your bag, but the dragon shoots a blast of flame, preventing you from getting any closer. 

    Reputation -2

    Gold +100"
  `);
  expect(output.treasureLevel).toBe(1);
  expect(output.gold).toBe(newGameState.gold + 100);
  expect(output.singeCount).toBe(newGameState.singeCount + 2);
  expect(output.reputation).toBe(newGameState.reputation - 2);
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations.outOfPlay).toEqual(
    expect.not.arrayContaining([item])
  );

  output = reducer(output, {
    action: "takeItem",
    item: item,
  });
  expect(output.consequenceText).toMatchInlineSnapshot(`
    "You already took the treasure that you can safely reach. As you edge closer to take more, the dragon shoots a burst of flame, burning your hands. 

    Reputation -2

    Gold 0"
  `);
  expect(output.treasureLevel).toBe(1);
  expect(output.gold).toBe(newGameState.gold + 100);
  expect(output.singeCount).toBe(newGameState.singeCount + 4);
  expect(output.reputation).toBe(newGameState.reputation - 4);
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations.outOfPlay).toEqual(
    expect.not.arrayContaining([item])
  );
});

test("If the dragon is not poisoned or anything, you can't take any treasure", () => {
  const item = "treasure";
  let location = "lair";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      dragonDead: false,
      dragonAsleep: false,
      dragonPoisoned: false,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [],
        [location]: [item],
      },
    },
    {
      action: "takeItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(`
    "You try to steal the treasure, but the dragon singes you before you can get close. 

    Reputation -1"
  `);
  expect(output.treasureLevel).toBe(0);
  expect(output.gold).toBe(newGameState.gold);
  expect(output.singeCount).toBe(newGameState.singeCount + 1);
  expect(output.reputation).toBe(newGameState.reputation - 1);
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations.outOfPlay).toEqual(
    expect.not.arrayContaining([item])
  );

  output = reducer(output, {
    action: "takeItem",
    item: item,
  });
  expect(output.consequenceText).toMatchInlineSnapshot(`
    "You try to steal the treasure, but the dragon singes you before you can get close. 

    Reputation -1"
  `);
  expect(output.treasureLevel).toBe(0);
  expect(output.gold).toBe(newGameState.gold);
  expect(output.singeCount).toBe(newGameState.singeCount + 2);
  expect(output.reputation).toBe(newGameState.reputation - 2);
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations.outOfPlay).toEqual(
    expect.not.arrayContaining([item])
  );
});

test("You can take the treasure in increments, getting singed along the way", () => {
  const item = "treasure";
  let location = "lair";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: location,
      dragonDead: false,
      dragonAsleep: false,
      dragonPoisoned: false,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [],
        [location]: [item],
      },
    },
    {
      action: "takeItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(`
    "You try to steal the treasure, but the dragon singes you before you can get close. 

    Reputation -1"
  `);
  expect(output.treasureLevel).toBe(0);
  expect(output.gold).toBe(newGameState.gold);
  expect(output.singeCount).toBe(newGameState.singeCount + 1);
  expect(output.reputation).toBe(newGameState.reputation - 1);
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations.outOfPlay).toEqual(
    expect.not.arrayContaining([item])
  );

  output = reducer(
    { ...output, dragonPoisoned: true },
    {
      action: "takeItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(`
    "With the dragon slower from the poison, you can now reach the edge of the treasure pile. You scoop all of the treasure within reach into your bag, but the dragon shoots a blast of flame, preventing you from getting any closer. 

    Reputation -2

    Gold +100"
  `);
  expect(output.treasureLevel).toBe(1);
  expect(output.gold).toBe(newGameState.gold + 100);
  expect(output.singeCount).toBe(newGameState.singeCount + 3);
  expect(output.reputation).toBe(newGameState.reputation - 3);
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations.outOfPlay).toEqual(
    expect.not.arrayContaining([item])
  );

  output = reducer(
    { ...output, dragonPoisoned: true, dragonAsleep: true },
    {
      action: "takeItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(`
    "Giving a wide berth to the snoring dragon, you scoop as much treasure as possible into your bag. The dragon's head rests on the last of the treasure, and a snore of fire singes you as you try to take it. 

    Reputation -1

    Gold +100"
  `);
  expect(output.treasureLevel).toBe(2);
  expect(output.gold).toBe(newGameState.gold + 200);
  expect(output.singeCount).toBe(newGameState.singeCount + 4);
  expect(output.reputation).toBe(newGameState.reputation - 4);
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.arrayContaining([item])
  );
  expect(output.itemLocations.outOfPlay).toEqual(
    expect.not.arrayContaining([item])
  );

  output = reducer(
    { ...output, dragonPoisoned: true, dragonAsleep: true, dragonDead: true },
    {
      action: "takeItem",
      item: item,
    }
  );
  expect(output.consequenceText).toMatchInlineSnapshot(`
    "You scoop all of the treasure into your bag, avoiding the gore from the severed dragon head. 

    Gold +100"
  `);
  expect(output.treasureLevel).toBe(3);
  expect(output.gold).toBe(newGameState.gold + 300);
  expect(output.singeCount).toBe(newGameState.singeCount + 4);
  expect(output.reputation).toBe(newGameState.reputation - 4);
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations.outOfPlay).toEqual(
    expect.arrayContaining([item])
  );
});

test("Moving player, no consequences", () => {
  let oldLocation = "inn";
  let newLocation = "room";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: oldLocation,
    },
    {
      action: "movePlayer",
      newLocation: newLocation,
    }
  );
  expect(output.playerLocation).toEqual(newLocation);
  expect(output).toEqual({ ...newGameState, playerLocation: newLocation });
});

test("Entering the inn when naked will lose reputation", () => {
  let oldLocation = "fountain";
  let newLocation = "inn";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: oldLocation,
    },
    {
      action: "movePlayer",
      newLocation: newLocation,
    }
  );
  expect(output.playerLocation).toEqual(newLocation);
  expect(output.reputation).toEqual(newGameState.reputation - 1);
});

test("Leaving the courtyard the first time is different", () => {
  let oldLocation = "courtyard";
  let newLocation = "fountain";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: oldLocation,
      firstCourtyardEntry: true,
    },
    {
      action: "movePlayer",
      newLocation: newLocation,
    }
  );
  expect(output.playerLocation).toEqual(newLocation);
  expect(output.firstCourtyardEntry).toEqual(false);

  output = reducer(output, {
    action: "movePlayer",
    newLocation: newLocation,
  });
  expect(output.playerLocation).toEqual(newLocation);
  expect(output.firstCourtyardEntry).toEqual(false);
});

test("Entering the fountain: saved baby, not rewarded yet, no cough, no baby cough, clothed", () => {
  let oldLocation = "manor";
  let newLocation = "fountain";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: oldLocation,
      savedBaby: true,
      receivedBabyReward: false,
      playerCough: false,
      babyCough: false,
      naked: false,
    },
    {
      action: "movePlayer",
      newLocation: newLocation,
    }
  );
  expect(output.playerLocation).toEqual(newLocation);
  expect(output.reputation).toEqual(newGameState.reputation + 2);
  expect(output.gold).toEqual(newGameState.gold + 50);
  expect(output.locationConsequenceText).toMatchInlineSnapshot(`
    "

    Reputation +2

    Gold +50"
  `);
});

test("Entering the fountain: saved baby, not rewarded yet, cough, no baby cough, clothed", () => {
  let oldLocation = "manor";
  let newLocation = "fountain";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: oldLocation,
      savedBaby: true,
      receivedBabyReward: false,
      playerCough: true,
      babyCough: false,
      naked: false,
    },
    {
      action: "movePlayer",
      newLocation: newLocation,
    }
  );
  expect(output.playerLocation).toEqual(newLocation);
  expect(output.reputation).toEqual(newGameState.reputation + 1);
  expect(output.gold).toEqual(newGameState.gold + 50);
  expect(output.locationConsequenceText).toMatchInlineSnapshot(`
    "

    Reputation +1

    Gold +50"
  `);
});

test("Entering the fountain: saved baby, not rewarded yet, no cough, baby cough, clothed", () => {
  let oldLocation = "manor";
  let newLocation = "fountain";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: oldLocation,
      savedBaby: true,
      receivedBabyReward: false,
      playerCough: false,
      babyCough: true,
      naked: false,
    },
    {
      action: "movePlayer",
      newLocation: newLocation,
    }
  );
  expect(output.playerLocation).toEqual(newLocation);
  expect(output.reputation).toEqual(newGameState.reputation + 1);
  expect(output.gold).toEqual(newGameState.gold + 50);
  expect(output.locationConsequenceText).toMatchInlineSnapshot(`
    "

    Reputation +1

    Gold +50"
  `);
});

test("Entering the fountain: saved baby, not rewarded yet, no cough, no baby cough, not clothed", () => {
  let oldLocation = "manor";
  let newLocation = "fountain";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: oldLocation,
      savedBaby: true,
      receivedBabyReward: false,
      playerCough: false,
      babyCough: false,
      naked: true,
    },
    {
      action: "movePlayer",
      newLocation: newLocation,
    }
  );
  expect(output.playerLocation).toEqual(newLocation);
  expect(output.reputation).toEqual(newGameState.reputation + 1);
  expect(output.gold).toEqual(newGameState.gold + 50);
  expect(output.locationConsequenceText).toMatchInlineSnapshot(`
    "

    Reputation +1

    Gold +50"
  `);
});

test("Entering the fountain: saved baby, not rewarded yet, cough, no baby cough, not clothed", () => {
  let oldLocation = "manor";
  let newLocation = "fountain";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: oldLocation,
      savedBaby: true,
      receivedBabyReward: false,
      playerCough: true,
      babyCough: false,
      naked: true,
    },
    {
      action: "movePlayer",
      newLocation: newLocation,
    }
  );
  expect(output.playerLocation).toEqual(newLocation);
  expect(output.reputation).toEqual(newGameState.reputation + 0);
  expect(output.gold).toEqual(newGameState.gold + 50);
  expect(output.locationConsequenceText).toMatchInlineSnapshot(`
    "

    Reputation +0

    Gold +50"
  `);
});

test("Entering the fountain: saved baby, not rewarded yet, cough, baby cough, not clothed", () => {
  let oldLocation = "manor";
  let newLocation = "fountain";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: oldLocation,
      savedBaby: true,
      receivedBabyReward: false,
      playerCough: true,
      babyCough: true,
      naked: true,
    },
    {
      action: "movePlayer",
      newLocation: newLocation,
    }
  );
  expect(output.playerLocation).toEqual(newLocation);
  expect(output.reputation).toEqual(newGameState.reputation - 1);
  expect(output.gold).toEqual(newGameState.gold + 50);
  expect(output.locationConsequenceText).toMatchInlineSnapshot(`
    "

    Reputation -1

    Gold +50"
  `);
});

test("Entering the fountain: baby goes out of play", () => {
  let oldLocation = "manor";
  let newLocation = "fountain";
  let item = "baby";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: oldLocation,
      savedBaby: true,
      receivedBabyReward: false,
      playerCough: true,
      babyCough: true,
      naked: true,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [item],
      },
    },
    {
      action: "movePlayer",
      newLocation: newLocation,
    }
  );
  expect(output.playerLocation).toEqual(newLocation);
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[oldLocation]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[newLocation]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations.outOfPlay).toEqual(
    expect.arrayContaining([item])
  );
});

test("Entering the fountain: baby goes out of play, does not error if baby already was out of play", () => {
  let oldLocation = "manor";
  let newLocation = "fountain";
  let item = "baby";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: oldLocation,
      savedBaby: true,
      receivedBabyReward: false,
      playerCough: true,
      babyCough: true,
      naked: true,
      itemLocations: {
        ...newGameState.itemLocations,
        outOfPlay: [item],
        inventory: [],
      },
    },
    {
      action: "movePlayer",
      newLocation: newLocation,
    }
  );
  expect(output.playerLocation).toEqual(newLocation);
  expect(output.itemLocations.inventory).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[oldLocation]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations[newLocation]).toEqual(
    expect.not.arrayContaining([item])
  );
  expect(output.itemLocations.outOfPlay).toEqual(
    expect.arrayContaining([item])
  );
});

test("Exiting the fountain puts out the fire if the baby was saved", () => {
  let oldLocation = "fountain";
  let newLocation = "manor";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: oldLocation,
      savedBaby: true,
      receivedBabyReward: false,
      manorFire: true,
    },
    {
      action: "movePlayer",
      newLocation: newLocation,
    }
  );
  expect(output.playerLocation).toEqual(newLocation);
  expect(output.savedBaby).toBe(true);
  expect(output.manorFire).toBe(false);
  expect(output.receivedBabyReward).toBe(true);
});

test("Exiting the fountain does not put out the fire if the baby was not saved", () => {
  let oldLocation = "fountain";
  let newLocation = "manor";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: oldLocation,
      savedBaby: false,
      receivedBabyReward: false,
      manorFire: true,
    },
    {
      action: "movePlayer",
      newLocation: newLocation,
    }
  );
  expect(output.playerLocation).toEqual(newLocation);
  expect(output.savedBaby).toBe(false);
  expect(output.manorFire).toBe(true);
  expect(output.receivedBabyReward).toBe(false);
});

test("Taking the baby into the manor gives it a cough", () => {
  let oldLocation = "nursery";
  let newLocation = "manor";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: oldLocation,
      manorFire: true,
      babyCough: false,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: ["baby"],
      },
    },
    {
      action: "movePlayer",
      newLocation: newLocation,
    }
  );
  expect(output.playerLocation).toEqual(newLocation);
  expect(output.babyCough).toBe(true);
  expect(output.manorFire).toBe(true);
});

test("The baby doesn't develop a cough if you don't bring it with you", () => {
  let oldLocation = "nursery";
  let newLocation = "manor";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: oldLocation,
      manorFire: true,
      babyCough: false,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: [],
        nursery: ["baby"],
      },
    },
    {
      action: "movePlayer",
      newLocation: newLocation,
    }
  );
  expect(output.playerLocation).toEqual(newLocation);
  expect(output.babyCough).toBe(false);
  expect(output.manorFire).toBe(true);
});

test("If you get to the nursery without wearing the damp handkerchief, you get a cough", () => {
  let oldLocation = "manor";
  let newLocation = "nursery";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: oldLocation,
      handkerchiefDamp: false,
      playerMasked: false,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: ["handkerchief"],
      },
    },
    {
      action: "movePlayer",
      newLocation: newLocation,
    }
  );
  expect(output.playerLocation).toEqual(newLocation);
  expect(output.playerCough).toBe(true);
});

test("Wearing a dry handkerchief doesn't protect from cough", () => {
  let oldLocation = "manor";
  let newLocation = "nursery";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: oldLocation,
      handkerchiefDamp: false,
      playerMasked: true,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: ["handkerchief"],
      },
    },
    {
      action: "movePlayer",
      newLocation: newLocation,
    }
  );
  expect(output.playerLocation).toEqual(newLocation);
  expect(output.playerCough).toBe(true);
});

test("Having but not wearing a damp handkerchief doesn't protect from cough", () => {
  let oldLocation = "manor";
  let newLocation = "nursery";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: oldLocation,
      handkerchiefDamp: true,
      playerMasked: false,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: ["handkerchief"],
      },
    },
    {
      action: "movePlayer",
      newLocation: newLocation,
    }
  );
  expect(output.playerLocation).toEqual(newLocation);
  expect(output.playerCough).toBe(true);
});

test("Wearing a damp handkerchief protects from cough", () => {
  let oldLocation = "manor";
  let newLocation = "nursery";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: oldLocation,
      handkerchiefDamp: true,
      playerMasked: true,
      itemLocations: {
        ...newGameState.itemLocations,
        inventory: ["handkerchief"],
      },
    },
    {
      action: "movePlayer",
      newLocation: newLocation,
    }
  );
  expect(output.playerLocation).toEqual(newLocation);
  expect(output.playerCough).toBe(false);
});

test("Talking to the blacksmith when naked will lose reputation", () => {
  let oldLocation = "smithy";
  let newLocation = "blacksmith";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: oldLocation,
    },
    {
      action: "movePlayer",
      newLocation: newLocation,
    }
  );
  expect(output.playerLocation).toEqual(newLocation);
  expect(output.reputation).toEqual(newGameState.reputation - 1);
});

test("Talking to the youth when naked will lose reputation", () => {
  let oldLocation = "gate";
  let newLocation = "youth";

  let output = reducer(
    {
      ...newGameState,
      playerLocation: oldLocation,
    },
    {
      action: "movePlayer",
      newLocation: newLocation,
    }
  );
  expect(output.playerLocation).toEqual(newLocation);
  expect(output.reputation).toEqual(newGameState.reputation - 1);
});

test("If you cross the stream without repaying the wizard, you get cursed", () => {
  let oldLocation = "stream";
  let newLocation = "road3";
  let treasureLevel = 1;

  let output = reducer(
    {
      ...newGameState,
      playerLocation: oldLocation,
      gotScoreByCredit: true,
      paidDebt: false,
      treasureLevel: treasureLevel,
      cursed: false,
    },
    {
      action: "movePlayer",
      newLocation: newLocation,
    }
  );
  expect(output.playerLocation).toEqual(newLocation);
  expect(output.reputation).toEqual(newGameState.reputation - 1);
  expect(output.gold).toEqual(newGameState.gold - 100);
  expect(output.treasureLevel).toEqual(treasureLevel);
  expect(output.paidDebt).toBe(false);
  expect(output.cursed).toBe(false);
  expect(output.locationConsequenceText).toMatchInlineSnapshot(`
    "

    Reputation -1

    Gold -100"
  `);

  // The game state doesn't reflect cursed until you leave the location though
  output = reducer(
    {
      ...output,
      playerLocation: newLocation,
    },
    {
      action: "movePlayer",
      newLocation: oldLocation,
    }
  );
  expect(output.playerLocation).toEqual(oldLocation);
  expect(output.reputation).toEqual(newGameState.reputation - 1);
  expect(output.gold).toEqual(newGameState.gold - 100);
  expect(output.treasureLevel).toEqual(treasureLevel);
  expect(output.paidDebt).toBe(false);
  expect(output.cursed).toBe(true);
  expect(output.locationConsequenceText).toMatchInlineSnapshot(`""`);
});

test("If you haven't earned any treasure, it is safe to cross", () => {
  let oldLocation = "stream";
  let newLocation = "road3";
  let treasureLevel = 0;

  let output = reducer(
    {
      ...newGameState,
      playerLocation: oldLocation,
      gotScoreByCredit: true,
      paidDebt: false,
      treasureLevel: treasureLevel,
      cursed: false,
    },
    {
      action: "movePlayer",
      newLocation: newLocation,
    }
  );
  expect(output.playerLocation).toEqual(newLocation);
  expect(output.reputation).toEqual(newGameState.reputation);
  expect(output.gold).toEqual(newGameState.gold);
  expect(output.treasureLevel).toEqual(treasureLevel);
  expect(output.paidDebt).toBe(false);
  expect(output.cursed).toBe(false);
  expect(output.locationConsequenceText).toMatchInlineSnapshot(`""`);

  output = reducer(
    {
      ...output,
      playerLocation: newLocation,
    },
    {
      action: "movePlayer",
      newLocation: oldLocation,
    }
  );
  expect(output.playerLocation).toEqual(oldLocation);
  expect(output.reputation).toEqual(newGameState.reputation);
  expect(output.gold).toEqual(newGameState.gold);
  expect(output.treasureLevel).toEqual(treasureLevel);
  expect(output.paidDebt).toBe(false);
  expect(output.cursed).toBe(false);
  expect(output.locationConsequenceText).toMatchInlineSnapshot(`""`);
});

test("If you repaid the wizard, it is safe to cross", () => {
  let oldLocation = "stream";
  let newLocation = "road3";
  let treasureLevel = 1;

  let output = reducer(
    {
      ...newGameState,
      playerLocation: oldLocation,
      gotScoreByCredit: true,
      paidDebt: true,
      treasureLevel: treasureLevel,
      cursed: false,
    },
    {
      action: "movePlayer",
      newLocation: newLocation,
    }
  );
  expect(output.playerLocation).toEqual(newLocation);
  expect(output.reputation).toEqual(newGameState.reputation);
  expect(output.gold).toEqual(newGameState.gold);
  expect(output.treasureLevel).toEqual(treasureLevel);
  expect(output.paidDebt).toBe(true);
  expect(output.cursed).toBe(false);
  expect(output.locationConsequenceText).toMatchInlineSnapshot(`""`);

  output = reducer(
    {
      ...output,
      playerLocation: newLocation,
    },
    {
      action: "movePlayer",
      newLocation: oldLocation,
    }
  );
  expect(output.playerLocation).toEqual(oldLocation);
  expect(output.reputation).toEqual(newGameState.reputation);
  expect(output.gold).toEqual(newGameState.gold);
  expect(output.treasureLevel).toEqual(treasureLevel);
  expect(output.paidDebt).toBe(true);
  expect(output.cursed).toBe(false);
  expect(output.locationConsequenceText).toMatchInlineSnapshot(`""`);
});

test("If you don't owe the wizard, you can cross safely", () => {
  let oldLocation = "stream";
  let newLocation = "road3";
  let treasureLevel = 1;

  let output = reducer(
    {
      ...newGameState,
      playerLocation: oldLocation,
      gotScoreByCredit: false,
      paidDebt: false,
      treasureLevel: treasureLevel,
      cursed: false,
    },
    {
      action: "movePlayer",
      newLocation: newLocation,
    }
  );
  expect(output.playerLocation).toEqual(newLocation);
  expect(output.reputation).toEqual(newGameState.reputation);
  expect(output.gold).toEqual(newGameState.gold);
  expect(output.treasureLevel).toEqual(treasureLevel);
  expect(output.paidDebt).toBe(false);
  expect(output.cursed).toBe(false);
  expect(output.locationConsequenceText).toMatchInlineSnapshot(`""`);

  output = reducer(
    {
      ...output,
      playerLocation: newLocation,
    },
    {
      action: "movePlayer",
      newLocation: oldLocation,
    }
  );
  expect(output.playerLocation).toEqual(oldLocation);
  expect(output.reputation).toEqual(newGameState.reputation);
  expect(output.gold).toEqual(newGameState.gold);
  expect(output.treasureLevel).toEqual(treasureLevel);
  expect(output.paidDebt).toBe(false);
  expect(output.cursed).toBe(false);
  expect(output.locationConsequenceText).toMatchInlineSnapshot(`""`);
});

test("You won't get cursed twice", () => {
  let oldLocation = "stream";
  let newLocation = "road3";
  let treasureLevel = 1;

  let output = reducer(
    {
      ...newGameState,
      playerLocation: oldLocation,
      gotScoreByCredit: true,
      paidDebt: false,
      treasureLevel: treasureLevel,
      cursed: true,
    },
    {
      action: "movePlayer",
      newLocation: newLocation,
    }
  );
  expect(output.playerLocation).toEqual(newLocation);
  expect(output.reputation).toEqual(newGameState.reputation);
  expect(output.gold).toEqual(newGameState.gold);
  expect(output.treasureLevel).toEqual(treasureLevel);
  expect(output.paidDebt).toBe(false);
  expect(output.cursed).toBe(true);
  expect(output.locationConsequenceText).toMatchInlineSnapshot(`""`);

  output = reducer(
    {
      ...output,
      playerLocation: newLocation,
    },
    {
      action: "movePlayer",
      newLocation: oldLocation,
    }
  );
  expect(output.playerLocation).toEqual(oldLocation);
  expect(output.reputation).toEqual(newGameState.reputation);
  expect(output.gold).toEqual(newGameState.gold);
  expect(output.treasureLevel).toEqual(treasureLevel);
  expect(output.paidDebt).toBe(false);
  expect(output.cursed).toBe(true);
  expect(output.locationConsequenceText).toMatchInlineSnapshot(`""`);
});
