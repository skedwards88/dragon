import { locations, dragonDescription } from "./locations";
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

test("Lawn description, fire, not saved baby, naked", () => {
  const location = "lawn";
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
      entryway: ["baby"],
    },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You stand in front of a burning manor. A crowd surrounds the manor, surveying the fire. You hear a voice sobbing, "My baby! My baby is trapped inside." 

    In the commotion, the crowd doesn't notice your lack of clothes, though surely this crowd will not be so understanding under other circumstances."
  `);
});

test("lawn description, fire, not saved baby, not naked", () => {
  const location = "lawn";
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
      entryway: ["baby"],
    },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You stand in front of a burning manor. A crowd surrounds the manor, surveying the fire. You hear a voice sobbing, "My baby! My baby is trapped inside." "`
  );
});

test("lawn description, no fire", () => {
  const location = "lawn";
  const gameState = {
    ...newGameState,
    manorFire: false,
    naked: false,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You stand in front of a framework of charred wood. "`
  );
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
  "lawn description: naked $naked, babyCough $babyCough, playerCough $playerCough",
  ({ naked, babyCough, playerCough }) => {
    const location = "lawn";
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

test("fountain description, fire", () => {
  const location = "fountain";
  const gameState = {
    ...newGameState,
    manorFire: true,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You stand at the edge of a fountain. In the center is a statue of a dragon and cowering people. 

    Beyond the fountain, you see a burning manor surrounded by a crowd. "
  `);
});

test("fountain description, no fire", () => {
  const location = "fountain";
  const gameState = {
    ...newGameState,
    manorFire: false,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You stand at the edge of a fountain. In the center is a statue of a dragon and cowering people. 

    Beyond the fountain, the manor is a framework of charred wood. "
  `);
});

test("entryway description, no fire", () => {
  const location = "entryway";
  const gameState = {
    ...newGameState,
    manorFire: false,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You stand in the charred remains of the manor. The stairs to the nursery are blocked by rubble. "`
  );
});

test("entryway description, fire, baby in nursery, not masked", () => {
  const location = "entryway";
  const gameState = {
    ...newGameState,
    manorFire: true,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You stand in the entrance of the burning manor. You hear a baby crying upstairs. 

    Your throat burns from the smoke and heat. You can't breath this air. You will surely develop a nasty cough if you go further into the manor without protection. "
  `);
});

test("entryway description, fire, baby in nursery, masked not damp", () => {
  const location = "entryway";
  const gameState = {
    ...newGameState,
    manorFire: true,
    playerMasked: true,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You stand in the entrance of the burning manor. You hear a baby crying upstairs. 

    Your throat burns from the smoke and heat. You can't breath this air. You will surely develop a nasty cough if you go further into the manor without protection. 

    On its own, the handkerchief does little to block the smoke. "
  `);
});

test("entryway description, fire, baby in nursery, damp not masked", () => {
  const location = "entryway";
  const gameState = {
    ...newGameState,
    manorFire: true,
    handkerchiefDamp: true,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You stand in the entrance of the burning manor. You hear a baby crying upstairs. 

    Your throat burns from the smoke and heat. You can't breath this air. You will surely develop a nasty cough if you go further into the manor without protection. "
  `);
});

test("entryway description, fire, baby in nursery, damp and masked", () => {
  const location = "entryway";
  const gameState = {
    ...newGameState,
    manorFire: true,
    handkerchiefDamp: true,
    playerMasked: true,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You stand in the entrance of the burning manor. You hear a baby crying upstairs. 

    Although the smoke is thick, the damp handkerchief over your mouth helps you breathe. "
  `);
});

test("entryway description, fire, baby not in nursery, not masked", () => {
  const location = "entryway";
  const gameState = {
    ...newGameState,
    manorFire: true,
    itemLocations: { ...newGameState.itemLocations, nursery: [] },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You stand in the entrance of the burning manor. 

    Your throat burns from the smoke and heat. You can't breath this air. You will surely develop a nasty cough if you go further into the manor without protection. "
  `);
});

test("entryway description, fire, baby not in nursery, masked not damp", () => {
  const location = "entryway";
  const gameState = {
    ...newGameState,
    manorFire: true,
    playerMasked: true,
    itemLocations: { ...newGameState.itemLocations, nursery: [] },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You stand in the entrance of the burning manor. 

    Your throat burns from the smoke and heat. You can't breath this air. You will surely develop a nasty cough if you go further into the manor without protection. 

    On its own, the handkerchief does little to block the smoke. "
  `);
});

test("entryway description, fire, baby not in nursery, damp not masked", () => {
  const location = "entryway";
  const gameState = {
    ...newGameState,
    manorFire: true,
    handkerchiefDamp: true,
    itemLocations: { ...newGameState.itemLocations, nursery: [] },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You stand in the entrance of the burning manor. 

    Your throat burns from the smoke and heat. You can't breath this air. You will surely develop a nasty cough if you go further into the manor without protection. "
  `);
});

test("entryway description, fire, baby not in nursery, damp and masked", () => {
  const location = "entryway";
  const gameState = {
    ...newGameState,
    manorFire: true,
    handkerchiefDamp: true,
    playerMasked: true,
    itemLocations: { ...newGameState.itemLocations, nursery: [] },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You stand in the entrance of the burning manor. 

    Although the smoke is thick, the damp handkerchief over your mouth helps you breathe. "
  `);
});

test("nursery description, fire, baby not in nursery", () => {
  const location = "nursery";
  const gameState = {
    ...newGameState,
    manorFire: true,
    itemLocations: { ...newGameState.itemLocations, nursery: [] },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You stand in a nursery with an empty crib. The fire continues to burn, pouring smoke into the room. "`
  );
});

test("nursery description, fire, baby in nursery", () => {
  const location = "nursery";
  const gameState = {
    ...newGameState,
    manorFire: true,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You stand in a nursery. You see a baby wailing in the crib under an open window. The open window must be the only thing keeping the baby alive in this smoke. "`
  );
});

test("nursery description, no fire", () => {
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

test("blacksmith description, sword absent, clothed, not masked", () => {
  const location = "blacksmith";
  const gameState = {
    ...newGameState,
    naked: false,
    itemLocations: { ...newGameState.itemLocations, smithy: [] },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"The blacksmith looks up as you approach. "`
  );
});

test("blacksmith description, sword absent, not clothed, not masked", () => {
  const location = "blacksmith";
  const gameState = {
    ...newGameState,
    itemLocations: { ...newGameState.itemLocations, smithy: [] },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"The blacksmith looks up as you approach. "No clothes? You best stay away from the furnace lest you burn something important." "`
  );
});

test("blacksmith description, sword absent, clothed, masked", () => {
  const location = "blacksmith";
  const gameState = {
    ...newGameState,
    naked: false,
    playerMasked: true,
    itemLocations: { ...newGameState.itemLocations, smithy: [] },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"The blacksmith looks up as you approach. They eye the handkerchief tied over your face warily, but don't comment on it."`
  );
});

test("blacksmith description, sword absent, not clothed, not masked", () => {
  const location = "blacksmith";
  const gameState = {
    ...newGameState,
    naked: true,
    playerMasked: true,
    itemLocations: { ...newGameState.itemLocations, smithy: [] },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"The blacksmith looks up as you approach. "No clothes? You best stay away from the furnace lest you burn something important." They eye the handkerchief tied over your face warily, but don't comment on it."`
  );
});

test("blacksmith description, sword present but already bought, clothed, not masked", () => {
  const location = "blacksmith";
  const gameState = {
    ...newGameState,
    naked: false,
    ownSword: true,
    itemLocations: { ...newGameState.itemLocations, smithy: ["sword"] },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"The blacksmith looks up as you approach. "`
  );
});

test("blacksmith description, sword present but already bought, not clothed, not masked", () => {
  const location = "blacksmith";
  const gameState = {
    ...newGameState,
    ownSword: true,
    itemLocations: { ...newGameState.itemLocations, smithy: ["sword"] },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"The blacksmith looks up as you approach. "No clothes? You best stay away from the furnace lest you burn something important." "`
  );
});

test("blacksmith description, sword present but already bought, clothed, masked", () => {
  const location = "blacksmith";
  const gameState = {
    ...newGameState,
    naked: false,
    playerMasked: true,
    ownSword: true,
    itemLocations: { ...newGameState.itemLocations, smithy: ["sword"] },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"The blacksmith looks up as you approach. They eye the handkerchief tied over your face warily, but don't comment on it."`
  );
});

test("blacksmith description, sword present but already bought, not clothed, not masked", () => {
  const location = "blacksmith";
  const gameState = {
    ...newGameState,
    naked: true,
    playerMasked: true,
    ownSword: true,
    itemLocations: { ...newGameState.itemLocations, smithy: ["sword"] },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"The blacksmith looks up as you approach. "No clothes? You best stay away from the furnace lest you burn something important." They eye the handkerchief tied over your face warily, but don't comment on it."`
  );
});

test("blacksmith description, sword present, clothed, not masked", () => {
  const location = "blacksmith";
  const gameState = {
    ...newGameState,
    naked: false,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "The blacksmith looks up as you approach. 

    "Are you interested in buying that sword?" they ask. "It costs 40 gold. " "
  `);
});

test("blacksmith description, sword present, not clothed, not masked", () => {
  const location = "blacksmith";
  const gameState = {
    ...newGameState,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "The blacksmith looks up as you approach. "No clothes? You best stay away from the furnace lest you burn something important." 

    "Are you interested in buying that sword?" they ask. "It costs 40 gold. " "
  `);
});

test("blacksmith description, sword present, clothed, masked", () => {
  const location = "blacksmith";
  const gameState = {
    ...newGameState,
    naked: false,
    playerMasked: true,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "The blacksmith looks up as you approach. They eye the handkerchief tied over your face warily, but don't comment on it.

    "Are you interested in buying that sword?" they ask. "It costs 40 gold. " "
  `);
});

test("blacksmith description, sword present, not clothed, not masked", () => {
  const location = "blacksmith";
  const gameState = {
    ...newGameState,
    naked: true,
    playerMasked: true,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "The blacksmith looks up as you approach. "No clothes? You best stay away from the furnace lest you burn something important." They eye the handkerchief tied over your face warily, but don't comment on it.

    "Are you interested in buying that sword?" they ask. "It costs 40 gold. " "
  `);
});

test("blacksmith description, sword present, not clothed, not masked, upped cost", () => {
  const location = "blacksmith";
  const gameState = {
    ...newGameState,
    naked: true,
    playerMasked: true,
    swordCost: 200,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "The blacksmith looks up as you approach. "No clothes? You best stay away from the furnace lest you burn something important." They eye the handkerchief tied over your face warily, but don't comment on it.

    "Are you interested in buying that sword?" they ask. "It costs 200 gold. " "
  `);
});

test("pasture description, horse present, not dead, not tethered", () => {
  const location = "pasture";
  const gameState = {
    ...newGameState,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You are standing in a wide field just outside the city gates. 

    A horse is grazing in the field. A sign reads: "Free horse (if you can catch it)." "
  `);
});

test("pasture description, horse absent, not dead, not tethered", () => {
  const location = "pasture";
  const gameState = {
    ...newGameState,
    itemLocations: { ...newGameState.itemLocations, pasture: [] },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You are standing in a wide field just outside the city gates. "`
  );
});

test("pasture description, horse present, dead, not tethered", () => {
  const location = "pasture";
  const gameState = {
    ...newGameState,
    horseDead: true,
    itemLocations: { ...newGameState.itemLocations, pasture: ["horse"] },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You are standing in a wide field just outside the city gates. "`
  );
});

test("pasture description, horse present, not dead, tethered", () => {
  const location = "pasture";
  const gameState = {
    ...newGameState,
    horseTethered: true,
    itemLocations: { ...newGameState.itemLocations, pasture: ["horse"] },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You are standing in a wide field just outside the city gates. "`
  );
});

test("pasture description, horse present, dead, tethered", () => {
  const location = "pasture";
  const gameState = {
    ...newGameState,
    horseDead: true,
    horseTethered: true,
    itemLocations: { ...newGameState.itemLocations, pasture: ["horse"] },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You are standing in a wide field just outside the city gates. "`
  );
});

test("pasture name/sentient, horse present, not dead, not tethered", () => {
  const location = "pasture";
  const gameState = {
    ...newGameState,
  };
  const name = locations[location].getDisplayName(gameState);
  expect(name).toMatchInlineSnapshot(`"horse"`);
  const sentient = locations[location].getSentient(gameState);
  expect(sentient).toMatchInlineSnapshot(`true`);
});

test("pasture name/sentient, horse absent, not dead, not tethered", () => {
  const location = "pasture";
  const gameState = {
    ...newGameState,
    itemLocations: { ...newGameState.itemLocations, pasture: [] },
  };
  const name = locations[location].getDisplayName(gameState);
  expect(name).toMatchInlineSnapshot(`"pasture"`);
  const sentient = locations[location].getSentient(gameState);
  expect(sentient).toMatchInlineSnapshot(`false`);
});

test("pasture name/sentient, horse present, dead, not tethered", () => {
  const location = "pasture";
  const gameState = {
    ...newGameState,
    horseDead: true,
    itemLocations: { ...newGameState.itemLocations, pasture: ["horse"] },
  };
  const name = locations[location].getDisplayName(gameState);
  expect(name).toMatchInlineSnapshot(`"pasture"`);
  const sentient = locations[location].getSentient(gameState);
  expect(sentient).toMatchInlineSnapshot(`false`);
});

test("pasture name/sentient, horse present, not dead, tethered", () => {
  const location = "pasture";
  const gameState = {
    ...newGameState,
    horseTethered: true,
    itemLocations: { ...newGameState.itemLocations, pasture: ["horse"] },
  };
  const name = locations[location].getDisplayName(gameState);
  expect(name).toMatchInlineSnapshot(`"horse"`);
  const sentient = locations[location].getSentient(gameState);
  expect(sentient).toMatchInlineSnapshot(`true`);
});

test("pasture name/sentient, horse present, dead, tethered", () => {
  const location = "pasture";
  const gameState = {
    ...newGameState,
    horseDead: true,
    horseTethered: true,
    itemLocations: { ...newGameState.itemLocations, pasture: ["horse"] },
  };
  const name = locations[location].getDisplayName(gameState);
  expect(name).toMatchInlineSnapshot(`"pasture"`);
  const sentient = locations[location].getSentient(gameState);
  expect(sentient).toMatchInlineSnapshot(`false`);
});

test("gate description, not played for youth", () => {
  const location = "gate";
  const gameState = {
    ...newGameState,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You are standing at the city gate. You see a pasture and a road leading up a mountain. 

    The youth that you saw earlier stands at the gate, crying. "
  `);
});

test("gate description, played for youth", () => {
  const location = "gate";
  const gameState = {
    ...newGameState,
    playedForYouth: true,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You are standing at the city gate. You see a pasture and a road leading up a mountain. 

    The youth that you saw earlier stands at the gate. "
  `);
});

test("youth description, played for youth, clothed", () => {
  const location = "youth";
  const gameState = {
    ...newGameState,
    playedForYouth: true,
    naked: false,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"The youth stands by the city gates. "`
  );
});

test("youth description, played for youth, not clothed", () => {
  const location = "youth";
  const gameState = {
    ...newGameState,
    playedForYouth: true,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"The youth stands by the city gates. "Ack! Where are your clothes?!""`
  );
});

test("youth description, not played for youth, clothed", () => {
  const location = "youth";
  const gameState = {
    ...newGameState,
    naked: false,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"The youth stands by the city gates crying. "`
  );
});

test("youth description, not played for youth, not clothed", () => {
  const location = "youth";
  const gameState = {
    ...newGameState,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"The youth stands by the city gates crying. "Ack! Where are your clothes?!""`
  );
});

test("road1 description, not mounted", () => {
  const location = "road1";
  const gameState = {
    ...newGameState,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You stand at the end of a long road that stretches from the city gate to mountains. "`
  );
  const connections = locations[location].getConnections(gameState);
  expect(connections.N).toMatchInlineSnapshot(`"road2"`);
  expect(connections.S).toMatchInlineSnapshot(`"gate"`);
});

test("road1 description, mounted", () => {
  const location = "road1";
  const gameState = {
    ...newGameState,
    horseMounted: true,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You stand at the end of a long road that stretches from the city gate to mountains. 

    Thankfully, the horse lets you travel quickly. "
  `);
  const connections = locations[location].getConnections(gameState);
  expect(connections.N).toMatchInlineSnapshot(`"stream"`);
  expect(connections.S).toMatchInlineSnapshot(`"gate"`);
});

test("road2 description, not mounted", () => {
  const location = "road2";
  const gameState = {
    ...newGameState,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You are halfway along a long road that stretches from the city gate to mountains. 

    This would be much easier if you were riding a horse. "
  `);
  const connections = locations[location].getConnections(gameState);
  expect(connections.N).toMatchInlineSnapshot(`"road3"`);
  expect(connections.S).toMatchInlineSnapshot(`"road1"`);
});

test("road2 description, mounted", () => {
  const location = "road2";
  const gameState = {
    ...newGameState,
    horseMounted: true,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You are halfway along a long road that stretches from the city gate to mountains. 

    Thankfully, the horse lets you travel faster. "
  `);
  const connections = locations[location].getConnections(gameState);
  expect(connections.N).toMatchInlineSnapshot(`"stream"`);
  expect(connections.S).toMatchInlineSnapshot(`"gate"`);
});

test("road3 description, not mounted", () => {
  const location = "road3";
  const gameState = {
    ...newGameState,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You stand at the end of a long road that stretches from the city gate to mountains. "`
  );
  const connections = locations[location].getConnections(gameState);
  expect(connections.N).toMatchInlineSnapshot(`"stream"`);
  expect(connections.S).toMatchInlineSnapshot(`"road2"`);
});

test("road3 description, mounted", () => {
  const location = "road3";
  const gameState = {
    ...newGameState,
    horseMounted: true,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You stand at the end of a long road that stretches from the city gate to mountains. 

    Thankfully, the horse lets you travel quickly. "
  `);
  const connections = locations[location].getConnections(gameState);
  expect(connections.N).toMatchInlineSnapshot(`"stream"`);
  expect(connections.S).toMatchInlineSnapshot(`"gate"`);
});

test("road3 description, getting cursed", () => {
  const location = "road3";
  const gameState = {
    ...newGameState,
    gotScoreByCredit: true,
    paidDebt: false,
    treasureLevel: 2,
    cursed: false,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"As you cross the stream, a flash of lightning hits you, knocking you onto your back. "WHERE IS MY TREASURE?" the wizard demands. "Since you did not give me my share, you shall not have any." The treasure flies from your pouch and disappears down the stream. The wizard vanishes in a cloud of smoke."`
  );
});

test("road3 description, not in debt", () => {
  const location = "road3";
  const gameState = {
    ...newGameState,
    gotScoreByCredit: false,
    paidDebt: false,
    treasureLevel: 2,
    cursed: false,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You stand at the end of a long road that stretches from the city gate to mountains. "`
  );
});

test("road3 description, no treasure so won't get cursed", () => {
  const location = "road3";
  const gameState = {
    ...newGameState,
    gotScoreByCredit: true,
    paidDebt: false,
    cursed: false,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You stand at the end of a long road that stretches from the city gate to mountains. "`
  );
});

test("road3 description, already cursed", () => {
  const location = "road3";
  const gameState = {
    ...newGameState,
    gotScoreByCredit: true,
    paidDebt: false,
    treasureLevel: 2,
    cursed: true,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You stand at the end of a long road that stretches from the city gate to mountains. "`
  );
});

test("road3 description, paid to prevent curse", () => {
  const location = "road3";
  const gameState = {
    ...newGameState,
    gotScoreByCredit: true,
    paidDebt: true,
    treasureLevel: 2,
    cursed: false,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You stand at the end of a long road that stretches from the city gate to mountains. "`
  );
});

test("stream description, not in debt", () => {
  const location = "stream";
  const gameState = {
    ...newGameState,
    gotScoreByCredit: false,
    paidDebt: false,
    cursed: false,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You come across a steam that separates the road from a clearing. It looks crossable by foot or by horse. "`
  );
});

test("stream description, in debt", () => {
  const location = "stream";
  const gameState = {
    ...newGameState,
    gotScoreByCredit: true,
    paidDebt: false,
    cursed: false,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You come across a steam that separates the road from a clearing. It looks crossable by foot or by horse. 

    The air above the stream shimmers. "
  `);
});
test("stream description, in debt but already cursed", () => {
  const location = "stream";
  const gameState = {
    ...newGameState,
    gotScoreByCredit: true,
    paidDebt: false,
    cursed: true,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You come across a steam that separates the road from a clearing. It looks crossable by foot or by horse. "`
  );
});

test("stream description, paid debt", () => {
  const location = "stream";
  const gameState = {
    ...newGameState,
    gotScoreByCredit: true,
    paidDebt: true,
    cursed: false,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You come across a steam that separates the road from a clearing. It looks crossable by foot or by horse. "`
  );
});

test("clearing description, not cursed, squirrel not dead", () => {
  const location = "clearing";
  const gameState = {
    ...newGameState,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You stand in a clearing, in the shadow of a rocky cliff with a cave. A bush full of berries catches your eye. 

    A man stands in the middle of the clearing. His long white beard, pointed hat, and staff mark him as a wizard.  

    A squirrel scampers around a tree. "
  `);
  const connections = locations[location].getConnections(gameState);
  expect(connections.A).toEqual(expect.arrayContaining(["wizard", "squirrel"]));
});

test("clearing description, cursed, squirrel not dead", () => {
  const location = "clearing";
  const gameState = {
    ...newGameState,
    squirrelDead: false,
    cursed: true,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You stand in a clearing, in the shadow of a rocky cliff with a cave. A bush full of berries catches your eye. 

    A black patch marks where the wizard vanished.  

    A squirrel scampers around a tree. "
  `);
  const connections = locations[location].getConnections(gameState);
  expect(connections.A).toEqual(expect.arrayContaining(["squirrel"]));
  expect(connections.A).toEqual(expect.not.arrayContaining(["wizard"]));
});

test("clearing description, not cursed, squirrel dead", () => {
  const location = "clearing";
  const gameState = {
    ...newGameState,
    squirrelDead: true,
    cursed: false,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You stand in a clearing, in the shadow of a rocky cliff with a cave. A bush full of berries catches your eye. 

    A man stands in the middle of the clearing. His long white beard, pointed hat, and staff mark him as a wizard.  

    A dead squirrel lies at the base of a tree. "
  `);
  const connections = locations[location].getConnections(gameState);
  expect(connections.A).toEqual(expect.arrayContaining(["wizard", "squirrel"]));
});

test("clearing description, cursed, squirrel dead", () => {
  const location = "clearing";
  const gameState = {
    ...newGameState,
    squirrelDead: true,
    cursed: true,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You stand in a clearing, in the shadow of a rocky cliff with a cave. A bush full of berries catches your eye. 

    A black patch marks where the wizard vanished.  

    A dead squirrel lies at the base of a tree. "
  `);
  const connections = locations[location].getConnections(gameState);
  expect(connections.A).toEqual(expect.arrayContaining(["squirrel"]));
  expect(connections.A).toEqual(expect.not.arrayContaining(["wizard"]));
});

test("clearing description, not cursed, squirrel dead, horse dead but not here", () => {
  const location = "clearing";
  const gameState = {
    ...newGameState,
    squirrelDead: false,
    cursed: false,
    horseDead: true,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You stand in a clearing, in the shadow of a rocky cliff with a cave. A bush full of berries catches your eye. 

    A man stands in the middle of the clearing. His long white beard, pointed hat, and staff mark him as a wizard.  

    A squirrel scampers around a tree. "
  `);
  const connections = locations[location].getConnections(gameState);
  expect(connections.A).toEqual(expect.arrayContaining(["wizard", "squirrel"]));
});

test("clearing description, not cursed, squirrel dead, horse dead here", () => {
  const location = "clearing";
  const gameState = {
    ...newGameState,
    squirrelDead: false,
    cursed: false,
    horseDead: true,
    itemLocations: { ...newGameState.itemLocations, clearing: ["horse"] },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You stand in a clearing, in the shadow of a rocky cliff with a cave. A bush full of berries catches your eye. 

    A man stands in the middle of the clearing. His long white beard, pointed hat, and staff mark him as a wizard.  

    A squirrel scampers around a tree. 

    A dead horse lies on the ground, foam and partially chewed berries coming from its mouth. "
  `);
  const connections = locations[location].getConnections(gameState);
  expect(connections.A).toEqual(expect.arrayContaining(["wizard", "squirrel"]));
});

test("clearing description, not cursed, squirrel dead, horse here not dead", () => {
  const location = "clearing";
  const gameState = {
    ...newGameState,
    squirrelDead: false,
    cursed: false,
    horseDead: false,
    itemLocations: { ...newGameState.itemLocations, clearing: ["horse"] },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You stand in a clearing, in the shadow of a rocky cliff with a cave. A bush full of berries catches your eye. 

    A man stands in the middle of the clearing. His long white beard, pointed hat, and staff mark him as a wizard.  

    A squirrel scampers around a tree. "
  `);
  const connections = locations[location].getConnections(gameState);
  expect(connections.A).toEqual(expect.arrayContaining(["wizard", "squirrel"]));
});

test("squirrel description, not dead", () => {
  const location = "squirrel";
  const gameState = {
    ...newGameState,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You approach the squirrel. It pauses, perhaps curious if you will feed it, before scampering up the tree. "`
  );
  const sentient = locations[location].getSentient(gameState);
  expect(sentient).toBe(true);
  const name = locations[location].getDisplayName(gameState);
  expect(name).toMatchInlineSnapshot(`"squirrel"`);
});

test("squirrel description, dead", () => {
  const location = "squirrel";
  const gameState = {
    ...newGameState,
    squirrelDead: true,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"The squirrel lies dead on the ground. "`
  );
  const sentient = locations[location].getSentient(gameState);
  expect(sentient).toBe(false);
  const name = locations[location].getDisplayName(gameState);
  expect(name).toMatchInlineSnapshot(`"dead squirrel"`);
});

test("wizard description, naked, score on offer", () => {
  const location = "wizard";
  const gameState = {
    ...newGameState,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "The wizard looks at you though bushy eyebrows. "Ah, a naturalist," he comments, eyeing your lack of clothes.

    "I have a musical score that will be useful. I would trade it for gold," the wizard says. 

    "Alas, I see your gold pouch is not as heavy as it could be. It is certainly not enough to buy this score!" 

    "However, I believe this score will lead to treasure if you combine it with your wit. Instead of requiring a payment now, I would accept a promised payment, and will take half the treasure that you earn from the dragon's lair." 

    "All promised payments are final. All payments completed at time of purchase are refundable." "
  `);
});

test("wizard description, naked, score on offer, you have score", () => {
  const location = "wizard";
  const gameState = {
    ...newGameState,
    itemLocations: { ...newGameState.itemLocations, inventory: ["sword"] },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "The wizard looks at you though bushy eyebrows. "Ah, a naturalist," he comments, eyeing your lack of clothes.

    "I have a musical score that will be useful. I would trade it for your fine sword or gold," the wizard says. 

    "Alas, I see your gold pouch is not as heavy as it could be. It is certainly not enough to buy this score!" 

    "However, I believe this score will lead to treasure if you combine it with your wit. Instead of requiring a payment now, I would accept a promised payment, and will take half the treasure that you earn from the dragon's lair." 

    "All promised payments are final. All payments completed at time of purchase are refundable." "
  `);
});

test("wizard description, not naked, score on offer", () => {
  const location = "wizard";
  const gameState = {
    ...newGameState,
    naked: false,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "The wizard looks at you though bushy eyebrows. 

    "I have a musical score that will be useful. I would trade it for gold," the wizard says. 

    "Alas, I see your gold pouch is not as heavy as it could be. It is certainly not enough to buy this score!" 

    "However, I believe this score will lead to treasure if you combine it with your wit. Instead of requiring a payment now, I would accept a promised payment, and will take half the treasure that you earn from the dragon's lair." 

    "All promised payments are final. All payments completed at time of purchase are refundable." "
  `);
});

test("wizard description, not naked, score by trade", () => {
  const location = "wizard";
  const gameState = {
    ...newGameState,
    naked: false,
    gotScoreByTrade: true,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"The wizard looks at you though bushy eyebrows. "`
  );
});

test("wizard description, not naked, score by credit", () => {
  const location = "wizard";
  const gameState = {
    ...newGameState,
    naked: false,
    gotScoreByCredit: true,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"The wizard looks at you though bushy eyebrows. "`
  );
});

test("wizard description, not naked, score at wizard but you own it by credit", () => {
  const location = "wizard";
  const gameState = {
    ...newGameState,
    naked: false,
    gotScoreByCredit: true,
    itemLocations: { ...newGameState.itemLocations, wizard: ["score"] },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"The wizard looks at you though bushy eyebrows. "`
  );
});

test("wizard description, not naked, score at wizard but you own it by trade", () => {
  const location = "wizard";
  const gameState = {
    ...newGameState,
    naked: false,
    gotScoreByTrade: true,
    itemLocations: { ...newGameState.itemLocations, wizard: ["score"] },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"The wizard looks at you though bushy eyebrows. "`
  );
});

test("wizard description, not naked, score not at wizard", () => {
  const location = "wizard";
  const gameState = {
    ...newGameState,
    naked: false,
    itemLocations: { ...newGameState.itemLocations, wizard: [] },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"The wizard looks at you though bushy eyebrows. "`
  );
});

test("wizard description, not naked, got score by credit, did not pay debt, no treasure", () => {
  const location = "wizard";
  const gameState = {
    ...newGameState,
    naked: false,
    gotScoreByCredit: true,
    itemLocations: { ...newGameState.itemLocations, wizard: [] },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"The wizard looks at you though bushy eyebrows. "`
  );
});

test("wizard description, not naked, got score by credit, did not pay debt, treasure", () => {
  const location = "wizard";
  const gameState = {
    ...newGameState,
    naked: false,
    gotScoreByCredit: true,
    treasureLevel: 1,
    itemLocations: { ...newGameState.itemLocations, wizard: [] },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"The wizard looks at you though bushy eyebrows. "Are you here to give me my share of the treasure? ""`
  );
});

test("wizard description, not naked, got score by credit, did not pay debt, treasure but not more than what had when made deal", () => {
  const location = "wizard";
  const gameState = {
    ...newGameState,
    naked: false,
    gotScoreByCredit: true,
    treasureLevel: 1,
    preCreditTreasureLevel: 1,
    itemLocations: { ...newGameState.itemLocations, wizard: [] },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"The wizard looks at you though bushy eyebrows. "`
  );
});

test("wizard description, not naked, got score by credit, paid debt, treasure", () => {
  const location = "wizard";
  const gameState = {
    ...newGameState,
    naked: false,
    gotScoreByCredit: true,
    treasureLevel: 1,
    paidDebt: true,
    itemLocations: { ...newGameState.itemLocations, wizard: [] },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"The wizard looks at you though bushy eyebrows. "`
  );
});

test("cliff description, no horse", () => {
  const location = "cliff";
  const gameState = {
    ...newGameState,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You scramble on the rocky cliff. Above you is the entrance to a cave. Below you is a clearing next to a stream. "`
  );
  const connections = locations[location].getConnections(gameState);
  expect(connections.N).toEqual("caveEntrance");
});

test("cliff description, horse", () => {
  const location = "cliff";
  const gameState = {
    ...newGameState,
    itemLocations: { ...newGameState.itemLocations, inventory: ["horse"] },
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"The horse cannot make it up the rocky cliff. You must return to the clearing. "`
  );
  const connections = locations[location].getConnections(gameState);
  expect(connections.N).toEqual("");
});

test("caveEntrance description, dragon not asleep, clothes not poopy not worn", () => {
  const location = "caveEntrance";
  const gameState = {
    ...newGameState,
    clothesPoopy: false,
    naked: true,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You stand in the entrance of a cave. Two short passageways branch out. One passageway leads to a foul smelling cavern. The other passageway leads to a room that glitters with gems and gold. 

    You hear coins clanking from the glittering room, as if a large beast is rolling in piles of gold. From that room, voice booms "WHO DO I SMELL?""
  `);
});

test("caveEntrance description, dragon not asleep, clothes poopy but not worn", () => {
  const location = "caveEntrance";
  const gameState = {
    ...newGameState,
    clothesPoopy: true,
    naked: true,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You stand in the entrance of a cave. Two short passageways branch out. One passageway leads to a foul smelling cavern. The other passageway leads to a room that glitters with gems and gold. 

    You hear coins clanking from the glittering room, as if a large beast is rolling in piles of gold. From that room, voice booms "WHO DO I SMELL?""
  `);
});

test("caveEntrance description, dragon not asleep, clothes not poopy but worn", () => {
  const location = "caveEntrance";
  const gameState = {
    ...newGameState,
    clothesPoopy: false,
    naked: false,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You stand in the entrance of a cave. Two short passageways branch out. One passageway leads to a foul smelling cavern. The other passageway leads to a room that glitters with gems and gold. 

    You hear coins clanking from the glittering room, as if a large beast is rolling in piles of gold. From that room, voice booms "WHO DO I SMELL?""
  `);
});

test("caveEntrance description, dragon not asleep, clothes poopy and worn", () => {
  const location = "caveEntrance";
  const gameState = {
    ...newGameState,
    clothesPoopy: true,
    naked: false,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You stand in the entrance of a cave. Two short passageways branch out. One passageway leads to a foul smelling cavern. The other passageway leads to a room that glitters with gems and gold. 

    You hear coins clanking from the glittering room, as if a large beast is rolling in piles of gold. "
  `);
});

test("caveEntrance description, dragon asleep", () => {
  const location = "caveEntrance";
  const gameState = {
    ...newGameState,
    dragonAsleep: true,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You stand in the entrance of a cave. Two short passageways branch out. One passageway leads to a foul smelling cavern. The other passageway leads to a room that glitters with gems and gold. "`
  );
});

test("lair description, dragon poisoned, dragon asleep, dragon dead", () => {
  const location = "lair";
  const gameState = {
    ...newGameState,
    dragonPoisoned: true,
    dragonAsleep: true,
    dragonDead: true,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You stand in a room full of gold and gems. 

    The dragon's body lies severed from its head. The treasure it was guarding is now accessible. "
  `);
});

test("lair description, dragon poisoned, dragon asleep, dragon not dead", () => {
  const location = "lair";
  const gameState = {
    ...newGameState,
    dragonPoisoned: true,
    dragonAsleep: true,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You stand in a room full of gold and gems. 

    The dragon lies in a deep slumber atop the pile of treasure, periodically snoring flames of fire. "
  `);
});

test("lair description, dragon poisoned, dragon not asleep, dragon not dead", () => {
  const location = "lair";
  const gameState = {
    ...newGameState,
    dragonPoisoned: true,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You stand in a room full of gold and gems. 

    The dragon looks half dead from the poison but still shoots flame as you approach it and its pile of treasure. 

    The flame is no longer strong enough to harm you from the entrance to the lair, but it will surely singe you if you get closer. "
  `);
});

test("lair description, dragon not poisoned, dragon not asleep, dragon not dead", () => {
  const location = "lair";
  const gameState = {
    ...newGameState,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(`
    "You stand in a room full of gold and gems. 

    A dragon sits atop the pile of treasure. It shoots fire as you approach, singing you. You cannot go closer without getting badly burnt. "
  `);
});

test("defecatory description, dragon not poisoned, dragon not asleep, dragon not dead", () => {
  const location = "defecatory";
  const gameState = {
    ...newGameState,
  };
  const description = locations[location].getDescription(gameState);
  expect(description).toMatchInlineSnapshot(
    `"You stand in a large, foul smelling cavern. There is a puddle of clear water, a crevice, and a pile of dragon dung. "`
  );
});

test.each([
  { timeInCave: 0, dragonPoisoned: false, clothesPoopy: false, naked: false, playerLocation: "dung", berryLocation: "inventory"  },
  { timeInCave: 1, dragonPoisoned: false, clothesPoopy: false, naked: false, playerLocation: "dung", berryLocation: "inventory"  },
  { timeInCave: 2, dragonPoisoned: false, clothesPoopy: false, naked: false, playerLocation: "dung", berryLocation: "inventory"  },
  { timeInCave: 3, dragonPoisoned: false, clothesPoopy: false, naked: false, playerLocation: "dung", berryLocation: "inventory"  },
])(
  "dragon description: timeInCave $timeInCave, dragonPoisoned $dragonPoisoned, clothesPoopy $clothesPoopy, naked $naked, playerLocation $playerLocation, berryLocation $berryLocation, ",
  ({ timeInCave, dragonPoisoned, clothesPoopy, naked, playerLocation, berryLocation }) => {
    const gameState = {
      ...newGameState,
      timeInCave: timeInCave,
      dragonPoisoned: dragonPoisoned,
      clothesPoopy: clothesPoopy,
      naked: naked,
      playerLocation: playerLocation,
      itemLocations: { ...newGameState.itemLocations, [berryLocation]: ["berries"] },
    };
    const description = dragonDescription(gameState);
    expect(description).toMatchSnapshot();
  }
);

// todo catch cases where try to get prop from game state that doesn't exist

// defecatory
// puddle
// crevice
// dung
