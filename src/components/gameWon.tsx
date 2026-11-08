import Stats from "./stats";
import Share from "@skedwards88/shared-components/src/components/Share";
import {useMetadataContext} from "@skedwards88/shared-components/src/components/MetadataContextProvider";
import type {GameState} from "../logic/init";
import type {DisplayState} from "./App";
import type {ReducerPayload} from "../logic/reducer";

export default function GameWon({
  dispatchGameState,
  horseMounted,
  naked,
  clothesPoopy,
  playerPoisoned,
  singeCount,
  cursed,
  dragonDead,
  reputation,
  maxReputation,
  gold,
  maxGold,
  setCurrentDisplay,
}: {
  dispatchGameState: React.Dispatch<ReducerPayload>;
  horseMounted: GameState["horseMounted"];
  naked: GameState["naked"];
  clothesPoopy: GameState["clothesPoopy"];
  playerPoisoned: GameState["playerPoisoned"];
  singeCount: GameState["singeCount"];
  cursed: GameState["cursed"];
  dragonDead: GameState["dragonDead"];
  reputation: GameState["reputation"];
  maxReputation: GameState["maxReputation"];
  gold: GameState["gold"];
  maxGold: GameState["maxGold"];
  setCurrentDisplay: React.Dispatch<React.SetStateAction<DisplayState>>;
}): React.JSX.Element {
  const {userId, sessionId} = useMetadataContext();

  const gameEndText = `You arrive at the city gates ${
    horseMounted
      ? `proudly mounted on your horse.\n\nReputation +1`
      : "weary from the long walk. "
  }\n\nA crowd has gathered, curious about the fate of the person who willingly entered the dragon's lair. ${
    naked
      ? `\n\nThe townsfolk jeer at your lack of clothes.\n\nReputation -1`
      : ""
  }${
    clothesPoopy && !naked
      ? "\n\nThe townsfolk gag at the horrid smell emanating from you clothes and give you a wide berth.\n\nReputation -1"
      : ""
  }${
    playerPoisoned
      ? "\n\nYour face is still splotchy and swollen from eating the berries. "
      : ""
  }${
    singeCount
      ? `\n\nYou have ${String(singeCount)} singe mark${
          singeCount > 1 ? "s" : ""
        } and no eyebrows, courtesy of the dragon's flame. `
      : ""
  }${
    cursed
      ? "\n\nAlthough the curse is not visible, a forbidding aura hangs around you. You wonder what effect the curse will have on your life."
      : ""
  }${
    dragonDead
      ? `\n\nThe townsfolk see the gore on your sword. You hear whispers of "dragon slayer" and "hero" before the town erupts into cheers. ${
          reputation === maxReputation
            ? "Thanks to your flawless reputation and heroism, they appoint you mayor on the spot."
            : ""
        }`
      : `\n\nInitially excited about your successful return, the towns folk cower as a huge roar erupts from the cave. It seems that the dragon is no longer incapacitated. You hear whispers of "provoked" and "doomed" as the townsfolk glare angrily at you. \n\nEager to escape the wrath of the dragon and townsfolk, you flee town.`
  }`;

  return (
    <div className="App" id="gameOver-display">
      <Stats
        reputation={reputation}
        maxReputation={maxReputation}
        gold={gold}
        maxGold={maxGold}
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
            reputation,
            maxReputation,
            gold,
            maxGold,
          })}
          url="https://dragon.twistedtrailgames.com/"
          origin="game over"
          className="close"
          content="SHARE"
          userId={userId}
          sessionId={sessionId}
        />
      </div>
    </div>
  );
}

function getWinShareText({
  reputation,
  maxReputation,
  gold,
  maxGold,
}: {
  reputation: GameState["reputation"];
  maxReputation: GameState["maxReputation"];
  gold: GameState["gold"];
  maxGold: GameState["maxGold"];
}): string {
  let resultText = "";
  if (reputation === maxReputation && gold === maxGold) {
    resultText = `I earned the maximum score on Dragon Hero!`;
  } else {
    resultText = `I beat Dragon Hero: ${String(reputation)}/${String(maxReputation)} reputation, ${String(gold)}/${String(maxGold)} gold.`;
  }

  return resultText;
}
