import { PlayerInfo } from "./player.info";

export class Match {
    id:string;
    date:Date;
    playersTeamWinner:PlayerInfo[];
    playersTeamLooser:PlayerInfo[];
    status:number;    
    winners:string;
    loosers:string;
    
}