/** @ts-expect-error */
let aio: AIO = {}; 
if(!aio.AddAddon()) {

/**
 * This a way for players to game for items in game. Since this is an 
 * AIO module it has both a client and server side component. 
 * 
 * Games currently supported: 
 * - Slots
 * 
 * REQUIRES PATCH FILE WITH IMAGES 
 * REQUIRES AIO TO BE INSTALLED
 */

/**
 * Configuration options
 */
const LOW_BET_SIZE_GOLD: number = 20;
const HIGH_BET_SIZE_GOLD: number = 100;

const gamblerHandlers = aio.AddHandlers('GamblerMain', {}); 

const classImages = [
   "Interface/Gambler/druid",
   "Interface/Gambler/deathknight",
   "Interface/Gambler/hunter",
   "Interface/Gambler/mage",
   "Interface/Gambler/paladin",
   "Interface/Gambler/priest",
   "Interface/Gambler/rogue",
   "Interface/Gambler/shaman",
   "Interface/Gambler/warlock",
   "Interface/Gambler/warrior",
];

let slotSpin = []; 
let multiplier = 1; 

// this function will randomly select a class image from the array above
function getRandomClassImage() {
    const spinIndex = Math.floor(Math.random() * classImages.length);
    slotSpin.push(spinIndex);

    return classImages[spinIndex];
}

// reset the spin
function resetSpin () {
    slotSpin = []; 
}


function determineWin(): number {
    let  win = 0;
    let gold = 0;
    let tokens = 0; 

    // Jackpot is all 3 slots as deathknight arthas
    if(slotSpin[0] == 1 && slotSpin[1] == 1 && slotSpin[2] == 1) {

        if(multiplier == 3) {
            tokens = 100; 
        }
        gold = multiplier * 5000;                        
        win = 2;
    }

    if(slotSpin[0] == slotSpin[1] && slotSpin[1] == slotSpin[2]) {
        if(multiplier == 3) {
            tokens = 50; 
        }
        gold = multiplier * 1000;        
        win = 1; 
    }

    // Deathknights are considered wild cards
    if(
        (slotSpin[0] == slotSpin[1] && slotSpin[2] === 1) || 
        (slotSpin[0] == slotSpin[2] && slotSpin[1] === 1) || 
        (slotSpin[1] == slotSpin[2] && slotSpin[0] === 1) ||
        (slotSpin[0] == 1 && slotSpin[1] === 1) || 
        (slotSpin[0] == 1 && slotSpin[2] === 1) ||
        (slotSpin[1] == 1 && slotSpin[2] === 1)       
    
    ) {
        if(multiplier == 3) {
            tokens = 20; 
        }
        gold = multiplier * 500;
        win = 1;
    }

    // handle two of the same class in a row
    if((slotSpin[0] == slotSpin[1]) && win == 0) {
        gold = multiplier * 100;        
        win = 1;

        if(slotSpin[1] == 1) {
            if(multiplier == 3) {
                tokens = 3; 
            }
            gold = multiplier * 250;
            win = 1;
        }
    }

    // Return money on any lich king wild
    if((slotSpin[0] == 1 || slotSpin[1] == 1 || slotSpin[2] == 1) && win == 0) {
        if(multiplier == 3) {
            tokens = 0; 
            gold = 200; 
        } else {
            tokens = 0; 
            gold = 40;
        }

        win = 1;
    }

    if(win > 0) {
        PlaySoundFile("Sound\\Interface\\LootCoinLarge.wav", "Master");
        aio.Handle("GamblerMain", "AwardSlotWin", gold, tokens);
    } 

    return win; 
}

function SpinSlots(SlotFrame: WoWAPI.Frame, Slot: WoWAPI.Texture[]) {
    let timer = 1; 
    let counter = 1; 
    
    PlaySoundFile("Sound\\Doodad\\GnomeMachine02StandLoop.wav", "Master");
    SlotFrame.SetScript("OnUpdate", (frame, elapsed) => {
        timer = timer + elapsed; 
        if(timer > 0.20) {
            counter = counter + 1;  
            
            resetSpin(); 
            timer = 0;
            Slot[0].SetTexture(getRandomClassImage());    
            Slot[1].SetTexture(getRandomClassImage());    
            Slot[2].SetTexture(getRandomClassImage());                   

            if(counter > 22) {
                frame.SetScript("OnUpdate", null); 
                
                determineWin(); 
            }
        }
    });
}

function ShowSlots(player: Player) {

    const GamblerMainFrame = CreateFrame("Frame", "GamblerMainFrame", UIParent, "UIPanelDialogTemplate"); 

    GamblerMainFrame.SetSize(512,324); 
    GamblerMainFrame.SetMovable(false);    
    GamblerMainFrame.SetPoint("CENTER"); 
    GamblerMainFrame.EnableMouse(true); 
    GamblerMainFrame.EnableKeyboard(true);      
    GamblerMainFrame.Hide();

    const Title = GamblerMainFrame.CreateFontString("TitleFrame", "OVERLAY", "GameFontHighlight");
    Title.SetPoint("TOPLEFT", 15, -10);
    Title.SetText("Heros Slots");
    Title.SetFont("Fonts\\FRIZQT__.TTF", 10);

    // Slots Display Window
    const Slots = CreateFrame("Frame", "SlotsFrame", GamblerMainFrame);
    Slots.SetSize(420,160);
    Slots.SetPoint("CENTER", 0, 25);
    Slots.SetFrameLevel(1);    
    Slots.SetBackdrop({
        bgFile: "Interface/DialogFrame/UI-DialogBox-Background",
        edgeFile: "Interface/DialogFrame/UI-DialogBox-Border",
        tile: true,
        tileSize: 32,
        edgeSize: 32,
        insets: {
            left: 11,
            right: 12,
            top: 12,
            bottom: 11
        }
    });    

    // Slot Columns 1 - 3
    const Slot1 = Slots.CreateTexture("Slot1Texture", null, Slots);
    Slot1.SetSize(128,128);
    Slot1.SetAlpha(0.85);
    Slot1.SetPoint("TOPLEFT", 13, -16);
    Slot1.SetTexture(getRandomClassImage());

    let [ Slot1Point, Slot1Region, Slot1RelPoint, x1offset, y1offset ] = Slot1.GetPoint();

    const Slot2 = Slots.CreateTexture("Slot2Texture", null, Slots);
    Slot2.SetSize(128,128);
    Slot2.SetAlpha(0.85);
    Slot2.SetPoint("TOPLEFT", Slot1Region, Slot1RelPoint, x1offset + 128 + 5, y1offset);
    Slot2.SetTexture(getRandomClassImage());

    let [ Slot2Point, Slot2Region, Slot2RelPoint, x2offset, y2offset ] = Slot2.GetPoint();

    const Slot3 = Slots.CreateTexture("Slot3Texture", null, Slots);
    Slot3.SetSize(128,128);
    Slot3.SetAlpha(0.85);
    Slot3.SetPoint("TOPLEFT", Slot2Region, Slot2RelPoint, x2offset + 128 + 5, y2offset);
    Slot3.SetTexture(getRandomClassImage());

    // Low bet button. 
    const SpinButton = CreateFrame("Button", "SpinButtonLow", GamblerMainFrame, "UIPanelButtonTemplate");
    SpinButton.SetSize(128,32);
    SpinButton.SetPoint("CENTER", -80, -80);
    SpinButton.SetText(`Bet ${LOW_BET_SIZE_GOLD}g Spin`);
    SpinButton.SetFrameLevel(2);
    SpinButton.SetScript("OnClick", (frame, mouse, button) => {        
        resetSpin();    
        multiplier = 1;
        aio.Handle("GamblerMain", "PayForSpin", LOW_BET_SIZE_GOLD*10000);
    }); 

    const SpinButtonHigh = CreateFrame("Button", "SpinButtonHigh", GamblerMainFrame, "UIPanelButtonTemplate");
    SpinButtonHigh.SetSize(128,32);
    SpinButtonHigh.SetPoint("CENTER", 80, -80);
    SpinButtonHigh.SetText(`Bet ${HIGH_BET_SIZE_GOLD}g Spin`);
    SpinButtonHigh.SetFrameLevel(2);
    SpinButtonHigh.SetScript("OnClick", (frame, mouse, button) => {        
        resetSpin();    
        multiplier = 3;
        aio.Handle("GamblerMain", "PayForSpin", HIGH_BET_SIZE_GOLD*10000);
    }); 

    gamblerHandlers.StartSpin = (player: Player) => {        
        SpinSlots(Slots, [Slot1, Slot2, Slot3]);
    }
    
    GamblerMainFrame.Show(); 

    return GamblerMainFrame;
}    

gamblerHandlers.ShowFrame = (player: Player) => {
    ShowSlots(player);     
}    

}

