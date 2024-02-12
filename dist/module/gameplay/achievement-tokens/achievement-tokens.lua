--- CONFIG OPTIONS
-- 
-- @returns
AWARD_RATE = 5
TOKEN_ID = 910001
REWARD_CHAR_GUID = 2506
--- On Achivement complete the system will reward the player with tokens based on the AWARD_RATE
-- set above 
-- Default is 5 Achievement Points = 1 Token
-- 
-- IE) 
-- 10 Achievement Points = 2 Tokens
-- 50 Achievement Points = 10 Tokens
-- 
-- @param event : number
-- @param player : Player
-- @param achievement : Achievement
-- @returns boolean
achievementComplete = function(____, event, player, achievement)
    local id = achievement:GetId()
    local query = WorldDBQuery("SELECT Points from achievements where ID=" .. tostring(id))
    local points = query:GetUInt32(0)
    if points ~= nil then
        local tokens = math.ceil(points / AWARD_RATE)
        SendMail(
            "Your achievement token reward!",
            "You earned it now spend it!",
            player:GetGUIDLow(),
            REWARD_CHAR_GUID,
            41,
            0,
            0,
            0,
            TOKEN_ID,
            tokens
        )
    end
    return true
end
RegisterPlayerEvent(
    45,
    function(...) return achievementComplete(_G, ...) end
)
