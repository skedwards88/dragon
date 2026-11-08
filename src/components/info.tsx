import packageJson from "../../package.json";
import type {DisplayState} from "./App";

export default function Info({
  setCurrentDisplay,
}: {
  setCurrentDisplay: React.Dispatch<React.SetStateAction<DisplayState>>;
}): React.JSX.Element {
  const feedbackLink = `https://github.com/skedwards88/dragon/issues/new?body=Dragon+Hero+version+${packageJson.version}`;
  return (
    <div className="App">
      <div className="description">
        <h1>Dragon Hero</h1>
        <small>{`version ${packageJson.version}\n\n`}</small>
        a text adventure puzzle game
        <hr />
        {`Thanks for playing! We'd love to hear your feedback, especially if you find a logical discrepancy or bug. To leave feedback, `}
        <a href={feedbackLink}>open an issue</a>
        {" on GitHub."}
        <hr />
        {`Want more games? See all of our puzzle games at `}
        <a href="https://twistedtrailgames.com/">TwistedTrailGames.com</a>
        .
        <hr />
        {`Story by Colin\nBuilt by Sarah\nArtwork (mostly) by Dall-e`}
        <hr />
        <a href="./privacy.html">Privacy policy</a>
        <br />
        <small>tl;dr: We only collect anonymous data about usage.</small>
      </div>
      <button
        className="close"
        onClick={() => {
          setCurrentDisplay("location");
        }}
      >
        CLOSE
      </button>
    </div>
  );
}
