local ____lualib = require("lualib_bundle")
local __TS__ArrayIncludes = ____lualib.__TS__ArrayIncludes
local __TS__New = ____lualib.__TS__New
local ____exports = {}
local ____money = require("shared.money")
local ToGold = ____money.ToGold
local ToCopper = ____money.ToCopper
local ____account = require("shared.account")
local AccountInfo = ____account.AccountInfo
--- This is the list of item classes that are allowed to be sent to other characters.
-- 
-- @link https://www.azerothcore.org/wiki/item_template
local ALLOWED_ITEM_CLASSES = {2, 4, 9}
--- This is the number of characters an account can have.
local ALLOWED_ACCOUNT_CHARS = 15
--- Base price for sending an item multipliers will be added on top
local SOULSWAP_BASE_PRICE = ToCopper(nil, 20)
--- The level the discount for sending items is no longer applied
local NO_DISCOUNT_LEVEL = 70
--- Discount percentage applied per 10 levels
local DISCOUNT_ADJ = 3
--- The id of the object that will interact with the player to handle the soulswap
local INTERACTIVE_OBJECT = 750000
local selectedItem = {}
local function getCost(self, guid, player)
    local itemGuid = GetItemGUID(guid)
    local theItem = player:GetItemByGUID(itemGuid)
    local discount = 1
    local iLevelModifer = theItem:GetItemLevel() / 40
    if player:GetLevel() < NO_DISCOUNT_LEVEL then
        discount = (NO_DISCOUNT_LEVEL - player:GetLevel()) * DISCOUNT_ADJ
    end
    if discount > 100 then
        discount = 90
    end
    return SOULSWAP_BASE_PRICE * iLevelModifer * ((100 - discount) / 100)
end
local function GossipHello(____, event, player, gameobject)
    player:GossipClearMenu()
    local items = 0
    do
        local i = 23
        while i <= 38 do
            local item = player:GetItemByPos(255, i)
            if item ~= nil then
                local itemClass = item:GetClass()
                if item:IsSoulBound() and __TS__ArrayIncludes(ALLOWED_ITEM_CLASSES, itemClass) then
                    local quality = item:GetQuality()
                    local quantity = item:GetCount()
                    local cost = getCost(
                        nil,
                        item:GetGUIDLow(),
                        player
                    )
                    if quality > 2 and quantity == 1 then
                        items = items + 1
                        player:GossipMenuAddItem(
                            1,
                            ((("Item: " .. item:GetItemLink()) .. " (") .. tostring(ToGold(nil, cost))) .. "g)",
                            1,
                            item:GetGUIDLow(),
                            nil,
                            nil
                        )
                    end
                end
            end
            i = i + 1
        end
    end
    if items == 0 then
        player:SendNotification("You have no soulbound items in your backback to send to your other characters.")
    end
    player:GossipMenuAddItem(1, "Stop using the device", 1, 50500)
    player:GossipSendMenu(1000, gameobject, 10000)
    return true
end
local function GossipSelect(____, event, player, creature, selection, action, code, menuId)
    local account = __TS__New(
        AccountInfo,
        player:GetAccountId()
    )
    local characters = account:GetCharacters()
    if action == 50500 then
        player:GossipClearMenu()
        player:GossipComplete()
        return true
    end
    if action > ALLOWED_ACCOUNT_CHARS then
        do
            local numC = 0
            while numC < #characters do
                local name = characters[numC + 1].name
                if name ~= player:GetName() then
                    local cost = getCost(nil, action, player)
                    player:GossipMenuAddItem(
                        2,
                        "Send to: " .. name,
                        2,
                        numC + 1,
                        nil,
                        ("Are you sure you will to rebind this item? The item will be mailed to " .. name) .. "?",
                        cost
                    )
                end
                numC = numC + 1
            end
        end
        selectedItem[player:GetName()] = action
        player:GossipSendMenu(1000, creature, 10000)
    end
    if action <= ALLOWED_ACCOUNT_CHARS then
        local itemToChange = selectedItem[player:GetName()]
        local itemGuid = GetItemGUID(itemToChange)
        local PlayerItem = player:GetItemByGUID(itemGuid)
        print((("Item Info: " .. PlayerItem:GetOwner():GetName()) .. " owns ") .. PlayerItem:GetName())
        local newItemGuid = SendMail(
            "Item Rebound " .. PlayerItem:GetName(),
            "Soulbinder has sent you a gift " .. PlayerItem:GetName(),
            characters[action].guid,
            player:GetGUIDLow(),
            41,
            0,
            0,
            0,
            PlayerItem:GetEntry(),
            1
        )
        player:RemoveItem(
            PlayerItem,
            PlayerItem:GetEntry(),
            1
        )
        player:GossipClearMenu()
        player:GossipComplete()
    end
    return true
end
RegisterGameObjectGossipEvent(
    INTERACTIVE_OBJECT,
    1,
    function(...) return GossipHello(nil, ...) end
)
RegisterGameObjectGossipEvent(
    INTERACTIVE_OBJECT,
    2,
    function(...) return GossipSelect(nil, ...) end
)
return ____exports
