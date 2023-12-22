export function colors(name: string) {
    const colors = {
        GREY: "|cff999999",
        RED: "|cffff0000",
        WHITE: "|cffFFFFFF",
        GREEN: "|cff1eff00",
        PURPLE: "|cff9F3FFF",
        BLUE: "|cff0070dd",
        ORANGE: "|cffFF8400",
    }; 

    const keyName = name.toUpperCase();
    if(colors[keyName]) {
        return colors[keyName]; 
    } else {
        return colors.WHITE;
    }
}