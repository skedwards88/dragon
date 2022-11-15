import React from "react";
import Stats from "./stats";

export default function GameOver({
  result, // win | lose
  handleNewGame,
  gameState,
}) {
  let reputationChange = 0
  if (result === "win") {
    if (gameState.horseMounted) reputationChange += 1;
    if (gameState.naked) reputationChange -= 1;
    if (gameState.clothesPoopy && !gameState.naked) reputationChange -= 1;
    if (gameState.cursed) reputationChange -= 1;
    // Not losing reputation for being poisoned or singed since that happens when the event occurs
  }
  let finalReputation = gameState.reputation + reputationChange;

  let gameEndText;
  if (result === "win") {
    gameEndText = `You arrive at the city gates ${
      gameState.horseMounted
        ? `proudly mounted on your horse.\n\nReputation +1`
        : "weary from the long walk. "
    }\n\nA crowd has gathered, curious about the fate of the person who willingly entered the dragon's lair. ${
      gameState.naked ? `\n\nThe townsfolk jeer at your lack of clothes.\n\nReputation -1` : ""
    }${
      gameState.clothesPoopy && !gameState.naked
        ? "\n\nThe townsfolk gag at the horrid smell emanating from you clothes and give you a wide berth.\n\nReputation -1"
        : ""
    }${
      gameState.playerPoisoned
        ? "\n\nYour face is still splotchy and swollen from eating the berries. "
        : ""
    }${
      gameState.singeCount
        ? `\n\nYou have ${gameState.singeCount} singe mark${
            gameState.singeCount > 1 ? "s" : ""
          } and no eyebrows, courtesy of the dragon's flame. `
        : ""
    }${
      gameState.cursed
        ? "\n\nAlthough the curse is not visible, a forbidding aura hangs around you. You wonder what effect the curse will have on your life.\n\nReputation -1"
        : ""
    }${
      gameState.dragonDead
        ? `\n\nThe townsfolk see the gore on your sword. You hear whispers of "dragon slayer" and "hero" before the town erupts into cheers. ${
          finalReputation = gameState.maxReputation
              ? "Thanks to your flawless reputation and heroism, they appoint you mayor on the spot."
              : ""
          }`
        : `\n\nInitially excited about your successful return, the towns folk cower as a huge roar erupts from the cave. It seems that the dragon is no longer incapacitated. You hear whispers of "provoked" and "doomed" as the townsfolk glare angrily at you. \n\nEager to escape the wrath of the dragon and townsfolk, you flee town.`
    }`;
  } else {
    gameEndText =
      "Reputation: 0\n\nEven your pride has its limits. With what little reputation you have left, you flee the town.";
  }

  return (
    <div className="App">
      <div className="description">{gameEndText}</div>
      <button className="close" onClick={handleNewGame}>
        PLAY AGAIN
      </button>
      <Stats
        reputation={finalReputation}
        maxReputation={gameState.maxReputation}
        gold={gameState.gold}
        maxGold={gameState.maxGold}
      />
    </div>
  );
}
