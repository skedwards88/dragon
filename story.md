## State

- reputation: int
- gold: int
- time in cave: int, increases whenever move to cave location/sublocation
- unsinged body parts: [eyebrows, hair, nose, ears, heels]
- fire: bool
- naked: bool
- squirrel dead: bool
- poisoned: bool
- dragon sleep: bool
- poopy: bool

## Items

- All items
  - Actions
    - Take (if item location is not inventory). You now have {item description}.
    - Drop/Give (if item is in inventory) (item location changes to player location). You drop/give the {item name} at/in/to the {player location}.
    - Use (if item is in inventory)

- Lute
  - Location starts as room
  - Take: The instrument feels familiar in your hands.
  - Use:
    - todo
    - else: You play a beautiful melody.

- Clothes
  - Location starts as wardrobe
  - Use: naked = false. You put your clothes on.
  - Drop: naked = true.
    - You strip down and drop your clothes at/in the {player location}
    - If stream or fountain: In addition to above: Your clothes look much cleaner now.

- Handkerchief
  - Location starts as null
  - Name
    - if damp: damp handkerchief
    - else: handkerchief
  - Actions
    - Drop
      - if player location is fountain, damp = true
    - Use
      - if player location is manor or nursery and if damp: you hold the handkerchief over your nose and mouth. The damp cloth lets you breath in the smoke and heat.
      - if player location is manor or nursery and if not damp: you hold the handkerchief over your nose and mouth. On its own, it does nothing to block the smoke.
      - else: You wipe your brow | You blow your nose
  - Location: Inventory or place or person
  - Damp: bool
  - in use: bool

- Baby
  - Location starts in nursery
  - Description
    - A crying baby
  - Actions:
    - Take:
      - If item location is nursery: You pick up the baby from the crib. The baby coughs as you take it from the open window. baby location = inventory.
    - Drop:
      - If player location is balcony and baby location is inventory: You drop the baby off the balcony. The crowd below catches the baby. baby location = fountain.
      - else: You drop the crying baby. It starts crying even louder.
    - Use: it's unclear what use this item has
  - Cough: bool

- Sword
  - Location starts in smithy
  - Actions:
    - Admire:
      - if sword location is smithy and own is false: You admire the sword. The smith sees you admiring the sword and offers to sell it at a discount. cost = 40 gold.
    - Take: (if item location is smithy and own is false) You grab the sword and place it in your bag. "Hey! Are you stealing my sword?" The smithy grabs the sword from you and returns it to the table." Reputation -1. item location = smithy
    - Buy with gold (if own is false and gold > cost): sword location is now inventory. Gold -50. own = true.
    - Buy with lute (if own is false and lute in inventory): sword location is now inventory. lute location = smithy. own = true.
    - Use
      - else: You slash the sword through the air, looking a bit foolish.
  - Own: bool
  - Cost: 50 gold

- Horse
  - Location starts in south gate
  - Actions
    - Take:
      - location does not change to inventory when take
      - if horse not dead: You try to grab the horse's reins, but it evades you.
      - if horse dead: This dead horse is too heavy to carry.
    - Drop:
      - if in use: You unmount the horse. need to tie up? in use = false
      - if location = clearing: The horse immediately starts to munch on the berries. It starts to foam at the mouth, then falls over dead.
      - else:
    - Use:
      - if not in use: You mount the horse. Much easier than walking! in_use = true
      - if in use: This is a one trick pony. He's already carrying you. What more do you want him to do?!
    - In use: bool

- Apple ? not sure if should be able to take multiple (would need count and would need to override take so that can take if already have item)
  - Location starts in inn
  - Actions
    - Drop
      - if player location = s gate and horse location = s gate: This horse seems very interested in food. The horse walks over to eat the apple. While he is preoccupied, you grab the reins. apple location = inn.
    - Use
      - if player location = s gate and horse location = s gate: This horse seems very interested in food. The horse walks over to eat the apple. While he is preoccupied, you grab the reins. apple location = inn.
      - else: you eat the apple? apple location = inn.

- Berries
  - Location starts at clearing. ?Location can be both inventory and clearing?
  - Use ? rename to Eat?
    - You pop the berries into your mouth. Immediately, your mouth starts to tingle, so you spit out the berries. You narrowly avoided death, but your face is splotchy ans swollen, and your lips are a nasty shade of purple. Reputation -1. poisoned = true
  - Drop
    - If location is clearing and squirrel dead is false: This squirrel seems used to humans feeding it. It eats the berries that you dropped. After a few seconds, it foams at the mouth and rolls over, dead. Oh dear. A hawk swoops down to grab the squirrel, carrying the dead animal away. Will the hawk eat it and die too? Oh dear oh dear.

- Treasure
  - Location starts in lair
  - Take: You pile as much treasure as you can into your bag. Gold + 100.

- Dung
  - Location starts in defecatory
  - Take: You grab the dragon dung. It oozes through your fingers and smears onto your clothes. dung location does not go to inventory? poopy = true todo not sure if should be this easy. need to take use action? maybe there is a squish action?

## Sentient locations

### Horse

### Smithy

### Wizard

## Locations

## All locations

- Leave (give options to connected locations)
- Inventory (show items. once select item, show actions for item)
- Items (list items at location; click on item to interact)

### Room

You are in a room with a bed. A window faces the west. A wardrobe sits on the north side of the room, opposite a door.
if lute location is room: At the foot of the bed is a lute.
if fire: You smell fire and hear screams in the distance.

### Window

if fire: Through the window, you can see flames and smoke coming from a nearby mansion. A crowd has gathered in front of the mansion.
else: Through the window, you see the charred remains of a mansion.

### Wardrobe

You open the wardrobe. Inside, there is a mirror (if clothes location is wardrobe: and a set of clothes).

### Mirror

You look into the mirror.
if naked: You're naked!
else: you are quite good looking, if you do say so yourself
todo maybe modify based on dragon poop, etc.

### Inn

You enter what appears to be the common room of an inn. A bowl of apples sits out for inn guests to enjoy.
if naked: The inn keeper laughs, "Haven't you hear of clothes?" Reputation -1.
todo should nakedness be a factor in all interactions?

### Courtyard

You are in a small courtyard. The entrance to the inn sits at the north side. To the west you see a fountain. To the east you hear sounds of a smithy.

- If handkerchief location null: An adolescent runs west to east, crying as they flee. They drop a handkerchief in their distress. (Then handkerchief location is courtyard.)

### Fountain

You are at a fountain. In the center is a statue of a dragon surrounded by cowering people. To the east is a courtyard. To the north is a manor.

- If fire: The manor is on fire and surrounded by a crowd of people.
  - if baby location is nursery: You hear a voice sobbing, "My baby! My baby is trapped in the nursery."
  - if baby location is inventory: You hear a voice: "My baby! You saved my baby! But my dear baby has a terrible cough from you carrying it through the smoke. Regardless, take this gold as thanks." As you take the gold and praise, you see the manor collapse. Finally, the crowd is able to douse the flames. fire = false. Reputation +1. Gold +50
  - if baby location is fountain: "Thank you for saving my baby! Please take this gold as thanks." As you take the gold and praise, you see the manor collapse. Finally, the crowd is able to douse the flames. fire = false. Reputation +2. Gold +50.
- If not fire: The manor is a framework of charred wood.

### Manor

- if fire: You stand in the entrance of the burning manor.
  - if baby location is nursery: You hear a baby crying upstairs.
  - if handkerchief is not in use and damp: Your throat burns from the smoke and heat. You can't breath this air.
  - if baby location is inventory: cough = true
- if no fire: The manor seems like it is about to collapse.
- For items in manor: List items in manor

### Nursery

- if fire: You see a baby wailing in the crib under an open window. The open window must be the only thing keeping the baby alive in this smoke. Outside the window, you see the gathered crowd.
  - if handkerchief is not in use and damp: You collapse from the smoke. Game over.
- if no fire: The manor collapses on you. Game over.

## Balcony

## Smithy

You stand in front of the blacksmith shop. To the north and south are city gates.

- if sword in smithy: In front of the shop, you see a sword gleaming as if someone was recently polishing it. The blacksmith is busy but acknowledges you with a nod.

## South Gate

You are standing at the south gate, which opens to a wide field. There is no road in sight. To the north, you hear sounds of the smithy.

- if horse at south gate: A horse is grazing in the field. A sign reads "Free horse (if you can catch it)"

# North Gate

You are standing at the north gate. To the north, you see a road leading up a mountain.

- if ?: The adolescent that you saw earlier is standing at the gate, still crying.

At N. Gate you encounter young woman. She doesn’t want to talk. You can give her back her handkerchief and/or play a song on the lute for increased reputation. You can leave North to get to the Long Road.

## Road 1

From Long Road, it takes one turn to get to stream if on horse, else you have to select “keep walking” a few times, adding 5 time each.

## Road 2

## Road 3

To the north, you hear a stream. To the south, the road stretches back to the city.

## Stream

You come across a steam. It looks crossable by foot or by horse. On the north side, you see a bush full of berries. To the south, the road stretches back to the city.

## Clearing

You stand in a clearing. A bush full of berries catches your eye. To the south, a stream burbles. To the north, you see a rocky cliff with a cave. A man stands in the middle of the clearing. His long white beard, pointed hat, and staff mark him as a wizard.
if squirrel not dead: A fat squirrel plays in a nearby tree, unconcerned with your presence.
todo if drop horse on road does it go back to town or to berries?

wizard

## Wizard

Talk to wizard. Give sword (return policy) or promise treasure for musical score. Wizard insists it will be helpful. Wizard offers to hold on to your horse for you (and leaving it loose will let it eat the poison bush). 

Talk: 

Would you like me to hold your horse? if yes: drop horse, location wizard, tethered = true

## Cliff

if horse in inventory: The horse cannot make it up the rocky cliff. You must return to the clearing. player location = clearing
else: You scramble on the rocky cliff. Above you is the entrance to a cave. Below you is a clearing with a wizard.

time in cave = 0 when enter

## Cave entrance

You stand in the entrance of a large cave. To the west, there is an entrance to a foul smelling room. To the east, there is an entrance to a room that glitters with gems and gold. You hear coins clanking from the east room, as if a large beast is rolling in piles of gold.
if time in cave = 1 and poppy = false: From the east room, a voice booms "WHO DO I SMELL?"

time in cave + 1 when enter

## Defecatory

You stand in a foul smelling room. On the south side, there is a puddle of clear water. On the west side, there is a large boulder. In the center, there is a pile of dragon dung. The stench makes you gag.

time in cave + 1 when enter

any time in defecatory/puddle/boulder:
If time in cave = 3: You hear coins clanking from the east room, as if a large beast is rising from a sea of treasure.
If time in cave = 4 or poopy+hidden+berries in puddle: The dragon prowls into the room.
  if not poop and not hidden: "I KNEW I SMELT A HUMAN." singes you.
  if poop and not hidden: "YOU DO NOT SMELL LIKE A HUMAN BUT YOU LOOK LIKE ONE." Singes.
  if not poop and hidden: "I SMELL A HUMAN SOMEWHERE NEARBY." Finds you behind boulder and singes you.
  if poop and hidden: The dragon takes a drink from the water.
    if berries in water: dragon is poisoned/weakened/foam smothers its flames
    else: The dragon exits the defecatory. You hear coins clanking as it settles back into its sea of treasure.
    

## Puddle

You stand at a large puddle of clear water. To the west, there is a large boulder.

if dragon location = defecatory: You see the dragon prowling around the defecatory. "I SMELL A HUMAN."
  if unsinged body parts > 0: The dragon spies you by the pool of water. It breaths fire at you singing your {body part pop} as you run away. Reputation -1. player location = cliff
  else: you die

time in cave + 1 when enter

## Boulder

You walk behind the boulder. It seems large enough to hide your from sight. To the north, there is a pile of dragon dung. To the south, there is a pool of clear water.

if dragon location = defecatory: You hear the dragon prowling around the defecatory. "I SMELL A HUMAN."
  if unsinged body parts > 0: The dragon peaks around the boulder. It breaths fire at you singing your {body part pop} as you run away. Reputation -1. player location = cliff
  else: you die

time in cave + 1 when enter

## Lair

You enter a room full of gold and gems.
if treasure in inventory: Temping as it is to take more, your pack is already brimming with gold.
if dragon location = lair: A dragon sits atop the pile of treasure.
  if unsinged body parts > 0: The dragon breaths fire at you singing your {body part pop} as you run away. Reputation -1. player location = cliff
  else: you die
time in cave + 1 when enter



In the Defecatory, you have a few turns to drop the berries in the pool. Then the Dragon comes and you can hide behind the boulder (bad choice) or in the poop (good choice). Dragon comes, attacks you (if you hid behind the boulder), or drinks from the pool (gets sick if berries dropped in pool). You can then play a song (from musical score) to put the dragon to sleep. Return to Wizard to trade back for sword if needed, then slay the dragon. [discuss branching points with Colin here]








When you pass the wizard and talk to him, he requests the treasure if you offered it for the musical score. Not giving the wizard the treasure will get you cursed. You can also take your horse by the wizard if you left it in his care.



At the stream you can drop your clothes to wash (increase reputation if covered in dragon poop). Remember to put them back on, or the townspeople will laugh at you afterward. 

Go south along the long road and come to the N. gate where the townspeople are waiting. End game text describes different outcomes based on how you played. In the best scenario, it describes you marching clean, on horseback, holding a scepter, without too much time passing. If you killed the dragon, you can stay in the village (optionally pair with smith or young woman). You even become mayor if your reputation is high enough! If you didn’t kill the dragon, you make it out of the village before the angry dragon burns it down.

