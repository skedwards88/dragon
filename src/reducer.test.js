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

  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You take a bite from the apple, feeling refreshed. "`
  );
});

test("Dropping or giving the apple will give you the horse if the horse is present and if the apple is not fully eaten. The apple will go out of game.", () => {
  const item = "apple";
  let location = "pasture";

  // Drop uneaten apple
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
  expect(output.itemLocations["outOfPlay"]).toEqual(expect.arrayContaining([item]));
  expect(output.itemLocations.inventory).toEqual(
    expect.arrayContaining(["horse"])
  );
  expect(output.itemLocations[location]).toEqual(
    expect.not.arrayContaining(["horse"])
  );
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"This horse seems very interested in food. The horse walks over to eat the apple that you dropped. While he is preoccupied, you grab the reins. You now have a horse."`
  );

  // Give uneaten apple
  output = reducer(
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
  expect(output.itemLocations["outOfPlay"]).toEqual(expect.arrayContaining([item]));
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
