## SoulSwapper
This will allow players to send soulbound items that are rare quality or higher to their alts for a fee.  

This uses a GossipMenu and the in-game mail system to transfer items between characters. 

> [!Warning]
> There is currently a limitation of only being able to send things that are in your main backpack.  So if you use an addon like bagnon it is the first couple rows. 

**REQUIRES SQL**

## Configuration

**ALLOWED_ITEM_CLASSES**: - This is the list of item classes that are allowed to be sent to other characters. [Link to Item Template](https://www.azerothcore.org/wiki/item_template)
- `ALLOWED_ITEM_CLASSES = [2, 4, 9]; // 2 = weapon, 4 = armor, 9 = recipe`

**ALLOWED_ACCOUNT_CHARS**: - This is the number of characters an account can have.
- `ALLOWED_ACCOUNT_CHARS = 15;`

**SOULSWAP_BASE_PRICE**: - Base price for sending an item; multipliers will be added on top.
- `SOULSWAP_BASE_PRICE = ToCopper(20);`

**NO_DISCOUNT_LEVEL**: - The level at which the discount for sending items is no longer applied.
- `NO_DISCOUNT_LEVEL = 70;`

**DISCOUNT_ADJ**: - Discount percentage applied per 10 levels.
- `DISCOUNT_ADJ = 3;`

**INTERACTIVE_OBJECT**: - The ID of the object that will interact with the player to handle the soulswap.
- `INTERACTIVE_OBJECT = 750000;`


 
### Demo  
[![Watch the video](https://img.youtube.com/vi/rJ92hM93pYA/0.jpg)](https://youtu.be/nTQUwghvy5Q)
