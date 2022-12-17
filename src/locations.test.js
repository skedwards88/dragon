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
