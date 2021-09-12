export class ItemInteraction {
  constructor({
    gameEffect,
    description,
    targetItemLocation,
    otherItemLocations,
  }) {
    this.description = description;
    this.gameEffect = gameEffect;
    this.targetItemLocation = targetItemLocation;
    this.otherItemLocations = otherItemLocations;
  }
}

class Item {
  constructor({
    id,
    displayName = id[0].toUpperCase() + id.slice(1),
    spawnLocation,
    getDescription = function () {
      return displayName;
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

  getCustomGive: function (props) {
    function writeDescription(props) {
      if (
        !props.gameState.ownSword &&
        props.itemLocations.smithy.has("sword") &&
        props.playerLocation === "blacksmith"
      ) {
        return "You give your lute to the blacksmith. In exchange, they give you the sword. ";
      }
    }

    function getGameEffect(props) {
      let gameEffect = {};

      if (
        !props.gameState.ownSword &&
        props.itemLocations.smithy.has("sword") &&
        props.playerLocation === "blacksmith"
      ) {
        gameEffect = { ...gameEffect, ownSword: true };
      }

      if (Object.keys(gameEffect).length) return gameEffect;
    }

    function getOtherItemLocation(props) {
      if (
        !props.gameState.ownSword &&
        props.itemLocations.smithy.has("sword") &&
        props.playerLocation === "blacksmith"
      ) {
        return {
          item: "sword",
          oldLocation: "smithy",
          newLocation: "inventory",
        };
      }
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(props),
      otherItemLocations: getOtherItemLocation(props), //todo could make list to handle multiples
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
  // todo when you eat the apple, it remains in inventory; it should not. also, if apple is not in inventory, it should be in inn so you can get another one

  getUseVerb: function () {
    return "Eat";
  },
  getCustomUse: function (props) {
    function writeDescription() {
      return "You eat the apple, feeling refreshed. ";
    }

    return new ItemInteraction({
      description: writeDescription(props),
    });
  },

  getCustomDrop: function (props) {
    function writeDescription(props) {
      // todo should you be able to drop/give to squirrel also?
      if (
        props.itemLocations.pasture.has("horse") &&
        props.playerLocation === "pasture"
      ) {
        return "This horse seems very interested in food. The horse walks over to eat the apple that you dropped. While he is preoccupied, you tie the reins back to the post. ";
      }
    }

    if (
      props.itemLocations.pasture.has("horse") &&
      props.playerLocation === "pasture"
    ) {
      return new ItemInteraction({
        gameEffect: { horseTethered: true },
        targetItemLocation: "outOfPlay",
        description: writeDescription(props),
      });
    }

    return new ItemInteraction({
      description: writeDescription(props),
    });
  },

  getCustomGive: function (props) {
    function writeDescription(props) {
      // todo should you also be able to give to squirrel?

      if (
        props.itemLocations.pasture.has("horse") &&
        props.playerLocation === "pasture"
      ) {
        return "This horse seems very interested in food. The horse walks over to eat the apple that you offered. While he is preoccupied, you tie the reins back to the post. ";
      }
    }

    function getGameEffect(props) {
      let gameEffect = {};

      if (
        props.itemLocations.pasture.has("horse") &&
        props.playerLocation === "pasture"
      ) {
        gameEffect = { ...gameEffect, horseTethered: true };
      }

      if (Object.keys(gameEffect).length) return gameEffect;
    }

    function getTargetItemLocation(props) {
      if (
        props.itemLocations.pasture.has("horse") &&
        props.playerLocation === "pasture"
      ) {
        return "outOfPlay";
      }
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(props),
      targetItemLocation: getTargetItemLocation(props),
      description: writeDescription(props),
      // todo could use otherItemLocations to make horse go it inventory instead of being tied up. would also want to add for drop.
    });
  },
});

const handkerchief = new Item({
  // todo when you drop the handkerchief but are wearing it, you should also stop wearingit

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
        return `You offer the handkerchief that you saw the youth drop. "Th-thank you," they sob. \n\nThe youth tells you that they were meant to be sacrificed to the dragon in exchange for another year of safety for the town. In retaliation, they set the mayor's house on fire, not realizing that the baby was trapped inside. `;
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

    function getTargetItemLocation(props) {
      if (props.playerLocation === "youth") {
        return "outOfPlay";
      }
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(props),
      targetItemLocation: getTargetItemLocation(props),
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

    function getTargetItemLocation(props) {
      if (props.playerLocation === "nurseryWindow") {
        return "outOfPlay";
      }
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(props),
      targetItemLocation: getTargetItemLocation(props),
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
          swordCost: Math.max(
            props.gameState.swordCost + 10,
            props.gameState.maxSwordCost
          ),
        };
      }
    }
    function getTargetItemLocation(props) {
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
      targetItemLocation: getTargetItemLocation(props),
      description: writeDescription(props),
    });
  },

  getCustomGive: function (props) {
    function writeDescription(props) {
      if (
        props.itemLocations.wizard.has("score") &&
        !props.gameState.ownScore &&
        props.playerLocation === "wizard" &&
        !props.gameState.earnedTreasureAmount
      ) {
        return "You give your sword to the wizard. In exchange, they give you the musical score. ";
      }
    }

    function getGameEffect(props) {
      let gameEffect = {};

      if (
        props.itemLocations.wizard.has("score") &&
        !props.gameState.ownScore &&
        props.playerLocation === "wizard" &&
        !props.gameState.earnedTreasureAmount
      ) {
        gameEffect = { ...gameEffect, ownScore: true };
      }

      if (Object.keys(gameEffect).length) return gameEffect;
    }

    function getTargetItemLocation(props) {
      if (
        props.itemLocations.wizard.has("score") &&
        !props.gameState.ownScore &&
        props.playerLocation === "wizard" &&
        !props.gameState.earnedTreasureAmount
      ) {
        return "wizard";
      }
    }

    function getOtherItemLocation(props) {
      if (
        props.itemLocations.wizard.has("score") &&
        !props.gameState.ownScore &&
        props.playerLocation === "wizard" &&
        !props.gameState.earnedTreasureAmount
      ) {
        return {
          item: "score",
          oldLocation: "wizard",
          newLocation: "inventory",
        };
      }
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(props),
      targetItemLocation: getTargetItemLocation(props),
      description: writeDescription(props),
      otherItemLocations: getOtherItemLocation(props),
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
        text += "You drop the horse's reins. ";
      }

      if (props.playerLocation === "clearing") {
        text +=
          "The horse starts to eat the berries. After a few mouthfuls, it foams at the mouth and falls over dead. ";
      } else {
        text +=
          "You let go of the horse's reins. The horse trots away, probably in search of grass to munch. ";
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
    }

    function getTargetItemLocation(props) {
      if (props.gameState.horseDead) {
        return props.playerLocation;
      }

      if (!props.gameState.horseTethered) {
        return props.playerLocation;
      }
    }

    return new ItemInteraction({
      targetItemLocation: getTargetItemLocation(props),
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
    function writeDescription() {
      return "You pop the berries into your mouth. Immediately, your mouth starts to tingle, so you spit out the berries. You narrowly avoided death, but your face is splotchy and swollen, and your lips are a nasty shade of purple. ";
    }

    function getGameEffect(props) {
      return {
        playerPoisoned: true,
        reputation: props.gameState.reputation - 1,
      };
    }

    // todo where do the berries go when you eat them?

    return new ItemInteraction({
      gameEffect: getGameEffect(props),
      description: writeDescription(props),
    });
  },

  getCustomDrop: function (props) {
    function writeDescription(props) {
      if (
        props.playerLocation === "squirrel" &&
        !props.gameState.squirrelDead
      ) {
        return "The squirrel eats the berries that you dropped. After a few seconds, it foams at the mouth and rolls over, dead. Oh dear. ";
      }
    }

    function getGameEffect(props) {
      let gameEffect = {};

      if (
        props.playerLocation === "squirrel" &&
        !props.gameState.squirrelDead
      ) {
        gameEffect = { ...gameEffect, squirrelDead: true };
      }

      if (Object.keys(gameEffect).length) return gameEffect;
    }

    function getTargetItemLocation(props) {
      // todo is this wht I want?
      if (
        props.playerLocation === "squirrel" &&
        !props.gameState.squirrelDead
      ) {
        return "clearing";
      }
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(props),
      targetItemLocation: getTargetItemLocation(props),
      description: writeDescription(props),
    });
  },

  getCustomGive: function (props) {
    function writeDescription(props) {
      if (
        props.playerLocation === "squirrel" &&
        !props.gameState.squirrelDead
      ) {
        return "The squirrel eats the berries that you offered. After a few seconds, it foams at the mouth and rolls over, dead. Oh dear. ";
      }
      // todo also give to horse
      if (props.playerLocation === "wizard") {
        return `The wizard politely refuses the berries. "Those will give you a life changing experience," he says.`;
      }
    }

    function getGameEffect(props) {
      if (
        props.playerLocation === "squirrel" &&
        !props.gameState.squirrelDead
      ) {
        return { squirrelDead: true };
      }
    }

    function getTargetItemLocation(props) {
      if (
        props.playerLocation === "squirrel" &&
        !props.gameState.squirrelDead
      ) {
        return "clearing"; // todo is this right?
      }

      if (props.playerLocation === "wizard") {
        return "inventory";
      }
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(props),
      targetItemLocation: getTargetItemLocation(props),
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
        return "You scoop as much treasure as possible into your bag, avoiding the gore from the severed dragon head. ";
      }

      if (props.gameState.dragonAsleep && !props.gameState.dragonDead) {
        return "Giving a wide berth to the snoring dragon, you scoop as much treasure as possible into your bag. ";
      }

      if (
        props.gameState.dragonPoisoned &&
        !props.gameState.dragonAsleep &&
        !props.gameState.dragonDead
      ) {
        return "With the dragon slower from the poison, you can now reach the treasure. You scoop as much treasure as possible into your bag before the dragon singes you. ";
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
      if (props.gameState.dragonDead || props.gameState.dragonAsleep) {
        return {
          gold: props.gameState.gold + props.gameState.treasureAmount,
          earnedTreasureAmount: props.gameState.treasureAmount,
        };
      }

      if (
        props.gameState.dragonPoisoned &&
        !props.gameState.dragonAsleep &&
        !props.gameState.dragonDead
      ) {
        return {
          gold: props.gameState.gold + props.gameState.treasureAmount / 2,
          earnedTreasureAmount: props.gameState.treasureAmount / 2,
          singeCount: props.gameState.singeCount + 1,
          reputation: props.gameState.reputation - 1,
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

    function getTargetItemLocation(props) {
      if (
        props.gameState.dragonPoisoned ||
        props.gameState.dragonAsleep ||
        props.gameState.dragonDead
      ) {
        return "outOfPlay";
      }

      if (
        !props.gameState.dragonPoisoned &&
        !props.gameState.dragonAsleep &&
        !props.gameState.dragonDead
      ) {
        return "lair";
      }
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(props),
      targetItemLocation: getTargetItemLocation(props),
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
        return `"Ah ah!" The wizard shakes a finger at you. Not for free. I would trade it for ${
          props.itemLocations.inventory.has("sword")
            ? "your fine sword or "
            : ""
        }gold.`;
      }
    }

    function getTargetItemLocation(props) {
      if (!props.gameState.ownScore) {
        return "wizard";
      }
    }

    return new ItemInteraction({
      targetItemLocation: getTargetItemLocation(props),
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

    function getTargetItemLocation(props) {
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

    function getOtherItemLocation(props) {
      if (
        props.playerLocation === "wizard" &&
        props.itemLocations.inventory.has("score") &&
        props.itemLocations.wizard.has("sword")
      ) {
        return {
          item: "sword",
          oldLocation: "wizard",
          newLocation: "inventory",
        };
      }
    }

    return new ItemInteraction({
      gameEffect: getGameEffect(props),
      targetItemLocation: getTargetItemLocation(props),
      otherItemLocations: getOtherItemLocation(props),
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
