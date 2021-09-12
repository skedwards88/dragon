onEnterGameStateEffect
onExitGameStateEffect
onEnterItemLocationEffect
onExitItemLocationEffect

takeDescription
takeGameStateEffect
takeLocation

useVerb
useDescription
useGameStateEffect

dropDescription
dropGameStateEffect
dropLocation

giveDescription
giveGameStateEffect
giveLocation
giveItemLocationEffect

payDescription
payGameStateEffect
payItemLocationEffect

// todo add tests that locations and items have required values

// todo write end game and scoring

// todo typescript

// todo save progress?

// todo PWA / offline

Go south along the long road and come to the N. gate where the townspeople are waiting. End game text describes different outcomes based on how you played. In the best scenario, it describes you marching clean, on horseback, holding a scepter, without too much time passing. If you killed the dragon, you can stay in the village (optionally pair with smith or young woman). You even become mayor if your reputation is high enough! If you didn’t kill the dragon, you make it out of the village before the angry dragon burns it down.

make apples be a barrel, always have apple at inn but can also put in inventory
if take apple when have apple, lose reputation. could allow take (and have x apples) or prevent take
maybe add count to apples so can have more than one

if naked, lose reputation at manor, blacksmith, adolescent

if masked, lose reputation at blacksmith

instead of wizard offering to hold horse -- make the default give be "x doesn't want this item, but agrees to hold this item for you"--need to exempt squirrel

if you return the score to the wizard and have the treasure, wizard shouldn't offer the score again

when pay wizard -- make sure decrements gold

make lose condition if get down to 0 reputation

    reputation: 10,
    gold: 0,
    playerMasked: false,
    savedBaby: false,
    treasureAmount: 200,

```javascript
`
```
