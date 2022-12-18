import { locations } from "./locations";
import { init } from "./init";

const newGameState = init();

test("Inn description, apple not taken, not clothed", () => {
  const location = "inn";
  const gameState = {
    ...newGameState,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You enter what appears to be the common room of an inn. A complementary apple rests on the table. 

    The inn keeper laughs, "Haven't you heard of clothes?!""
  `);
});

test("Inn description, apple not taken, clothed", () => {
  const location = "inn";
  const gameState = {
    ...newGameState,
    naked: false,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You enter what appears to be the common room of an inn. A complementary apple rests on the table. "`
  );
});

test("Inn description, apple not taken but partially eaten, clothed", () => {
  const location = "inn";
  const gameState = {
    ...newGameState,
    naked: false,
    appleBitesRemaining: 4,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You enter what appears to be the common room of an inn. "`
  );
});

test("Inn description, apple taken, not clothed", () => {
  const location = "inn";
  const gameState = {
    ...newGameState,
    itemLocations: { ...newGameState.itemLocations, inn: ["lute"] },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You enter what appears to be the common room of an inn. 

    The inn keeper laughs, "Haven't you heard of clothes?!""
  `);
});

test("Inn description, apple not taken, clothed", () => {
  const location = "inn";
  const gameState = {
    ...newGameState,
    naked: false,
    itemLocations: { ...newGameState.itemLocations, inn: ["lute"] },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You enter what appears to be the common room of an inn. "`
  );
});

test("Mirror description, clothed", () => {
  const location = "mirror";
  const gameState = {
    ...newGameState,
    naked: false,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You are quite good looking, if you say so yourself. "`
  );
});

test("Mirror description, not clothed", () => {
  const location = "mirror";
  const gameState = {
    ...newGameState,
    naked: true,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`"You're naked!"`);
});

test("Wardrobe description, clothes not taken", () => {
  const location = "wardrobe";
  const gameState = {
    ...newGameState,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"Inside the wardrobe, there is a mirror and a set of clothes. "`
  );
});

test("Wardrobe description, clothes taken", () => {
  const location = "wardrobe";
  const gameState = {
    ...newGameState,
    itemLocations: { ...newGameState.itemLocations, wardrobe: ["lute"] },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"Inside the wardrobe, there is a mirror. "`
  );
});

test("Inn window description, manor on fire", () => {
  const location = "window";
  const gameState = {
    ...newGameState,
    manorFire: true,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"Through the window, you see flames and smoke coming from a nearby manor. A crowd has gathered in front of the manor. "`
  );
});

test("Inn window description, manor not on fire", () => {
  const location = "window";
  const gameState = {
    ...newGameState,
    manorFire: false,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"Through the window, you see the charred remains of a nearby manor. "`
  );
});

test("Room description, lute not taken", () => {
  const location = "room";
  const gameState = {
    ...newGameState,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You are in a bedroom with a window, wardrobe, and door. A lute leans against the bed. You smell smoke and hear screams in the distance. "`
  );
});

test("Room description, lute taken", () => {
  const location = "room";
  const gameState = {
    ...newGameState,
    itemLocations: { ...newGameState.itemLocations, room: [] },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You are in a bedroom with a window, wardrobe, and door. You smell smoke and hear screams in the distance. "`
  );
});

test("Room description, lute not taken, no fire", () => {
  const location = "room";
  const gameState = {
    ...newGameState,
    manorFire: false,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You are in a bedroom with a window, wardrobe, and door. A lute leans against the bed. "`
  );
});

test("Room description, lute taken", () => {
  const location = "room";
  const gameState = {
    ...newGameState,
    manorFire: false,
    itemLocations: { ...newGameState.itemLocations, room: [] },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You are in a bedroom with a window, wardrobe, and door. "`
  );
});

test("Courtyard description, fire, first time", () => {
  const location = "courtyard";
  const gameState = {
    ...newGameState,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You are in a small courtyard that connects to the inn. You can see a fountain and hear sounds of a blacksmith shop. Beyond the fountain, you see flames and smoke. 

    A youth runs from the fire, crying as they flee. They drop a handkerchief in their distress. "
  `);
});

test("Courtyard description, fire, not first time", () => {
  const location = "courtyard";
  const gameState = {
    ...newGameState,
    firstCourtyardEntry: false,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You are in a small courtyard that connects to the inn. You can see a fountain and hear sounds of a blacksmith shop. Beyond the fountain, you see flames and smoke. "`
  );
});

test("Courtyard description, no fire, first time", () => {
  const location = "courtyard";
  const gameState = {
    ...newGameState,
    manorFire: false,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You are in a small courtyard that connects to the inn. You can see a fountain and hear sounds of a blacksmith shop. 

    A youth runs from the fire, crying as they flee. They drop a handkerchief in their distress. "
  `);
});

test("Courtyard description, no fire, not first time", () => {
  const location = "courtyard";
  const gameState = {
    ...newGameState,
    firstCourtyardEntry: false,
    manorFire: false,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You are in a small courtyard that connects to the inn. You can see a fountain and hear sounds of a blacksmith shop. "`
  );
});

test("Nursery description, fire, baby absent", () => {
  const location = "nursery";
  const gameState = {
    ...newGameState,
    itemLocations: { ...newGameState.itemLocations, nursery: [] },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You stand in a nursery with an empty crib. The fire continues to burn, pouring smoke into the room. "`
  );
});

test("Nursery description, fire, baby present", () => {
  const location = "nursery";
  const gameState = {
    ...newGameState,
    itemLocations: { ...newGameState.itemLocations, nursery: ["baby"] },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You stand in a nursery. You see a baby wailing in the crib under an open window. The open window must be the only thing keeping the baby alive in this smoke. "`
  );
});

test("Nursery description, no fire", () => {
  const location = "nursery";
  const gameState = {
    ...newGameState,
    manorFire: false,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You stand in the charred remains of a nursery. "`
  );
});

test("Nursery window description, no fire", () => {
  const location = "nurseryWindow";
  const gameState = {
    ...newGameState,
    manorFire: false,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You see the charred remains of the manor below you. "`
  );
});

test("Nursery window description, fire", () => {
  const location = "nurseryWindow";
  const gameState = {
    ...newGameState,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"Below the window, you see the gathered crowd. "`
  );
});

test("Smithy description, sword present", () => {
  const location = "smithy";
  const gameState = {
    ...newGameState,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You stand in front of a blacksmith shop. From the shop, you can see the city gate and the inn courtyard. The blacksmith is working in front of the shop. In front of the shop, you see a sword gleaming as if someone was recently polishing it. "`
  );
});

test("Smithy description, sword absent", () => {
  const location = "smithy";
  const gameState = {
    ...newGameState,
    itemLocations: { ...newGameState.itemLocations, smithy: [] },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You stand in front of a blacksmith shop. From the shop, you can see the city gate and the inn courtyard. The blacksmith is working in front of the shop. "`
  );
});

test("Fountain description, fire, not saved baby, naked", () => {
  const location = "fountain";
  const gameState = {
    ...newGameState,
    manorFire: true,
    naked: true,
    savedBaby: false,
    receivedBabyReward: false,
    babyCough: true,
    playerCough: true,
    itemLocations: {
      ...newGameState.itemLocations,
      nursery: ["baby"],
      manor: ["baby"],
    },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You stand at the edge of a fountain. In the center is a statue of a dragon and cowering people. 

    Beyond the fountain, you see a manor on fire. A crowd surrounds the fountain, surveying the fire. You hear a voice sobbing, "My baby! My baby is trapped inside." 

    In the commotion, the crowd doesn't notice your lack of clothes, though surely this crowd will not be so understanding under other circumstances."
  `);
});

test("Fountain description, fire, not saved baby, not naked", () => {
  const location = "fountain";
  const gameState = {
    ...newGameState,
    manorFire: true,
    naked: false,
    savedBaby: false,
    receivedBabyReward: false,
    babyCough: true,
    playerCough: true,
    itemLocations: {
      ...newGameState.itemLocations,
      nursery: ["baby"],
      manor: ["baby"],
    },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You stand at the edge of a fountain. In the center is a statue of a dragon and cowering people. 

    Beyond the fountain, you see a manor on fire. A crowd surrounds the fountain, surveying the fire. You hear a voice sobbing, "My baby! My baby is trapped inside." "
  `);
});

test("Fountain description, no fire", () => {
  const location = "fountain";
  const gameState = {
    ...newGameState,
    manorFire: false,
    naked: false,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You stand at the edge of a fountain. In the center is a statue of a dragon and cowering people. 

    Beyond the fountain, the manor is a framework of charred wood. "
  `);
});

test.each([
  { naked: true, babyCough: true, playerCough: true },
  { naked: false, babyCough: true, playerCough: true },
  { naked: true, babyCough: false, playerCough: true },
  { naked: true, babyCough: true, playerCough: false },
  { naked: true, babyCough: false, playerCough: false },
  { naked: false, babyCough: false, playerCough: true },
  { naked: false, babyCough: true, playerCough: false },
  { naked: false, babyCough: false, playerCough: false },
])(
  "Fountain description: naked $naked, babyCough $babyCough, playerCough $playerCough",
  ({ naked, babyCough, playerCough }) => {
    const location = "fountain";
    const gameState = {
      ...newGameState,
      manorFire: true,
      naked: naked,
      savedBaby: true,
      receivedBabyReward: false,
      babyCough: babyCough,
      playerCough: playerCough,
    };
    const description = locations[location].getDescription(gameState);
    expect(description).toMatchSnapshot();
  }
);

//
// manor
// blacksmith
// pasture
// gate
// youth
// road1
// road2
// road3
// stream
// clearing
// squirrel
// wizard
// cliff
// caveEntrance
// defecatory
// puddle
// crevice
// dung
// lair
