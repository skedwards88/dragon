import { ItemInteraction } from "./items";

class Location {
  constructor({
    id,
    getDisplayName = function () {
      return id;
    },
    getBackgroundName = function () {
      return id;
    },
    getConnections = function () {
      return {};
    },
    dropPreposition = "at",
    getSentient = function () {
      return false;
    },
    getHuman = function () {
      return false;
    },
    getDescription,
    onEnterGameStateEffect,
    onExitGameStateEffect,
    onEnterItemLocationEffect,
    onExitItemLocationEffect,
    getCustomPay = function () {
      return new ItemInteraction({});
    },
  }) {
    this.id = id;
    this.getDisplayName = getDisplayName;
    this.getBackgroundName = getBackgroundName;
    this.getSentient = getSentient;
    this.getHuman = getHuman;
    this.dropPreposition = dropPreposition;
    this.getConnections = getConnections;
    this.getDescription = getDescription;
    this.onEnterGameStateEffect = onEnterGameStateEffect;
    this.onExitGameStateEffect = onExitGameStateEffect;
    this.onEnterItemLocationEffect = onEnterItemLocationEffect;
    this.onExitItemLocationEffect = onExitItemLocationEffect;
    this.getCustomPay = getCustomPay;
  }
}

const room = new Location({
  id: "room",
  getConnections: function () {
    return {
      N: "wardrobe",
      S: "inn",
      E: "",
      W: "window",
      A: [],
    };
  },
  dropPreposition: "in",
  getDescription: function (gameState) {
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

const window = new Location({
  id: "window",
  getConnections: function () {
    return {
      N: "",
      S: "",
      E: "room",
      W: "",
      A: [],
    };
  },
  dropPreposition: "at",
  getDescription: function (gameState) {
    return gameState.manorFire
      ? "Through the window, you see flames and smoke coming from a nearby manor. A crowd has gathered in front of the manor. "
      : "Through the window, you see the charred remains of a nearby manor. ";
  },
});

const wardrobe = new Location({
  id: "wardrobe",
  getConnections: function () {
    return {
      N: "",
      S: "room",
      E: "mirror",
      W: "",
      A: [],
    };
  },
  dropPreposition: "in",
  getDescription: function (gameState) {
    return `Inside the wardrobe, there is a mirror${
      gameState.itemLocations.wardrobe.includes("clothes")
        ? " and a set of clothes"
        : ""
    }. `;
  },
});

const mirror = new Location({
  id: "mirror",
  getConnections: function () {
    return {
      N: "",
      S: "room",
      E: "",
      W: "wardrobe",
      A: [],
    };
  },
  dropPreposition: "at",
  getDescription: function (gameState) {
    return `${
      gameState.naked
        ? "You're naked!"
        : "You are quite good looking, if you say so yourself. "
    }`;
  },
});

const inn = new Location({
  id: "inn",
  getDisplayName: function (gameState) {
    return `${gameState.playerLocation === "room" ? "Door" : "Inn"}`;
  },
  getConnections: function () {
    return {
      N: "room",
      S: "courtyard",
      E: "",
      W: "",
      A: [],
    };
  },
  dropPreposition: "in",
  getDescription: function (gameState) {
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
  onEnterGameStateEffect: function (gameState) {
    if (gameState.naked) {
      return { reputation: gameState.reputation - 1 };
    }
  },
});

const courtyard = new Location({
  id: "courtyard",
  getConnections: function () {
    return {
      N: "inn",
      S: "",
      E: "smithy",
      W: "fountain",
      A: [],
    };
  },
  dropPreposition: "in",
  getDescription: function (gameState) {
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
  onExitGameStateEffect: function (gameState) {
    if (gameState.firstCourtyardEntry) {
      return { firstCourtyardEntry: false };
    }
  },
});

const fountain = new Location({
  id: "fountain",
  dropPreposition: "in",
  getConnections: function () {
    return {
      N: "lawn",
      S: "",
      E: "courtyard",
      W: "",
      A: [],
    };
  },
  getDescription: function (gameState) {
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

const lawn = new Location({
  id: "lawn",
  getDisplayName: function () {
    return "Manor";
  },
  getBackgroundName: function (gameState) {
    if (gameState.manorFire) {
      return "lawnFire";
    } else {
      return "lawnNoFire";
    }
  },
  dropPreposition: "at",
  getConnections: function () {
    return {
      N: "entryway",
      S: "",
      E: "fountain",
      W: "",
      A: [],
    };
  },
  getDescription: function (gameState) {
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
  onEnterGameStateEffect: function (gameState) {
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
  },
  onExitGameStateEffect: function (gameState) {
    if (gameState.savedBaby && !gameState.receivedBabyReward) {
      return { manorFire: false, receivedBabyReward: true };
    }
  },
  onEnterItemLocationEffect: function (gameState) {
    if (gameState.savedBaby && !gameState.receivedBabyReward) {
      return {
        item: "baby",
        oldLocation: "inventory",
        newLocation: "outOfPlay",
      };
    }
  },
});

const entryway = new Location({
  id: "entryway",
  dropPreposition: "in",
  getBackgroundName: function (gameState) {
    if (gameState.manorFire) {
      return "entrywayFire";
    } else {
      return "entrywayNoFire";
    }
  },
  getConnections: function (gameState) {
    return {
      N: gameState.manorFire ? "nursery" : "",
      S: "lawn",
      E: "",
      W: "",
      A: [],
    };
  },
  getDescription: function (gameState) {
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
  onEnterGameStateEffect: function (gameState) {
    if (gameState.itemLocations.inventory.includes("baby")) {
      return { babyCough: true };
    }
  },
});

const nursery = new Location({
  id: "nursery",
  dropPreposition: "in",
  getConnections: function () {
    return {
      N: "nurseryWindow",
      S: "entryway",
      E: "",
      W: "",
      A: [],
    };
  },
  getDescription: function (gameState) {
    if (gameState.manorFire) {
      if (gameState.itemLocations.nursery.includes("baby")) {
        return "You stand in a nursery. You see a baby wailing in the crib under an open window. The open window must be the only thing keeping the baby alive in this smoke. ";
      } else {
        return "You stand in a nursery with an empty crib. The fire continues to burn, pouring smoke into the room. ";
      }
    } else {
      return "You stand in the charred remains of a nursery. ";
    }
  },
  onEnterGameStateEffect: function (gameState) {
    if (!gameState.handkerchiefDamp || !gameState.playerMasked) {
      return { playerCough: true };
    }
  },
});

const nurseryWindow = new Location({
  id: "nurseryWindow",
  getDisplayName: function () {
    return "Window";
  },
  dropPreposition: "at",
  getConnections: function () {
    return {
      N: "",
      S: "nursery",
      E: "",
      W: "",
      A: [],
    };
  },
  getDescription: function (gameState) {
    return gameState.manorFire
      ? "Below the window, you see the gathered crowd. "
      : "You see the charred remains of the manor below you. ";
  },
});

const smithy = new Location({
  id: "smithy",
  getDisplayName: function () {
    return "Blacksmith shop";
  },
  dropPreposition: "at",
  getConnections: function () {
    return {
      N: "gate",
      S: "",
      E: "",
      W: "courtyard",
      A: ["blacksmith"],
    };
  },
  getDescription: function (gameState) {
    let text =
      "You stand in front of a blacksmith shop. From the shop, you can see the city gate and the inn courtyard. The blacksmith is working in front of the shop. ";

    if (gameState.itemLocations.smithy.includes("sword")) {
      text +=
        "In front of the shop, you see a sword gleaming as if someone was recently polishing it. ";
    }
    return text;
  },
});

const blacksmith = new Location({
  id: "blacksmith",
  dropPreposition: "by",
  getSentient: function () {
    return true;
  },
  getHuman: function () {
    return true;
  },
  getConnections: function () {
    return {
      N: "smithy",
      S: "",
      E: "",
      W: "",
      A: [],
    };
  },
  getDescription: function (gameState) {
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
      text += `\n\n"Are you interested in buying that sword?" they ask. "It costs ${gameState.swordCost} gold. " `;
    }
    return text;
  },
  onEnterGameStateEffect: function (gameState) {
    if (gameState.naked) {
      return {
        reputation: gameState.reputation - 1,
      };
    }
  },
  getCustomPay: function (gameState) {
    function writeDescription(gameState) {
      if (
        !gameState.ownSword &&
        gameState.itemLocations.smithy.includes("sword")
      ) {
        if (gameState.gold >= gameState.swordCost) {
          return `You hand the blacksmith ${gameState.swordCost} gold in exchange for the sword. `;
        } else {
          return `The blacksmith looks at your gold. "It looks like you don't have enough gold to buy this sword. Come back once you have enough gold, or try your luck without it." `;
        }
      }
    }

    function getGameEffect(gameState) {
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
    }

    function getItemMovements(gameState) {
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
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(gameState),
      itemMovements: getItemMovements(gameState),
      description: writeDescription(gameState),
    });
  },
});

const pasture = new Location({
  id: "pasture",
  getDisplayName: function (gameState) {
    const pastureHasHorse = gameState.itemLocations?.pasture.includes("horse");
    return pastureHasHorse && !gameState.horseDead ? "horse" : "pasture";
  },
  getSentient: function (gameState) {
    return (
      gameState.itemLocations.pasture.includes("horse") && !gameState.horseDead
    );
  },
  dropPreposition: "at",
  getConnections: function () {
    return {
      N: "",
      S: "",
      E: "gate",
      W: "",
      A: [],
    };
  },
  getDescription: function (gameState) {
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

const gate = new Location({
  id: "gate",
  dropPreposition: "at",
  getConnections: function () {
    return {
      N: "road1",
      S: "smithy",
      E: "",
      W: "pasture",
      A: ["youth"],
    };
  },
  getDescription: function (gameState) {
    return `You are standing at the city gate. You see a pasture and a road leading up a mountain. \n\nThe youth that you saw earlier stands at the gate${
      !gameState.playedForYouth ? ", crying" : ""
    }. `;
  },
});

const youth = new Location({
  id: "youth",
  getSentient: function () {
    return true;
  },
  getHuman: function () {
    return true;
  },
  dropPreposition: "by",
  getConnections: function () {
    return {
      N: "gate",
      S: "",
      E: "",
      W: "",
      A: [],
    };
  },
  getDescription: function (gameState) {
    let text = `The youth stands by the city gates${
      gameState.playedForYouth ? "" : " crying"
    }. `;
    if (gameState.naked) {
      text += `"Ack! Where are your clothes?!"`;
    }
    return text;
  },
  onEnterGameStateEffect: function (gameState) {
    if (gameState.naked) {
      return {
        reputation: gameState.reputation - 1,
      };
    }
  },
});

const road1 = new Location({
  id: "road1",
  dropPreposition: "on",
  getDisplayName: function () {
    return "Long road (South end)";
  },
  getBackgroundName: function () {
    return "road";
  },
  getConnections: function (gameState) {
    return {
      N: gameState.horseMounted ? "stream" : "road2",
      S: "gate",
      E: "",
      W: "",
      A: [],
    };
  },
  getDescription: function (gameState) {
    let text =
      "You stand at the end of a long road that stretches from the city gate to mountains. ";
    if (gameState.horseMounted) {
      text += "\n\nThankfully, the horse lets you travel quickly. ";
    }
    return text;
  },
});

const road2 = new Location({
  id: "road2",
  dropPreposition: "on",
  getDisplayName: function () {
    return "Long road (middle)";
  },
  getBackgroundName: function () {
    return "road";
  },
  getConnections: function (gameState) {
    return {
      N: gameState.horseMounted ? "stream" : "road3",
      S: gameState.horseMounted ? "gate" : "road1",
      E: "",
      W: "",
      A: [],
    };
  },
  getDescription: function (gameState) {
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

const road3 = new Location({
  id: "road3",
  dropPreposition: "on",
  getDisplayName: function () {
    return "Long road (North end)";
  },
  getBackgroundName: function () {
    return "road";
  },
  getConnections: function (gameState) {
    return {
      N: "stream",
      S: gameState.horseMounted ? "gate" : "road2",
      E: "",
      W: "",
      A: [],
    };
  },
  getDescription: function (gameState) {
    if (
      gameState.gotScoreByCredit &&
      !gameState.paidDebt &&
      gameState.treasureLevel &&
      !gameState.cursed
    ) {
      return 'As you cross the stream, a flash of lightning hits you, knocking you onto your back. "WHERE IS MY TREASURE?" the wizard demands. "Since you did not give me my share, you shall not have any." The treasure flies from your pouch and disappears down the stream. The wizard vanishes in a cloud of smoke.';
    } else {
      let text = `You stand at the end of a long road that stretches from the city gate to mountains. `;

      if (gameState.horseMounted) {
        text += "\n\nThankfully, the horse lets you travel quickly. ";
      }
      return text;
    }
  },

  onEnterGameStateEffect: function (gameState) {
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
  },

  onExitGameStateEffect: function (gameState) {
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
  },
});

const stream = new Location({
  id: "stream",
  dropPreposition: "in",
  getConnections: function () {
    return {
      N: "clearing",
      S: "road3",
      E: "",
      W: "",
      A: [],
    };
  },
  getDescription: function (gameState) {
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

const clearing = new Location({
  id: "clearing",
  dropPreposition: "in",
  getConnections: function (gameState) {
    return {
      N: "cliff",
      S: "stream",
      E: "",
      W: "",
      A: gameState.cursed ? ["squirrel"] : ["wizard", "squirrel"],
    };
  },
  getDescription: function (gameState) {
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

const squirrel = new Location({
  id: "squirrel",
  getDisplayName: function (gameState) {
    return gameState.squirrelDead ? "dead squirrel" : "squirrel";
  },
  getSentient: function (gameState) {
    return !gameState.squirrelDead;
  },
  getBackgroundName: function (gameState) {
    if (gameState.squirrelDead) {
      return "squirrelDead";
    } else {
      return "squirrel";
    }
  },
  dropPreposition: "by",
  getConnections: function () {
    return {
      N: "clearing",
      S: "",
      E: "",
      W: "",
      A: [],
    };
  },
  getDescription: function (gameState) {
    return gameState.squirrelDead
      ? "The squirrel lies dead on the ground. "
      : "You approach the squirrel. It pauses, perhaps curious if you will feed it, before scampering up the tree. ";
  },
});

const wizard = new Location({
  id: "wizard",
  getSentient: function () {
    return true;
  },
  getHuman: function () {
    return true;
  },
  dropPreposition: "by",
  getConnections: function () {
    return {
      N: "clearing",
      S: "",
      E: "",
      W: "",
      A: [],
    };
  },
  getDescription: function (gameState) {
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
  getCustomPay: function (gameState) {
    function writeDescription(gameState) {
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
        } else {
          return `"Hmm...You have not earned any treasure. Use your wits!"`;
        }
      }

      return `"Although I would like your gold, you have no debts to me."`;
    }

    function getGameEffect(gameState) {
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
    }

    function getItemMovements(gameState) {
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
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(gameState),
      itemMovements: getItemMovements(gameState),
      description: writeDescription(gameState),
    });
  },
});

const cliff = new Location({
  id: "cliff",
  dropPreposition: "on",
  getConnections: function (gameState) {
    return {
      N: gameState.itemLocations.inventory.includes("horse")
        ? ""
        : "caveEntrance",
      S: "clearing",
      E: "",
      W: "",
      A: [],
    };
  },

  getDescription: function (gameState) {
    let text = "";
    if (gameState.itemLocations.inventory.includes("horse")) {
      text += `The horse cannot make it up the rocky cliff. You must return to the clearing. `;
    } else {
      text += `You scramble on the rocky cliff. Above you is the entrance to a cave. Below you is a clearing next to a stream. `;
    }
    return text;
  },
});

const caveEntrance = new Location({
  id: "caveEntrance",
  getDisplayName: function () {
    return "Cave entrance";
  },
  dropPreposition: "at",
  getConnections: function () {
    return {
      N: "",
      S: "cliff",
      E: "lair",
      W: "defecatory",
      A: [],
    };
  },
  getDescription: function (gameState) {
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

const defecatory = new Location({
  id: "defecatory",
  dropPreposition: "in",
  getConnections: function () {
    return {
      N: "puddle",
      S: "crevice",
      E: "caveEntrance",
      W: "dung",
      A: [],
    };
  },
  getDescription: function () {
    return "You stand in a large, foul smelling cavern. There is a puddle of clear water, a crevice, and a pile of dragon dung. ";
  },
});

const puddle = new Location({
  id: "puddle",
  dropPreposition: "in",
  getConnections: function () {
    return {
      N: "",
      S: "crevice",
      E: "defecatory",
      W: "dung",
      A: [],
    };
  },
  getDescription: function (gameState) {
    return `You stand at a puddle of clear water. \n\n${dragonDescription(
      gameState
    )}`;
  },
  onEnterGameStateEffect: function (gameState) {
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

const crevice = new Location({
  id: "crevice",
  dropPreposition: "in",
  getConnections: function () {
    return {
      N: "puddle",
      S: "",
      E: "defecatory",
      W: "dung",
      A: [],
    };
  },
  getDescription: function (gameState) {
    return `You squeeze into the crevice. It isn't big, but it seems deep enough to hide your from sight. \n\n${dragonDescription(
      gameState
    )}`;
  },
  onEnterGameStateEffect: function (gameState) {
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
  onExitGameStateEffect: function (gameState) {
    // if the berries are in the puddle and you are poopy_hidden, the dragon is poisoned

    if (
      gameState.itemLocations.puddle.includes("berries") &&
      gameState.clothesPoopy &&
      !gameState.naked
    ) {
      return { dragonPoisoned: true };
    }
  },
});

const dung = new Location({
  id: "dung",
  dropPreposition: "in",
  getDisplayName: function () {
    return "Dung pile";
  },
  getConnections: function () {
    return {
      N: "puddle",
      S: "crevice",
      E: "defecatory",
      W: "",
      A: [],
    };
  },
  getDescription: function (gameState) {
    return `You stand in front of a large pile of dragon dung. The stench makes your eyes water. \n\n${dragonDescription(
      gameState
    )}`;
  },
  onEnterGameStateEffect: function (gameState) {
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

const lair = new Location({
  id: "lair",
  dropPreposition: "in",
  getConnections: function () {
    return {
      N: "",
      S: "",
      E: "caveEntrance",
      W: "",
      A: [],
    };
  },
  getDescription: function (gameState) {
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
  onEnterGameStateEffect: function (gameState) {
    // todo maybe shouldn't get singed when enter...but then would need to get singed any time you try to do something at this location
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
  },
});

function dragonDescription(gameState) {
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
  room: room,
  window: window,
  wardrobe: wardrobe,
  mirror: mirror,
  inn: inn,
  courtyard: courtyard,
  fountain: fountain,
  lawn: lawn,
  entryway: entryway,
  nursery: nursery,
  nurseryWindow: nurseryWindow,
  smithy: smithy,
  blacksmith: blacksmith,
  pasture: pasture,
  gate: gate,
  youth: youth,
  road1: road1,
  road2: road2,
  road3: road3,
  stream: stream,
  clearing: clearing,
  squirrel: squirrel,
  wizard: wizard,
  cliff: cliff,
  caveEntrance: caveEntrance,
  defecatory: defecatory,
  puddle: puddle,
  crevice: crevice,
  dung: dung,
  lair: lair,
};

export default {
  locations,
};
