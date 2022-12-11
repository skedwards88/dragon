import { locations } from "./locations";

export class ItemInteraction {
  constructor({
    gameEffect,
    description,
    targetItemDestination,
    itemMovements = [],
  }) {
    this.description = description;
    this.gameEffect = gameEffect;
    this.targetItemDestination = targetItemDestination;
    this.itemMovements = itemMovements;
  }
}

class Item {
  constructor({
    id,
    displayName = id,
    spawnLocation,
    getDescription = function () {
      return id;
    },

    getUseVerb = function () {
      return "Use";
    },

    getCustomDrop = function () {
      return new ItemInteraction({});
    },
    getCustomGive = function () {
      return new ItemInteraction({});
    },
    getCustomTake = function () {
      return new ItemInteraction({});
    },
    getCustomUse = function () {
      return new ItemInteraction({});
    },
  }) {
    this.id = id;
    this.displayName = displayName;
    this.spawnLocation = spawnLocation;
    this.getDescription = getDescription;

    this.getUseVerb = getUseVerb;

    this.getCustomDrop = getCustomDrop;
    this.getCustomGive = getCustomGive;
    this.getCustomTake = getCustomTake;
    this.getCustomUse = getCustomUse;
  }
}

const lute = new Item({
  id: "lute",
  spawnLocation: "room",
  getDescription: function () {
    return "wooden lute";
  },

  getUseVerb: function () {
    return "Play";
  },

  getCustomUse: function (gameState) {
    function writeDescription(gameState) {
      if (gameState.playerLocation === "youth" && !gameState.playedForYouth) {
        return `You play a song for the crying youth. The music seems to cheer the youth up. `;
      } else if (
        gameState.playerLocation === "youth" &&
        gameState.playedForYouth
      ) {
        return `They appreciate the music, but don't seem keen to listen all day. `;
      } else {
        return "You play a beautiful melody. ";
      }
    }

    function getGameEffect(gameState) {
      if (gameState.playerLocation === "youth" && !gameState.playedForYouth) {
        return {
          reputation: gameState.reputation + 1,
          playedForYouth: true,
        };
      }
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(gameState),
      description: writeDescription(gameState),
    });
  },

  getCustomTake: function (gameState) {
    function writeDescription(gameState) {
      if (gameState.playerLocation === "room") {
        return "The lute feels familiar. ";
      }
    }

    return new ItemInteraction({
      description: writeDescription(gameState),
    });
  },
});

const clothes = new Item({
  id: "clothes",
  spawnLocation: "wardrobe",
  getDescription: function (gameState) {
    return gameState.clothesPoopy ? "poopy set of clothes" : "set of clothes";
  },

  getUseVerb: function (gameState) {
    return gameState.naked ? "Wear" : "Remove";
  },
  getCustomUse: function (gameState) {
    function writeDescription(gameState) {
      let text = gameState.naked
        ? "You put on the clothes. "
        : "You strip down. ";

      if (gameState.clothesPoopy) {
        text +=
          "You wrinkle your nose in distaste. Certainly you are not fit for fine company anymore.";
      }
      if (!gameState.naked && gameState.playerLocation === "inn") {
        text += "The innkeeper eyes you suspiciously.";
      }
      if (!gameState.naked && gameState.playerLocation === "blacksmith") {
        text += "The blacksmith eyes you suspiciously.";
      }
      if (!gameState.naked && gameState.playerLocation === "youth") {
        text += "The youth eyes you suspiciously.";
      }
      return text;
    }

    function getGameEffect(gameState) {
      let gameEffect = gameState.naked ? { naked: false } : { naked: true };
      if (
        !gameState.naked &&
        (gameState.playerLocation === "inn" ||
          gameState.playerLocation === "blacksmith" ||
          gameState.playerLocation === "youth")
      ) {
        gameEffect = {
          ...gameEffect,
          reputation: gameState.reputation - 1,
        };
      }
      return gameEffect;
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(gameState),
      description: writeDescription(gameState),
    });
  },

  getCustomDrop: function (gameState) {
    function writeDescription(gameState) {
      let text = "";
      const dropPreposition =
        locations[gameState.playerLocation].dropPreposition;

      gameState.naked
        ? (text += `You drop your clothes ${dropPreposition} the ${gameState.playerLocation}. `)
        : (text += `You strip down and drop your clothes ${dropPreposition} the ${gameState.playerLocation}. `);

      if (!gameState.naked && gameState.playerLocation === "inn") {
        text += "The innkeeper eyes you suspiciously.";
      }
      if (!gameState.naked && gameState.playerLocation === "blacksmith") {
        text += "The blacksmith eyes you suspiciously.";
      }
      if (!gameState.naked && gameState.playerLocation === "youth") {
        text += "The youth eyes you suspiciously.";
      }
      if (["fountain", "stream", "puddle"].includes(gameState.playerLocation)) {
        text += "Your clothes look much cleaner now. ";
      }

      return text;
    }

    function getGameEffect(gameState) {
      let gameEffect = { naked: true };
      if (
        !gameState.naked &&
        (gameState.playerLocation === "inn" ||
          gameState.playerLocation === "blacksmith" ||
          gameState.playerLocation === "youth")
      ) {
        gameEffect = {
          ...gameEffect,
          reputation: gameState.reputation - 1,
        };
      }
      if (gameState.playerLocation === "dung") {
        gameEffect = {
          ...gameEffect,
          clothesPoopy: true,
        };
      }
      if (["fountain", "stream", "puddle"].includes(gameState.playerLocation)) {
        gameEffect = {
          ...gameEffect,
          clothesPoopy: false,
        };
      }
      return gameEffect;
    }

    if (["fountain", "stream", "puddle"].includes(gameState.playerLocation)) {
      return new ItemInteraction({
        description: writeDescription(gameState),
        gameEffect: getGameEffect(gameState),
      });
    }

    if (gameState.playerLocation === "dung") {
      return new ItemInteraction({
        description: writeDescription(gameState),
        gameEffect: getGameEffect(gameState),
      });
    }

    return new ItemInteraction({
      description: writeDescription(gameState),
      gameEffect: getGameEffect(gameState),
    });
  },
});

const apple = new Item({
  id: "apple",
  spawnLocation: "inn",
  getDescription: function (gameState) {
    switch (gameState.appleBitesRemaining) {
      case 5:
        return "fresh apple";
      case 4:
        return "apple with a bite taken";
      case 3:
        return "partially eaten apple";
      case 2:
        return "mostly eaten apple";
      case 1:
        return "apple with one bite remaining";
      case 0:
        return "apple core";
      default:
        return "apple core";
    }
  },

  getUseVerb: function () {
    return "Eat";
  },
  getCustomUse: function (gameState) {
    function writeDescription(gameState) {
      switch (gameState.appleBitesRemaining) {
        case 5:
          return "You take a bite from the apple, feeling refreshed. ";
        case 4:
          return "You take a bite from the apple, feeling refreshed. It looks like there are a few bites remaining. ";
        case 3:
          return "You take a bite from the apple, feeling refreshed. It looks like there are a couple of bites remaining. ";
        case 2:
          return "You take a bite from the apple, wondering if you'll be able to find another apple. It looks like there is one bite remaining. ";
        case 1:
          return "You take the last bite from the apple, feeling regret that there isn't any more. ";
        case 0:
          return "You nibble at the core, but there isn't much flesh remaining. ";
        default:
          return "You nibble at the core, but there isn't much flesh remaining. ";
      }
    }

    function getGameEffect(gameState) {
      if (gameState.appleBitesRemaining > 0) {
        return {
          appleBitesRemaining: gameState.appleBitesRemaining - 1,
        };
      }
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(gameState),
      description: writeDescription(gameState),
    });
  },

  getCustomDrop: function (gameState) {
    function writeDescription(gameState) {
      let appleDescription;
      if (gameState.appleBitesRemaining <= 0) {
        appleDescription = "apple core";
      } else if (gameState.appleBitesRemaining === 5) {
        appleDescription = "apple";
      } else {
        appleDescription = "partially eaten apple";
      }
      if (
        gameState.itemLocations[gameState.playerLocation].includes("horse") &&
        !gameState.horseTethered
      ) {
        if (gameState.appleBitesRemaining > 0) {
          return `This horse seems very interested in food. The horse walks over to eat the ${appleDescription} that you dropped. While he is preoccupied, you grab the reins. You now have a horse.`;
        } else {
          return `This horse seems very interested in food. The horse walks over to eat the ${appleDescription} that you dropped but the paltry amount remaining doesn't occupy him for long. He trots away as you try to grab the reins.`;
        }
      }

      if (gameState.playerLocation === "squirrel" && !gameState.squirrelDead) {
        return `The squirrel sniffs at the ${appleDescription} but doesn't bite. Perhaps it needs something smaller. `;
      }
    }

    if (
      gameState.itemLocations[gameState.playerLocation].includes("horse") &&
      !gameState.horseTethered &&
      gameState.appleBitesRemaining > 0
    ) {
      return new ItemInteraction({
        gameEffect: { horseTethered: true },
        targetItemDestination: "outOfPlay",
        itemMovements: [
          {
            item: "horse",
            oldLocation: gameState.playerLocation,
            newLocation: "inventory",
          },
        ],
        description: writeDescription(gameState),
      });
    }

    return new ItemInteraction({
      description: writeDescription(gameState),
    });
  },

  getCustomGive: function (gameState) {
    function writeDescription(gameState) {
      let appleDescription;
      if (gameState.appleBitesRemaining <= 0) {
        appleDescription = "apple core";
      } else if (gameState.appleBitesRemaining === 5) {
        appleDescription = "apple";
      } else {
        appleDescription = "partially eaten apple";
      }
      if (
        gameState.itemLocations[gameState.playerLocation].includes("horse") &&
        !gameState.horseTethered
      ) {
        if (gameState.appleBitesRemaining > 0) {
          return `This horse seems very interested in food. The horse walks over to eat the ${appleDescription} that you offered. While he is preoccupied, you grab the reins. You now have a horse.`;
        } else {
          return `This horse seems very interested in food. The horse walks over to eat the ${appleDescription} that you offered but the paltry amount remaining doesn't occupy him for long. He trots away as you try to grab the reins.`;
        }
      }

      if (gameState.playerLocation === "squirrel" && !gameState.squirrelDead) {
        return `The squirrel sniffs at the ${appleDescription} but doesn't bite. Perhaps it needs something smaller. `;
      }
    }

    if (
      gameState.itemLocations[gameState.playerLocation].includes("horse") &&
      !gameState.horseTethered &&
      gameState.appleBitesRemaining > 0
    ) {
      return new ItemInteraction({
        gameEffect: { horseTethered: true },
        targetItemDestination: "outOfPlay",
        itemMovements: [
          {
            item: "horse",
            oldLocation: gameState.playerLocation,
            newLocation: "inventory",
          },
        ],
        description: writeDescription(gameState),
      });
    } else {
      return new ItemInteraction({});
    }
  },
});

const handkerchief = new Item({
  id: "handkerchief",
  spawnLocation: "courtyard",
  getDescription: function (gameState) {
    return gameState.handkerchiefDamp ? "damp handkerchief" : "handkerchief";
  },
  getUseVerb: function (gameState) {
    return gameState.playerMasked ? "Remove" : "Wear";
  },
  getCustomUse: function (gameState) {
    function writeDescription(gameState) {
      let text = "";
      gameState.playerMasked
        ? (text += "You remove the handkerchief from your nose and mouth. ")
        : (text += "You tie the handkerchief around your nose and mouth. ");

      if (
        ["manor", "nursery", "nurseryWindow"].includes(
          gameState.playerLocation
        ) &&
        gameState.manorFire &&
        gameState.handkerchiefDamp
      ) {
        if (gameState.playerMasked) {
          // was masked ==> is now not masked
          text += "The smoke fills your lungs, making you cough. ";
        } else {
          // was not masked ==> is now masked
          text += "The damp handkerchief lets you breath more easily. ";
        }
      }

      if (
        ["manor", "nursery", "nurseryWindow"].includes(
          gameState.playerLocation
        ) &&
        gameState.manorFire &&
        !gameState.handkerchiefDamp
      ) {
        if (!gameState.playerMasked) {
          // was not masked ==> is now masked
          text +=
            "On its own, the handkerchief does little to block the smoke. ";
        }
      }

      if (
        ["dung", "defecatory", "crevice", "puddle"].includes(
          gameState.playerLocation && !gameState.playerMasked
        )
      ) {
        text += "Even with it, the stench reaches your nose. ";
      }

      return text;
    }

    function getGameEffect(gameState) {
      return gameState.playerMasked
        ? { playerMasked: false }
        : { playerMasked: true };
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(gameState),
      description: writeDescription(gameState),
    });
  },

  getCustomDrop: function (gameState) {
    function writeDescription(gameState) {
      if (gameState.playerMasked) {
        const dropPreposition =
          locations[gameState.playerLocation].dropPreposition;

        let text = `You remove the handkerchief from your nose and mouth and drop it ${dropPreposition} the ${gameState.playerLocation}. `;

        if (
          ["manor", "nursery", "nurseryWindow"].includes(
            gameState.playerLocation
          ) &&
          gameState.manorFire &&
          gameState.handkerchiefDamp
        ) {
          text += "The smoke fills your lungs, making you cough. ";
        }
        return text;
      }
    }

    function getGameEffect(gameState) {
      let gameEffect = {};

      if (gameState.playerMasked) {
        gameEffect = { ...gameEffect, playerMasked: false };
      }

      if (["fountain", "stream", "puddle"].includes(gameState.playerLocation)) {
        gameEffect = { ...gameEffect, handkerchiefDamp: true };
      }

      if (Object.keys(gameEffect).length) return gameEffect;
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(gameState),
      description: writeDescription(gameState),
    });
  },

  getCustomGive: function (gameState) {
    function writeDescription(gameState) {
      if (gameState.playerLocation === "youth") {
        if (!gameState.offeredHandkerchiefToYouth) {
          return `You offer the handkerchief that you saw the youth drop. "Th-thank you," they sob, "but I don't want it back. You keep it; perhaps you will find a use for it." \n\nThe youth tells you that they were meant to be sacrificed to the dragon in exchange for another year of safety for the town. In retaliation, they set the mayor's house on fire, not realizing that the baby was trapped inside. `;
        }
      }
    }

    function getGameEffect(gameState) {
      let gameEffect = {};

      if (
        gameState.playerLocation === "youth" &&
        !gameState.offeredHandkerchiefToYouth
      ) {
        gameEffect = {
          ...gameEffect,
          reputation: gameState.reputation + 1,
          offeredHandkerchiefToYouth: true,
        };
      }

      if (Object.keys(gameEffect).length) return gameEffect;
    }

    function getTargetItemDestination(gameState) {
      if (
        gameState.playerLocation === "youth" &&
        !gameState.offeredHandkerchiefToYouth
      ) {
        return "inventory";
      }
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(gameState),
      targetItemDestination: getTargetItemDestination(gameState),
      description: writeDescription(gameState),
    });
  },
});

const baby = new Item({
  id: "baby",
  spawnLocation: "nursery",
  getDescription: function () {
    return "crying baby";
  },
  getUseVerb: function () {
    return "Use";
  },
  getCustomUse: function (gameState) {
    function writeDescription() {
      return "It's unclear what use this baby has. ";
    }

    return new ItemInteraction({
      description: writeDescription(gameState),
    });
  },

  getCustomDrop: function (gameState) {
    function writeDescription(gameState) {
      if (gameState.playerLocation === "nursery") {
        return "You place the baby back in the crib. ";
      } else if (gameState.playerLocation === "nurseryWindow") {
        return "You drop the baby out of the open window. The crowd below catches the baby. ";
      } else {
        return "You drop the crying baby. It cries even louder. ";
      }
    }

    function getGameEffect(gameState) {
      // you "save the baby" when you pick it up. If you drop it anywhere besides the window, you no longer save it.
      if (gameState.playerLocation !== "nurseryWindow") {
        return { savedBaby: false };
      }
    }

    function getTargetItemDestination(gameState) {
      if (gameState.playerLocation === "nurseryWindow") {
        return "outOfPlay";
      }
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(gameState),
      targetItemDestination: getTargetItemDestination(gameState),
      description: writeDescription(gameState),
    });
  },

  getCustomTake: function (gameState) {
    function writeDescription(gameState) {
      if (gameState.playerLocation === "nursery") {
        return "You pick up the baby from the crib. The baby coughs as you move it away from the open window. ";
      }
    }

    return new ItemInteraction({
      gameEffect: { savedBaby: true },
      description: writeDescription(gameState),
    });
  },
});

const sword = new Item({
  id: "sword",
  spawnLocation: "smithy",
  getUseVerb: function () {
    return "Attack";
  },
  getCustomUse: function (gameState) {
    function writeDescription(gameState) {
      if (
        gameState.dragonAsleep &&
        !gameState.dragonDead &&
        gameState.playerLocation === "lair"
      ) {
        return "You cut off the head of the dragon, freeing the town from the dragon's tyrannical rule. ";
      } else if (
        gameState.dragonPoisoned &&
        !gameState.dragonAsleep &&
        !gameState.dragonDead &&
        gameState.playerLocation === "lair"
      ) {
        return "Despite the poison, the dragon is still able to singe you once you get near enough to cut off its head. ";
      } else if (
        !gameState.dragonPoisoned &&
        !gameState.dragonAsleep &&
        !gameState.dragonDead &&
        gameState.playerLocation === "lair"
      ) {
        return "You try to cut off the dragon's head, but it singes you as soon as you get close enough. ";
      } else {
        return "You slash the sword through the air, looking a bit foolish. ";
      }
    }

    function getGameEffect(gameState) {
      if (
        gameState.dragonAsleep &&
        !gameState.dragonDead &&
        gameState.playerLocation === "lair"
      ) {
        return {
          dragonDead: true,
          reputation: gameState.reputation + 2,
        };
      } else if (
        !gameState.dragonAsleep &&
        !gameState.dragonDead &&
        gameState.playerLocation === "lair"
      ) {
        return {
          singeCount: gameState.singeCount + 1,
          reputation: gameState.reputation - 1,
        };
      }
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(gameState),
      description: writeDescription(gameState),
    });
  },

  getCustomTake: function (gameState) {
    function writeDescription(gameState) {
      if (gameState.playerLocation === "smithy" && !gameState.ownSword) {
        return 'You grab the sword and place it in your bag. "Hey! Are you stealing my sword?" The blacksmith grabs the sword from you and returns it to the table. ';
      }

      if (gameState.playerLocation === "wizard" && gameState.gotScoreByTrade) {
        return "Ah you would like to exchange? You must first give me the score.";
      }
    }

    function getGameEffect(gameState) {
      if (gameState.playerLocation === "smithy" && !gameState.ownSword) {
        return {
          reputation: gameState.reputation - 1,
          swordCost: Math.min(gameState.swordCost + 10, gameState.maxSwordCost),
        };
      }
    }
    function getTargetItemDestination(gameState) {
      if (gameState.playerLocation === "smithy" && !gameState.ownSword) {
        return "smithy";
      }

      if (gameState.playerLocation === "wizard" && gameState.gotScoreByTrade) {
        return "wizard";
      }
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(gameState),
      targetItemDestination: getTargetItemDestination(gameState),
      description: writeDescription(gameState),
    });
  },

  getCustomGive: function (gameState) {
    function writeDescription(gameState) {
      if (
        gameState.itemLocations.wizard.includes("score") &&
        !(gameState.gotScoreByCredit || gameState.gotScoreByTrade) &&
        gameState.playerLocation === "wizard"
      ) {
        return "You give your sword to the wizard. In exchange, they give you the musical score. ";
      }
    }

    function getGameEffect(gameState) {
      let gameEffect = {};

      if (
        gameState.itemLocations.wizard.includes("score") &&
        !(gameState.gotScoreByCredit || gameState.gotScoreByTrade) &&
        gameState.playerLocation === "wizard"
      ) {
        gameEffect = { ...gameEffect, gotScoreByTrade: true };
      }

      if (Object.keys(gameEffect).length) return gameEffect;
    }

    function getTargetItemDestination(gameState) {
      if (
        gameState.itemLocations.wizard.includes("score") &&
        !(gameState.gotScoreByCredit || gameState.gotScoreByTrade) &&
        gameState.playerLocation === "wizard"
      ) {
        return "wizard";
      }
    }

    function getItemMovements(gameState) {
      if (
        gameState.itemLocations.wizard.includes("score") &&
        !(gameState.gotScoreByCredit || gameState.gotScoreByTrade) &&
        gameState.playerLocation === "wizard"
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
      targetItemDestination: getTargetItemDestination(gameState),
      description: writeDescription(gameState),
      itemMovements: getItemMovements(gameState),
    });
  },
});

const horse = new Item({
  id: "horse",
  spawnLocation: "pasture",
  getDescription: function (gameState) {
    return gameState.horseDead ? "dead horse" : "voracious horse";
  },

  getUseVerb: function (gameState) {
    return gameState.horseMounted ? "Unmount" : "Mount";
  },
  getCustomUse: function (gameState) {
    function writeDescription(gameState) {
      return gameState.horseMounted
        ? "You unmount the horse, keeping hold of the horse's reins. "
        : "You mount the horse. Much easier than walking!"; // todo should you be allowed to mount inside a building?
    }

    function getGameEffect(gameState) {
      return gameState.horseMounted
        ? { horseMounted: false, horseTethered: true }
        : { horseMounted: true, horseTethered: true };
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(gameState),
      description: writeDescription(gameState),
    });
  },

  getCustomDrop: function (gameState) {
    function writeDescription(gameState) {
      let text = "";

      if (gameState.horseMounted) {
        text += "You unmount the horse and let go of the horse's reins. ";
      } else {
        text += "You let go of the horse's reins. ";
      }

      if (
        gameState.itemLocations[gameState.playerLocation].includes("berries")
      ) {
        text +=
          "The horse starts to eat the berries. After a few mouthfuls, it foams at the mouth and falls over dead. ";
      } else {
        text +=
          "The horse shakes its mane, glad to have a free head. It starts nosing around for food to munch. ";
      }

      return text;
    }

    function getGameEffect(gameState) {
      let gameEffect = { horseTethered: false };

      if (
        gameState.itemLocations[gameState.playerLocation].includes("berries")
      ) {
        gameEffect = { ...gameEffect, horseDead: true };
      }

      if (gameState.horseMounted) {
        gameEffect = { ...gameEffect, horseMounted: false };
      }

      return gameEffect;
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(gameState),
      description: writeDescription(gameState),
    });
  },

  getCustomTake: function (gameState) {
    function writeDescription(gameState) {
      if (gameState.horseDead) {
        return "This dead horse is too heavy to carry. ";
      }

      if (!gameState.horseTethered) {
        return "You try to grab the horse's reins, but it evades you. It seems more interested in foraging for food than carrying you around. ";
      }

      if (gameState.horseTethered) {
        return "You take back the horse's reins. ";
      }
    }

    function getTargetItemDestination(gameState) {
      if (gameState.horseDead) {
        return gameState.playerLocation;
      }

      if (!gameState.horseTethered) {
        return gameState.playerLocation;
      }
    }

    return new ItemInteraction({
      targetItemDestination: getTargetItemDestination(gameState),
      description: writeDescription(gameState),
    });
  },

  getCustomGive: function (gameState) {
    function getGameEffect(gameState) {
      if (gameState.horseMounted) {
        return { horseMounted: false, horseTethered: true };
      }
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(gameState),
    });
  },
});

const berries = new Item({
  id: "berries",
  spawnLocation: "clearing",
  getDescription: function () {
    return "handful of berries";
  },

  getUseVerb: function () {
    return "Eat";
  },
  getCustomUse: function (gameState) {
    return new ItemInteraction({
      gameEffect: {
        playerPoisoned: true,
        reputation: gameState.reputation - 1,
      },
      description:
        "You pop some berries into your mouth. Immediately, your mouth starts to tingle, so you spit out the berries. You narrowly avoided death, but your face is splotchy and swollen, and your lips are a nasty shade of purple. ",
      targetItemDestination: "inventory",
    });
  },

  getCustomDrop: function (gameState) {
    function writeDescription(gameState) {
      let text = "";
      if (gameState.playerLocation === "squirrel" && !gameState.squirrelDead) {
        text +=
          "The squirrel eats the berries that you dropped. After a few seconds, it foams at the mouth and rolls over, dead. Oh dear. ";
      }
      if (
        gameState.itemLocations[gameState.playerLocation].includes("horse") &&
        !gameState.horseTethered &&
        !gameState.horseDead
      ) {
        text +=
          "The horse eats the berries that you dropped. After a few seconds, it foams at the mouth and falls over, dead. Oh dear. ";
      }
      return text;
    }

    function getGameEffect(gameState) {
      let gameEffect = {};

      if (gameState.playerLocation === "squirrel" && !gameState.squirrelDead) {
        gameEffect = { ...gameEffect, squirrelDead: true };
      }

      if (
        gameState.itemLocations[gameState.playerLocation].includes("horse") &&
        !gameState.horseTethered
      ) {
        gameEffect = { ...gameEffect, horseDead: true };
      }

      if (Object.keys(gameEffect).length) return gameEffect;
    }

    function getTargetItemDestination(gameState) {
      if (gameState.playerLocation === "squirrel" && !gameState.squirrelDead) {
        return "squirrel";
      }
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(gameState),
      targetItemDestination: getTargetItemDestination(gameState),
      description: writeDescription(gameState),
    });
  },

  getCustomGive: function (gameState) {
    function writeDescription(gameState) {
      let text = "";
      if (gameState.playerLocation === "squirrel" && !gameState.squirrelDead) {
        text +=
          "The squirrel eats the berries that you offered. After a few seconds, it foams at the mouth and rolls over, dead. Oh dear. ";
      }

      if (
        gameState.itemLocations[gameState.playerLocation].includes("horse") &&
        !gameState.horseTethered &&
        !gameState.horseDead
      ) {
        text +=
          "The horse eats the berries that you offered. After a few seconds, it foams at the mouth and falls over, dead. Oh dear. ";
      }
      if (gameState.playerLocation === "wizard") {
        text += `The wizard politely refuses the berries. "Those will give you a life changing experience," he says.`;
      }
      return text;
    }

    function getGameEffect(gameState) {
      if (gameState.playerLocation === "squirrel" && !gameState.squirrelDead) {
        return { squirrelDead: true };
      }
      if (
        gameState.itemLocations[gameState.playerLocation].includes("horse") &&
        !gameState.horseTethered
      ) {
        return { horseDead: true };
      }
    }

    function getTargetItemDestination(gameState) {
      if (gameState.playerLocation === "squirrel" && !gameState.squirrelDead) {
        return "squirrel";
      }

      if (gameState.playerLocation === "wizard") {
        return "inventory";
      }
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(gameState),
      targetItemDestination: getTargetItemDestination(gameState),
      description: writeDescription(gameState),
    });
  },
});

const treasure = new Item({
  id: "treasure",
  spawnLocation: "lair",

  getCustomTake: function (gameState) {
    function writeDescription(gameState) {
      if (gameState.dragonDead) {
        return "You scoop all of the treasure into your bag, avoiding the gore from the severed dragon head. ";
      }

      if (gameState.dragonAsleep && !gameState.dragonDead) {
        if (gameState.treasureLevel === 2) {
          return "You already took the treasure that you can safely reach. As you edge closer to take more, the dragon snores, releasing a burst of flame that singes your eyebrows. ";
        } else {
          return "Giving a wide berth to the snoring dragon, you scoop as much treasure as possible into your bag. The dragon's head rests on the last of the treasure, and a snore of fire singes you as you try to take it. ";
        }
      }

      if (
        gameState.dragonPoisoned &&
        !gameState.dragonAsleep &&
        !gameState.dragonDead
      ) {
        if (gameState.treasureLevel) {
          return "You already took the treasure that you can safely reach. As you edge closer to take more, the dragon shoots a burst of flame, burning your hands. ";
        } else {
          return "With the dragon slower from the poison, you can now reach the edge of the treasure pile. You scoop all of the treasure within reach into your bag, but the dragon shoots a blast of flame, preventing you from getting any closer. ";
        }
      }

      if (
        !gameState.dragonPoisoned &&
        !gameState.dragonAsleep &&
        !gameState.dragonDead
      ) {
        return "You try to steal the treasure, but the dragon singes you before you can get close. ";
      }
    }
    function getGameEffect(gameState) {
      if (gameState.dragonDead) {
        const newTreasureLevel = 3;
        const treasureLevelDiff = newTreasureLevel - gameState.treasureLevel;
        const treasureTaken =
          gameState.treasureAmount * (treasureLevelDiff / 3);

        return {
          gold: gameState.gold + treasureTaken,
          treasureLevel: newTreasureLevel,
        };
      }

      if (gameState.dragonAsleep && !gameState.dragonDead) {
        const newTreasureLevel = 2;
        const treasureLevelDiff = newTreasureLevel - gameState.treasureLevel;
        const treasureTaken =
          gameState.treasureAmount * (treasureLevelDiff / 3);

        return {
          gold: gameState.gold + treasureTaken,
          treasureLevel: newTreasureLevel,
          singeCount: gameState.singeCount + 1,
          reputation: gameState.reputation - 1,
        };
      }

      if (
        gameState.dragonPoisoned &&
        !gameState.dragonAsleep &&
        !gameState.dragonDead
      ) {
        const newTreasureLevel = 1;
        const treasureLevelDiff = newTreasureLevel - gameState.treasureLevel;
        const treasureTaken =
          gameState.treasureAmount * (treasureLevelDiff / 3);

        return {
          gold: gameState.gold + treasureTaken,
          treasureLevel: newTreasureLevel,
          singeCount: gameState.singeCount + 2,
          reputation: gameState.reputation - 2,
        };
      }

      if (
        !gameState.dragonPoisoned &&
        !gameState.dragonAsleep &&
        !gameState.dragonDead
      ) {
        return {
          singeCount: gameState.singeCount + 1,
          reputation: gameState.reputation - 1,
        };
      }
    }

    function getTargetItemDestination(gameState) {
      if (gameState.dragonDead) {
        return "outOfPlay";
      } else {
        return "lair";
      }
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(gameState),
      targetItemDestination: getTargetItemDestination(gameState),
      description: writeDescription(gameState),
    });
  },
});

const score = new Item({
  id: "score",
  spawnLocation: "wizard",
  getDescription: function () {
    return "musical score";
  },
  getUseVerb: function () {
    return "Play";
  },
  getCustomUse: function (gameState) {
    function writeDescription(gameState) {
      if (!gameState.itemLocations.inventory.includes("lute")) {
        return "You would like to play this song, but you have no instrument. ";
      }

      if (
        gameState.dragonPoisoned &&
        !gameState.dragonAsleep &&
        !gameState.dragonDead &&
        gameState.playerLocation === "lair" &&
        gameState.itemLocations.inventory.includes("lute")
      ) {
        return "You play a lulling melody. The dragon closes its eyes and begins to snore. ";
      }

      if (
        !gameState.dragonPoisoned &&
        !gameState.dragonAsleep &&
        !gameState.dragonDead &&
        gameState.playerLocation === "lair" &&
        gameState.itemLocations.inventory.includes("lute")
      ) {
        return "Before you can play the first few notes, the dragon lets out a burst of flame, singing you and nearly burning your lute. ";
      }

      return "You play a lulling melody. ";
    }

    function getGameEffect(gameState) {
      if (
        gameState.dragonPoisoned &&
        !gameState.dragonAsleep &&
        !gameState.dragonDead &&
        gameState.playerLocation === "lair" &&
        gameState.itemLocations.inventory.includes("lute")
      ) {
        return {
          dragonAsleep: true,
        };
      }

      if (
        !gameState.dragonPoisoned &&
        !gameState.dragonAsleep &&
        !gameState.dragonDead &&
        gameState.playerLocation === "lair" &&
        gameState.itemLocations.inventory.includes("lute")
      ) {
        return {
          singeCount: gameState.singeCount + 1,
          reputation: gameState.reputation - 1,
        };
      }
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(gameState),
      description: writeDescription(gameState),
    });
  },

  getCustomTake: function (gameState) {
    function writeDescription(gameState) {
      if (!(gameState.gotScoreByCredit || gameState.gotScoreByTrade)) {
        return `"Ah ah!" The wizard shakes a finger at you. "Not for free. I would trade it for ${
          gameState.itemLocations.inventory.includes("sword")
            ? "your fine sword or "
            : ""
        }gold." `;
      }
    }

    function getTargetItemDestination(gameState) {
      if (!(gameState.gotScoreByCredit || gameState.gotScoreByTrade)) {
        return "wizard";
      }
    }

    return new ItemInteraction({
      targetItemDestination: getTargetItemDestination(gameState),
      description: writeDescription(gameState),
    });
  },

  getCustomGive: function (gameState) {
    function writeDescription(gameState) {
      if (
        gameState.playerLocation === "wizard" &&
        gameState.gotScoreByTrade &&
        gameState.itemLocations.inventory.includes("score") &&
        gameState.itemLocations.wizard.includes("sword")
      ) {
        return '"You would like to exchange?" The wizard takes the musical score in exchange for the sword.';
      }

      if (
        gameState.playerLocation === "wizard" &&
        gameState.itemLocations.inventory.includes("score") &&
        gameState.gotScoreByCredit
      ) {
        return '"Ah ah." The wizard waggles his finger. "All sales on credit are final. The score is yours to keep, and half your resulting treasure is mine."';
      }
    }

    function getGameEffect(gameState) {
      if (
        gameState.playerLocation === "wizard" &&
        gameState.itemLocations.inventory.includes("score") &&
        gameState.itemLocations.wizard.includes("sword")
      ) {
        return { gotScoreByTrade: false };
      }
    }

    function getTargetItemDestination(gameState) {
      if (
        gameState.playerLocation === "wizard" &&
        gameState.itemLocations.inventory.includes("score") &&
        gameState.itemLocations.wizard.includes("sword")
      )
        if (gameState.dragonAsleep) {
          return "outOfPlay";
        } else {
          return "wizard";
        }

      if (
        gameState.playerLocation === "wizard" &&
        gameState.itemLocations.inventory.includes("score") &&
        gameState.gotScoreByCredit
      ) {
        return "inventory";
      }
    }

    function getItemMovements(gameState) {
      if (
        gameState.playerLocation === "wizard" &&
        gameState.itemLocations.inventory.includes("score") &&
        gameState.itemLocations.wizard.includes("sword")
      ) {
        return [
          {
            item: "sword",
            oldLocation: "wizard",
            newLocation: "inventory",
          },
        ];
      }
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(gameState),
      targetItemDestination: getTargetItemDestination(gameState),
      itemMovements: getItemMovements(gameState),
      description: writeDescription(gameState),
    });
  },
});

export const items = {
  lute: lute,
  clothes: clothes,
  apple: apple,
  handkerchief: handkerchief,
  baby: baby,
  sword: sword,
  horse: horse,
  berries: berries,
  treasure: treasure,
  score: score,
};
export default {
  items,
  ItemInteraction,
};
