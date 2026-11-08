import type {GameState} from "../logic/init";
import type {ReducerPayload} from "../logic/reducer";
import type {DisplayState} from "./App";
import Stats from "./stats";

export default function GameLost({
  dispatchGameState,
  maxReputation,
  gold,
  maxGold,
  setCurrentDisplay,
}: {
  dispatchGameState: React.Dispatch<ReducerPayload>;
  maxReputation: GameState["maxReputation"];
  gold: GameState["gold"];
  maxGold: GameState["maxGold"];
  setCurrentDisplay: React.Dispatch<React.SetStateAction<DisplayState>>;
}): React.JSX.Element {
  return (
    <div className="App" id="gameOver-display">
      <Stats
        reputation={0}
        maxReputation={maxReputation}
        gold={gold}
        maxGold={maxGold}
      />
      <div className="description">{`Reputation: 0\n\nEven your pride has its limits. With what little reputation you have left, you flee the town.`}</div>
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
      </div>
    </div>
  );
}
