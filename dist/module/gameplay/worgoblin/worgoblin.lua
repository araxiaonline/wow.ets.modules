local ____exports = {}
local ____money = require("shared.money")
local ToCopper = ____money.ToCopper
RegisterPlayerEvent(
    30,
    function(event, player)
        if player:GetRace() == 12 then
            player:LearnSpell(20577)
            player:LearnSpell(33697)
            player:SetLevel(20)
            player:Teleport(
                0,
                -10728.057617,
                -1131.12085,
                27.594067,
                1.180833
            )
            player:ModifyMoney(ToCopper(nil, 100))
        end
        if player:GetRace() == 9 then
            player:SetLevel(20)
            player:ModifyMoney(ToCopper(nil, 100))
            player:Teleport(
                1,
                -1049.596,
                -3645.963,
                23.878,
                4.468
            )
        end
    end
)
return ____exports
