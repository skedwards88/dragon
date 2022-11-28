import { init } from "./init";
import { reducer } from "./reducer";

const newGameState = init();

test("New game resets state", () => {
  const output = reducer({ madeUpKey: true }, { action: "newGame" });

  expect(output).toMatchInlineSnapshot(`
    {
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
  const output = reducer(
    { ...newGameState, playerLocation: "smithy" },
    {
      action: "takeItem",
      item: "sword",
    }
  );

  expect(output.reputation).toMatchInlineSnapshot(`9`);
  expect(output.swordCost).toMatchInlineSnapshot(`50`);
  expect(output.itemLocations.inventory).toMatchInlineSnapshot(`[]`);
  expect(output.itemLocations.smithy).toMatchInlineSnapshot(`
    [
      "sword",
    ]
  `);
  expect(output.consequenceText).toMatchInlineSnapshot(`
    "You grab the sword and place it in your bag. "Hey! Are you stealing my sword?" The blacksmith grabs the sword from you and returns it to the table. 

    Reputation -1"
  `);
  expect(output).toMatchInlineSnapshot(`
    {
      "babyCough": false,
      "clothesPoopy": false,
      "consequenceText": "You grab the sword and place it in your bag. "Hey! Are you stealing my sword?" The blacksmith grabs the sword from you and returns it to the table. 

    Reputation -1",
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
      "playerLocation": "smithy",
      "playerMasked": false,
      "playerPoisoned": false,
      "receivedBabyReward": false,
      "reputation": 9,
      "savedBaby": false,
      "singeCount": 0,
      "squirrelDead": false,
      "swordCost": 50,
      "timeInCave": 0,
      "treasureAmount": 300,
      "treasureLevel": 0,
    }
  `);

  const output2 = reducer(output, {
    action: "takeItem",
    item: "sword",
  });

  expect(output2.reputation).toMatchInlineSnapshot(`8`);
  expect(output2.swordCost).toMatchInlineSnapshot(`50`);
  expect(output2.itemLocations.inventory).toMatchInlineSnapshot(`[]`);
  expect(output2.itemLocations.smithy).toMatchInlineSnapshot(`
    [
      "sword",
    ]
  `);
  expect(output2.consequenceText).toMatchInlineSnapshot(`
    "You grab the sword and place it in your bag. "Hey! Are you stealing my sword?" The blacksmith grabs the sword from you and returns it to the table. 

    Reputation -1"
  `);
  expect(output2).toMatchInlineSnapshot(`
    {
      "babyCough": false,
      "clothesPoopy": false,
      "consequenceText": "You grab the sword and place it in your bag. "Hey! Are you stealing my sword?" The blacksmith grabs the sword from you and returns it to the table. 

    Reputation -1",
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
      "playerLocation": "smithy",
      "playerMasked": false,
      "playerPoisoned": false,
      "receivedBabyReward": false,
      "reputation": 8,
      "savedBaby": false,
      "singeCount": 0,
      "squirrelDead": false,
      "swordCost": 50,
      "timeInCave": 0,
      "treasureAmount": 300,
      "treasureLevel": 0,
    }
  `);
});

test("Playing the lute for the youth will boost reputation only once", () => {
  const output = reducer(
    {
      ...newGameState,
      playerLocation: "youth",
    },
    {
      action: "useItem",
      item: "lute",
    }
  );

  expect(output.reputation).toMatchInlineSnapshot(`11`);
  expect(output.playedForYouth).toMatchInlineSnapshot(`true`);
  expect(output.itemLocations.inventory).toMatchInlineSnapshot(`[]`);
  expect(output.itemLocations.youth).toMatchInlineSnapshot(`[]`);
  expect(output.consequenceText).toMatchInlineSnapshot(`
    "You play a song for the crying youth. The music seems to cheer the youth up. 

    Reputation +1"
  `);

  const output2 = reducer(output, {
    action: "useItem",
    item: "lute",
  });

  expect(output2.reputation).toMatchInlineSnapshot(`11`);
  expect(output2.playedForYouth).toMatchInlineSnapshot(`true`);
  expect(output2.itemLocations.inventory).toMatchInlineSnapshot(`[]`);
  expect(output2.itemLocations.youth).toMatchInlineSnapshot(`[]`);
  expect(output2.consequenceText).toMatchInlineSnapshot(
    `"They appreciate the music, but don't seem keen to listen all day. "`
  );
});

test("Removing your clothes in the presence of a person (besides the wizard) will lose reputation", () => {
  let output = reducer(
    {
      ...newGameState,
      playerLocation: "youth",
      naked: false,
      itemLocations: { ...newGameState.itemLocations, inventory: ["clothes"] },
    },
    {
      action: "useItem",
      item: "clothes",
    }
  );

  expect(output.reputation).toMatchInlineSnapshot(`9`);
  expect(output.naked).toMatchInlineSnapshot(`true`);
  expect(output.itemLocations.inventory).toMatchInlineSnapshot(`
    [
      "clothes",
    ]
  `);
  expect(output.itemLocations.youth).toMatchInlineSnapshot(`[]`);
  expect(output.consequenceText).toMatchInlineSnapshot(`
    "You strip down. The youth eyes you suspiciously.

    Reputation -1"
  `);

  output = reducer(
    {
      ...newGameState,
      playerLocation: "blacksmith",
      naked: false,
      itemLocations: { ...newGameState.itemLocations, inventory: ["clothes"] },
    },
    {
      action: "useItem",
      item: "clothes",
    }
  );

  expect(output.reputation).toMatchInlineSnapshot(`9`);
  expect(output.naked).toMatchInlineSnapshot(`true`);
  expect(output.itemLocations.inventory).toMatchInlineSnapshot(`
    [
      "clothes",
    ]
  `);
  expect(output.itemLocations.blacksmith).toMatchInlineSnapshot(`[]`);
  expect(output.consequenceText).toMatchInlineSnapshot(`
    "You strip down. The blacksmith eyes you suspiciously.

    Reputation -1"
  `);

  output = reducer(
    {
      ...newGameState,
      playerLocation: "inn",
      naked: false,
      itemLocations: { ...newGameState.itemLocations, inventory: ["clothes"] },
    },
    {
      action: "useItem",
      item: "clothes",
    }
  );

  expect(output.reputation).toMatchInlineSnapshot(`9`);
  expect(output.naked).toMatchInlineSnapshot(`true`);
  expect(output.itemLocations.inventory).toMatchInlineSnapshot(`
    [
      "clothes",
    ]
  `);
  expect(output.itemLocations.inn).toMatchInlineSnapshot(`
    [
      "apple",
    ]
  `);
  expect(output.consequenceText).toMatchInlineSnapshot(`
    "You strip down. The innkeeper eyes you suspiciously.

    Reputation -1"
  `);

  output = reducer(
    {
      ...newGameState,
      playerLocation: "wizard",
      naked: false,
      itemLocations: { ...newGameState.itemLocations, inventory: ["clothes"] },
    },
    {
      action: "useItem",
      item: "clothes",
    }
  );

  expect(output.reputation).toMatchInlineSnapshot(`10`);
  expect(output.naked).toMatchInlineSnapshot(`true`);
  expect(output.itemLocations.inventory).toMatchInlineSnapshot(`
    [
      "clothes",
    ]
  `);
  expect(output.itemLocations.wizard).toMatchInlineSnapshot(`
    [
      "score",
    ]
  `);
  expect(output.consequenceText).toMatchInlineSnapshot(`"You strip down. "`);

  output = reducer(
    {
      ...newGameState,
      playerLocation: "fountain",
      naked: false,
      itemLocations: { ...newGameState.itemLocations, inventory: ["clothes"] },
    },
    {
      action: "useItem",
      item: "clothes",
    }
  );

  expect(output.reputation).toMatchInlineSnapshot(`10`);
  expect(output.naked).toMatchInlineSnapshot(`true`);
  expect(output.itemLocations.inventory).toMatchInlineSnapshot(`
    [
      "clothes",
    ]
  `);
  expect(output.itemLocations.fountain).toMatchInlineSnapshot(`[]`);
  expect(output.consequenceText).toMatchInlineSnapshot(`"You strip down. "`);
});

test("Dropping your clothes in the presence of a person (besides the wizard) will lose reputation", () => {
  let output = reducer(
    {
      ...newGameState,
      playerLocation: "youth",
      naked: false,
      itemLocations: { ...newGameState.itemLocations, inventory: ["clothes"] },
    },
    {
      action: "dropItem",
      item: "clothes",
    }
  );

  expect(output.reputation).toMatchInlineSnapshot(`9`);
  expect(output.naked).toMatchInlineSnapshot(`true`);
  expect(output.itemLocations.inventory).toMatchInlineSnapshot(`[]`);
  expect(output.itemLocations.youth).toMatchInlineSnapshot(`
    [
      "clothes",
    ]
  `);
  expect(output.consequenceText).toMatchInlineSnapshot(`
    "You strip down and drop your clothes by the youth. The youth eyes you suspiciously.

    Reputation -1"
  `);

  output = reducer(
    {
      ...newGameState,
      playerLocation: "blacksmith",
      naked: false,
      itemLocations: { ...newGameState.itemLocations, inventory: ["clothes"] },
    },
    {
      action: "dropItem",
      item: "clothes",
    }
  );

  expect(output.reputation).toMatchInlineSnapshot(`9`);
  expect(output.naked).toMatchInlineSnapshot(`true`);
  expect(output.itemLocations.inventory).toMatchInlineSnapshot(`[]`);
  expect(output.itemLocations.blacksmith).toMatchInlineSnapshot(`
    [
      "clothes",
    ]
  `);
  expect(output.consequenceText).toMatchInlineSnapshot(`
    "You strip down and drop your clothes by the blacksmith. The blacksmith eyes you suspiciously.

    Reputation -1"
  `);

  output = reducer(
    {
      ...newGameState,
      playerLocation: "inn",
      naked: false,
      itemLocations: { ...newGameState.itemLocations, inventory: ["clothes"] },
    },
    {
      action: "dropItem",
      item: "clothes",
    }
  );

  expect(output.reputation).toMatchInlineSnapshot(`9`);
  expect(output.naked).toMatchInlineSnapshot(`true`);
  expect(output.itemLocations.inventory).toMatchInlineSnapshot(`[]`);
  expect(output.itemLocations.inn).toMatchInlineSnapshot(`
    [
      "apple",
      "clothes",
    ]
  `);
  expect(output.consequenceText).toMatchInlineSnapshot(`
    "You strip down and drop your clothes in the inn. The innkeeper eyes you suspiciously.

    Reputation -1"
  `);

  output = reducer(
    {
      ...newGameState,
      playerLocation: "wizard",
      naked: false,
      itemLocations: { ...newGameState.itemLocations, inventory: ["clothes"] },
    },
    {
      action: "dropItem",
      item: "clothes",
    }
  );

  expect(output.reputation).toMatchInlineSnapshot(`10`);
  expect(output.naked).toMatchInlineSnapshot(`true`);
  expect(output.itemLocations.inventory).toMatchInlineSnapshot(`[]`);
  expect(output.itemLocations.wizard).toMatchInlineSnapshot(`
    [
      "score",
      "clothes",
    ]
  `);
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You strip down and drop your clothes by the wizard. "`
  );

  output = reducer(
    {
      ...newGameState,
      playerLocation: "fountain",
      naked: false,
      itemLocations: { ...newGameState.itemLocations, inventory: ["clothes"] },
    },
    {
      action: "dropItem",
      item: "clothes",
    }
  );

  expect(output.reputation).toMatchInlineSnapshot(`10`);
  expect(output.naked).toMatchInlineSnapshot(`true`);
  expect(output.itemLocations.inventory).toMatchInlineSnapshot(`[]`);
  expect(output.itemLocations.fountain).toMatchInlineSnapshot(`
    [
      "clothes",
    ]
  `);
  expect(output.consequenceText).toMatchInlineSnapshot(
    `"You strip down and drop your clothes in the fountain. Your clothes look much cleaner now. "`
  );
});
