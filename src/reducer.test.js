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
