import React from "react";
import Stats from "./stats";
import Share from "@skedwards88/shared-components/src/components/Share";
import {useMetadataContext} from "@skedwards88/shared-components/src/components/MetadataContextProvider";

export default function GameWon({
  dispatchGameState,
  gameState,
  setCurrentDisplay,
}) {
  const {userId, sessionId} = useMetadataContext();

  let gameEndText;
  gameEndText = `You arrive at the city gates ${
    gameState.horseMounted
      ? `proudly mounted on your horse.\n\nReputation +1`
      : "weary from the long walk. "
  }\n\nA crowd has gathered, curious about the fate of the person who willingly entered the dragon's lair. ${
    gameState.naked
      ? `\n\nThe townsfolk jeer at your lack of clothes.\n\nReputation -1`
      : ""
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
      ? "\n\nAlthough the curse is not visible, a forbidding aura hangs around you. You wonder what effect the curse will have on your life."
      : ""
  }${
    gameState.dragonDead
      ? `\n\nThe townsfolk see the gore on your sword. You hear whispers of "dragon slayer" and "hero" before the town erupts into cheers. ${
          gameState.reputation === gameState.maxReputation
            ? "Thanks to your flawless reputation and heroism, they appoint you mayor on the spot."
            : ""
        }`
      : `\n\nInitially excited about your successful return, the towns folk cower as a huge roar erupts from the cave. It seems that the dragon is no longer incapacitated. You hear whispers of "provoked" and "doomed" as the townsfolk glare angrily at you. \n\nEager to escape the wrath of the dragon and townsfolk, you flee town.`
  }`;

  return (
    <div className="App" id="gameOver-display">
      <Stats
        reputation={gameState.reputation}
        maxReputation={gameState.maxReputation}
        gold={gameState.gold}
        maxGold={gameState.maxGold}
      />
      <div className="description">{gameEndText}</div>
      <div id="non-navigation-buttons" className="buttons">
        <button
          className="close"
          onClick={() => {
            dispatchGameState({action: "newGame"});
            setCurrentDisplay("location");
          }}
        >
          PLAY AGAIN
        </button>
        <Share
          appName="Dragon Hero"
          text={getWinShareText({
            reputation: gameState.reputation,
            maxReputation: gameState.maxReputation,
            gold: gameState.gold,
            maxGold: gameState.maxGold,
          })}
          url="https://skedwards88.github.io/dragon/"
          origin="game over"
          className="close"
          content="SHARE"
          userId={userId}
          sessionId={sessionId}
        ></Share>
      </div>
    </div>
  );
}

function getWinShareText({reputation, maxReputation, gold, maxGold}) {
  let resultText = "";
  if (reputation === maxReputation && gold === maxGold) {
    resultText = `I earned the maximum score on Dragon Hero!`;
  } else {
    resultText = `I beat Dragon Hero: ${reputation}/${maxReputation} reputation, ${gold}/${maxGold} gold.`;
  }

  return resultText;
}
