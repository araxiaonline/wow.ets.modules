## Gambler 

This is a module for allowing players to gamble their gold in game.  Currently it supports rewarding gold and token currency.  

* REQUIRES SQL SCRIPT
* REQUIRES CLIENT PATCH FILE >> Patch-W.MPQ

Slot Machine Demo

https://github.com/araxiaonline/wow.ets.modules/assets/110695027/c8d579dd-0c04-4690-ba37-a5db03d658a9

### Configuration options

__Server__ 
<hr/>

**SLOT_GAME_OBJECT**: [number] The id of the gameobject to add. You can see a default option in the SQL folder. 

**TOKEN_ID**:[number] The id of a currency token to award on higher risk spins. Default is in the SQL folder. 

__Client__
<hr/>

**LOW_BET_SIZE_GOLD**: [number] The cost of a low risk spin

**HIGH_BET_SIZE_GOLD**: [number] The cost of a high risk spin


### Currently Supported Games: 

#### Slot Machine
- 22 rotations of images to determine win
- Bet 20g / 100g defaults (configurable)
- Custom graphics
- Awards tokens and Gold on high risk
- Attach to Slot machine

### GM Commands
Using the default gameobject you can use the following command to place the slot machine
```
.gobject add 750001 
```

