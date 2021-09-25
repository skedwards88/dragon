import React from "react";

export default function Info({ setCurrentDisplay }) {
  return (
    <div className="App">
      <div className="description">
        {`Dragon Hero 1.1\n\na text adventure puzzle game\n\nDesigned by Colin\nBuilt by Sarah\n\nWant more games?\nVisit `}
        <a href="https://skedwards88.github.io/portfolio/">CnS Games</a>
      </div>
      <button className="close" onClick={() => setCurrentDisplay("location")}>
        CLOSE
      </button>
    </div>
  );
}
