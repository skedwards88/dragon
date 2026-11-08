import type {GameState} from "../logic/init";
import {items} from "../logic/items";
import {locations} from "../logic/locations";
import type {ReducerPayload} from "../logic/reducer";
import type {DisplayState} from "./App";

function InventoryItems({
  dispatchGameState,
  gameState,
  setCurrentDisplay,
}: {
  dispatchGameState: React.Dispatch<ReducerPayload>;
  gameState: GameState;
  setCurrentDisplay: React.Dispatch<React.SetStateAction<DisplayState>>;
}): React.JSX.Element[] {
  const itemsInInventory = gameState.itemLocations.inventory;
  return itemsInInventory.map((item) => {
    return (
      <div className="inventoryItem" key={item}>
        <div key={item}>{items[item].getDescription(gameState)}</div>
        <button
          onClick={() => {
            dispatchGameState({item, action: "useItem"});
            setCurrentDisplay("consequence");
          }}
          className="item-action"
          key={`${item}-use`}
        >
          {items[item].getUseVerb(gameState)}
        </button>
        <button
          onClick={() => {
            dispatchGameState({item, action: "dropItem"});
            setCurrentDisplay("consequence");
          }}
          className="item-action"
          key={`${item}-drop`}
        >
          Drop
        </button>
        <button
          disabled={!locations[gameState.playerLocation].getSentient(gameState)}
          onClick={() => {
            dispatchGameState({item, action: "giveItem"});
            setCurrentDisplay("consequence");
          }}
          className="item-action"
          key={`${item}-give`}
        >
          Give
        </button>
      </div>
    );
  });
}

export default function Inventory({
  gameState,
  setCurrentDisplay,
  dispatchGameState,
}: {
  gameState: GameState;
  dispatchGameState: React.Dispatch<ReducerPayload>;
  setCurrentDisplay: React.Dispatch<React.SetStateAction<DisplayState>>;
}): React.JSX.Element {
  return (
    <div className="App" id="inventory-display">
      <div className="description" key="description">
        Inventory
      </div>
      <div id="inventoryItems">
        <InventoryItems
          gameState={gameState}
          dispatchGameState={dispatchGameState}
          setCurrentDisplay={setCurrentDisplay}
        />
        <div className="inventoryItem" key="journal">
          <div key="journal">{`journal with ${String(gameState.journalPagesRemaining)} pages left`}</div>
          <button
            onClick={() => {
              dispatchGameState({action: "readJournal"});
              setCurrentDisplay("consequence");
            }}
            className="item-action"
            key="journal-read"
          >
            Read
          </button>
          <button
            disabled={gameState.journalPagesRemaining <= 0}
            onClick={() => {
              dispatchGameState({action: "writeJournal"});
              setCurrentDisplay("consequence");
            }}
            className="item-action"
            key="journal-write"
          >
            Write
          </button>
        </div>
        <div className="inventoryItem" key="gold">
          <div key="gold">{`${String(gameState.gold)} gold`}</div>
          <button
            disabled={
              !locations[gameState.playerLocation].getSentient(gameState)
            }
            onClick={() => {
              dispatchGameState({action: "pay"});
              setCurrentDisplay("consequence");
            }}
            className="item-action"
            key="gold-give"
          >
            Pay
          </button>
        </div>
      </div>
      <div id="non-navigation-buttons" className="buttons">
        <button
          key="back"
          className="close"
          onClick={() => {
            setCurrentDisplay("location");
          }}
        >
          Close Inventory
        </button>
      </div>
    </div>
  );
}
