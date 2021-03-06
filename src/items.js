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

  getCustomUse: function (props) {
    function writeDescription(props) {
      if (props.playerLocation === "youth" && !props.gameState.playedForYouth) {
        return `You play a song for the crying youth. The music seems to cheer the youth up. `;
      } else if (
        props.playerLocation === "youth" &&
        props.gameState.playedForYouth
      ) {
        return `They appreciate the music, but don't seem keen to listen all day. `;
      } else {
        return "You play a beautiful melody. ";
      }
    }

    function getGameEffect(props) {
      if (props.playerLocation === "youth" && !props.gameState.playedForYouth) {
        return {
          reputation: props.gameState.reputation + 1,
          playedForYouth: true,
        };
      }
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(props),
      description: writeDescription(props),
    });
  },

  getCustomTake: function (props) {
    function writeDescription(props) {
      if (props.playerLocation === "room") {
        return "The lute feels familiar. ";
      }
    }

    return new ItemInteraction({
      description: writeDescription(props),
    });
  },
});

const clothes = new Item({
  id: "clothes",
  spawnLocation: "wardrobe",
  getDescription: function (props) {
    return props.gameState.clothesPoopy
      ? "poopy set of clothes"
      : "set of clothes";
  },

  getUseVerb: function (props) {
    return props.gameState.naked ? "Wear" : "Remove";
  },
  getCustomUse: function (props) {
    function writeDescription(props) {
      let text = props.gameState.naked
        ? "You put on the clothes. "
        : "You strip down. ";

      if (props.gameState.clothesPoopy) {
        text +=
          "You wrinkle your nose in distaste. Certainly you are not fit for fine company anymore.";
      }
      return text;
    }

    function getGameEffect(props) {
      return props.gameState.naked ? { naked: false } : { naked: true };
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(props),
      description: writeDescription(props),
    });
  },

  getCustomDrop: function (props) {
    function writeDescription(props) {
      let text = "";

      props.gameState.naked
        ? (text += `You drop your clothes ${props.dropPreposition} the ${props.playerLocation}. `)
        : (text += `You strip down and drop your clothes ${props.dropPreposition} the ${props.playerLocation}. `);

      if (["fountain", "stream", "puddle"].includes(props.playerLocation)) {
        text += "Your clothes look much cleaner now. ";
      }

      return text;
    }

    if (["fountain", "stream", "puddle"].includes(props.playerLocation)) {
      return new ItemInteraction({
        gameEffect: { naked: true, clothesPoopy: false },
        description: writeDescription(props),
      });
    }

    if (props.playerLocation === "dung") {
      return new ItemInteraction({
        gameEffect: { naked: true, clothesPoopy: true },
        description: writeDescription(props),
      });
    }

    return new ItemInteraction({
      gameEffect: { naked: true },
      description: writeDescription(props),
    });
  },
});

const apple = new Item({
  id: "apple",
  spawnLocation: "inn",
  getDescription: function () {
    return "fresh apple";
  },

  getUseVerb: function () {
    return "Eat";
  },
  getCustomUse: function (props) {
    function writeDescription() {
      return "You eat the apple, feeling refreshed. ";
    }

    return new ItemInteraction({
      description: writeDescription(props),
      targetItemDestination: "inn",
    });
  },

  getCustomDrop: function (props) {
    function writeDescription(props) {
      if (
        props.itemLocations[props.playerLocation].has("horse") &&
        !props.gameState.horseTethered
      ) {
        return "This horse seems very interested in food. The horse walks over to eat the apple that you dropped. While he is preoccupied, you grab the reins. You now have a horse.";
      }

      if (
        props.playerLocation === "squirrel" &&
        !props.gameState.squirrelDead
      ) {
        return "The squirrel sniffs at the apple but doesn't bite. Perhaps it needs something smaller. ";
      }
    }

    if (
      props.itemLocations[props.playerLocation].has("horse") &&
      !props.gameState.horseTethered
    ) {
      return new ItemInteraction({
        gameEffect: { horseTethered: true },
        targetItemDestination: "inn",
        itemMovements: [
          {
            item: "horse",
            oldLocation: props.playerLocation,
            newLocation: "inventory",
          },
        ],
        description: writeDescription(props),
      });
    }

    return new ItemInteraction({
      description: writeDescription(props),
    });
  },

  getCustomGive: function (props) {
    function writeDescription(props) {
      if (
        props.itemLocations[props.playerLocation].has("horse") &&
        !props.gameState.horseTethered
      ) {
        return "This horse seems very interested in food. The horse walks over to eat the apple that you offered. While he is preoccupied, you grab the reins. You now have a horse.";
      }

      if (
        props.playerLocation === "squirrel" &&
        !props.gameState.squirrelDead
      ) {
        return "The squirrel sniffs at the apple but doesn't bite. Perhaps it needs something smaller. ";
      }
    }

    if (
      props.itemLocations[props.playerLocation].has("horse") &&
      !props.gameState.horseTethered
    ) {
      return new ItemInteraction({
        gameEffect: { horseTethered: true },
        targetItemDestination: "inn",
        itemMovements: [
          {
            item: "horse",
            oldLocation: props.playerLocation,
            newLocation: "inventory",
          },
        ],
        description: writeDescription(props),
      });
    } else {
      return new ItemInteraction({});
    }
  },
});

const handkerchief = new Item({
  id: "handkerchief",
  spawnLocation: "courtyard",
  getDescription: function (props) {
    return props.gameState.handkerchiefDamp
      ? "damp handkerchief"
      : "handkerchief";
  },
  getUseVerb: function (props) {
    return props.gameState.playerMasked ? "Remove" : "Wear";
  },
  getCustomUse: function (props) {
    function writeDescription(props) {
      let text = "";
      props.gameState.playerMasked
        ? (text += "You remove the handkerchief from your nose and mouth. ")
        : (text += "You tie the handkerchief around your nose and mouth. ");

      if (
        ["manor", "nursery", "nurseryWindow"].includes(props.playerLocation) &&
        props.gameState.manorFire &&
        props.gameState.handkerchiefDamp
      ) {
        text += "The damp handkerchief lets you breath more easily. ";
      }

      if (
        ["manor", "nursery", "nurseryWindow"].includes(props.playerLocation) &&
        props.gameState.manorFire &&
        !props.gameState.handkerchiefDamp
      ) {
        text += "On its own, the handkerchief does little to block the smoke. ";
      }

      if (
        ["dung", "defecatory", "boulder", "puddle"].includes(
          props.playerLocation
        )
      ) {
        text += "Even with it, the stench reaches your nose. ";
      }

      return text;
    }

    function getGameEffect(props) {
      return props.gameState.playerMasked
        ? { playerMasked: false }
        : { playerMasked: true };
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(props),
      description: writeDescription(props),
    });
  },

  getCustomDrop: function (props) {
    function writeDescription(props) {
      if (props.gameState.playerMasked) {
        return `You remove the handkerchief from your nose and mouth and drop it ${props.dropPreposition} the ${props.playerLocation}. `;
      }
    }

    function getGameEffect(props) {
      let gameEffect = {};

      if (props.gameState.playerMasked) {
        gameEffect = { ...gameEffect, playerMasked: false };
      }

      if (["fountain", "stream", "puddle"].includes(props.playerLocation)) {
        gameEffect = { ...gameEffect, handkerchiefDamp: true };
      }

      if (Object.keys(gameEffect).length) return gameEffect;
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(props),
      description: writeDescription(props),
    });
  },

  getCustomGive: function (props) {
    function writeDescription(props) {
      if (props.playerLocation === "youth") {
        return `You offer the handkerchief that you saw the youth drop. "Th-thank you," they sob, "but I don't want it back. You keep it; perhaps you will find a use for it." \n\nThe youth tells you that they were meant to be sacrificed to the dragon in exchange for another year of safety for the town. In retaliation, they set the mayor's house on fire, not realizing that the baby was trapped inside. `;
      }
    }

    function getGameEffect(props) {
      let gameEffect = {};

      if (props.playerLocation === "youth") {
        gameEffect = {
          ...gameEffect,
          reputation: props.gameState.reputation + 1,
        };
      }

      if (Object.keys(gameEffect).length) return gameEffect;
    }

    function getTargetItemDestination(props) {
      if (props.playerLocation === "youth") {
        return "inventory";
      }
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(props),
      targetItemDestination: getTargetItemDestination(props),
      description: writeDescription(props),
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
  getCustomUse: function (props) {
    function writeDescription() {
      return "It's unclear what use this baby has. ";
    }

    return new ItemInteraction({
      description: writeDescription(props),
    });
  },

  getCustomDrop: function (props) {
    function writeDescription(props) {
      if (props.playerLocation === "nursery") {
        return "You place the baby back in the crib. ";
      } else if (props.playerLocation === "nurseryWindow") {
        return "You drop the baby out of the open window. The crowd below catches the baby. ";
      } else {
        return "You drop the crying baby. It cries even louder. ";
      }
    }

    function getGameEffect(props) {
      let gameEffect = {};

      if (!props.playerLocation === "nurseryWindow") {
        gameEffect = { ...gameEffect, savedBaby: false };
      }

      if (Object.keys(gameEffect).length) return gameEffect;
    }

    function getTargetItemDestination(props) {
      if (props.playerLocation === "nurseryWindow") {
        return "outOfPlay";
      }
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(props),
      targetItemDestination: getTargetItemDestination(props),
      description: writeDescription(props),
    });
  },

  getCustomTake: function (props) {
    function writeDescription(props) {
      if (props.playerLocation === "nursery") {
        return "You pick up the baby from the crib. The baby coughs as you move it away from the open window. ";
      }
    }

    return new ItemInteraction({
      gameEffect: { savedBaby: true },
      description: writeDescription(props),
    });
  },
});

const sword = new Item({
  id: "sword",
  spawnLocation: "smithy",
  getUseVerb: function () {
    return "Attack";
  },
  getCustomUse: function (props) {
    function writeDescription(props) {
      if (
        props.gameState.dragonAsleep &&
        !props.gameState.dragonDead &&
        props.playerLocation === "lair"
      ) {
        return "You cut off the head of the dragon. ";
      } else if (
        props.gameState.dragonPoisoned &&
        !props.gameState.dragonAsleep &&
        !props.gameState.dragonDead &&
        props.playerLocation === "lair"
      ) {
        return "Despite the poison, the dragon is still able to singe you once you get near enough to cut off its head. ";
      } else if (
        !props.gameState.dragonPoisoned &&
        !props.gameState.dragonAsleep &&
        !props.gameState.dragonDead &&
        props.playerLocation === "lair"
      ) {
        return "You try to cut off the dragon's head, but it singes you as soon as you get close enough. ";
      } else {
        return "You slash the sword through the air, looking a bit foolish. ";
      }
    }

    function getGameEffect(props) {
      if (
        props.gameState.dragonAsleep &&
        !props.gameState.dragonDead &&
        props.playerLocation === "lair"
      ) {
        return {
          dragonDead: true,
        };
      } else if (
        !props.gameState.dragonAsleep &&
        !props.gameState.dragonDead &&
        props.playerLocation === "lair"
      ) {
        return {
          singeCount: props.gameState.singeCount + 1,
          reputation: props.gameState.reputation - 1,
        };
      }
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(props),
      description: writeDescription(props),
    });
  },

  getCustomTake: function (props) {
    function writeDescription(props) {
      if (props.playerLocation === "smithy" && !props.gameState.ownSword) {
        return 'You grab the sword and place it in your bag. "Hey! Are you stealing my sword?" The blacksmith shop grabs the sword from you and returns it to the table. ';
      }

      if (
        props.playerLocation === "wizard" &&
        props.itemLocations.inventory.has("score")
      ) {
        return "Ah you would like to exchange? You must first give me the score.";
      }
    }

    function getGameEffect(props) {
      if (props.playerLocation === "smithy" && !props.gameState.ownSword) {
        return {
          reputation: props.gameState.reputation - 1,
          swordCost: Math.min(
            props.gameState.swordCost + 10,
            props.gameState.maxSwordCost
          ),
        };
      }
    }
    function getTargetItemDestination(props) {
      if (props.playerLocation === "smithy" && !props.gameState.ownSword) {
        return "smithy";
      }

      if (
        props.playerLocation === "wizard" &&
        props.itemLocations.inventory.has("score")
      ) {
        return "wizard";
      }
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(props),
      targetItemDestination: getTargetItemDestination(props),
      description: writeDescription(props),
    });
  },

  getCustomGive: function (props) {
    function writeDescription(props) {
      if (
        props.itemLocations.wizard.has("score") &&
        !props.gameState.ownScore &&
        props.playerLocation === "wizard"
      ) {
        return "You give your sword to the wizard. In exchange, they give you the musical score. ";
      }
    }

    function getGameEffect(props) {
      let gameEffect = {};

      if (
        props.itemLocations.wizard.has("score") &&
        !props.gameState.ownScore &&
        props.playerLocation === "wizard"
      ) {
        gameEffect = { ...gameEffect, ownScore: true };
      }

      if (Object.keys(gameEffect).length) return gameEffect;
    }

    function getTargetItemDestination(props) {
      if (
        props.itemLocations.wizard.has("score") &&
        !props.gameState.ownScore &&
        props.playerLocation === "wizard"
      ) {
        return "wizard";
      }
    }

    function getItemMovements(props) {
      if (
        props.itemLocations.wizard.has("score") &&
        !props.gameState.ownScore &&
        props.playerLocation === "wizard"
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
      gameEffect: getGameEffect(props),
      targetItemDestination: getTargetItemDestination(props),
      description: writeDescription(props),
      itemMovements: getItemMovements(props),
    });
  },
});

const horse = new Item({
  id: "horse",
  spawnLocation: "pasture",
  getDescription: function (props) {
    return props.gameState.horseDead ? "dead horse" : "voracious horse";
  },

  getUseVerb: function (props) {
    return props.gameState.horseMounted ? "Unmount" : "Mount";
  },
  getCustomUse: function (props) {
    function writeDescription(props) {
      return props.gameState.horseMounted
        ? "You unmount the horse, keeping hold of the horse's reins. "
        : "You mount the horse. Much easier than walking!"; // todo should you be allowed to mount inside a building?
    }

    function getGameEffect(props) {
      return props.gameState.horseMounted
        ? { horseMounted: false }
        : { horseMounted: true };
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(props),
      description: writeDescription(props),
    });
  },

  getCustomDrop: function (props) {
    function writeDescription(props) {
      let text = "";

      if (props.gameState.horseMounted) {
        text += "You unmount the horse and let go of the horse's reins. ";
      } else {
        text += "You let go of the horse's reins. ";
      }

      if (props.playerLocation === "clearing") {
        text +=
          "The horse starts to eat the berries. After a few mouthfuls, it foams at the mouth and falls over dead. ";
      } else {
        text +=
          "The horse shakes its mane, glad to have a free head. It starts nosing around for food to munch. ";
      }

      return text;
    }

    function getGameEffect(props) {
      let gameEffect = { horseTethered: false };

      if (props.playerLocation === "clearing") {
        gameEffect = { ...gameEffect, horseDead: true };
      }

      if (props.gameState.horseMounted) {
        gameEffect = { ...gameEffect, horseMounted: false };
      }

      return gameEffect;
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(props),
      description: writeDescription(props),
    });
  },

  getCustomTake: function (props) {
    function writeDescription(props) {
      if (props.gameState.horseDead) {
        return "This dead horse is too heavy to carry. ";
      }

      if (!props.gameState.horseTethered) {
        return "You try to grab the horse's reins, but it evades you. It seems more interested in foraging for food than carrying you around. ";
      }

      if (props.gameState.horseTethered) {
        return "You take back the horse's reins. ";
      }
    }

    function getTargetItemDestination(props) {
      if (props.gameState.horseDead) {
        return props.playerLocation;
      }

      if (!props.gameState.horseTethered) {
        return props.playerLocation;
      }
    }

    return new ItemInteraction({
      targetItemDestination: getTargetItemDestination(props),
      description: writeDescription(props),
    });
  },

  getCustomGive: function (props) {
    function getGameEffect(props) {
      if (props.gameState.horseMounted) {
        return { horseMounted: false };
      }
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(props),
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
  getCustomUse: function (props) {
    return new ItemInteraction({
      gameEffect: {
        playerPoisoned: true,
        reputation: props.gameState.reputation - 1,
      },
      description:
        "You pop some berries into your mouth. Immediately, your mouth starts to tingle, so you spit out the berries. You narrowly avoided death, but your face is splotchy and swollen, and your lips are a nasty shade of purple. ",
      targetItemDestination: "inventory",
    });
  },

  getCustomDrop: function (props) {
    function writeDescription(props) {
      let text = "";
      if (
        props.playerLocation === "squirrel" &&
        !props.gameState.squirrelDead
      ) {
        text +=
          "The squirrel eats the berries that you dropped. After a few seconds, it foams at the mouth and rolls over, dead. Oh dear. ";
      }
      if (
        props.itemLocations[props.playerLocation].has("horse") &&
        !props.gameState.horseTethered &&
        !props.gameState.horseDead
      ) {
        text +=
          "The horse eats the berries that you dropped. After a few seconds, it foams at the mouth and falls over, dead. Oh dear. ";
      }
      return text;
    }

    function getGameEffect(props) {
      let gameEffect = {};

      if (
        props.playerLocation === "squirrel" &&
        !props.gameState.squirrelDead
      ) {
        gameEffect = { ...gameEffect, squirrelDead: true };
      }

      if (
        props.itemLocations[props.playerLocation].has("horse") &&
        !props.gameState.horseTethered
      ) {
        gameEffect = { ...gameEffect, horseDead: true };
      }

      if (Object.keys(gameEffect).length) return gameEffect;
    }

    function getTargetItemDestination(props) {
      if (
        props.playerLocation === "squirrel" &&
        !props.gameState.squirrelDead
      ) {
        return "squirrel";
      }
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(props),
      targetItemDestination: getTargetItemDestination(props),
      description: writeDescription(props),
    });
  },

  getCustomGive: function (props) {
    function writeDescription(props) {
      let text = "";
      if (
        props.playerLocation === "squirrel" &&
        !props.gameState.squirrelDead
      ) {
        text +=
          "The squirrel eats the berries that you offered. After a few seconds, it foams at the mouth and rolls over, dead. Oh dear. ";
      }

      if (
        props.itemLocations[props.playerLocation].has("horse") &&
        !props.gameState.horseTethered &&
        !props.gameState.horseDead
      ) {
        text +=
          "The horse eats the berries that you offered. After a few seconds, it foams at the mouth and falls over, dead. Oh dear. ";
      }
      if (props.playerLocation === "wizard") {
        text += `The wizard politely refuses the berries. "Those will give you a life changing experience," he says.`;
      }
      return text;
    }

    function getGameEffect(props) {
      if (
        props.playerLocation === "squirrel" &&
        !props.gameState.squirrelDead
      ) {
        return { squirrelDead: true };
      }
      if (
        props.itemLocations[props.playerLocation].has("horse") &&
        !props.gameState.horseTethered
      ) {
        return { horseDead: true };
      }
    }

    function getTargetItemDestination(props) {
      if (
        props.playerLocation === "squirrel" &&
        !props.gameState.squirrelDead
      ) {
        return "squirrel";
      }

      if (props.playerLocation === "wizard") {
        return "inventory";
      }
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(props),
      targetItemDestination: getTargetItemDestination(props),
      description: writeDescription(props),
    });
  },
});

const treasure = new Item({
  id: "treasure",
  spawnLocation: "lair",

  getCustomTake: function (props) {
    function writeDescription(props) {
      if (props.gameState.dragonDead) {
        return "You scoop all of the treasure into your bag, avoiding the gore from the severed dragon head. ";
      }

      if (props.gameState.dragonAsleep && !props.gameState.dragonDead) {
        if (props.gameState.treasureLevel === 2) {
          return "You already took the treasure that you can safely reach. As you edge closer to take more, the dragon snores, releasing a burst of flame that singes your eyebrows. ";
        } else {
          return "Giving a wide berth to the snoring dragon, you scoop as much treasure as possible into your bag. The dragon's head rests on the last of the treasure, and a snore of fire singes you as you try to take it. ";
        }
      }

      if (
        props.gameState.dragonPoisoned &&
        !props.gameState.dragonAsleep &&
        !props.gameState.dragonDead
      ) {
        if (props.gameState.treasureLevel) {
          return "You already took the treasure that you can safely reach. As you edge closer to take more, the dragon shoots a burst of flame, burning your hands. ";
        } else {
          return "With the dragon slower from the poison, you can now reach the edge of the treasure pile. You scoop all of the treasure within reach into your bag, but the dragon shoots a blast of flame, preventing you from getting any closer. ";
        }
      }

      if (
        !props.gameState.dragonPoisoned &&
        !props.gameState.dragonAsleep &&
        !props.gameState.dragonDead
      ) {
        return "You try to steal the treasure, but the dragon singes you before you can get close. ";
      }
    }
    function getGameEffect(props) {
      if (props.gameState.dragonDead) {
        const newTreasureLevel = 3;
        const treasureLevelDiff =
          newTreasureLevel - props.gameState.treasureLevel;
        const treasureTaken =
          props.gameState.treasureAmount * (treasureLevelDiff / 3);

        return {
          gold: props.gameState.gold + treasureTaken,
          treasureLevel: newTreasureLevel,
        };
      }

      if (props.gameState.dragonAsleep && !props.gameState.dragonDead) {
        const newTreasureLevel = 2;
        const treasureLevelDiff =
          newTreasureLevel - props.gameState.treasureLevel;
        const treasureTaken =
          props.gameState.treasureAmount * (treasureLevelDiff / 3);

        return {
          gold: props.gameState.gold + treasureTaken,
          treasureLevel: newTreasureLevel,
          singeCount: props.gameState.singeCount + 1,
          reputation: props.gameState.reputation - 1,
        };
      }

      if (
        props.gameState.dragonPoisoned &&
        !props.gameState.dragonAsleep &&
        !props.gameState.dragonDead
      ) {
        const newTreasureLevel = 1;
        const treasureLevelDiff =
          newTreasureLevel - props.gameState.treasureLevel;
        const treasureTaken =
          props.gameState.treasureAmount * (treasureLevelDiff / 3);

        return {
          gold: props.gameState.gold + treasureTaken,
          treasureLevel: newTreasureLevel,
          singeCount: props.gameState.singeCount + 2,
          reputation: props.gameState.reputation - 2,
        };
      }

      if (
        !props.gameState.dragonPoisoned &&
        !props.gameState.dragonAsleep &&
        !props.gameState.dragonDead
      ) {
        return {
          singeCount: props.gameState.singeCount + 1,
          reputation: props.gameState.reputation - 1,
        };
      }
    }

    function getTargetItemDestination(props) {
      if (props.gameState.dragonDead) {
        return "outOfPlay";
      } else {
        return "lair";
      }
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(props),
      targetItemDestination: getTargetItemDestination(props),
      description: writeDescription(props),
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
  getCustomUse: function (props) {
    function writeDescription(props) {
      if (!props.itemLocations.inventory.has("lute")) {
        return "You would like to play this song, but you have no instrument. ";
      }

      if (
        props.gameState.dragonPoisoned &&
        !props.gameState.dragonAsleep &&
        !props.gameState.dragonDead &&
        props.playerLocation === "lair" &&
        props.itemLocations.inventory.has("lute")
      ) {
        return "You play a lulling melody. The dragon closes its eyes and begins to snore. ";
      }

      if (
        !props.gameState.dragonPoisoned &&
        !props.gameState.dragonAsleep &&
        !props.gameState.dragonDead &&
        props.playerLocation === "lair" &&
        props.itemLocations.inventory.has("lute")
      ) {
        return "Before you can play the first few notes, the dragon lets out a burst of flame, singing you and nearly burning your lute. ";
      }

      return "You play a lulling melody. ";
    }

    function getGameEffect(props) {
      if (
        props.gameState.dragonPoisoned &&
        !props.gameState.dragonAsleep &&
        !props.gameState.dragonDead &&
        props.playerLocation === "lair" &&
        props.itemLocations.inventory.has("lute")
      ) {
        return {
          dragonAsleep: true,
        };
      }

      if (
        !props.gameState.dragonPoisoned &&
        !props.gameState.dragonAsleep &&
        !props.gameState.dragonDead &&
        props.playerLocation === "lair" &&
        props.itemLocations.inventory.has("lute")
      ) {
        return {
          singeCount: props.gameState.singeCount + 1,
          reputation: props.gameState.reputation - 1,
        };
      }
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(props),
      description: writeDescription(props),
    });
  },

  getCustomTake: function (props) {
    function writeDescription(props) {
      if (!props.gameState.ownScore) {
        return `"Ah ah!" The wizard shakes a finger at you. "Not for free. I would trade it for ${
          props.itemLocations.inventory.has("sword")
            ? "your fine sword or "
            : ""
        }gold." `;
      }
    }

    function getTargetItemDestination(props) {
      if (!props.gameState.ownScore) {
        return "wizard";
      }
    }

    return new ItemInteraction({
      targetItemDestination: getTargetItemDestination(props),
      description: writeDescription(props),
    });
  },

  getCustomGive: function (props) {
    function writeDescription(props) {
      if (
        props.playerLocation === "wizard" &&
        props.itemLocations.inventory.has("score") &&
        props.itemLocations.wizard.has("sword")
      ) {
        return '"You would like to exchange?" The wizard takes the musical score in exchange for the sword.';
      }

      if (
        props.playerLocation === "wizard" &&
        props.itemLocations.inventory.has("score") &&
        props.gameState.promisedTreasure
      ) {
        return "Ah ah. All sales on credit are final. The score is yours to keep, and half your resulting treasure is mine.";
      }
    }

    function getGameEffect(props) {
      if (
        props.playerLocation === "wizard" &&
        props.itemLocations.inventory.has("score") &&
        props.itemLocations.wizard.has("sword")
      ) {
        return { ownScore: false };
      }
    }

    function getTargetItemDestination(props) {
      if (
        props.playerLocation === "wizard" &&
        props.itemLocations.inventory.has("score") &&
        props.itemLocations.wizard.has("sword")
      ) {
        return "wizard";
      }

      if (
        props.playerLocation === "wizard" &&
        props.itemLocations.inventory.has("score") &&
        props.gameState.promisedTreasure
      ) {
        return "inventory";
      }
    }

    function getItemMovements(props) {
      if (
        props.playerLocation === "wizard" &&
        props.itemLocations.inventory.has("score") &&
        props.itemLocations.wizard.has("sword")
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
      gameEffect: getGameEffect(props),
      targetItemDestination: getTargetItemDestination(props),
      itemMovements: getItemMovements(props),
      description: writeDescription(props),
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
