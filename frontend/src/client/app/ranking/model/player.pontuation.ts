export class PlayerPontuation {
    name:string;
    wins:number;
    losts:number;
    percentualWins;number;
    percentualLosts:number;
    totalMatches:number;
    type:number;

    constructor(name:string, type:number){
        this.name = name;
        this.wins = 0;
        this.losts = 0;
        this.percentualLosts = 0;
        this.percentualWins = 0;
        this.totalMatches = 0;
        this.type = type;
    }

}