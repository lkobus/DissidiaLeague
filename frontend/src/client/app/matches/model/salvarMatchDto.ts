export class SalvarMatchDto {
    playersTeamWinner:SalvarPlayerInfoDto[];
    playersTeamLooser:SalvarPlayerInfoDto[];
    
}

export class SalvarPlayerInfoDto {
    name:string;
    character:number;
    points:number;

    constructor(n:string, c:number, p:number){
        this.name = n;
        this.character = c;
        this.points = p;
    }
}