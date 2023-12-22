import { ToGold, ToCopper, GetPlayerTax } from "../../shared/money";
import { AccountInfo } from "../../shared/account";

/**
 * SoulSwapper GameObject/NPC
 * This is a module that allows players to send soulbound items to alts on the same account. 
 * 
 * REQUIRES SQL
 * REQUIRES CLASSES
 */

/**
 * This is the list of item classes that are allowed to be sent to other characters.
 * @link https://www.azerothcore.org/wiki/item_template
 */
const ALLOWED_ITEM_CLASSES = [2,4,9]; // 2 = weapon, 4 = armor, 9 = recipe

/**
 * This is the number of characters an account can have. 
 */
const ALLOWED_ACCOUNT_CHARS = 15; 

/**
 * Base price for sending an item multipliers will be added on top
 */
const SOULSWAP_BASE_PRICE = ToCopper(20); 

/**
 * The level the discount for sending items is no longer applied
 */
const NO_DISCOUNT_LEVEL = 70; 

/**
 * Discount percentage applied per 10 levels 
 */
const DISCOUNT_ADJ = 3;

/**
 * The id of the object that will interact with the player to handle the soulswap
 */
const INTERACTIVE_OBJECT = 750000;


const selectedItem: Record<string, number> = {};

function getCost(guid: number, player: Player): number {
    const itemGuid = GetItemGUID(guid); 
    const theItem = player.GetItemByGUID(itemGuid); 
    let discount = 1;

    const iLevelModifer = theItem.GetItemLevel() / 40;
    
    if(player.GetLevel() < NO_DISCOUNT_LEVEL) { 
        discount = (NO_DISCOUNT_LEVEL - player.GetLevel()) * DISCOUNT_ADJ;
    }

    if(discount > 100) {
        discount = 90;
    }

    return SOULSWAP_BASE_PRICE * iLevelModifer * ((100 - discount) / 100);
}

const GossipHello : gossip_event_on_hello = (event: number, player: Player, gameobject: EObject) => {
    
    player.GossipClearMenu();     

    let items = 0; 
    /**
     * Backpack is 255, 23-38
     */
    for(let i=23; i <= 38; i++ ) {
        let item = player.GetItemByPos(255, i);

        if(item != undefined) {    
            
            const itemClass = item.GetClass();

            if( item.IsSoulBound() && (ALLOWED_ITEM_CLASSES.includes(itemClass)) ) {
                const quality = item.GetQuality();
                const quantity = item.GetCount();
                const cost = getCost(item.GetGUIDLow(), player);

                if(quality > 2 && quantity === 1) {
                    items += 1;
                    player.GossipMenuAddItem(1,`Item: ${item.GetItemLink()} (${ToGold(cost)}g)`,1,item.GetGUIDLow(), undefined, undefined);
                }        
            }
            
        }
    }

    if(items === 0) {
        player.SendNotification("You have no soulbound items in your backback to send to your other characters.");
    }

    player.GossipMenuAddItem(1,`Stop using the device`,1,50500);
    player.GossipSendMenu(1000, gameobject, 10000);    

    return true;
}

const GossipSelect: gossip_event_on_select = (event: number, player: Player, creature: any, selection, action, code, menuId) => {
    
    const account = new AccountInfo(player.GetAccountId()); 
    const characters = account.GetCharacters(); 

    // 50500 is an item that is not in the game and can safely be used to exit the menu.
    if(action === 50500) {
        player.GossipClearMenu(); 
        player.GossipComplete(); 
        return true;
    }

    // if the action is greater than the number 
    if(action > ALLOWED_ACCOUNT_CHARS) {
        for(let numC = 0; numC < characters.length; numC++) {
            let name = characters[numC].name;        

            if(name != player.GetName()) {
                const cost = getCost(action, player);
                player.GossipMenuAddItem(2, `Send to: ${name}`, 2, numC+1, undefined, `Are you sure you will to rebind this item? The item will be mailed to ${name}?`, cost);                 
            }            
        }   

        selectedItem[player.GetName()] = action; 
        
        player.GossipSendMenu(1000, creature, 10000);        
    } 

    // Action to select player to receive the item. 
    if(action <= ALLOWED_ACCOUNT_CHARS) {

        let itemToChange = selectedItem[player.GetName()]; 
        let itemGuid = GetItemGUID(itemToChange); 

        const PlayerItem = player.GetItemByGUID(itemGuid); 
        print(`Item Info: ${PlayerItem.GetOwner().GetName()} owns ${PlayerItem.GetName()}`); 
        
        let newItemGuid = SendMail(
            `Item Rebound ${PlayerItem.GetName()}`, 
            `Soulbinder has sent you a gift ${PlayerItem.GetName()}`, 
            characters[action-1].guid,
            player.GetGUIDLow(), 
            MailStationery.MAIL_STATIONERY_DEFAULT,
            0,
            0,
            0,
            PlayerItem.GetEntry(),            
            1
        ); 
                    
        player.RemoveItem(PlayerItem, PlayerItem.GetEntry(), 1);

        player.GossipClearMenu(); 
        player.GossipComplete(); 
    } 

    return true; 
}

RegisterGameObjectGossipEvent(
    INTERACTIVE_OBJECT,
    GossipEvents.GOSSIP_EVENT_ON_HELLO, 
    (...args) => GossipHello(...args)
);

RegisterGameObjectGossipEvent(
    INTERACTIVE_OBJECT,
    GossipEvents.GOSSIP_EVENT_ON_SELECT, 
    (...args) => GossipSelect(...args)
);
