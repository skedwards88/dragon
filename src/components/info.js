import React from "react";
import packageJson from "../../package.json";

export default function Info({setCurrentDisplay}) {
  const feedbackLink = `https://github.com/skedwards88/dragon/issues/new?body=Dragon+Hero+version+${packageJson.version}`;
  return (
    <div className="App">
      <div className="description">
        <h1>Dragon Hero</h1>
        <small>{`version ${packageJson.version}\n\n`}</small>
        {`a text adventure puzzle game`}
        {<hr></hr>}
        {`Thanks for playing! We'd love to hear your feedback, especially if you find a logical discrepancy or bug. To leave feedback, `}
        <a href={feedbackLink}>open an issue</a>
        {" on GitHub."}
        {<hr></hr>}
        {`Want more games? Check `}
        <a href="https://skedwards88.github.io/">these</a>
        {` out.`}
        {<hr></hr>}
        {`Story by Colin\nBuilt by Sarah\nArtwork (mostly) by Dall-e`}
        {<hr></hr>}
        <a href="./privacy.html">Privacy policy</a>
      </div>
      <button className="close" onClick={() => setCurrentDisplay("location")}>
        CLOSE
      </button>
    </div>
  );
}
