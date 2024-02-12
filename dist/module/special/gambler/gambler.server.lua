---

local AIO = AIO or require("AIO")
--- Game Object that will start the slot machine up
SLOT_GAME_OBJECT = 750001
--- Token Id of the currency you want to aware the players.
TOKEB_ID = 910001
ShowGambler = function(____, event, player, command)
    if command == "gamble" then
        AIO.Handle(player, "GamblerMain", "ShowFrame")
        return false
    end
    return true
end
---
-- @noSelf
function PayForSpin(player, cost)
    local money = player:GetCoinage()
    if money >= cost then
        player:ModifyMoney(cost * -1)
        AIO.Handle(player, "GamblerMain", "StartSpin")
    else
        player:SendNotification("You don't have enough money to spin the slots!")
        player:PlayDirectSound(8959, player)
    end
end
function AwardSlotWin(player, gold, tokens)
    player:ModifyMoney(gold * 10000)
    if tokens > 0 then
        player:AddItem(TOKEB_ID, tokens)
    end
    if tokens > 75 then
        player:SendChatMessageToPlayer(
            1,
            0,
            ((("|cff1eff00I HIT THE JACKPOT! I won " .. tostring(gold)) .. " gold and ") .. tostring(tokens)) .. " tokens!",
            player
        )
    else
        if tokens > 0 then
            player:SendChatMessageToPlayer(
                1,
                0,
                ((("|cff1eff00I won " .. tostring(gold)) .. " gold and ") .. tostring(tokens)) .. " tokens!",
                player
            )
        else
            player:SendChatMessageToPlayer(
                1,
                0,
                ("|cff1eff00I won " .. tostring(gold)) .. " gold",
                player
            )
        end
    end
end
SendSlotStart = function(____, event, gameobject, player)
    AIO.Handle(player, "GamblerMain", "ShowFrame")
    return true
end
gamblerHandlers = AIO.AddHandlers("GamblerMain", {PayForSpin = PayForSpin, AwardSlotWin = AwardSlotWin})
RegisterPlayerEvent(
    42,
    function(...) return ShowGambler(_G, ...) end
)
RegisterGameObjectEvent(
    SLOT_GAME_OBJECT,
    14,
    function(...) return SendSlotStart(_G, ...) end
)
