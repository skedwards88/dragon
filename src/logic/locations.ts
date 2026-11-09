import type {GameState} from "./init";
import {
  createItemInteraction,
  type ItemInteraction,
  type ItemMovement,
} from "./items";

export const directions = ["N", "S", "E", "W"] as const;
export type Direction = (typeof directions)[number];

export type Connections = Partial<Record<Direction, LocationName>>;

type LocationInfo = {
  id: string;
  getDisplayName: (gameState: GameState) => string;
  getBackgroundName: (gameState: GameState) => string;
  getConnections: (gameState: GameState) => Connections;
  getInteractions: (gameState: GameState) => LocationName[];
  dropPreposition: string;
  getSentient: (gameState: GameState) => boolean;
  getHuman: () => boolean;
  getDescription: (gameState: GameState) => string;
  onEnterGameStateEffect?: (gameState: GameState) => Partial<GameState>;
  onExitGameStateEffect?: (gameState: GameState) => Partial<GameState>;
  onEnterItemLocationEffect?: (
    gameState: GameState,
  ) => ItemMovement | undefined;
  onExitItemLocationEffect?: (gameState: GameState) => ItemMovement | undefined;
  getCustomPay: (gameState: GameState) => ItemInteraction;
};

function createLocation(
  options: Pick<LocationInfo, "id" | "getConnections" | "getDescription"> &
    Partial<LocationInfo>,
): LocationInfo {
  return {
    getDisplayName: () => options.id,
    getBackgroundName: () => options.id,
    dropPreposition: "at",
    getSentient: () => false,
    getHuman: () => false,
    getCustomPay: (): ItemInteraction => {
      return createItemInteraction({});
    },
    getInteractions: () => [],
    ...options,
  };
}

const room = createLocation({
  id: "room",
  getConnections() {
    return {
      N: "wardrobe",
      S: "inn",
      W: "window",
    };
  },
  dropPreposition: "in",
  getDescription(gameState) {
    let text = "You are in a bedroom with a window, wardrobe, and door. ";

    if (gameState.itemLocations.room.includes("lute")) {
      text += "A lute leans against the bed. ";
    }

    if (gameState.manorFire) {
      text += "You smell smoke and hear screams in the distance. ";
    }
    return text;
  },
});

const window = createLocation({
  id: "window",
  getConnections() {
    return {
      E: "room",
    };
  },
  dropPreposition: "at",
  getDescription(gameState) {
    return gameState.manorFire
      ? "Through the window, you see flames and smoke coming from a nearby manor. A crowd has gathered in front of the manor. "
      : "Through the window, you see the charred remains of a nearby manor. ";
  },
});

const wardrobe = createLocation({
  id: "wardrobe",
  getConnections() {
    return {
      S: "room",
      E: "mirror",
    };
  },
  dropPreposition: "in",
  getDescription(gameState) {
    return `Inside the wardrobe, there is a mirror${
      gameState.itemLocations.wardrobe.includes("clothes")
        ? " and a set of clothes"
        : ""
    }. `;
  },
});

const mirror = createLocation({
  id: "mirror",
  getConnections() {
    return {
      S: "room",
      W: "wardrobe",
    };
  },
  dropPreposition: "at",
  getDescription(gameState) {
    return gameState.naked
      ? "You're naked!"
      : "You are quite good looking, if you say so yourself. ";
  },
});

const inn = createLocation({
  id: "inn",
  getDisplayName(gameState) {
    return gameState.playerLocation === "room" ? "Door" : "Inn";
  },
  getConnections() {
    return {
      N: "room",
      S: "courtyard",
    };
  },
  dropPreposition: "in",
  getDescription(gameState) {
    return `You enter what appears to be the common room of an inn. ${
      gameState.itemLocations.inn.includes("apple") &&
      gameState.appleBitesRemaining === 5
        ? "A complementary apple rests on the table. "
        : ""
    }${
      gameState.naked
        ? `\n\nThe inn keeper laughs, "Haven't you heard of clothes?!"`
        : ""
    }`;
  },
  onEnterGameStateEffect(gameState) {
    if (gameState.naked) {
      return {reputation: gameState.reputation - 1};
    }
    return {};
  },
});

const courtyard = createLocation({
  id: "courtyard",
  getConnections() {
    return {
      N: "inn",
      E: "smithy",
      W: "fountain",
    };
  },
  dropPreposition: "in",
  getDescription(gameState) {
    return `You are in a small courtyard that connects to the inn. You can see a fountain and hear sounds of a blacksmith shop. ${
      gameState.manorFire
        ? "Beyond the fountain, you see flames and smoke. "
        : ""
    }${
      gameState.firstCourtyardEntry
        ? "\n\nA youth runs from the fire, crying as they flee. They drop a handkerchief in their distress. "
        : ""
    }`;
  },
  onExitGameStateEffect(gameState) {
    if (gameState.firstCourtyardEntry) {
      return {firstCourtyardEntry: false};
    }
    return {};
  },
});

const fountain = createLocation({
  id: "fountain",
  dropPreposition: "in",
  getConnections() {
    return {
      N: "lawn",
      E: "courtyard",
    };
  },
  getDescription(gameState) {
    let text =
      "You stand at the edge of a fountain. In the center is a statue of a dragon and cowering people. ";

    if (gameState.manorFire) {
      text +=
        "\n\nBeyond the fountain, you see a burning manor surrounded by a crowd. ";
    } else {
      text +=
        "\n\nBeyond the fountain, the manor is a framework of charred wood. ";
    }
    return text;
  },
});

const lawn = createLocation({
  id: "lawn",
  getDisplayName() {
    return "Manor";
  },
  getBackgroundName(gameState) {
    if (gameState.manorFire) {
      return "lawnFire";
    }
    return "lawnNoFire";
  },
  dropPreposition: "at",
  getConnections() {
    return {
      N: "entryway",
      E: "fountain",
    };
  },
  getDescription(gameState) {
    let text = "";

    if (!gameState.savedBaby && gameState.manorFire) {
      text +=
        'You stand in front of a burning manor. A crowd surrounds the manor, surveying the fire. You hear a voice sobbing, "My baby! My baby is trapped inside." ';
      if (gameState.naked) {
        text += `\n\nIn the commotion, the crowd doesn't notice your lack of clothes, though surely this crowd will not be so understanding under other circumstances.`;
      }
    } else if (gameState.savedBaby && !gameState.receivedBabyReward) {
      if (gameState.babyCough) {
        text += `You hear a voice: "My baby! You saved my baby!" The baby coughs from the smoke. The parent glares at you, "My baby has a terrible cough from being carried through the smoke. Regardless, take this gold as thanks.`;
      } else {
        text +=
          'You hear a voice: "My baby! You saved my baby! Please take this gold as thanks.';
      }
      if (gameState.naked) {
        text += ` And perhaps buy yourself some clothes," they say, eyeing your naked body. `;
      } else {
        text += `" `;
      }
      if (gameState.playerCough) {
        text +=
          "\n\nAs you take the gold, you let out a racking cough. It seems that you should have taken measures to avoid breathing the smoke. They pass you the gold quickly, eager to get away from your coughing. ";
      }
      text +=
        "\n\nBehind you, you hear the roof collapse. Finally, the crowd is able to douse the flames. ";
    } else {
      text += "You stand in front of a framework of charred wood. ";
    }
    return text;
  },
  onEnterGameStateEffect(gameState) {
    if (gameState.savedBaby && !gameState.receivedBabyReward) {
      let reputationIncrease = 0;
      if (!gameState.playerCough) {
        reputationIncrease += 1;
      }
      if (!gameState.babyCough) {
        reputationIncrease += 1;
      }
      if (gameState.naked) {
        reputationIncrease -= 1;
      }
      return {
        gold: gameState.gold + 50,
        reputation: gameState.reputation + reputationIncrease,
      };
    }
    return {};
  },
  onExitGameStateEffect(gameState) {
    if (gameState.savedBaby && !gameState.receivedBabyReward) {
      return {manorFire: false, receivedBabyReward: true};
    }
    return {};
  },
  onEnterItemLocationEffect(gameState) {
    if (gameState.savedBaby && !gameState.receivedBabyReward) {
      return {
        item: "baby",
        oldLocation: "inventory",
        newLocation: "outOfPlay",
      };
    }
    return undefined;
  },
});

const entryway = createLocation({
  id: "entryway",
  dropPreposition: "in",
  getBackgroundName(gameState) {
    if (gameState.manorFire) {
      return "entrywayFire";
    }
    return "entrywayNoFire";
  },
  getConnections(gameState) {
    return {
      ...(gameState.manorFire && {N: "nursery"}),
      S: "lawn",
    };
  },
  getDescription(gameState) {
    if (!gameState.manorFire) {
      return "You stand in the charred remains of the manor. The stairs to the nursery are blocked by rubble. ";
    }

    let text = "You stand in the entrance of the burning manor. ";

    if (gameState.itemLocations.nursery.includes("baby")) {
      text += "You hear a baby crying upstairs. ";
    }

    if (!gameState.handkerchiefDamp || !gameState.playerMasked) {
      text +=
        "\n\nYour throat burns from the smoke and heat. You can't breath this air. You will surely develop a nasty cough if you go further into the manor without protection. ";
    }

    if (gameState.handkerchiefDamp && gameState.playerMasked) {
      text +=
        "\n\nAlthough the smoke is thick, the damp handkerchief over your mouth helps you breathe. ";
    }

    if (!gameState.handkerchiefDamp && gameState.playerMasked) {
      text +=
        "\n\nOn its own, the handkerchief does little to block the smoke. ";
    }

    return text;
  },
  onEnterGameStateEffect(gameState) {
    if (gameState.itemLocations.inventory.includes("baby")) {
      return {babyCough: true};
    }
    return {};
  },
});

const nursery = createLocation({
  id: "nursery",
  dropPreposition: "in",
  getConnections() {
    return {
      N: "nurseryWindow",
      S: "entryway",
    };
  },
  getDescription(gameState) {
    if (gameState.manorFire) {
      if (gameState.itemLocations.nursery.includes("baby")) {
        return "You stand in a nursery. You see a baby wailing in the crib under an open window. The open window must be the only thing keeping the baby alive in this smoke. ";
      }
      return "You stand in a nursery with an empty crib. The fire continues to burn, pouring smoke into the room. ";
    }
    return "You stand in the charred remains of a nursery. ";
  },
  onEnterGameStateEffect(gameState) {
    if (!gameState.handkerchiefDamp || !gameState.playerMasked) {
      return {playerCough: true};
    }
    return {};
  },
});

const nurseryWindow = createLocation({
  id: "nurseryWindow",
  getDisplayName() {
    return "Window";
  },
  dropPreposition: "at",
  getConnections() {
    return {
      S: "nursery",
    };
  },
  getDescription(gameState) {
    return gameState.manorFire
      ? "Below the window, you see the gathered crowd. "
      : "You see the charred remains of the manor below you. ";
  },
});

const smithy = createLocation({
  id: "smithy",
  getDisplayName() {
    return "Blacksmith shop";
  },
  dropPreposition: "at",
  getConnections() {
    return {
      N: "gate",
      W: "courtyard",
    };
  },
  getInteractions() {
    return ["blacksmith"];
  },
  getDescription(gameState) {
    let text =
      "You stand in front of a blacksmith shop. From the shop, you can see the city gate and the inn courtyard. The blacksmith is working in front of the shop. ";

    if (gameState.itemLocations.smithy.includes("sword")) {
      text +=
        "In front of the shop, you see a sword gleaming as if someone was recently polishing it. ";
    }
    return text;
  },
});

const blacksmith = createLocation({
  id: "blacksmith",
  dropPreposition: "by",
  getSentient() {
    return true;
  },
  getHuman() {
    return true;
  },
  getConnections() {
    return {
      N: "smithy",
    };
  },
  getDescription(gameState) {
    let text = `The blacksmith looks up as you approach. ${
      gameState.naked
        ? `"No clothes? You best stay away from the furnace lest you burn something important." `
        : ""
    }${
      gameState.playerMasked
        ? "They eye the handkerchief tied over your face warily, but don't comment on it."
        : ""
    }`;

    if (
      !gameState.ownSword &&
      gameState.itemLocations.smithy.includes("sword")
    ) {
      text += `\n\n"Are you interested in buying that sword?" they ask. "It costs ${String(gameState.swordCost)} gold. " `;
    }
    return text;
  },
  onEnterGameStateEffect(gameState) {
    if (gameState.naked) {
      return {
        reputation: gameState.reputation - 1,
      };
    }
    return {};
  },
  getCustomPay(gameState) {
    function writeDescription(gameState: GameState): string {
      if (
        !gameState.ownSword &&
        gameState.itemLocations.smithy.includes("sword")
      ) {
        if (gameState.gold >= gameState.swordCost) {
          return `You hand the blacksmith ${String(gameState.swordCost)} gold in exchange for the sword. `;
        }
        return `The blacksmith looks at your gold. "It looks like you don't have enough gold to buy this sword. Come back once you have enough gold, or try your luck without it." `;
      }
      return "";
    }

    function getGameEffect(gameState: GameState): Partial<GameState> {
      if (
        !gameState.ownSword &&
        gameState.itemLocations.smithy.includes("sword") &&
        gameState.gold >= gameState.swordCost
      ) {
        return {
          ownSword: true,
          gold: gameState.gold - gameState.swordCost,
        };
      }
      return {};
    }

    function getItemMovements(gameState: GameState): ItemMovement[] {
      if (
        !gameState.ownSword &&
        gameState.itemLocations.smithy.includes("sword") &&
        gameState.gold >= gameState.swordCost
      ) {
        return [
          {
            item: "sword",
            oldLocation: "smithy",
            newLocation: "inventory",
          },
        ];
      }
      return [];
    }

    return {
      gameEffect: getGameEffect(gameState),
      itemMovements: getItemMovements(gameState),
      description: writeDescription(gameState),
    };
  },
});

const pasture = createLocation({
  id: "pasture",
  getDisplayName(gameState) {
    const pastureHasHorse = gameState.itemLocations.pasture.includes("horse");
    return pastureHasHorse && !gameState.horseDead ? "horse" : "pasture";
  },
  getSentient(gameState) {
    return (
      gameState.itemLocations.pasture.includes("horse") && !gameState.horseDead
    );
  },
  dropPreposition: "at",
  getConnections() {
    return {
      E: "gate",
    };
  },
  getDescription(gameState) {
    let text = "You are standing in a wide field just outside the city gates. ";

    if (
      gameState.itemLocations.pasture.includes("horse") &&
      !gameState.horseDead &&
      !gameState.horseTethered
    ) {
      text += `\n\nA horse is grazing in the field. A sign reads: "Free horse (if you can catch it)." `;
    }

    return text;
  },
});

const gate = createLocation({
  id: "gate",
  dropPreposition: "at",
  getConnections() {
    return {
      N: "road1",
      S: "smithy",
      W: "pasture",
    };
  },
  getInteractions() {
    return ["youth"];
  },
  getDescription(gameState) {
    return `You are standing at the city gate. You see a pasture and a road leading up a mountain. \n\nThe youth that you saw earlier stands at the gate${
      !gameState.playedForYouth ? ", crying" : ""
    }. `;
  },
  onEnterGameStateEffect(gameState) {
    // game over if enter this location and have earned treasure
    if (gameState.treasureLevel) {
      let reputationChange = 0;
      if (gameState.horseMounted) reputationChange += 1;
      if (gameState.naked) reputationChange -= 1;
      if (gameState.clothesPoopy && !gameState.naked) reputationChange -= 1;
      // Not losing reputation for being poisoned or singed since that happens when the event occurs
      return {
        reputation: gameState.reputation + reputationChange,
      };
    }
    return {};
  },
});

const youth = createLocation({
  id: "youth",
  getSentient() {
    return true;
  },
  getHuman() {
    return true;
  },
  dropPreposition: "by",
  getConnections() {
    return {
      N: "gate",
    };
  },
  getDescription(gameState) {
    let text = `The youth stands by the city gates${
      gameState.playedForYouth ? "" : " crying"
    }. `;
    if (gameState.naked) {
      text += `"Ack! Where are your clothes?!"`;
    }
    return text;
  },
  onEnterGameStateEffect(gameState) {
    if (gameState.naked) {
      return {
        reputation: gameState.reputation - 1,
      };
    }
    return {};
  },
});

const road1 = createLocation({
  id: "road1",
  dropPreposition: "on",
  getDisplayName() {
    return "Long road";
  },
  getBackgroundName() {
    return "road";
  },
  getConnections(gameState) {
    return {
      N: gameState.horseMounted ? "stream" : "road2",
      S: "gate",
    };
  },
  getDescription(gameState) {
    let text =
      "You stand at the end of a long road that stretches from the city gate to mountains. ";
    if (gameState.horseMounted) {
      text += "\n\nThankfully, the horse lets you travel quickly. ";
    }
    return text;
  },
});

const road2 = createLocation({
  id: "road2",
  dropPreposition: "on",
  getDisplayName() {
    return "Long road";
  },
  getBackgroundName() {
    return "road";
  },
  getConnections(gameState) {
    return {
      N: gameState.horseMounted ? "stream" : "road3",
      S: gameState.horseMounted ? "gate" : "road1",
    };
  },
  getDescription(gameState) {
    let text =
      "You are halfway along a long road that stretches from the city gate to mountains. ";
    if (gameState.horseMounted) {
      text += "\n\nThankfully, the horse lets you travel faster. ";
    } else {
      text += "\n\nThis would be much easier if you were riding a horse. ";
    }
    return text;
  },
});

const road3 = createLocation({
  id: "road3",
  dropPreposition: "on",
  getDisplayName() {
    return "Long road";
  },
  getBackgroundName() {
    return "road";
  },
  getConnections(gameState) {
    return {
      N: "stream",
      S: gameState.horseMounted ? "gate" : "road2",
    };
  },
  getDescription(gameState) {
    if (
      gameState.gotScoreByCredit &&
      !gameState.paidDebt &&
      gameState.treasureLevel &&
      !gameState.cursed
    ) {
      return 'As you cross the stream, a flash of lightning hits you, knocking you onto your back. "WHERE IS MY TREASURE?" the wizard demands. "Since you did not give me my share, you shall not have any." The treasure flies from your pouch and disappears down the stream. The wizard vanishes in a cloud of smoke.';
    }
    let text = `You stand at the end of a long road that stretches from the city gate to mountains. `;

    if (gameState.horseMounted) {
      text += "\n\nThankfully, the horse lets you travel quickly. ";
    }
    return text;
  },

  onEnterGameStateEffect(gameState) {
    if (
      gameState.gotScoreByCredit &&
      !gameState.paidDebt &&
      gameState.treasureLevel &&
      !gameState.cursed
    ) {
      const treasureTaken =
        gameState.treasureAmount * (gameState.treasureLevel / 3);

      return {
        // you won't get cursed until you leave the location so that the proper text displays
        gold: gameState.gold - treasureTaken,
        reputation: gameState.reputation - 1,
      };
    }
    return {};
  },

  onExitGameStateEffect(gameState) {
    if (
      gameState.gotScoreByCredit &&
      !gameState.paidDebt &&
      gameState.treasureLevel &&
      !gameState.cursed
    ) {
      return {
        // you get cursed when you leave instead of when you enter so that the proper text displays
        cursed: true,
      };
    }
    return {};
  },
});

const stream = createLocation({
  id: "stream",
  dropPreposition: "in",
  getConnections() {
    return {
      N: "clearing",
      S: "road3",
    };
  },
  getDescription(gameState) {
    let text =
      "You come across a steam that separates the road from a clearing. It looks crossable by foot or by horse. ";
    if (
      gameState.gotScoreByCredit &&
      !gameState.paidDebt &&
      !gameState.cursed
    ) {
      text += "\n\nThe air above the stream shimmers. ";
    }
    return text;
  },
});

const clearing = createLocation({
  id: "clearing",
  dropPreposition: "in",
  getConnections() {
    return {
      N: "cliff",
      S: "stream",
    };
  },
  getInteractions(gameState) {
    return gameState.cursed ? ["squirrel"] : ["wizard", "squirrel"];
  },
  getDescription(gameState) {
    let text = `You stand in a clearing, in the shadow of a rocky cliff with a cave. A bush full of berries catches your eye. ${
      gameState.cursed
        ? "\n\nA black patch marks where the wizard vanished. "
        : "\n\nA man stands in the middle of the clearing. His long white beard, pointed hat, and staff mark him as a wizard. "
    } ${
      gameState.squirrelDead
        ? "\n\nA dead squirrel lies at the base of a tree. "
        : "\n\nA squirrel scampers around a tree. "
    }`;

    if (
      gameState.horseDead &&
      gameState.itemLocations.clearing.includes("horse")
    ) {
      text +=
        "\n\nA dead horse lies on the ground, foam and partially chewed berries coming from its mouth. ";
    }
    return text;
  },
});

const squirrel = createLocation({
  id: "squirrel",
  getDisplayName(gameState) {
    return gameState.squirrelDead ? "dead squirrel" : "squirrel";
  },
  getSentient(gameState) {
    return !gameState.squirrelDead;
  },
  getBackgroundName(gameState) {
    if (gameState.squirrelDead) {
      return "squirrelDead";
    }
    return "squirrel";
  },
  dropPreposition: "by",
  getConnections() {
    return {
      N: "clearing",
    };
  },
  getDescription(gameState) {
    return gameState.squirrelDead
      ? "The squirrel lies dead on the ground. "
      : "You approach the squirrel. It pauses, perhaps curious if you will feed it, before scampering up the tree. ";
  },
});

const wizard = createLocation({
  id: "wizard",
  getSentient() {
    return true;
  },
  getHuman() {
    return true;
  },
  dropPreposition: "by",
  getConnections() {
    return {
      N: "clearing",
    };
  },
  getDescription(gameState) {
    let text = "The wizard looks at you though bushy eyebrows. ";

    if (gameState.naked) {
      text += `"Ah, a naturalist," he comments, eyeing your lack of clothes.`;
    }

    if (
      gameState.itemLocations.wizard.includes("score") &&
      !(gameState.gotScoreByCredit || gameState.gotScoreByTrade)
    ) {
      text += `\n\n"I have a musical score that will be useful. I would trade it for ${
        gameState.itemLocations.inventory.includes("sword")
          ? "your fine sword or "
          : ""
      }gold," the wizard says. \n\n"Alas, I see your gold pouch is not as heavy as it could be. It is certainly not enough to buy this score!" \n\n"However, I believe this score will lead to treasure if you combine it with your wit. Instead of requiring a payment now, I would accept a promised payment, and will take half the treasure that you earn from the dragon's lair." \n\n"All promised payments are final. All payments completed at time of purchase are refundable." `;
    }

    if (
      gameState.gotScoreByCredit &&
      !gameState.paidDebt &&
      gameState.preCreditTreasureLevel < gameState.treasureLevel
    ) {
      text += `"Are you here to give me my share of the treasure? "`;
    }

    return text;
  },
  getCustomPay(gameState) {
    function writeDescription(gameState: GameState): string {
      if (
        gameState.itemLocations.wizard.includes("score") &&
        !(gameState.gotScoreByCredit || gameState.gotScoreByTrade)
      ) {
        return `You promise the wizard half of the treasure that you hope to earn and pocket the musical score. As you shake on the deal, a shimmering barrier appears over the stream, then fades. `;
      }

      if (
        gameState.gotScoreByCredit &&
        !gameState.paidDebt &&
        gameState.treasureLevel &&
        gameState.preCreditTreasureLevel < gameState.treasureLevel
      ) {
        let text = "";
        if (gameState.treasureLevel === 3) {
          text += `"It looks like you succeeded nicely." `;
        }
        if (gameState.treasureLevel < 3) {
          text += `"It looks like you succeeded, though not as well as I hoped." `;
        }
        text += "The wizard takes a share of your treasure. ";

        return text;
      }

      if (
        gameState.gotScoreByCredit &&
        !gameState.paidDebt &&
        !(gameState.preCreditTreasureLevel < gameState.treasureLevel)
      ) {
        if (gameState.preCreditTreasureLevel) {
          return `"Hmm...You have not earned any more treasure. Use your wits!"`;
        }
        return `"Hmm...You have not earned any treasure. Use your wits!"`;
      }

      return `"Although I would like your gold, you have no debts to me."`;
    }

    function getGameEffect(gameState: GameState): Partial<GameState> {
      if (
        gameState.itemLocations.wizard.includes("score") &&
        !(gameState.gotScoreByCredit || gameState.gotScoreByTrade)
      ) {
        return {
          gotScoreByCredit: true,
          paidDebt: false,
          preCreditTreasureLevel: gameState.treasureLevel,
        };
      }

      if (
        gameState.gotScoreByCredit &&
        !gameState.paidDebt &&
        gameState.treasureLevel &&
        // You only can pay the debt if you have earned any treasure post-deal
        gameState.preCreditTreasureLevel < gameState.treasureLevel
      ) {
        // The wizard only takes the half of the gold that you earned in the time after promising them treasure
        const treasureTakenPostDeal =
          gameState.treasureAmount *
          ((gameState.treasureLevel - gameState.preCreditTreasureLevel) / 3);

        return {
          paidDebt: true,
          gold: gameState.gold - treasureTakenPostDeal / 2,
        };
      }
      return {};
    }

    function getItemMovements(gameState: GameState): ItemMovement[] {
      if (
        gameState.itemLocations.wizard.includes("score") &&
        !(gameState.gotScoreByCredit || gameState.gotScoreByTrade)
      ) {
        return [
          {
            item: "score",
            oldLocation: "wizard",
            newLocation: "inventory",
          },
        ];
      }
      return [];
    }

    return {
      gameEffect: getGameEffect(gameState),
      itemMovements: getItemMovements(gameState),
      description: writeDescription(gameState),
    };
  },
});

const cliff = createLocation({
  id: "cliff",
  dropPreposition: "on",
  getConnections(gameState) {
    return {
      ...(!gameState.itemLocations.inventory.includes("horse") && {
        N: "caveEntrance",
      }),
      S: "clearing",
    };
  },

  getDescription(gameState) {
    let text = "";
    if (gameState.itemLocations.inventory.includes("horse")) {
      text += `The horse cannot make it up the rocky cliff. You must return to the clearing. `;
    } else {
      text += `You scramble on the rocky cliff. Above you is the entrance to a cave. Below you is a clearing next to a stream. `;
    }
    return text;
  },
});

const caveEntrance = createLocation({
  id: "caveEntrance",
  getDisplayName() {
    return "Cave entrance";
  },
  dropPreposition: "at",
  getConnections() {
    return {
      S: "cliff",
      E: "lair",
      W: "defecatory",
    };
  },
  getDescription(gameState) {
    let text =
      "You stand in the entrance of a cave. Two short passageways branch out. One passageway leads to a foul smelling cavern. The other passageway leads to a room that glitters with gems and gold. ";

    if (!gameState.dragonAsleep) {
      text +=
        "\n\nYou hear coins clanking from the glittering room, as if a large beast is rolling in piles of gold. ";

      if (!gameState.clothesPoopy || gameState.naked) {
        text += 'From that room, voice booms "WHO DO I SMELL?"';
      }
    }

    return text;
  },
});

const defecatory = createLocation({
  id: "defecatory",
  dropPreposition: "in",
  getConnections() {
    return {
      N: "puddle",
      S: "crevice",
      E: "caveEntrance",
      W: "dung",
    };
  },
  getDescription() {
    return "You stand in a large, foul smelling cavern. There is a puddle of clear water, a crevice, and a pile of dragon dung. ";
  },
});

const puddle = createLocation({
  id: "puddle",
  dropPreposition: "in",
  getConnections() {
    return {
      S: "crevice",
      E: "defecatory",
      W: "dung",
    };
  },
  getDescription(gameState) {
    return `You stand at a puddle of clear water. \n\n${dragonDescription(
      gameState,
    )}`;
  },
  onEnterGameStateEffect(gameState) {
    return {
      // always increase the time
      timeInCave: gameState.timeInCave + 1,
      // if dragon is not poisoned and time is enough to trigger dragon entry, you get singed
      ...(!gameState.dragonPoisoned &&
        (gameState.timeInCave + 1) % 4 === 3 && {
          singeCount: gameState.singeCount + 1,
          reputation: gameState.reputation - 1,
        }),
    };
  },
});

const crevice = createLocation({
  id: "crevice",
  dropPreposition: "in",
  getConnections() {
    return {
      N: "puddle",
      E: "defecatory",
      W: "dung",
    };
  },
  getDescription(gameState) {
    return `You squeeze into the crevice. It isn't big, but it seems deep enough to hide your from sight. \n\n${dragonDescription(
      gameState,
    )}`;
  },
  onEnterGameStateEffect(gameState) {
    return {
      // always increase the time
      timeInCave: gameState.timeInCave + 1,
      // if dragon is not poisoned and time is enough to trigger dragon entry and you are not wearing poopy clothes, you get singed
      ...(!gameState.dragonPoisoned &&
        (gameState.timeInCave + 1) % 4 === 3 &&
        (!gameState.clothesPoopy || gameState.naked) && {
          singeCount: gameState.singeCount + 1,
          reputation: gameState.reputation - 1,
        }),
    };
  },
  onExitGameStateEffect(gameState) {
    // if the berries are in the puddle and you are poopy_hidden, the dragon is poisoned
    if (
      gameState.itemLocations.puddle.includes("berries") &&
      gameState.clothesPoopy &&
      !gameState.naked
    ) {
      return {dragonPoisoned: true};
    }
    return {};
  },
});

const dung = createLocation({
  id: "dung",
  dropPreposition: "in",
  getDisplayName() {
    return "Dung pile";
  },
  getConnections() {
    return {
      N: "puddle",
      S: "crevice",
      E: "defecatory",
    };
  },
  getDescription(gameState) {
    return `You stand in front of a large pile of dragon dung. The stench makes your eyes water. \n\n${dragonDescription(
      gameState,
    )}`;
  },
  onEnterGameStateEffect(gameState) {
    return {
      // always increase the time
      timeInCave: gameState.timeInCave + 1,
      // if dragon is not poisoned and time is enough to trigger dragon entry, you get singed
      ...(!gameState.dragonPoisoned &&
        (gameState.timeInCave + 1) % 4 === 3 && {
          singeCount: gameState.singeCount + 1,
          reputation: gameState.reputation - 1,
        }),
    };
  },
});

const lair = createLocation({
  id: "lair",
  dropPreposition: "in",
  getConnections() {
    return {
      E: "caveEntrance",
    };
  },
  getDescription(gameState) {
    let text = "You stand in a room full of gold and gems. ";

    if (
      !gameState.dragonAsleep &&
      !gameState.dragonDead &&
      !gameState.dragonPoisoned
    ) {
      text +=
        "\n\nA dragon sits atop the pile of treasure. It shoots fire as you approach, singing you. You cannot go closer without getting badly burnt. ";
    }

    if (gameState.dragonAsleep && !gameState.dragonDead) {
      text +=
        "\n\nThe dragon lies in a deep slumber atop the pile of treasure, periodically snoring flames of fire. ";
    }

    if (gameState.dragonDead) {
      text +=
        "\n\nThe dragon's body lies severed from its head. The treasure it was guarding is now accessible. ";
    }

    if (
      !gameState.dragonAsleep &&
      !gameState.dragonDead &&
      gameState.dragonPoisoned
    ) {
      text +=
        "\n\nThe dragon looks half dead from the poison but still shoots flame as you approach it and its pile of treasure. \n\nThe flame is no longer strong enough to harm you from the entrance to the lair, but it will surely singe you if you get closer. ";
    }

    return text;
  },
  onEnterGameStateEffect(gameState) {
    if (
      !gameState.dragonAsleep &&
      !gameState.dragonDead &&
      !gameState.dragonPoisoned
    ) {
      return {
        singeCount: gameState.singeCount + 1,
        reputation: gameState.reputation - 1,
      };
    }
    return {};
  },
});

export function dragonDescription(gameState: GameState): string {
  const timeInterval = gameState.timeInCave % 4;

  let text = "";

  if (!gameState.dragonPoisoned) {
    // If the dragon is not due to return yet but the poison conditions are met
    if (
      timeInterval < 3 &&
      gameState.clothesPoopy &&
      !gameState.naked &&
      gameState.playerLocation === "crevice" &&
      gameState.itemLocations.puddle.includes("berries")
    ) {
      text +=
        "You jump as you hear the dragon just outside the cavern. Wasn't the dragon just in the lair? \n\n";
    }

    if (
      timeInterval === 3 ||
      (gameState.clothesPoopy &&
        !gameState.naked &&
        gameState.playerLocation === "crevice" &&
        gameState.itemLocations.puddle.includes("berries"))
    ) {
      text += "The dragon prowls into the cavern. ";
      // not poop and not hidden
      if (
        (!gameState.clothesPoopy || gameState.naked) &&
        gameState.playerLocation !== "crevice"
      ) {
        text += `"I KNEW I SMELT A HUMAN." You hide in a nearby crevice to avoid death, but the dragon still manages to singe you. \n\nAs you exit the crevice and smother the flames, you hear the dragon return to its lair to guard its treasure.`;
      } // poop and not hidden
      else if (
        gameState.clothesPoopy &&
        !gameState.naked &&
        gameState.playerLocation !== "crevice"
      ) {
        text += `"YOU DO NOT SMELL LIKE A HUMAN BUT YOU LOOK LIKE ONE." You hide in a nearby crevice to avoid death, but the dragon still manages to singe you. \n\nAs you exit the crevice and smother the flames, you hear the dragon return to its lair to guard its treasure. `;
      } // not poop and hidden
      else if (
        (!gameState.clothesPoopy || gameState.naked) &&
        gameState.playerLocation === "crevice"
      ) {
        text += `"I SMELL A HUMAN SOMEWHERE NEARBY." The dragon peers into the crevice and spots you. The dragon singes you before you can fight or run. \n\nAs you smother the flames, you hear the dragon return to its lair to guard its treasure.`;
      } // poop and hidden
      else if (
        gameState.clothesPoopy &&
        !gameState.naked &&
        gameState.playerLocation === "crevice"
      ) {
        text += "It seems unaware of your location. ";
        // dragon drinks
        if (gameState.itemLocations.puddle.includes("berries")) {
          text +=
            "\n\nThe dragon drinks from the puddle. It starts foaming at the mouth. Enraged and in pain, it stumbles back to the lair. ";
        } else {
          text +=
            "\n\nThe dragon drinks from the puddle, then returns to the lair to guard its treasure. ";
        }
      }
    } else if (timeInterval === 2) {
      text += "You hear the dragon just outside. ";
    } else if (timeInterval === 1) {
      text +=
        "You hear coins clanking from the other room, as if a large beast is rising from a sea of treasure. ";
    }
  }

  return text;
}

export const locations = {
  room,
  window,
  wardrobe,
  mirror,
  inn,
  courtyard,
  fountain,
  lawn,
  entryway,
  nursery,
  nurseryWindow,
  smithy,
  blacksmith,
  pasture,
  gate,
  youth,
  road1,
  road2,
  road3,
  stream,
  clearing,
  squirrel,
  wizard,
  cliff,
  caveEntrance,
  defecatory,
  puddle,
  crevice,
  dung,
  lair,
} as const;

export type LocationName = keyof typeof locations;

export type AlterItemLocationName = "inventory" | "outOfPlay";
