---

local AIO = AIO or require("AIO")
if not AIO.AddAddon() then
    --- Configuration options
    local LOW_BET_SIZE_GOLD = 20
    local HIGH_BET_SIZE_GOLD = 100
    local gamblerHandlers = AIO.AddHandlers("GamblerMain", {})
    local classImages = {
        "Interface/Gambler/druid",
        "Interface/Gambler/deathknight",
        "Interface/Gambler/hunter",
        "Interface/Gambler/mage",
        "Interface/Gambler/paladin",
        "Interface/Gambler/priest",
        "Interface/Gambler/rogue",
        "Interface/Gambler/shaman",
        "Interface/Gambler/warlock",
        "Interface/Gambler/warrior"
    }
    local slotSpin = {}
    local multiplier = 1
    local function getRandomClassImage(self)
        local spinIndex = math.floor(math.random() * #classImages)
        slotSpin[#slotSpin + 1] = spinIndex
        return classImages[spinIndex + 1]
    end
    local function resetSpin(self)
        slotSpin = {}
    end
    local function determineWin(self)
        local win = 0
        local gold = 0
        local tokens = 0
        if slotSpin[1] == 1 and slotSpin[2] == 1 and slotSpin[3] == 1 then
            if multiplier == 3 then
                tokens = 100
            end
            gold = multiplier * 5000
            win = 2
        end
        if slotSpin[1] == slotSpin[2] and slotSpin[2] == slotSpin[3] then
            if multiplier == 3 then
                tokens = 50
            end
            gold = multiplier * 1000
            win = 1
        end
        if slotSpin[1] == slotSpin[2] and slotSpin[3] == 1 or slotSpin[1] == slotSpin[3] and slotSpin[2] == 1 or slotSpin[2] == slotSpin[3] and slotSpin[1] == 1 or slotSpin[1] == 1 and slotSpin[2] == 1 or slotSpin[1] == 1 and slotSpin[3] == 1 or slotSpin[2] == 1 and slotSpin[3] == 1 then
            if multiplier == 3 then
                tokens = 20
            end
            gold = multiplier * 500
            win = 1
        end
        if slotSpin[1] == slotSpin[2] and win == 0 then
            gold = multiplier * 100
            win = 1
            if slotSpin[2] == 1 then
                if multiplier == 3 then
                    tokens = 3
                end
                gold = multiplier * 250
                win = 1
            end
        end
        if (slotSpin[1] == 1 or slotSpin[2] == 1 or slotSpin[3] == 1) and win == 0 then
            if multiplier == 3 then
                tokens = 0
                gold = 200
            else
                tokens = 0
                gold = 40
            end
            win = 1
        end
        if win > 0 then
            PlaySoundFile("Sound\\Interface\\LootCoinLarge.wav", "Master")
            AIO.Handle("GamblerMain", "AwardSlotWin", gold, tokens)
        end
        return win
    end
    local function SpinSlots(self, SlotFrame, Slot)
        local timer = 1
        local counter = 1
        PlaySoundFile("Sound\\Doodad\\GnomeMachine02StandLoop.wav", "Master")
        SlotFrame:SetScript(
            "OnUpdate",
            function(frame, elapsed)
                timer = timer + elapsed
                if timer > 0.2 then
                    counter = counter + 1
                    resetSpin(_G)
                    timer = 0
                    Slot[1]:SetTexture(getRandomClassImage(_G))
                    Slot[2]:SetTexture(getRandomClassImage(_G))
                    Slot[3]:SetTexture(getRandomClassImage(_G))
                    if counter > 22 then
                        frame:SetScript("OnUpdate", nil)
                        determineWin(_G)
                    end
                end
            end
        )
    end
    local function ShowSlots(self, player)
        local GamblerMainFrame = CreateFrame("Frame", "GamblerMainFrame", UIParent, "UIPanelDialogTemplate")
        GamblerMainFrame:SetSize(512, 324)
        GamblerMainFrame:SetMovable(false)
        GamblerMainFrame:SetPoint("CENTER")
        GamblerMainFrame:EnableMouse(true)
        GamblerMainFrame:EnableKeyboard(true)
        GamblerMainFrame:Hide()
        local Title = GamblerMainFrame:CreateFontString("TitleFrame", "OVERLAY", "GameFontHighlight")
        Title:SetPoint("TOPLEFT", 15, -10)
        Title:SetText("Heros Slots")
        Title:SetFont("Fonts\\FRIZQT__.TTF", 10)
        local Slots = CreateFrame("Frame", "SlotsFrame", GamblerMainFrame)
        Slots:SetSize(420, 160)
        Slots:SetPoint("CENTER", 0, 25)
        Slots:SetFrameLevel(1)
        Slots:SetBackdrop({
            bgFile = "Interface/DialogFrame/UI-DialogBox-Background",
            edgeFile = "Interface/DialogFrame/UI-DialogBox-Border",
            tile = true,
            tileSize = 32,
            edgeSize = 32,
            insets = {left = 11, right = 12, top = 12, bottom = 11}
        })
        local Slot1 = Slots:CreateTexture("Slot1Texture", nil, Slots)
        Slot1:SetSize(128, 128)
        Slot1:SetAlpha(0.85)
        Slot1:SetPoint("TOPLEFT", 13, -16)
        Slot1:SetTexture(getRandomClassImage(_G))
        local Slot1Point, Slot1Region, Slot1RelPoint, x1offset, y1offset = Slot1:GetPoint()
        local Slot2 = Slots:CreateTexture("Slot2Texture", nil, Slots)
        Slot2:SetSize(128, 128)
        Slot2:SetAlpha(0.85)
        Slot2:SetPoint(
            "TOPLEFT",
            Slot1Region,
            Slot1RelPoint,
            x1offset + 128 + 5,
            y1offset
        )
        Slot2:SetTexture(getRandomClassImage(_G))
        local Slot2Point, Slot2Region, Slot2RelPoint, x2offset, y2offset = Slot2:GetPoint()
        local Slot3 = Slots:CreateTexture("Slot3Texture", nil, Slots)
        Slot3:SetSize(128, 128)
        Slot3:SetAlpha(0.85)
        Slot3:SetPoint(
            "TOPLEFT",
            Slot2Region,
            Slot2RelPoint,
            x2offset + 128 + 5,
            y2offset
        )
        Slot3:SetTexture(getRandomClassImage(_G))
        local SpinButton = CreateFrame("Button", "SpinButtonLow", GamblerMainFrame, "UIPanelButtonTemplate")
        SpinButton:SetSize(128, 32)
        SpinButton:SetPoint("CENTER", -80, -80)
        SpinButton:SetText(("Bet " .. tostring(LOW_BET_SIZE_GOLD)) .. "g Spin")
        SpinButton:SetFrameLevel(2)
        SpinButton:SetScript(
            "OnClick",
            function(frame, mouse, button)
                resetSpin(_G)
                multiplier = 1
                AIO.Handle("GamblerMain", "PayForSpin", LOW_BET_SIZE_GOLD * 10000)
            end
        )
        local SpinButtonHigh = CreateFrame("Button", "SpinButtonHigh", GamblerMainFrame, "UIPanelButtonTemplate")
        SpinButtonHigh:SetSize(128, 32)
        SpinButtonHigh:SetPoint("CENTER", 80, -80)
        SpinButtonHigh:SetText(("Bet " .. tostring(HIGH_BET_SIZE_GOLD)) .. "g Spin")
        SpinButtonHigh:SetFrameLevel(2)
        SpinButtonHigh:SetScript(
            "OnClick",
            function(frame, mouse, button)
                resetSpin(_G)
                multiplier = 3
                AIO.Handle("GamblerMain", "PayForSpin", HIGH_BET_SIZE_GOLD * 10000)
            end
        )
        gamblerHandlers.StartSpin = function(____, player)
            SpinSlots(_G, Slots, {Slot1, Slot2, Slot3})
        end
        GamblerMainFrame:Show()
        return GamblerMainFrame
    end
    gamblerHandlers.ShowFrame = function(____, player)
        ShowSlots(_G, player)
    end
end
