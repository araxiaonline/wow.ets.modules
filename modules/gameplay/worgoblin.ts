import { ToCopper } from "../classes/money";

/**
 * This will change the starting zone for Worgren and Goblins 
 * and provides additional racials for Worgren because they are missing some. 
 * 
 * REQUIRES WORGOBLIN MOD INSTALLATION AND PATCHES TO BE APPLIED
 * SEE README FOR INSTALLATION INSTRUCTIONS
 */

RegisterPlayerEvent(PlayerEvents.PLAYER_EVENT_ON_FIRST_LOGIN, (event, player) => {

    // Worgren get additional racials and start at level 20 in Duskwood
    if(player.GetRace() == 12 ) {
        // Since we do not have all Worgren spells will give them another racial fitting of their class. 
        player.LearnSpell(20577); // Cannibalize

        // learn spell blood fury
        player.LearnSpell(33697);

        player.SetLevel(20);
        player.Teleport(0, -10728.057617, -1131.120850, 27.594067, 1.180833);
        player.ModifyMoney(ToCopper(100));
    }

    // If we are a goblin then start off at level 20 in Ratchet
    if(player.GetRace() == 9) {
        player.SetLevel(20);
        player.ModifyMoney(ToCopper(100)); 
        player.Teleport(1, -1049.596, -3645.963, 23.878, 4.468);        
    }
}); 