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
          <td>{Math.max(gold, 0)}</td>
          <td className="statName">Max: </td>
          <td>{maxGold}</td>
        </tr>
      </tbody>
    </table>
  );
}
