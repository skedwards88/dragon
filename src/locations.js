import { ItemInteraction } from "./items";

class Location {
  constructor({
    id,
    getDisplayName = function () {
      return id;
    },
    getConnections = function () {
      return [];
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
    return ["window", "wardrobe", "inn"];
  },
  dropPreposition: "in",
  getDescription: function (props) {
    let text =
      "You are in a room with a bed. A window faces the west. A wardrobe sits on the north side of the room, opposite a door. ";

    if (props.itemLocations.room.has("lute")) {
      text += "A lute leans against the bed. ";
    }

    if (props.gameState.manorFire) {
      text += "You smell fire and hear screams in the distance. ";
    }
    return text;
  },
});

const window = new Location({
  id: "window",
  getConnections: function () {
    return ["room"];
  },
  dropPreposition: "at",
  getDescription: function (props) {
    return props.gameState.manorFire
      ? "Through the window, you see flames and smoke coming from a nearby mansion. A crowd has gathered in front of the mansion. "
      : "Through the window, you see the charred remains of a nearby mansion. ";
  },
});

const wardrobe = new Location({
  id: "wardrobe",
  getConnections: function () {
    return ["mirror", "room"];
  },
  dropPreposition: "in",
  getDescription: function (props) {
    return `Inside the wardrobe, there is a mirror ${
      props.itemLocations.wardrobe.has("clothes") ? "and a set of clothes" : ""
    }. `;
  },
});

const mirror = new Location({
  id: "mirror",
  getConnections: function () {
    return ["room", "wardrobe"];
  },
  dropPreposition: "at",
  getDescription: function (props) {
    return `${
      props.gameState.naked
        ? "You're naked!"
        : "You are quite good looking, if you say so yourself. "
    }`;
  },
});

const inn = new Location({
  id: "inn",
  getDisplayName: function (props) {
    return `${props.playerLocation === "room" ? "Door" : "Inn"}`;
  },
  getConnections: function () {
    return ["courtyard", "room"];
  },
  dropPreposition: "in",
  getDescription: function (props) {
    return `You enter what appears to be the common room of an inn. ${
      props.itemLocations.inn.has("apple")
        ? "A complementary apple rests on the table. "
        : ""
    }${
      props.gameState.naked
        ? `\n\nThe inn keeper laughs, "Haven't you heard of clothes?!"`
        : ""
    }`;
  },
  onEnterGameStateEffect: function (props) {
    if (props.gameState.naked) {
      return { reputation: props.gameState.reputation - 1 };
    }
  },
});

const courtyard = new Location({
  id: "courtyard",
  getConnections: function () {
    return ["fountain", "smithy", "inn"];
  },
  dropPreposition: "in",
  getDescription: function (props) {
    return `You are in a small courtyard. The entrance to the inn sits at the north side. To the east you hear sounds of a blacksmith shop. To the west you see a fountain. ${
      props.gameState.manorFire
        ? "Beyond the fountain, you see flames and smoke. "
        : ""
    }${
      props.gameState.firstCourtyardEntry
        ? "\n\nAn youth runs west to east, crying as they flee. They drop a handkerchief in their distress. "
        : ""
    }`;
  },
  onExitGameStateEffect: function (props) {
    if (props.gameState.firstCourtyardEntry) {
      return { firstCourtyardEntry: false };
    }
  },
});

const fountain = new Location({
  id: "fountain",
  dropPreposition: "in",
  getConnections: function () {
    return ["manor", "courtyard"];
  },
  getDescription: function (props) {
    let text =
      "You stand at the edge of a fountain. In the center is a statue of a dragon surrounded by cowering people. To the east is a courtyard. To the north is a manor. ";

    if (props.gameState.manorFire) {
      text += "\n\nThe manor is on fire and surrounded by a crowd of people. ";
    } else {
      text += "\n\nThe manor is a framework of charred wood. ";
    }

    if (props.itemLocations.nursery.has("baby")) {
      text +=
        'You hear a voice sobbing, "My baby! My baby is trapped in the nursery. " ';
    }

    if (props.gameState.savedBaby && !props.gameState.receivedBabyReward) {
      if (props.gameState.babyCough) {
        text +=
          '\n\nYou hear a voice: "My baby! You saved my baby! But my dear baby has a terrible cough from being carried through the smoke. Regardless, take this gold as thanks." \n\nAs you take the gold and praise, you see the roof collapse. Finally, the crowd is able to douse the flames. ';
      } else {
        text +=
          '\n\nYou hear a voice: "Thank you for saving my baby! Please take this gold as thanks." \n\nAs you take the gold and praise, you see the roof collapse. Finally, the crowd is able to douse the flames. ';
      }
    }
    return text;
  },
  onEnterGameStateEffect: function (props) {
    if (props.gameState.savedBaby && !props.gameState.receivedBabyReward) {
      return {
        gold: props.gameState.gold + 50,
        reputation: props.gameState.babyCough
          ? props.gameState.reputation + 1
          : props.gameState.reputation + 2,
      };
    }
  },
  onExitGameStateEffect: function (props) {
    if (props.gameState.savedBaby && !props.gameState.receivedBabyReward) {
      return { manorFire: false, receivedBabyReward: true };
    }
  },
  onEnterItemLocationEffect: function (props) {
    if (props.gameState.savedBaby && !props.gameState.receivedBabyReward) {
      return {
        item: "baby",
        oldLocation: "inventory",
        newLocation: "outOfPlay",
      };
    }
  },
  onExitItemLocationEffect: function () {},
});

const manor = new Location({
  id: "manor",
  dropPreposition: "in",
  getConnections: function (props) {
    return props.gameState.manorFire &&
      props.gameState.handkerchiefDamp &&
      props.gameState.playerMasked
      ? ["nursery", "fountain"]
      : ["fountain"]; // todo allow to continue if not masked but developcough/lose reputation. todo could instead allow to continue if no fire but have manor collapse
  },
  getDescription: function (props) {
    let text = "";

    if (props.gameState.manorFire) {
      text += "You stand in the entrance of the burning manor. ";
    } else {
      text += "You stand in the charred remains of the manor. ";
    }

    if (props.itemLocations.nursery.has("baby")) {
      text += "You hear a baby crying upstairs. ";
    }

    if (
      props.gameState.manorFire &&
      (!props.gameState.handkerchiefDamp || !props.gameState.playerMasked)
    ) {
      text +=
        "\n\nYour throat burns from the smoke and heat. You can't breath this air. ";
    }

    if (
      props.gameState.manorFire &&
      props.gameState.handkerchiefDamp &&
      props.gameState.playerMasked
    ) {
      text +=
        "\n\nAlthough the smoke is thick, the damp handkerchief over your mouth helps you breath. ";
    }

    return text;
  },
  onEnterGameStateEffect: function (props) {
    if (props.itemLocations.inventory.has("baby")) {
      return { babyCough: true };
    }
  },
});

const nursery = new Location({
  id: "nursery",
  dropPreposition: "in",
  getConnections: function () {
    return ["nurseryWindow", "manor"];
  },
  getDescription: function (props) {
    if (props.gameState.manorFire) {
      if (props.itemLocations.nursery.has("baby")) {
        return "You stand in a nursery. You see a baby wailing in the crib under an open window. The open window must be the only thing keeping the baby alive in this smoke. ";
      } else {
        return "You stand in a nursery with an empty crib. The fire continues to burn, pouring smoke into the room. ";
      }
    } else {
      return "You stand in the charred remains of a nursery. ";
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
    return ["nursery"];
  },
  getDescription: function (props) {
    return props.gameState.manorFire
      ? "Below the window, you see the gathered crowd. "
      : "You see the charred remains of the manor below you. ";
  },
});

const smithy = new Location({
  id: "smithy",
  dropPreposition: "at",
  getConnections: function () {
    return ["blacksmith", "gate", "courtyard"];
  },
  getDescription: function (props) {
    let text =
      "You stand in front of a blacksmith shop. To the north and south are city gates. To the west is a courtyard. The blacksmith is working inside the shop. ";

    if (props.itemLocations.smithy.has("sword")) {
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
    return ["smithy"];
  },
  getDescription: function (props) {
    let text = `The blacksmith sets down their work. ${
      props.gameState.naked
        ? `"No clothes? You best stay away from the furnace lest you burn something important. "`
        : ""
    }${
      props.gameState.playerMasked
        ? "They eye the handkerchief tied over your face warily, but don't comment on it."
        : ""
    }`;

    if (!props.gameState.ownSword && props.itemLocations.smithy.has("sword")) {
      text += `\n\n"Are you interested in buying that sword?" they ask. It costs ${props.gameState.swordCost} gold. " `;
    }
    return text;
  },
  onEnterGameStateEffect: function (props) {
    if (props.gameState.naked) {
      return {
        reputation: props.gameState.reputation - 1,
      };
    }
  },
  getCustomPay: function (props) {
    function writeDescription(props) {
      if (
        !props.gameState.ownSword &&
        props.itemLocations.smithy.has("sword")
      ) {
        if (props.gameState.gold >= props.gameState.swordCost) {
          return `You hand the blacksmith ${props.gameState.swordCost} gold in exchange for the sword. `;
        } else {
          return `"It looks like you don't have enough gold to buy this sword. Come back once you have enough gold, or try your luck without it." `;
        }
      }
    }

    function getGameEffect(props) {
      if (
        !props.gameState.ownSword &&
        props.itemLocations.smithy.has("sword") &&
        props.gameState.gold >= props.gameState.swordCost
      ) {
        return {
          ownSword: true,
          gold: props.gameState.gold - props.gameState.swordCost,
        };
      }
    }

    function getItemMovements(props) {
      if (
        !props.gameState.ownSword &&
        props.itemLocations.smithy.has("sword") &&
        props.gameState.gold >= props.gameState.swordCost
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
      gameEffect: getGameEffect(props),
      itemMovements: getItemMovements(props),
      description: writeDescription(props),
    });
  },
});

const pasture = new Location({
  id: "pasture",
  getSentient: function (props) {
    return props.itemLocations.pasture.has("horse");
  },
  dropPreposition: "at",
  getConnections: function () {
    return ["gate"];
  },
  getDescription: function (props) {
    let text =
      "You are standing in a wide field. There is no road in sight. To the north, you hear sounds of the blacksmith shop. ";

    if (
      props.itemLocations.pasture.has("horse") &&
      !props.gameState.horseDead &&
      !props.gameState.tethered
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
    return ["pasture", "youth", "road1", "smithy"];
  },
  getDescription: function (props) {
    return `You are standing at the north gate. To the north, you see a road leading up a mountain. \n\nThe youth that you saw earlier stands at the courtyard${
      !props.gameState.playedForYouth ? ", crying" : ""
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
    return ["gate"];
  },
  getDescription: function (props) {
    let text = `The youth stands by the city gates${
      props.gameState.playedForYouth ? " crying" : ""
    }. `;
    if (props.gameState.naked) {
      text += `"Ack! Where are your clothes?!"`;
    }
    return text;
  },
  onEnterGameStateEffect: function (props) {
    if (props.gameState.naked) {
      return {
        reputation: props.gameState.reputation - 1,
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
  getConnections: function (props) {
    if (props.gameState.horseMounted) {
      return ["stream", "gate"];
    } else {
      return ["road2", "gate"];
    }
  },
  getDescription: function (props) {
    return `You stand at the end of a long road. The city gates sit to the south. To the north, you see mountains. 
    ${
      props.gameState.horseMounted
        ? "\n\nThankfully, the horse lets you travel quickly. "
        : ""
    }`;
  },
});

const road2 = new Location({
  id: "road2",
  dropPreposition: "on",
  getDisplayName: function () {
    return "Long road (middle)";
  },
  getConnections: function (props) {
    if (props.gameState.horseMounted) {
      return ["stream", "gate"];
    } else {
      return ["road3", "road1"];
    }
  },
  getDescription: function (props) {
    return `You are halfway along a long road. The city gates sit to the south. To the north, you see mountains.     
    ${
      props.gameState.horseMounted
        ? "\n\nThankfully, the horse lets you travel faster. "
        : "\n\nThis would be much easier with a horse. "
    }`;
  },
});

const road3 = new Location({
  id: "road3",
  dropPreposition: "on",
  getDisplayName: function () {
    return "Long road (North end)";
  },
  getConnections: function (props) {
    if (props.gameState.horseMounted) {
      return ["stream", "gate"];
    } else {
      return ["stream", "road2"];
    }
  },
  getDescription: function (props) {
    if (
      props.gameState.promisedTreasure &&
      props.gameState.treasureLevel &&
      !props.gameState.cursed
    ) {
      return 'As you cross the stream, a flash of lightning hits you, knocking you onto your back. "WHERE IS MY TREASURE?" the wizard demands. "Since you did not give me my share, you shall not have any." The treasure flies from your pouch and disappears down the stream. The wizard vanishes in a cloud of smoke.';
    } else {
      let text = `You stand at the end of a long road. The city gates sit to the south. To the north, you see mountains. `;

      if (props.gameState.horseMounted) {
        text += "\n\nThankfully, the horse lets you travel quickly. ";
      }
      return text;
    }
  },

  onEnterGameStateEffect: function (props) {
    if (props.gameState.promisedTreasure && props.gameState.treasureLevel) {
      const treasureTaken =
        props.gameState.treasureAmount * (props.gameState.treasureLevel / 3);

      return {
        cursed: true,
        gold: props.gameState.gold - treasureTaken,
      };
    }
  },
});

const stream = new Location({
  id: "stream",
  dropPreposition: "in",
  getConnections: function () {
    return ["clearing", "road3"];
  },
  getDescription: function () {
    return "You come across a steam. It looks crossable by foot or by horse. On the north side, you see a bush full of berries. To the south, the road stretches back to the city. ";
  },
});

const clearing = new Location({
  id: "clearing",
  dropPreposition: "in",
  getConnections: function (props) {
    if (props.gameState.cursed) {
      return ["squirrel", "stream", "cliff"];
    }
    return ["wizard", "squirrel", "stream", "cliff"];
  },
  getDescription: function (props) {
    let text = `You stand in a clearing. A bush full of berries catches your eye. To the south, a stream burbles. To the north, you see a rocky cliff with a cave. ${
      props.gameState.cursed
        ? "\n\nA black patch marks where the wizard vanished. "
        : "\n\nA man stands in the middle of the clearing. His long white beard, pointed hat, and staff mark him as a wizard. "
    } ${
      props.gameState.squirrelDead
        ? "\n\nA dead squirrel lies at the base of a tree. "
        : "\n\nA squirrel scampers around a tree. "
    }`;

    if (
      props.gameState.horseDead &&
      props.itemLocations.clearing.has("horse")
    ) {
      text +=
        "\n\nA dead horse lies on the ground, foam and partially chewed berries coming from its mouth. ";
    }
    return text;
  },
});

const squirrel = new Location({
  id: "squirrel",
  getDisplayName: function (props) {
    return props.gameState.squirrelDead
      ? "dead squirrel"
      : "squirrel";
  },
  getSentient: function () {
    return true;
  },
  dropPreposition: "by",
  getConnections: function () {
    return ["clearing"];
  },
  getDescription: function (props) {
    return props.gameState.squirrelDead
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
    return ["clearing"];
  },
  getDescription: function (props) {
    let text = "The wizard looks at you though bushy eyebrows. ";

    if (props.itemLocations.wizard.has("score") && !props.gameState.ownScore) {
      text += `\n\n"I have a musical score that will be useful. I would trade it for ${
        props.itemLocations.inventory.has("sword") ? "your fine sword or " : ""
      }gold," the wizard says. \n\n"I see your gold pouch is not as heavy as it could be. It is certainly not enough to buy this score! However, I believe this score will lead to treasure if you combine it with your wit." \n\n"I would accept gold on credit, and will take half the treasure that you earn from the dragon's lair. All sales on credit are final. All sales completed at time of purchase are refundable." `;
    }

    if (props.gameState.promisedTreasure && props.gameState.treasureLevel) {
      text += `"Are you here to give me my share of the treasure? "`;
    }

    return text;
  },
  getCustomPay: function (props) {
    function writeDescription(props) {
      if (
        props.itemLocations.wizard.has("score") &&
        !props.gameState.ownScore
      ) {
        return `You promise the wizard half of the treasure that you hope to earn and pocket the musical score. As you shake on the deal, a shimmering barrier appears over the stream, then vanishes. `;
      }

      if (props.gameState.promisedTreasure && props.gameState.treasureLevel) {
        let text = "";
        if (props.gameState.treasureLevel === 3) {
          text += `"It looks like you succeeded nicely." `;
        }
        if (props.gameState.treasureLevel < 3) {
          text += `"It looks like you succeeded, though not as well as I hoped." `;
        }
        text += "The wizard takes a share of your treasure. ";

        return text;
      }

      if (props.gameState.promisedTreasure && !props.gameState.treasureLevel) {
        return `"Hmm...You have not earned any treasure. Use your wits!"`;
      }

      return `"Although I would like your gold, you have no debts to me."`;
    }

    function getGameEffect(props) {
      if (
        props.itemLocations.wizard.has("score") &&
        !props.gameState.ownScore
      ) {
        return {
          ownScore: true,
          promisedTreasure: true,
        };
      }

      if (props.gameState.promisedTreasure && props.gameState.treasureLevel) {
        const treasureTaken =
          props.gameState.treasureAmount * (props.gameState.treasureLevel / 3);

        return {
          promisedTreasure: false,
          gold: props.gameState.gold - treasureTaken / 2,
        };
      }
    }

    function getItemMovements(props) {
      if (
        props.itemLocations.wizard.has("score") &&
        !props.gameState.ownScore
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
      itemMovements: getItemMovements(props),
      description: writeDescription(props),
    });
  },
});

const cliff = new Location({
  id: "cliff",
  dropPreposition: "on",
  getConnections: function (props) {
    return props.itemLocations.inventory.has("horse")
      ? ["clearing"]
      : ["clearing", "caveEntrance"];
  },
  getDescription: function (props) {
    let text = "";
    if (props.itemLocations.inventory.has("horse")) {
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
    return ["cliff", "lair", "defecatory"];
  },
  getDescription: function (props) {
    let text =
      "You stand in the entrance of a cave. To the west, there is a foul smelling cavern. To the east, there is an entrance to a room that glitters with gems and gold. To the south, you feel the fresh air from the cave entrance. ";

    if (!props.gameState.dragonAsleep) {
      text +=
        "\n\nYou hear coins clanking from the east room, as if a large beast is rolling in piles of gold. ";
    }

    if (
      (!props.gameState.clothesPoopy || props.gameState.naked) &&
      !props.gameState.dragonAsleep
    )
      text += 'From the east room, a voice booms "WHO DO I SMELL?"';

    return text;
  },
});

const defecatory = new Location({
  id: "defecatory",
  dropPreposition: "in",
  getConnections: function () {
    return ["puddle", "boulder", "dung", "caveEntrance"];
  },
  getDescription: function () {
    return "You stand in a large, foul smelling cavern. There is a puddle of clear water, a large boulder, and a pile of dragon dung. To the east, you feel the fresh air from the cave entrance. ";
  },
});

const puddle = new Location({
  id: "puddle",
  dropPreposition: "in",
  getConnections: function () {
    return ["boulder", "dung", "defecatory"];
  },
  getDescription: function (props) {
    return `You stand at a puddle of clear water. Nearby, there is a large boulder and a pile of dragon dung. The cave entrance is on the opposite side of the room. \n\n${dragonDescription(
      props
    )}`;
  },
  onEnterGameStateEffect: function (props) {
    return {
      // always increase the time
      timeInCave: props.gameState.timeInCave + 1,
      // if dragon is not poisoned and time is enough to trigger dragon entry and you are not poopy+hidden, you get singed
      ...(!props.gameState.dragonPoisoned &&
        (props.gameState.timeInCave + 1) % 4 === 3 &&
        (!props.gameState.clothesPoopy ||
          props.gameState.naked ||
          props.playerLocation !== "boulder") && {
          singeCount: props.gameState.singeCount + 1,
          reputation: props.gameState.reputation - 1,
        }),
    };
  },
});

const boulder = new Location({
  id: "boulder",
  dropPreposition: "behind",
  getConnections: function () {
    return ["puddle", "dung", "defecatory"];
  },
  getDescription: function (props) {
    return `You walk behind the boulder. It seems large enough to hide your from sight. Nearby, there is a pile of dragon dung and a puddle of clear water. The cave entrance is on the opposite side of the room. \n\n${dragonDescription(
      props
    )}`;
  },
  onEnterGameStateEffect: function (props) {
    console.log(props.gameState.dragonPoisoned);
    console.log(props.gameState.dragonAsleep);
    console.log(props.gameState.dragonDead);

    return {
      // always increase the time
      timeInCave: props.gameState.timeInCave + 1,
      // if dragon is not poisoned and time is enough to trigger dragon entry and you are not poopy+hidden, you get singed
      ...(!props.gameState.dragonPoisoned &&
        (props.gameState.timeInCave + 1) % 4 === 3 &&
        (!props.gameState.clothesPoopy ||
          props.gameState.naked ||
          props.playerLocation !== "boulder") && {
          singeCount: props.gameState.singeCount + 1,
          reputation: props.gameState.reputation - 1,
        }),
      ...(props.itemLocations.puddle.has("berries") &&
        props.gameState.clothesPoopy &&
        !props.gameState.naked &&
        props.playerLocation === "boulder" && { dragonPoisoned: true }),
    };
  },
  onExitGameStateEffect: function (props) {
    // if the berries are in the puddle and you are poopy_hidden, the dragon is poisoned

    if (
      props.itemLocations.puddle.has("berries") &&
      props.gameState.clothesPoopy &&
      !props.gameState.naked &&
      props.playerLocation === "boulder"
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
    return ["puddle", "boulder", "defecatory"];
  },
  getDescription: function (props) {
    return `You stand in front of a large pile of dragon dung. The stench makes your eyes water. Nearby, there is a large boulder and a puddle of clear water. The cave entrance is on the opposite side of the room. \n\n${dragonDescription(
      props
    )}`;
  },
  onEnterGameStateEffect: function (props) {
    return {
      // always increase the time
      timeInCave: props.gameState.timeInCave + 1,
      // if dragon is not poisoned and time is enough to trigger dragon entry and you are not poopy+hidden, you get singed
      ...(!props.gameState.dragonPoisoned &&
        (props.gameState.timeInCave + 1) % 4 === 3 &&
        (!props.gameState.clothesPoopy ||
          props.gameState.naked ||
          props.playerLocation !== "boulder") && {
          singeCount: props.gameState.singeCount + 1,
          reputation: props.gameState.reputation - 1,
        }),
    };
  },
});

const lair = new Location({
  id: "lair",
  dropPreposition: "in",
  getConnections: function () {
    return ["caveEntrance"];
  },
  getDescription: function (props) {
    let text = "You stand in a room full of gold and gems. ";

    if (
      !props.gameState.dragonAsleep &&
      !props.gameState.dragonDead &&
      !props.gameState.dragonPoisoned
    ) {
      text +=
        "\n\nA dragon sits atop the pile of treasure. It shoots fire as you approach. You cannot go closer without getting burnt. ";
    }

    if (props.gameState.dragonAsleep && !props.gameState.dragonDead) {
      text +=
        "\n\nThe dragon lies in a deep slumber atop the pile of treasure, periodically snoring flames of fire. ";
    }

    if (props.gameState.dragonDead) {
      text +=
        "\n\nThe dragon's body lies severed from its head. The treasure it was guarding is now accessible. ";
    }

    if (
      !props.gameState.dragonAsleep &&
      !props.gameState.dragonDead &&
      props.gameState.dragonPoisoned
    ) {
      text +=
        "\n\nThe dragon looks half dead from the poison but still shoots flame as you approach it and its pile of treasure. \n\nThe flame is no longer strong enough to harm you from the entrance to the lair, but it will surely singe you if you get closer. ";
    }

    return text;
  },
  onEnterGameStateEffect: function (props) {
    // todo maybe shouldn't get singed when enter...but then would need to get singed any time you try to do something at this location
    if (
      !props.gameState.dragonAsleep &&
      !props.gameState.dragonDead &&
      !props.gameState.dragonPoisoned
    ) {
      return {
        singeCount: props.gameState.singeCount + 1,
        reputation: props.gameState.reputation - 1,
      };
    }
  },
});

function dragonDescription(props) {
  const timeInterval = props.gameState.timeInCave % 4;

  let text = "";

  if (!props.gameState.dragonPoisoned) {

  // If the dragon is not due to return yet but the poison conditions are met
  if (
    timeInterval < 3 &&
    props.gameState.clothesPoopy &&
    !props.gameState.naked &&
    props.playerLocation === "boulder" &&
    props.itemLocations.puddle.has("berries")
  ) {
    text +=
      "You jump as you hear the dragon just outside the cavern. Wasn't the dragon just in the lair? \n\n";
  }

  if (
    timeInterval === 3 ||
    (props.gameState.clothesPoopy &&
      !props.gameState.naked &&
      props.playerLocation === "boulder" &&
      props.itemLocations.puddle.has("berries"))
  ) {
    text += "The dragon prowls into the cavern. ";
    // not poop and not hidden
    if (
      (!props.gameState.clothesPoopy || props.gameState.naked) &&
      props.playerLocation !== "boulder"
    ) {
      text += `"I KNEW I SMELT A HUMAN." The dragon singes you before you can fight or defend yourself. \n\nAs you smother the flames, you hear the dragon return to its lair to guard its treasure.`;
    } // poop and not hidden
    else if (
      props.gameState.clothesPoopy &&
      !props.gameState.naked &&
      props.playerLocation !== "boulder"
    ) {
      text += `"YOU DO NOT SMELL LIKE A HUMAN BUT YOU LOOK LIKE ONE. The dragon singes you before you can fight or defend yourself. \n\nAs you smother the flames, you hear the dragon return to its lair to guard its treasure." `;
    } // not poop and hidden
    else if (
      (!props.gameState.clothesPoopy || props.gameState.naked) &&
      props.playerLocation === "boulder"
    ) {
      text += `"I SMELL A HUMAN SOMEWHERE NEARBY." The dragon peaks around the boulder and spots you. The dragon singes you before you can fight or defend yourself. \n\nAs you smother the flames, you hear the dragon return to its lair to guard its treasure.`;
    } // poop and hidden
    else if (
      props.gameState.clothesPoopy &&
      !props.gameState.naked &&
      props.playerLocation === "boulder"
    ) {
      text += "It seems unaware of your location. ";
      // dragon drinks
      if (props.itemLocations.puddle.has("berries")) {
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
      "You hear coins clanking from the east room, as if a large beast is rising from a sea of treasure. ";
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
  manor: manor,
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
  boulder: boulder,
  dung: dung,
  lair: lair,
};

export default {
  locations,
};
