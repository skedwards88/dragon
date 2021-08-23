## Items

- All items
  - Actions
    - Take (if item location is not inventory). You now have {item description}.
    - Drop (if item is in inventory) (item location changes to player location)
    - Use (if item is in inventory)

- Lute
  - Take: The instrument feels familiar in your hands.
  - Use:
    - else: You play a beautiful melody.

- Clothes
  - Use: naked = false
  - Drop: naked = true

- Handkerchief
  - Location starts as null
  - Description
    - if damp: A damp handkerchief
    - else: A handkerchief
  - Actions
    - Drop
      - if player location is fountain, damp is true, item location changes to fountain
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
    - Take: You try to grab the horse's reins, but it evades you.
    - Drop:
      - if in use: You unmount the horse. need to tie up? in ues = false
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

## State

- fire: bool
- reputation: int
- gold: int
- naked: bool

## Actions at location

- Leave (give options to connected locations)
- Inventory (show items. once select item, show actions for item)
- Items (list items at location; click on item to interact)

## Locations

### Room

if start: You wake up to the smell of fire and the sound of screams in the distance.
A window faces the west. A wardrobe sits on the north side of the room, opposite a door.
if lute location is room: At the foot of the bed is a lute.

### Window

You can see flams and smoke coming from a mansion. A crowd has gathered in front of the mansion.

### Wardrobe

You open the wardrobe. Inside, there is a mirror (if clothes location is room: and a set of clothes).

### Mirror

You look into the mirror.
if naked: You're naked!
else: you are quite good looking, if you do say so yourself
maybe modify based on dragon poop, etc.

### Inn

You enter what appears to be the common room of an inn. A bowl of apples sits out for inn guests to enjoy.
if naked: The inn keeper laughs, haven't you hear of clothes? Reputation -1.

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

- if ?: The adloescent that you saw earlier is standing at the gate, still crying.

At N. Gate you encounter young woman. She doesn’t want to talk. You can give her back her handkerchief and/or play a song on the lute for increased reputation. You can leave North to get to the Long Road.

## Road 1

From Long Road, it takes one turn to get to stream if on horse, else you have to select “keep walking” a few times, adding 5 time each.

## Road 2

## Road 3

To the north, you hear a stream. To the south, the road stretches back to the city.

## Stream

You come across a steam. It looks crossable by foot or by horse. On the north side, you see a bush full of berries. To the south, the road stretches back to the city.

## Wizard

You enter a clearing. A bush full of berries catches your eye. To the south, the stream burbles. To the north, you see a cave. A man stands in the middle of the clearing. His long white beard, pointed hat, and staff mark him as a wizard.

