declare function GetGameTime(): number;

/**
 * This is used to track custom stats for players inside of other modules
 * REQUIRES SQL TABLES TO BE CREATED
 */

/**
 * Config
 */
const PLAYER_TYPE = 'player';
export const StatEvents = {
  TOKEN_CREATED: 'token_created',
  TICKETS_AWARDED: 'darkmoon_tickets_awarded',
};

/**
 * Adds stats to database based on type of stat.
 */
export class Stats {

  stats = new Map<string, Stat>();
  entity: StatEntity;

  constructor(entity: StatEntity) {
    this.entity = entity;
    this.load();
  }

  static GetStatsByType(type: string, name: string) : Map<number, number> {
    const result = CharDBQuery(`SELECT id, name, value, updated FROM ${type}_stats WHERE name = '${name}'`);
    const stats = new Map<number, number>();
    if(!result) {
      return stats;
    }
    for(let i=0; i < result.GetRowCount(); i++) {
      const row = result.GetRow();      
      stats.set(row.id as number, row.value as number);
      result.NextRow();
    }    
    return stats;
  }; 

  load() : boolean {
    const result = CharDBQuery(`SELECT id, name, value, updated FROM ${this.entity.type}_stats WHERE id = ${this.entity.id}`);
    if(!result) {
      return false;
    }
    for(let i=0; i < result.GetRowCount(); i++) {
      const row = result.GetRow();
      const stat: Stat = {
        name: row.name as string,
        type: this.entity.type,
        value: row.value as number,
        updated: row.updated as number,
        loaded: true
      }
      this.stats.set(stat.name, stat);
      result.NextRow();
    }
    return true;
  }

  save() : void {

    for(const stat of this.stats.values()) {
      if(!stat.loaded) {
        CharDBExecute(`INSERT INTO ${this.entity.type}_stats (id, name, value, updated) VALUES (${this.entity.id}, '${stat.name}', ${stat.value}, ${stat.updated})`);
        PrintDebug(`Inserted ${stat.name} for ${this.entity.type} ${this.entity.id} with value ${stat.value}`);
      } else {
        CharDBExecute(`UPDATE ${this.entity.type}_stats SET value = ${stat.value}, updated = ${stat.updated} WHERE id = ${this.entity.id} AND name = '${stat.name}'`);
        PrintDebug(`Updated ${stat.name} for ${this.entity.type} ${this.entity.id} to ${stat.value}`);
      }
    }
  }

  getStat(name: string) : Stat | undefined {
    return this.stats.get(name);
  }

  setStat(name: string, value: number) : void {
    const stat = this.stats.get(name);
    if(stat) {
      stat.value = value;
      stat.updated = GetGameTime();
    } else {
      this.stats.set(name, {
        name: name,
        type: PLAYER_TYPE,
        value: value,
        updated: GetGameTime(),
        loaded: false
      });
    }
  }

  increment(name: string, amount: number = 1) : void {
    const stat = this.stats.get(name);
    if(stat) {
      stat.value += amount;
      stat.updated = GetGameTime();
    } else {
      this.stats.set(name, {
        name: name,
        type: PLAYER_TYPE,
        value: 0,
        updated: GetGameTime(),
        loaded: false
      });
    }
  }
}

/**
 * Custom player stats that will be
 */
export class PlayerStats extends Stats {

  player: Player;
  playerStats: Stat[] = [];

  constructor(player: Player) {
    super({
      id: player.GetGUID(),
      type: PLAYER_TYPE
    });
    this.player = player;
  }

}

interface StatEntity {
  type: string,
  id: number
}

interface Stat {
  type: string,
  name: string,
  value: number,
  updated: number,
  loaded: boolean
}