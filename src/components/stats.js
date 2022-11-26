import React from "react";

export default function Stats({ gameState }) {
  return (
    <table className="stats">
      <tbody>
        <tr className="stat">
          <td className="statName">Reputation: </td>
          <td>{gameState.reputation}</td>
          <td className="statName">Max: </td>
          <td>{gameState.maxReputation}</td>
        </tr>
        <tr className="stat">
          <td className="statName">Gold: </td>
          <td>{Math.max(gameState.gold, 0)}</td>
          <td className="statName">Max: </td>
          <td>{gameState.maxGold}</td>
        </tr>
      </tbody>
    </table>
  );
}
