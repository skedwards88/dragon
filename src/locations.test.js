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

// todo where does apple go after the horse eats it?

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
