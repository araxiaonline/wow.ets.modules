local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local Map = ____lualib.Map
local __TS__New = ____lualib.__TS__New
local __TS__Iterator = ____lualib.__TS__Iterator
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local ____exports = {}
--- Config
local PLAYER_TYPE = "player"
____exports.StatEvents = {TOKEN_CREATED = "token_created", TICKETS_AWARDED = "darkmoon_tickets_awarded"}
--- Adds stats to database based on type of stat.
____exports.Stats = __TS__Class()
local Stats = ____exports.Stats
Stats.name = "Stats"
function Stats.prototype.____constructor(self, entity)
    self.stats = __TS__New(Map)
    self.entity = entity
    self:load()
end
function Stats.GetStatsByType(self, ____type, name)
    local result = CharDBQuery(((("SELECT id, name, value, updated FROM " .. ____type) .. "_stats WHERE name = '") .. name) .. "'")
    local stats = __TS__New(Map)
    if not result then
        return stats
    end
    do
        local i = 0
        while i < result:GetRowCount() do
            local row = result:GetRow()
            stats:set(row.id, row.value)
            result:NextRow()
            i = i + 1
        end
    end
    return stats
end
function Stats.prototype.load(self)
    local result = CharDBQuery((("SELECT id, name, value, updated FROM " .. self.entity.type) .. "_stats WHERE id = ") .. tostring(self.entity.id))
    if not result then
        return false
    end
    do
        local i = 0
        while i < result:GetRowCount() do
            local row = result:GetRow()
            local stat = {
                name = row.name,
                type = self.entity.type,
                value = row.value,
                updated = row.updated,
                loaded = true
            }
            self.stats:set(stat.name, stat)
            result:NextRow()
            i = i + 1
        end
    end
    return true
end
function Stats.prototype.save(self)
    for ____, stat in __TS__Iterator(self.stats:values()) do
        if not stat.loaded then
            CharDBExecute(((((((((("INSERT INTO " .. self.entity.type) .. "_stats (id, name, value, updated) VALUES (") .. tostring(self.entity.id)) .. ", '") .. stat.name) .. "', ") .. tostring(stat.value)) .. ", ") .. tostring(stat.updated)) .. ")")
            PrintDebug((((((("Inserted " .. stat.name) .. " for ") .. self.entity.type) .. " ") .. tostring(self.entity.id)) .. " with value ") .. tostring(stat.value))
        else
            CharDBExecute(((((((((("UPDATE " .. self.entity.type) .. "_stats SET value = ") .. tostring(stat.value)) .. ", updated = ") .. tostring(stat.updated)) .. " WHERE id = ") .. tostring(self.entity.id)) .. " AND name = '") .. stat.name) .. "'")
            PrintDebug((((((("Updated " .. stat.name) .. " for ") .. self.entity.type) .. " ") .. tostring(self.entity.id)) .. " to ") .. tostring(stat.value))
        end
    end
end
function Stats.prototype.getStat(self, name)
    return self.stats:get(name)
end
function Stats.prototype.setStat(self, name, value)
    local stat = self.stats:get(name)
    if stat then
        stat.value = value
        stat.updated = GetGameTime(nil)
    else
        self.stats:set(
            name,
            {
                name = name,
                type = PLAYER_TYPE,
                value = value,
                updated = GetGameTime(nil),
                loaded = false
            }
        )
    end
end
function Stats.prototype.increment(self, name, amount)
    if amount == nil then
        amount = 1
    end
    local stat = self.stats:get(name)
    if stat then
        stat.value = stat.value + amount
        stat.updated = GetGameTime(nil)
    else
        self.stats:set(
            name,
            {
                name = name,
                type = PLAYER_TYPE,
                value = 0,
                updated = GetGameTime(nil),
                loaded = false
            }
        )
    end
end
--- Custom player stats that will be
____exports.PlayerStats = __TS__Class()
local PlayerStats = ____exports.PlayerStats
PlayerStats.name = "PlayerStats"
__TS__ClassExtends(PlayerStats, ____exports.Stats)
function PlayerStats.prototype.____constructor(self, player)
    PlayerStats.____super.prototype.____constructor(
        self,
        {
            id = player:GetGUID(),
            type = PLAYER_TYPE
        }
    )
    self.playerStats = {}
    self.player = player
end
return ____exports
