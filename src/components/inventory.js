import React from "react";

function InventoryItems({
  items,
  itemLocations,
  itemsInInventory,
  gameState,
  locations,
  playerLocation,
  handleUse,
  handleDrop,
  handleGive,
}) {
  return Array.from(itemsInInventory).map((item) => {
    return (
      <div className="inventoryItem" key={item}>
        <div key={item}>
          {items[item].getDescription({
            playerLocation: playerLocation,
            gameState: gameState,
            itemLocations: itemLocations,
          })}
        </div>
        <button
          onClick={() => handleUse(item)}
          className="item-action"
          key={item + "-use"}
        >
          {items[item].getUseVerb({
            playerLocation: playerLocation,
            gameState: gameState,
            itemLocations: itemLocations,
          })}
        </button>
        <button
          onClick={() => handleDrop(item)}
          className="item-action"
          key={item + "-drop"}
        >
          Drop
        </button>
        <button
          disabled={
            !locations[playerLocation].getSentient({
              gameState: gameState,
              playerLocation: playerLocation,
              itemLocations: itemLocations,
            })
          }
          onClick={() => handleGive(item)}
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
  items,
  itemLocations,
  gameState,
  locations,
  playerLocation,
  setCurrentDisplay,
  handleUse,
  handleDrop,
  handleGive,
  handlePay,
}) {
  console.log(`in inv ${playerLocation}`);

  return (
    <div className="App">
      <div className="description" key="description">
        Inventory
      </div>
      <div className="inventoryItems">
        <InventoryItems
          itemsInInventory={itemLocations.inventory}
          items={items}
          itemLocations={itemLocations}
          gameState={gameState}
          locations={locations}
          playerLocation={playerLocation}
          handleUse={handleUse}
          handleDrop={handleDrop}
          handleGive={handleGive}
        />
        <div className="inventoryItem" key="gold">
          <div key="gold">{gameState.gold + " gold"}</div>
          <button
            disabled={
              !locations[playerLocation].getSentient({
                gameState: gameState,
                playerLocation: playerLocation,
                itemLocations: itemLocations,
              })
            }
            onClick={() => handlePay()}
            className="item-action"
            key={"gold-give"}
          >
            Pay
          </button>
        </div>
      </div>
      <button
        key="back"
        className="close"
        onClick={() => setCurrentDisplay("location")}
      >
        Close Inventory
      </button>
    </div>
  );
}
