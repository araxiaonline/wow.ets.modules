local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local ____exports = {}
____exports.AccountInfo = __TS__Class()
local AccountInfo = ____exports.AccountInfo
AccountInfo.name = "AccountInfo"
function AccountInfo.prototype.____constructor(self, accountId)
    self.accountId = accountId
end
function AccountInfo.prototype.GetAccountMoney(self)
    local result = CharDBQuery("SELECT SUM(Money) as AccountMoney from acore_characters.characters WHERE account = " .. tostring(self.accountId))
    local row = result:GetRow()
    return row.AccountMoney
end
function AccountInfo.prototype.GetCharacters(self)
    local result = CharDBQuery("SELECT guid, name from characters WHERE account = " .. tostring(self.accountId))
    local characters = {}
    do
        local i = 0
        while i < result:GetRowCount() do
            local row = result:GetRow()
            characters[#characters + 1] = {guid = row.guid, name = row.name}
            result:NextRow()
            i = i + 1
        end
    end
    return characters
end
return ____exports
