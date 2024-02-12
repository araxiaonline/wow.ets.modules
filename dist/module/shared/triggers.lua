local ____exports = {}
--- Sets a player trigger boolean that can be retieved later as needed
-- 
-- @param charTrigger TriggerInput
function ____exports.SetTrigger(self, charTrigger)
    local sql = ("INSERT INTO player_trigger (triggerName, characterGuid, isSet) " .. ((((("VALUES (\"" .. charTrigger.triggerName) .. "\", ") .. tostring(charTrigger.characterGuid)) .. ", ") .. tostring(charTrigger.isSet)) .. ")") .. "ON DUPLICATE KEY UPDATE isSet=" .. tostring(charTrigger.isSet)
    CharDBExecute(sql)
end
--- Will return the value of the trigger if it exists, otherwise it will return false
-- 
-- @param charGuid number
-- @param triggerName string
-- @returns boolean
function ____exports.GetTrigger(self, charGuid, triggerName)
    local sql = (("SELECT isSet from player_trigger WHERE triggerName=\"" .. triggerName) .. "\" and characterGuid=") .. tostring(charGuid)
    local result = CharDBQuery(sql)
    if result and result:GetRowCount() > 0 then
        return result:GetBool(0)
    else
        return false
    end
end
return ____exports
