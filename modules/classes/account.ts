/**
 * Class for find out information about an account
 */
export type BasicCharacter = {
    guid: number, 
    name: string
}

export class AccountInfo {
    private accountId: number; 

    constructor(accountId: number) {
        this.accountId = accountId;        
    }

    GetAccountMoney(): number {
        const result = CharDBQuery(`SELECT SUM(Money) as AccountMoney from acore_characters.characters WHERE account = ${this.accountId}`);
        const row = result.GetRow() as Record<string, number>;
        return row.AccountMoney;
    }

    GetCharacters(): BasicCharacter[] {
        const result = CharDBQuery(`SELECT guid, name from characters WHERE account = ${this.accountId}`); 
        const characters: BasicCharacter[] = []; 
        
        for(let i=0; i < result.GetRowCount(); i++) {
            const row = result.GetRow();             
            characters.push({ guid: row.guid as number, name: row.name as string });  
            result.NextRow();
        }
        
        return characters; 
    } 

}