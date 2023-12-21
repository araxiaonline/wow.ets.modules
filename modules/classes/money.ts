import { AccountInfo } from "./account";

export const GOLD_TO_COPPER = 10000;

/**
 * Converts a copper cost to gold 
 * @param cost <number> Cost of item in copper
 * @returns number
 */
export function ToGold(cost: number) : number {
    return Math.floor(cost / GOLD_TO_COPPER); 
}

/**
 * Converts a gold cost to copper
 * @param gold <number> Cost of item in gold
 * @returns number
 */
export function ToCopper(gold: number) : number {
    return gold*GOLD_TO_COPPER;
}

/**
 * Gets a scaling tax for players to help with balancing the economy for guild features. 
 * @param player Player
 * @param tax amount of tax against player to levy number (0-100)
 * @returns number result in copper
 */
export function GetPlayerTax(player: Player, tax: number) : number {
    const account = new AccountInfo(player.GetAccountId());             
    return (tax/100) * account.GetAccountMoney(); 
}
