import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Rx';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  FormsModule, NgModel, NG_VALIDATORS, Validator,
  Validators, AbstractControl, Form, ValidatorFn
} from '@angular/forms';
import { ToastService } from '../../_services/toast.service';
import { MatchesService } from '../shared/matches.service';
import { Match } from '../model/match';
import { CharEnum } from '../model/charEnum';
import { SalvarMatchDto, SalvarPlayerInfoDto } from '../model/salvarMatchDto';

@Component({
  moduleId: module.id,
  selector: 'matches-detail',
  templateUrl: 'matches-detail.component.html',
  styleUrls: ['matches-detail.component.css']
})

export class MatchesDetailComponent implements OnInit {
  
  match:Match;
  imageUrl:string;
  whoWins:string = "A";
  playerTeamA1: string;
  playerTeamA2: string;
  playerTeamA3: string;

  playerTeamB1: string;
  playerTeamB2: string;
  playerTeamB3: string;

  scorePlayerTeamA1: number;
  scorePlayerTeamA2: number;
  scorePlayerTeamA3: number;

  scorePlayerTeamB1: number;
  scorePlayerTeamB2: number;
  scorePlayerTeamB3: number;

  charPlayerTeamA1: number = 0;
  charPlayerTeamA2: number = 0;
  charPlayerTeamA3: number = 0;

  charPlayerTeamB1: number = 0;
  charPlayerTeamB2: number = 0;
  charPlayerTeamB3: number = 0;
  
  matchId: string;
  charEnums:CharEnum[];

  constructor(
    private toastService: ToastService,        
    private route: ActivatedRoute,
    private matchService: MatchesService,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.matchService.getChars()
    .then(p => this.charEnums = p);
    
    this.route.paramMap
    .switchMap((params: ParamMap) => {
      var id = params.get('id');      
      this.matchId = id;
      this.imageUrl = this.matchService.getMatchImageUrl(id);    
      return this.matchService.getMatch(id);
      
    })
    .subscribe(usuario => {
      this.match = usuario;
      this.playerTeamA1 = this.match.playersTeamWinner[0].name;
      this.playerTeamA2 = this.match.playersTeamWinner[1].name;
      this.playerTeamA3 = this.match.playersTeamWinner[2].name;

      this.playerTeamB1 = this.match.playersTeamLooser[0].name;
      this.playerTeamB2 = this.match.playersTeamLooser[1].name;
      this.playerTeamB3 = this.match.playersTeamLooser[2].name;

      this.scorePlayerTeamA1 = this.match.playersTeamWinner[0].points;
      this.scorePlayerTeamA2 = this.match.playersTeamWinner[1].points;
      this.scorePlayerTeamA3 = this.match.playersTeamWinner[2].points;

      this.scorePlayerTeamB1 = this.match.playersTeamLooser[0].points;
      this.scorePlayerTeamB2 = this.match.playersTeamLooser[1].points;
      this.scorePlayerTeamB3 = this.match.playersTeamLooser[2].points;

      this.charPlayerTeamA1 = this.match.playersTeamWinner[0].character;
      this.charPlayerTeamA2 = this.match.playersTeamWinner[1].character;
      this.charPlayerTeamA3 = this.match.playersTeamWinner[2].character;

      this.charPlayerTeamB1 = this.match.playersTeamLooser[0].character;
      this.charPlayerTeamB2 = this.match.playersTeamLooser[1].character;
      this.charPlayerTeamB3 = this.match.playersTeamLooser[2].character;
    });    
  }  

  salvar(){
    var dto = new SalvarMatchDto();
    var winners:SalvarPlayerInfoDto[] = [];
    var loosers:SalvarPlayerInfoDto[] = [];

    if(this.whoWins == "A"){
      winners.push(new SalvarPlayerInfoDto(this.playerTeamA1, this.charPlayerTeamA1, this.scorePlayerTeamA1));
      winners.push(new SalvarPlayerInfoDto(this.playerTeamA2, this.charPlayerTeamA2, this.scorePlayerTeamA3));
      winners.push(new SalvarPlayerInfoDto(this.playerTeamA3, this.charPlayerTeamA3, this.scorePlayerTeamA3));
  
      loosers.push(new SalvarPlayerInfoDto(this.playerTeamB1, this.charPlayerTeamB1, this.scorePlayerTeamB1));
      loosers.push(new SalvarPlayerInfoDto(this.playerTeamB2, this.charPlayerTeamB2, this.scorePlayerTeamB2));
      loosers.push(new SalvarPlayerInfoDto(this.playerTeamB3, this.charPlayerTeamB3, this.scorePlayerTeamB3));
    } else {
      loosers.push(new SalvarPlayerInfoDto(this.playerTeamA1, this.charPlayerTeamA1, this.scorePlayerTeamA1));
      loosers.push(new SalvarPlayerInfoDto(this.playerTeamA2, this.charPlayerTeamA2, this.scorePlayerTeamA3));
      loosers.push(new SalvarPlayerInfoDto(this.playerTeamA3, this.charPlayerTeamA3, this.scorePlayerTeamA3));
  
      winners.push(new SalvarPlayerInfoDto(this.playerTeamB1, this.charPlayerTeamB1, this.scorePlayerTeamB1));
      winners.push(new SalvarPlayerInfoDto(this.playerTeamB2, this.charPlayerTeamB2, this.scorePlayerTeamB2));
      winners.push(new SalvarPlayerInfoDto(this.playerTeamB3, this.charPlayerTeamB3, this.scorePlayerTeamB3));
    }
    dto.playersTeamLooser = loosers;
    dto.playersTeamWinner = winners;
    this.matchService.updateMatch(dto, this.matchId, window.localStorage.getItem("id"));

  }
  private handleError(error: any) {
    var message = 'Erro desconhecido ao salvar';
    if (error.Message || error.message) {
      message = error.Message != null ? error.Message : error.message;
    }

    this.toastService.errorNotification('Erro', message);
  }

  goBack(){    
    this.router.navigateByUrl('matches' + "?CACHE=true");
  }
}

