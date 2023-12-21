/**
 * @file set-xp-rate.ts
 * @date 2023-11-15
 * @author ben-of-codecraft
 * 
 * Type: Command
 * Adds a command that allows players to set their own XP rate for their character up to 5x normal xp rate. 
 * 
 */

/**
 * Configuration options
 */
const MAX_XP_RATE = 5;

// Command to show the current xp rate
const xpCmd = "#xprate";
const showXPcmd = "#xprate show";
const setXPcmd = "#xprate set";

const XP_RATE_SETTING = "xp_rate";

import { PlayerStats } from "../classes/stats";

let xpRateCache = new Map<number, number>();

const XPRateHandler: player_event_on_chat = (event: number, player: Player, message: string) => {

    if(message.includes(xpCmd)) {
        
        const args = message.split(" ");
        const cmd = args[1];
        

        const playerCustom = new PlayerStats(player);         
        playerCustom.load();           

        if(cmd == "show") {            
            const xpRate = xpRateCache.get(player.GetGUIDLow());            
            if(xpRate != undefined) {
                player.SendBroadcastMessage(`Your current XP rate is ${xpRate}x`);                
            } else {
                player.SendBroadcastMessage(`Your current XP rate is 1x`);                
            }
            
        } else if(cmd == "set") {
            const rate = args[2];
            const rateNum = parseInt(rate);
            
            if(rateNum > MAX_XP_RATE) {
                player.SendNotification(`You cannot set your XP rate higher then ${MAX_XP_RATE}x`);
                return false;                                
            }
            
            playerCustom.setStat(XP_RATE_SETTING, rateNum);
            playerCustom.save();
            xpRateCache.set(player.GetGUIDLow(), rateNum);
            
            player.SendBroadcastMessage(`Your XP rate has been set to ${rateNum}x`);            
        } 
        else {
            player.SendBroadcastMessage(`Usage: ${xpCmd} [show|set] [rate]`);            
        }
        
        return false; 
    }

    return true;
}; 

/**
 * Gives players extra XP based on their rate
 * @param event \
 * @param player 
 * @param amount 
 * @param victim 
 */
const XPBonus: player_event_on_give_xp = (event: number, player: Player, amount: number, victim: Unit) => {
        
    const xpRate = xpRateCache.get(player.GetGUIDLow());    
    if(xpRate && xpRate > 1) {
        player.GiveXP(amount * xpRate); 
    } 

}

const XPRateLoader: player_event_on_login = (event: number, player: Player) => {


    const playerCustom = new PlayerStats(player);         
    playerCustom.load();           
    
    const xpRate = playerCustom.getStat(XP_RATE_SETTING);    
    if(xpRate) {
        xpRateCache.set(player.GetGUIDLow(), xpRate.value);
    } else {
        xpRateCache.set(player.GetGUIDLow(), 1);
    }    

}; 

// Grants players extra XP Based on their rate
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_GIVE_XP, (...args) => XPBonus(...args)); 

// Register the command
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_CHAT, 
    (...args) => XPRateHandler(...args)
);

// Loads the cache of seetings on login
RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_LOGIN, (...args) => XPRateLoader(...args));

// reloads the cache of settings when the lua state is opened
RegisterServerEvent(ServerEvents.ELUNA_EVENT_ON_LUA_STATE_OPEN, (...args) => {
    xpRateCache = PlayerStats.GetStatsByType('player', XP_RATE_SETTING);    
}); 