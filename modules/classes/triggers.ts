/* @noSelfInFile */

/**
 * This is used to set feature flags and player triggers
 * REQUIRE SQL TABLES TO BE CREATED
 */

type TriggerInput = {    
    triggerName: string, 
    characterGuid: number, 
    isSet: boolean
}

/**
 * Sets a player trigger boolean that can be retieved later as needed
 * @param charTrigger TriggerInput
 */
export function SetTrigger(charTrigger: TriggerInput) {
    let sql = `INSERT INTO player_trigger (triggerName, characterGuid, isSet) `+
    `VALUES ("${charTrigger.triggerName}", ${charTrigger.characterGuid}, ${charTrigger.isSet})`+
    `ON DUPLICATE KEY UPDATE isSet=${charTrigger.isSet}`;             
    CharDBExecute(sql);     
}

/**
 * Will return the value of the trigger if it exists, otherwise it will return false
 * @param charGuid number
 * @param triggerName string
 * @returns boolean
 */
export function GetTrigger(charGuid: number, triggerName: string) {
    let sql = `SELECT isSet from player_trigger WHERE triggerName="${triggerName}" and characterGuid=${charGuid}`;
    const result = CharDBQuery(sql); 

    if(result && result.GetRowCount() > 0) {
        return result.GetBool(0)
    } else {
        return false;
    }
    
}
