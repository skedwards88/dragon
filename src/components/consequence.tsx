import {type GameState} from "../logic/init";
import {locations} from "../logic/locations";
import {type DisplayState} from "./App";

export default function Consequence({
  setCurrentDisplay,
  gameState,
}: {
  setCurrentDisplay: React.Dispatch<React.SetStateAction<DisplayState>>;
  gameState: GameState;
}): React.JSX.Element {
  return (
    <div className="App" id="consequence-display">
      <div className="description">{gameState.consequenceText}</div>
      <div id="non-navigation-buttons" className="buttons">
        <button className="close" onClick={() => setCurrentDisplay("location")}>
          Back to{" "}
          {locations[gameState.playerLocation].getDisplayName(gameState) ||
            gameState.playerLocation}
        </button>
        <button
          className="inventory"
          onClick={() => setCurrentDisplay("inventory")}
        >
          Inventory
        </button>
      </div>
    </div>
  );
}
