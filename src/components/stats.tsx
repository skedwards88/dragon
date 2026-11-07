export default function Stats({
  reputation,
  maxReputation,
  gold,
  maxGold,
}: {
  reputation: number;
  maxReputation: number;
  gold: number;
  maxGold: number;
}): React.JSX.Element {
  return (
    <div id="stats">
      <div className="stat">
        <div className="statName">Reputation: </div>
        <div>
          {reputation} / {maxReputation}
        </div>
      </div>
      <div className="stat">
        <div className="statName">Gold: </div>
        <div>
          {gold} / {maxGold}
        </div>
      </div>
    </div>
  );
}
