import React from "react";

export default function Stats({ reputation, maxReputation, gold, maxGold }) {
  return (
    <table className="stats">
      <tbody>
        <tr className="stat">
          <td className="statName">Reputation: </td>
          <td>{reputation}</td>
          <td className="statName">Max: </td>
          <td>{maxReputation}</td>
        </tr>
        <tr className="stat">
          <td className="statName">Gold: </td>
          <td>{gold}</td>
          <td className="statName">Max: </td>
          <td>{maxGold}</td>
        </tr>
      </tbody>
    </table>
  );
}
//todo calc max gold and rep
