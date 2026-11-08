import type {ReducerPayload} from "../logic/reducer";
import type {DisplayState} from "./App";

export default function Restart({
  setCurrentDisplay,
  dispatchGameState,
}: {
  setCurrentDisplay: React.Dispatch<React.SetStateAction<DisplayState>>;
  dispatchGameState: React.Dispatch<ReducerPayload>;
}): React.JSX.Element {
  return (
    <div className="App">
      <div className="description">Restart?</div>
      <div id="non-navigation-buttons" className="buttons">
        <button
          className="close"
          onClick={() => {
            dispatchGameState({action: "newGame"});
            setCurrentDisplay("location");
          }}
        >
          Yes
        </button>

        <button
          className="close"
          onClick={() => {
            setCurrentDisplay("location");
          }}
        >
          No
        </button>
      </div>
    </div>
  );
}
