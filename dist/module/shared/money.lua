local ____lualib = require("lualib_bundle")
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____account = require("shared.account")
local AccountInfo = ____account.AccountInfo
____exports.GOLD_TO_COPPER = 10000
--- Converts a copper cost to gold
-- 
-- @param cost <number> Cost of item in copper
-- @returns number
function ____exports.ToGold(self, cost)
    return math.floor(cost / ____exports.GOLD_TO_COPPER)
end
--- Converts a gold cost to copper
-- 
-- @param gold <number> Cost of item in gold
-- @returns number
function ____exports.ToCopper(self, gold)
    return gold * ____exports.GOLD_TO_COPPER
end
--- Gets a scaling tax for players to help with balancing the economy for guild features.
-- 
-- @param player Player
-- @param tax amount of tax against player to levy number (0-100)
-- @returns number result in copper
function ____exports.GetPlayerTax(self, player, tax)
    local account = __TS__New(
        AccountInfo,
        player:GetAccountId()
    )
    return tax / 100 * account:GetAccountMoney()
end
return ____exports
