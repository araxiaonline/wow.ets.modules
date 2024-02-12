local ____exports = {}
function ____exports.colors(self, name)
    local colors = {
        GREY = "|cff999999",
        RED = "|cffff0000",
        WHITE = "|cffFFFFFF",
        GREEN = "|cff1eff00",
        PURPLE = "|cff9F3FFF",
        BLUE = "|cff0070dd",
        ORANGE = "|cffFF8400"
    }
    local keyName = string.upper(name)
    if colors[keyName] then
        return colors[keyName]
    else
        return colors.WHITE
    end
end
return ____exports
