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
