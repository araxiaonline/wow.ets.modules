/**
 * REQUIRES DB acore_world.item_template to be updated for custom tokens
 */

/**
 * CONFIG OPTIONS
 * @returns 
 */

// Reward 1 token per every 5 achievement points earned.
const AWARD_RATE = 5; 

// Token Id of the currency you want to aware the players. 
const TOKEN_ID = 910001;

// Character GUID of the character that will be sending the tokens vai mail
const REWARD_CHAR_GUID = 2506;

/**
 * On Achivement complete the system will reward the player with tokens based on the AWARD_RATE
 * set above 
 * Default is 5 Achievement Points = 1 Token
 * 
 * IE) 
 * 10 Achievement Points = 2 Tokens
 * 50 Achievement Points = 10 Tokens
 * 
 * @param event : number
 * @param player : Player
 * @param achievement : Achievement
 * @returns boolean
 */
const achievementComplete: player_event_on_achievement_complete = (event, player, achievement) => {
     
    const id = achievement.GetId();
    const query = WorldDBQuery(`SELECT Points from achievements where ID=${id}`);
    const points = query.GetUInt32(0);

    if(points != undefined) {
        const tokens = Math.ceil(points / AWARD_RATE); 
        SendMail(
            `Your achievement token reward!`, 
            `You earned it now spend it!`, 
            player.GetGUIDLow(),
            REWARD_CHAR_GUID, 
            MailStationery.MAIL_STATIONERY_DEFAULT,
            0,
            0,
            0,
            TOKEN_ID,            
            tokens
        );                
    }    

    return true; 
}; 

RegisterPlayerEvent(
    PlayerEvents.PLAYER_EVENT_ON_ACHIEVEMENT_COMPLETE,
    (...args) => achievementComplete(...args)
);