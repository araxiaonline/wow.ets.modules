/** @ts-expect-error */
let aio: AIO = {}; 

/**
 * Gambler - Slot Machine
 * This is the server side code used to add gambling games to the server. 
 * 
 * REQUIRES SQL
 */

/**
 * Confiugration options
 */

/**
 * Game Object that will start the slot machine up
 */
const SLOT_GAME_OBJECT = 750001;

/**
 * Token Id of the currency you want to aware the players.
 */
const TOKEB_ID = 910001;


const ShowGambler: player_event_on_command = (event: number,player: Player, command: string): boolean => {
    if(command == 'gamble') {
        aio.Handle(player, 'GamblerMain', 'ShowFrame'); 
        return false; 
    }
    return true; 
}; 

/**
 * @noSelf
 */
function PayForSpin(this:void, player: Player, cost: number): void {
    const money = player.GetCoinage(); 
    if(money >= cost) {
        player.ModifyMoney(cost * -1);                 
        aio.Handle(player, 'GamblerMain', 'StartSpin');
    } else {
        player.SendNotification("You don't have enough money to spin the slots!");
        player.PlayDirectSound(8959, player);
    }    
}

function AwardSlotWin(this:void, player: Player, gold: number, tokens: number): void {    
    player.ModifyMoney(gold*10000);    
    if(tokens > 0) {
        player.AddItem(TOKEB_ID, tokens); 
    }

    if(tokens > 75) {
        player.SendChatMessageToPlayer(ChatMsg.CHAT_MSG_SAY, 0, `|cff1eff00I HIT THE JACKPOT! I won ${gold} gold and ${tokens} tokens!`, player);
    } else {        
        if(tokens > 0) {
            player.SendChatMessageToPlayer(ChatMsg.CHAT_MSG_SAY, 0, `|cff1eff00I won ${gold} gold and ${tokens} tokens!`, player);        
        } else {
            player.SendChatMessageToPlayer(ChatMsg.CHAT_MSG_SAY, 0, `|cff1eff00I won ${gold} gold`, player);        
        }
    }
    
}

const SendSlotStart: gameobject_event_on_use = (event: number, gameobject: GameObject, player: Player): boolean => {    
    aio.Handle(player, 'GamblerMain', 'ShowFrame'); 
    return true; 
}

const gamblerHandlers = aio.AddHandlers('GamblerMain', {
    PayForSpin,
    AwardSlotWin
}); 

RegisterPlayerEvent(
    PlayerEvents.PLAYER_EVENT_ON_COMMAND, 
    (...args) => ShowGambler(...args)
); 

RegisterGameObjectEvent(SLOT_GAME_OBJECT, GameObjectEvents.GAMEOBJECT_EVENT_ON_USE, (...args) => SendSlotStart(...args)); 
