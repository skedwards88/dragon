import React from "react";
import packageJson from "../../package.json";

export default function Info({ setCurrentDisplay }) {
  return (
    <div className="App">
      <div className="description">
        {`Dragon Hero (beta ${packageJson.version})\n\na text adventure puzzle game\n\nThanks for play testing! We'd love to hear your feedback, especially about logical discrepancies or bugs.`}
        {<hr></hr>}
        {`Story by Colin\nBuilt by Sarah\n\nWant more games?\nVisit `}
        <a href="https://skedwards88.github.io/portfolio/">CnS Games</a>
      </div>
      <button className="close" onClick={() => setCurrentDisplay("location")}>
        CLOSE
      </button>
    </div>
  );
}
