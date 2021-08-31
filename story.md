## State

- reputation: int
- gold: int
- actions: int ?
- time in cave: int, increases whenever move to cave location/sublocation
- unsinged body parts: [eyebrows, hair, nose, ears, neck]
- sword cost: 50
- singed body parts: []
- fire: true
- naked: true
- squirrel dead: false
- horse dead: false
- horse tethered: false
- horse mounted: false
- poisoned: false
- dragon sleep: false
- poopy: false
- handkerchief damp: false
- masked: false
- baby cough: false
- played for adolescent: false
- promised treasure: false
- cursed: false

## Items

- All items
  - Actions
    - Take (if item location is not inventory). You now have {item description}.
    - Drop (if item is in inventory) (item location changes to player location). You drop the {item name} at/in the {player location}.
    - Give (if item is in inventory) (item location changes to player location). Can give to any sentient item at location. Default (if no give handled for item to sentient): The {sentient} does not want this.
    - Use (if item is in inventory). Use has item specific verb.

- Lute
  - Location starts as room
  - Take: The instrument feels familiar in your hands.
  - Use (play):
    - todo
    - if location is adolescent and adolescent is crying/ if crying adolescent at location
      - if have not played for adolescent: The music seems to cheer the youth up. Reputation + 1. played for adolescent = true
      - else: They appreciate the music, but don't seem keen to listen all day.
    - else: You play a beautiful melody.

- Clothes
  - Location starts as wardrobe
  - Use (wear): if naked. You put your clothes on. naked = false.
  - Drop: naked = true.
    - You strip down and drop your clothes at/in the {player location}
    - If stream or fountain: In addition to above: Your clothes look much cleaner now. poopy = false. todo lose reputation if at fountain (drinking water)?
    - If dung: Your clothes are now covered in dragon dung.

- Handkerchief
  - Location starts as null
  - Name
    - if damp: damp handkerchief
    - else: handkerchief
  - Actions
    - Drop
      - if player location is fountain/stream/puddle, damp = true
    - Use (wear)
      - You tie the handkerchief over your nose and mouth. masked = true
      - if player location is manor or nursery and if damp: The damp cloth lets you breath in the smoke and heat.
      - if player location is manor or nursery and if not damp: On its own, it does nothing to block the smoke.
      - if player location is defecatory: Even with it, the stench reaches your nose. ?
  - Give:
    - if recipient is adolescent: You offer the handkerchief that you saw the adolescent drop. "Th-thank you," they sob. She tells you that she was meant to be sacrificed to the dragon in exchange for another year of safety for the town. In retaliation, she set the mayor's house on fire, not realizing that the baby was trapped inside. Reputation + 1

- Baby
  - Location starts in nursery
  - Description
    - A crying baby
  - Actions:
    - Take:
      - If item location is nursery: You pick up the baby from the crib. The baby coughs as you take it from the open window. baby location = inventory.
    - Drop:
      - If player location is nursery window and baby location is inventory: You drop the baby out the window. The crowd below catches the baby. baby location = fountain.
      - else: You drop the crying baby. It cries even louder.
    - Use: it's unclear what use this item has

- Sword
  - Location starts in blacksmith shop
  - Actions:
    - Admire:
      - if sword location is blacksmith shop: You admire the sword. The smith sees you admiring the sword. "Fine piece of work, eh? It costs 50, but I'll sell it for 40. cost -10 gold.
    - Take: (if item location is blacksmith shop) You grab the sword and place it in your bag. "Hey! Are you stealing my sword?" The blacksmith shop grabs the sword from you and returns it to the table." Reputation -1. item location = blacksmith shop
    - Use
      - else: You slash the sword through the air, looking a bit foolish.

- Horse
  - Location starts in south gate
  - Sentient (can give items to)
  - Actions
    - Take:
      - if horse not dead and horse not tethered: You try to grab the horse's reins, but it evades you. It seems more interested in foraging for food than carrying you around. horse location does not change.
      - if horse dead: This dead horse is too heavy to carry. horse location does not change.
      - if horse tethered: normal take. (make sure this works if location is wizard)
    - Drop:
      - You (if mounted: unmount the horse and) let go of the horse's reins. tethered = false
        - if location = clearing: The horse starts to munch on the berries. It starts to foam at the mouth, then falls over dead.
        - otherwise: The horse trots away, probably in search of grass to munch.
    - Use:
      - if not mounted: verb is mount. You mount the horse. Much easier than walking! mounted = true
      - if mounted: Verb is unmount. You unmount the horse, keeping hold of the horse's reins.

- Apple ? not sure if should be able to take multiple (would need count and would need to override take so that can take if already have item). or if have and try to take another: you already have an apple. maybe later. or maybe inn keeper offers you an apple instead of having them all out?
  - Location starts in inn
  - Actions
    - Drop
      - if player location = s gate and horse location = s gate: This horse seems very interested in food. The horse walks over to eat the apple. While he is preoccupied, you grab the reins. apple location = inn.
    - Give
      - if recipient is horse: This horse seems very interested in food. The horse walks over to eat the apple. While he is preoccupied, you grab the reins. horse location = inventory. apple location = inn ?.
      - if recipient is squirrel and squirrel is alive: The squirrel nibbles at the apple, pleased to have such a treat.
    - Use
      - if player location = s gate and horse location = s gate: This horse seems very interested in food. The horse walks over to eat the apple. While he is preoccupied, you grab the reins. apple location = inn.
      - else: you eat the apple? apple location = inn.

- Berries
  - Location starts at clearing. ?Location can be both inventory and clearing?
  - Use ? rename to Eat?
    - You pop the berries into your mouth. Immediately, your mouth starts to tingle, so you spit out the berries. You narrowly avoided death, but your face is splotchy ans swollen, and your lips are a nasty shade of purple. Reputation -1. poisoned = true
  - Give:
    - if recipient is squirrel and squirrel is alive: The squirrel eats the berries that you dropped. After a few seconds, it foams at the mouth and rolls over, dead. Oh dear.

- Treasure
  - Location starts in lair
  - Take: You pile as much treasure as you can into your bag. Gold + 100.

- Dung
  - Location starts in defecatory
  - Take: You grab the dragon dung. It oozes through your fingers and smears onto your clothes. dung location does not go to inventory? poopy = true todo not sure if should be this easy. need to take use action? maybe there is a squish action?

## Locations

## All locations

- Interactions (list items and sentients at location; click on item to interact)
- Leave (give options to connected locations)
- Inventory (show items. once select item, show actions for item)

### Room

You are in a room with a bed. A window faces the west. A wardrobe sits on the north side of the room, opposite a door.
if lute location is room: A lute leans against the bed.
if fire: You smell fire and hear screams in the distance.

connections: window, wardrobe, door

### Window

if fire: Through the window, you see flames and smoke coming from a nearby mansion. A crowd has gathered in front of the mansion.
else: Through the window, you see the charred remains of a nearby mansion.

connections: room

### Wardrobe

Inside the wardrobe, there is a mirror (if clothes location is wardrobe: and a set of clothes).

connections: room, mirror

### Mirror

You look into the mirror.
if naked: You're naked!
if poopy: Your clothes are covered in dragon poop.
if singed body parts: your {body parts} are singed
else: you are quite good looking, if you do say so yourself

connections: wardrobe

### Inn

You enter what appears to be the common room of an inn. A bowl of apples sits out for inn guests to enjoy.
if naked: The inn keeper laughs, "Haven't you heard of clothes?" Reputation -1.

fixme: only one apple in the game. if the horse runs away after, you just make due without.
fixme: if stay naked, you get ridiculed at every interaction.

connections: room, courtyard

### Courtyard

You are in a small courtyard. The entrance to the inn sits at the north side. To the east you hear sounds of a blacksmith shop. To the west you see a fountain. (if fire: Beyond the fountain, you see flames and smoke.)

- If handkerchief location null: An adolescent runs west to east, crying as they flee. They drop a handkerchief in their distress. (Then handkerchief location is courtyard.)

connections: inn, fountain, blacksmith shop

### Fountain

You stand at the edge of a fountain. In the center is a statue of a dragon surrounded by cowering people. To the east is a courtyard. To the north is a manor.

- If fire: The manor is on fire and surrounded by a crowd of people.
  - if baby location is nursery: You hear a voice sobbing, "My baby! My baby is trapped in the nursery."
  - if baby location is inventory: You hear a voice: "My baby! You saved my baby! But my dear baby has a terrible cough from being carried through the smoke. Regardless, take this gold as thanks." As you take the gold and praise, you see the roof collapse. Finally, the crowd is able to douse the flames. fire = false. Reputation +1. Gold +50
  - if baby location is fountain: "Thank you for saving my baby! Please take this gold as thanks." As you take the gold and praise, you see the roof collapse. Finally, the crowd is able to douse the flames. fire = false. Reputation +2. Gold +50.
- If not fire: The manor is a framework of charred wood.

connections: courtyard, manor

### Manor

- if fire: You stand in the entrance of the burning manor.
  - if baby location is nursery: You hear a baby crying upstairs.
  - if handkerchief is not in use and damp: Your throat burns from the smoke and heat. You can't breath this air.
  - if baby location is inventory: baby cough = true
- if no fire: The manor seems like it is about to collapse further.
- For items in manor: List items in manor

connections: fountain, nursery

### Nursery

- if fire and baby location is nursery: You stand in a nursery. You see a baby wailing in the crib under an open window. The open window must be the only thing keeping the baby alive in this smoke.
- if fire and baby location is not nursery: You stand in a nursery with an empty crib. The fire continues to burn, pouring smoke into the room.
  - if handkerchief is not in use and damp: The smoke is suffocating. Unable to bear it any longer, you run from the mansion. player location = fountain.
- if no fire: Part of the manor collapses, burying you in rubble. The townsfolk dig you out, scolding you for your carelessness. Reputation -2. player location = fountain.

connections: manor, nursery window

## Nursery window

Below the window, you see the gathered crowd.

connections: nursery

## Blacksmith shop

You stand in front of a blacksmith shop. To the north and south are city gates. To the west is a courtyard. The blacksmith is working inside the shop.

- if sword in blacksmith shop: In front of the shop, you see a sword gleaming as if someone was recently polishing it.

connections: north gate, south gate, courtyard, blacksmith

## Blacksmith

The blacksmith looks up as you walk in.
if sword in inventory: "That's a nice sword you have," he says with a glint in his eye. No actions offered. should you be able to sell it back or trade for lute? refund policy?
if sword not in inventory and not at blacksmith shop: "It looks like you are in need of a new sword," he says. I'm busy but the smith in the next town over might have one." No actions offered.
if sword at blacksmith shop: "Interested in buying that sword? It costs {cost}, (if lute in inventory: or I'll trade it for your lute). Actions:
  Buy sword for {cost}. Gold -cost. Sword location is inventory.
  Trade sword for lute: Sword location is inventory. Lute location is blacksmith. (But need to make it not show up as item at location.)

connections: blacksmith shop

## South Gate

You are standing at the south gate, which opens to a wide field. There is no road in sight. To the north, you hear sounds of the blacksmith shop.

- if horse location is south gate: A horse is grazing in the field. A sign reads "Free horse (if you can catch it)"

connections: blacksmith shop

## North Gate

You are standing at the north gate. To the north, you see a road leading up a mountain.

fixme: adolescent is a sentient whose location is north gate.

- if crying: The adolescent that you saw earlier is standing at the gate, still crying.

connections: blacksmith shop, road 1

## Road 1 todo

You walk along a road. To the south, you see the south gate. To the north, the road leads up a mountain.

connections: road 1 unless horse mounted, then road 3

## Road 2

You walk along a long road. You imagine the road would feel shorter with a horse. To the south, the road leads back to the city. To the north, the road leads up a mountain.

## Road 3

To the north, you hear a stream. To the south, the road stretches back to the city.

## Stream

You come across a steam. It looks crossable by foot or by horse. On the north side, you see a bush full of berries. To the south, the road stretches back to the city.

If leave to road and promised is true, you get cursed. Despite the warning, you cross the stream withoug giving the wizard treasure. A flash of lightning hits you, knocking you onto your back. The wizard disappears in a cloud of smoke. promised = false, cursed = true, player location = clearing, wizard location = null

connections: road, clearing

## Clearing

You stand in a clearing. A bush full of berries catches your eye. To the south, a stream burbles. To the north, you see a rocky cliff with a cave.
if wizard location is clearing: A man stands in the middle of the clearing. His long white beard, pointed hat, and staff mark him as a wizard.
if squirrel not dead: A squirrel plays in a nearby tree.
if promised = true. The wizard pounds his staff. "Where is the treasure that you promised me? If you cross the stream without giving me my promised share, you will suffer a curse."

connections: stream, cliff

## Squirrel (sentient)

location = clearing
if squirrel is alive: You approach the squirrel. It pauses, perhaps curious if you will feed it, before scampering up the tree.
is squirrel is dead: A dead squirrel lies at the base of a tree.

connections: clearing

## Wizard (sentient)

location = clearing
The wizard looks at you though bushy eyebrows.
if score location is wizard: I have a musical score that will be useful. I would trade it for (if sword in inventory: your sword or) a share of the treasure that you seek. fixme add sword return policy. Actions:
  trade sword for score: sword location is wizard. score location is inventory.
  trade sword for promise: promise is true. score location is inventory.
if horse in inventory: I do not think your horse will make it much further on this road. Would you like me to hold your horse?
  Actions: give horse to wizard. horse location is wizard. tethered = true.
if horse location is wizard: Would you like your horse? Action: take horse. horse location = inventory, tethered = true. fixme: just have horse at wizard location that you can take?
fixme: add way to exchange score for sword.

connections: clearing

## Cliff

if horse in inventory: The horse cannot make it up the rocky cliff. You must return to the clearing. player location = clearing
else: You scramble on the rocky cliff. Above you is the entrance to a cave. Below you is a clearing next to a stream.

time in cave = 0 when enter

## Cave entrance

You stand in the entrance of a large cave. To the west, there is an entrance to a foul smelling room. To the east, there is an entrance to a room that glitters with gems and gold. You hear coins clanking from the east room, as if a large beast is rolling in piles of gold.
if time in cave = 1 and poopy = false: From the east room, a voice booms "WHO DO I SMELL?"

time in cave + 1 when enter

## Defecatory

You stand in a foul smelling room. On the south side, there is a puddle of clear water. On the west side, there is a large boulder. On the north side, there is a pile of dragon dung. The stench makes you gag.

time in cave + 1 when enter

any time in defecatory/dung/puddle/boulder:
If dragon not poisoned and time in cave = 3: You hear coins clanking from the east room, as if a large beast is rising from a sea of treasure.
If dragon not poisoned and time in cave = 4 or poopy+hidden+berries in puddle: The dragon prowls into the room.
  if not poop and not hidden: "I KNEW I SMELT A HUMAN." singes you before you can fight or defend yourself.
  if poop and not hidden: "YOU DO NOT SMELL LIKE A HUMAN BUT YOU LOOK LIKE ONE." Singes.
  if not poop and hidden: "I SMELL A HUMAN SOMEWHERE NEARBY." The dragon peaks around the boulder. singes you.
  if poop and hidden: The dragon takes a drink from the water.
    if berries in water: dragon is poisoned/weakened/foam smothers its flames
    else: The dragon exits the defecatory. You hear coins clanking as it settles back into its sea of treasure.
  when singe: It breaths fire at you singing your {body part pop} as you run away. body part pop, die if none left. player location = cliff

If dragon poisoned:
  The dragon is slower so you don't get singed on sight, but it will singe you if you try to use the sword. You can take the treasure, but you will get singed. To use the sword and/or take treasure without getting singed, you need to play the music to put it to sleep.

If dragon asleep:
  You can use the sword to kill it
  You can take the treasure.

## Puddle

You stand at a puddle of clear water. To the west, there is a large boulder. To the north, there is a pile of dragon dung.

(this is where player should drop berries)

time in cave + 1 when enter

## Boulder

You walk behind the boulder. It seems large enough to hide your from sight. To the north, there is a pile of dragon dung. To the south, there is a pool of clear water.

(this is where player should drop clothes)

time in cave + 1 when enter

## Lair

You enter a room full of gold and gems.
if treasure not inventory and dragon not in lair: You scoop as much gold as you can fit into your pack. Gold +200.
if treasure in inventory and dragon not in lair: Temping as it is to take more, your pack is already brimming with gold. todo this means player can come get more after giving to wizard?
if dragon location = lair: A dragon sits atop the pile of treasure.
  if unsinged body parts > 0: The dragon breaths fire at you singing your {body part pop} as you run away. player location = cliff
  else: you die
time in cave + 1 when enter










Go south along the long road and come to the N. gate where the townspeople are waiting. End game text describes different outcomes based on how you played. In the best scenario, it describes you marching clean, on horseback, holding a scepter, without too much time passing. If you killed the dragon, you can stay in the village (optionally pair with smith or young woman). You even become mayor if your reputation is high enough! If you didn’t kill the dragon, you make it out of the village before the angry dragon burns it down.

