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
    `"Through the window, you see flames and smoke coming from a nearby mansion. A crowd has gathered in front of the mansion. "`
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
    `"Through the window, you see the charred remains of a nearby mansion. "`
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
