import React from "react";
import {items} from "../items";
import {locations} from "../locations";

function InventoryItems({dispatchGameState, gameState, setCurrentDisplay}) {
  const itemsInInventory = gameState.itemLocations.inventory;
  return Array.from(itemsInInventory).map((item) => {
    return (
      <div className="inventoryItem" key={item}>
        <div key={item}>{items[item].getDescription(gameState)}</div>
        <button
          onClick={() => {
            dispatchGameState({item: item, action: "useItem"});
            setCurrentDisplay("consequence");
          }}
          className="item-action"
          key={item + "-use"}
        >
          {items[item].getUseVerb(gameState)}
        </button>
        <button
          onClick={() => {
            dispatchGameState({item: item, action: "dropItem"});
            setCurrentDisplay("consequence");
          }}
          className="item-action"
          key={item + "-drop"}
        >
          Drop
        </button>
        <button
          disabled={!locations[gameState.playerLocation].getSentient(gameState)}
          onClick={() => {
            dispatchGameState({item: item, action: "giveItem"});
            setCurrentDisplay("consequence");
          }}
          className="item-action"
          key={item + "-give"}
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
}) {
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
          <div key="journal">{`journal with ${gameState.journalPagesRemaining} pages left`}</div>
          <button
            onClick={() => {
              dispatchGameState({action: "readJournal"});
              setCurrentDisplay("consequence");
            }}
            className="item-action"
            key={"journal-read"}
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
            key={"journal-write"}
          >
            Write
          </button>
        </div>
        <div className="inventoryItem" key="gold">
          <div key="gold">{gameState.gold + " gold"}</div>
          <button
            disabled={
              !locations[gameState.playerLocation].getSentient(gameState)
            }
            onClick={() => {
              dispatchGameState({action: "pay"});
              setCurrentDisplay("consequence");
            }}
            className="item-action"
            key={"gold-give"}
          >
            Pay
          </button>
        </div>
      </div>
      <div id="non-navigation-buttons" className="buttons">
        <button
          key="back"
          className="close"
          onClick={() => setCurrentDisplay("location")}
        >
          Close Inventory
        </button>
      </div>
    </div>
  );
}
