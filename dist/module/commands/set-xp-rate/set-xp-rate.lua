local ____lualib = require("lualib_bundle")
local Map = ____lualib.Map
local __TS__New = ____lualib.__TS__New
local __TS__StringIncludes = ____lualib.__TS__StringIncludes
local __TS__StringSplit = ____lualib.__TS__StringSplit
local __TS__ParseInt = ____lualib.__TS__ParseInt
local ____exports = {}
local ____stats = require("shared.stats")
local PlayerStats = ____stats.PlayerStats
--- Configuration options
local MAX_XP_RATE = 5
local xpCmd = "#xprate"
local showXPcmd = "#xprate show"
local setXPcmd = "#xprate set"
local XP_RATE_SETTING = "xp_rate"
local xpRateCache = __TS__New(Map)
local function XPRateHandler(____, event, player, message)
    if __TS__StringIncludes(message, xpCmd) then
        local args = __TS__StringSplit(message, " ")
        local cmd = args[2]
        local playerCustom = __TS__New(PlayerStats, player)
        playerCustom:load()
        if cmd == "show" then
            local xpRate = xpRateCache:get(player:GetGUIDLow())
            if xpRate ~= nil then
                player:SendBroadcastMessage(("Your current XP rate is " .. tostring(xpRate)) .. "x")
            else
                player:SendBroadcastMessage("Your current XP rate is 1x")
            end
        elseif cmd == "set" then
            local rate = args[3]
            local rateNum = __TS__ParseInt(rate)
            if rateNum > MAX_XP_RATE then
                player:SendNotification(("You cannot set your XP rate higher then " .. tostring(MAX_XP_RATE)) .. "x")
                return false
            end
            playerCustom:setStat(XP_RATE_SETTING, rateNum)
            playerCustom:save()
            xpRateCache:set(
                player:GetGUIDLow(),
                rateNum
            )
            player:SendBroadcastMessage(("Your XP rate has been set to " .. tostring(rateNum)) .. "x")
        else
            player:SendBroadcastMessage(("Usage: " .. xpCmd) .. " [show|set] [rate]")
        end
        return false
    end
    return true
end
--- Gives players extra XP based on their rate
-- 
-- @param event \
-- @param player
-- @param amount
-- @param victim
local function XPBonus(____, event, player, amount, victim)
    local xpRate = xpRateCache:get(player:GetGUIDLow())
    if xpRate and xpRate > 1 then
        player:GiveXP(amount * xpRate)
    end
end
local function XPRateLoader(____, event, player)
    local playerCustom = __TS__New(PlayerStats, player)
    playerCustom:load()
    local xpRate = playerCustom:getStat(XP_RATE_SETTING)
    if xpRate then
        xpRateCache:set(
            player:GetGUIDLow(),
            xpRate.value
        )
    else
        xpRateCache:set(
            player:GetGUIDLow(),
            1
        )
    end
end
RegisterPlayerEvent(
    12,
    function(...) return XPBonus(nil, ...) end
)
RegisterPlayerEvent(
    18,
    function(...) return XPRateHandler(nil, ...) end
)
RegisterPlayerEvent(
    3,
    function(...) return XPRateLoader(nil, ...) end
)
RegisterServerEvent(
    33,
    function(...)
        xpRateCache = PlayerStats:GetStatsByType("player", XP_RATE_SETTING)
    end
)
return ____exports
