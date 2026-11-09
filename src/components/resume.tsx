import type {ReducerPayload} from "../logic/reducer";
import type {DisplayState} from "./App";

export default function Resume({
  setCurrentDisplay,
  dispatchGameState,
}: {
  setCurrentDisplay: React.Dispatch<React.SetStateAction<DisplayState>>;
  dispatchGameState: React.Dispatch<ReducerPayload>;
}): React.JSX.Element {
  return (
    <div className="App">
      <div className="description">Continue from last point?</div>
      <div id="non-navigation-buttons" className="buttons">
        <button
          className="close"
          onClick={() => {
            setCurrentDisplay("location");
          }}
        >
          Continue
        </button>
        <button
          className="close"
          onClick={() => {
            dispatchGameState({action: "newGame"});
            setCurrentDisplay("location");
          }}
        >
          Restart
        </button>
      </div>
    </div>
  );
}
