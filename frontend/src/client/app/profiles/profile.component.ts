import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Usuario } from '../_model/usuario';
import { PaginationInstance } from '../../../../node_modules/ngx-pagination/dist/ngx-pagination';
import { BaseTableComponent } from '../shared/table/base-table-component';
import { ModalConfirmacaoComponent } from '../_directives/modal-confirmacao/modal-confirmacao.component';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { Modal } from 'ngx-modal';
import { TeamDTO } from './model/team.dto';
import * as moment from 'moment';
import { ProfileService } from './shared/profile.service';
import { RankingService } from '../ranking/shared/ranking.service';
import { PlayerPontuation } from '../ranking/model/player.pontuation';
import { List } from 'linqts';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { CharEnum } from '../matches/model/charEnum';
import { MatchesService } from '../matches/shared/matches.service';
import { LineGraph } from './model/lineGraph.dto';

@Component({
  moduleId: module.id,
  selector: 'profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})

export class ProfileComponent extends BaseTableComponent implements OnInit {

  @ViewChild('modalTeam')
  modalTeam: Modal;  

  @ViewChild("modalUploadLogo")
  modalUploadLogo: Modal;

  @ViewChild("inviteModal")
  inviteModal: Modal;

  @ViewChild("modalProfileLogo")
  modalProfileLogo: Modal;

  filtroPlayer: number;
  selectedUser: PlayerPontuation;
  fileHolder: any;
  inputSearch: any;
  currentTeam:TeamDTO;
  teamLogoImage:string;
  name:string;
  alias:string;
  player1:string;
  player2:string;
  emailToInvite:string;
  player3:string;
  player4:string;
  userLogoImage: string;
  playerPontuation: PlayerPontuation[];
  selectedPlayerPontuation: List<PlayerPontuation>;
  selectedTeamPontuation: List<PlayerPontuation>;
  teamHeaderPontuation: PlayerPontuation;
  teamPontuations: PlayerPontuation[];
  headerPontuation: PlayerPontuation;
  firstTime: boolean = true;
  activeMembers:string[] = [];

  constructor(
    private page: ElementRef,    
    private router: Router,
    private profileService: ProfileService,
    private rankingService: RankingService,
    private matchService: MatchesService
  ) {
    super();
    this.filtroPlayer = 3;
    this.lastRun = 3;
  }

  public selectedDateDe = moment().format('DD/MM/YYYY');
  public selectedDateAte = moment().format('DD/MM/YYYY');  

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
    dayLabels: {
      su: 'Dom', mo: 'Seg', tu: 'Ter', we: 'Qua', th: 'Qui',
      fr: 'Sex', sa: 'Sab'
    },
    monthLabels: {
      1: 'Jan', 2: 'Fev', 3: 'Mar', 4: 'Abr', 5: 'Mar', 6: 'Jun', 7: 'Jul',
      8: 'Ago', 9: 'Set', 10: 'Out', 11: 'Nov', 12: 'Dez'
    },
    yearSelector: true,
    monthSelector: true,
    showClearDateBtn: false,
    markCurrentDay: true,
    showTodayBtn: false,
    markCurrentMonth: true,
    markCurrentYear: true,
    alignSelectorRight: true,
    disableHeaderButtons: false,
    showDecreaseDateBtn: true,
    showIncreaseDateBtn: true
  };

  getUsuarios(): void {    
    
  }
  busy: any;
  templateLoading: string =
  '<div class="loading-overlay">' +
    '<img src="assets/loader.gif" alt="logo Promax" height="194" class="img-loader" />'+
    '<div class="spinner">'+
      '<div class="bounce1"></div>'+
      '<div class="bounce2"></div>'+
      '<div class="bounce3"></div>'+
    '</div>'+
    '<h1 class="loading-venda">' +
    '{{message}}' +
    '</h1>' +
  '</div>';


  type:number = -1;
  period:number = 1;

  // lineChart
  public lineChartData:Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Wins'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Loss'},    
  ];  
  
  public lineChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  // Radar
  public radarChartLabels:string[] = ['Vanguard', 'Assassin', "Marksmen", "Specialist"];
  
   public radarChartData:any = [
     {data: [65, 59, 90, 81], label: 'Wins'},
     {data: [28, 48, 40, 19], label: 'Loss'}
   ];


   drawLineGraph(p:LineGraph){
    this.lineChartLabels = p.labels;            
    this.lineChartData = [
      {data: p.losts, label: "Losts"},
      {data: p.wins, label: "Wins"}
    ];      
    var max = new List(p.wins).Max();
    var maxLost = new List(p.losts).Max();

    if(max > maxLost){
      this.lineChartOptions = this.getLineChartOption(0, max);
    } else {
      this.lineChartOptions = this.getLineChartOption(0, maxLost);
    }
   }
  ngOnInit(): void {        
    this.rankingService.getLineGraph(this.period, this.type)
    .then(p =>{
      this.drawLineGraph(p);
    });

    this.matchService.getChars()
    .then(p => this.charEnums = p);

    this.profileService.getTeam()
    .then(p => { 
        debugger;
                
        p.members.forEach(m => {
          this.profileService.getNickName(m)
          .then(p => {
            debugger;
            this.activeMembers.push(p);
          });
        });
        this.teamLogoImage = this.profileService.getTeamImageUrl(p.id);
        this.currentTeam = p;
        this.rankingService.getTeamPontuation(p.id)
        .then(p =>{          
          this.selectedTeamPontuation = new List<PlayerPontuation>(p);          
          this.teamHeaderPontuation = this.selectedTeamPontuation.FirstOrDefault(p => p.type == 5);          
          this.teamPontuations = this.selectedTeamPontuation.Where(p => p.type != 5).ToArray();
        });      

    });      

    this.busy = this.rankingService.getLoggedPlayerPontuation()
    .then(p => {
      debugger;
      var tmp = new List<PlayerPontuation>(p);
      this.headerPontuation = tmp.FirstOrDefault(p => p.name == window.localStorage.getItem("login"));
      this.selectedPlayerPontuation = tmp;
      this.playerPontuation = tmp.RemoveAll(p => p.name == window.localStorage.getItem("login")).ToArray();
      
      var vanguard = tmp.FirstOrDefault(p => p.name == "VANGUARD");
      var ass = tmp.FirstOrDefault(p => p.name == "ASSASSIN");
      var marks = tmp.FirstOrDefault(p => p.name == "MARKSMEN");
      var specialist = tmp.FirstOrDefault(p => p.name == "SPECIALIST");

      if(vanguard == null){
        vanguard = new PlayerPontuation("VANGUARD", -2);        
      }
      if(ass == null){
        ass = new PlayerPontuation("ASSASSIN", -3);        
      }
      if(marks == null){
        marks = new PlayerPontuation("MARKS", -4);        
      }
      if(specialist == null){
        specialist = new PlayerPontuation("SPECIALIST", -5);        
      }
      
       var wins = [ vanguard.percentualWins, 
            ass.percentualWins, 
            marks.percentualWins, 
            specialist.percentualWins]; 
      var losts = [ vanguard.percentualLosts, 
        ass.percentualLosts, 
        marks.percentualLosts, 
        specialist.percentualLosts];
        this.radarChartData = [
          {data: wins, label: 'Wins'},
          {data: losts, label: 'Loss'}
        ];

    });
    this.userLogoImage = this.profileService.getProfileUrl(window.localStorage.getItem("id"));
  }

  onSelect(user: PlayerPontuation): void {
    this.selectedUser = user;
  }

  imageUploaded(event: any): void {
    this.fileHolder = event;
  }

  abrirConfirmacaoExclusao(user: Usuario) {    
  }

  
  gotoDetail(): void {
    
  }

  saveTeam() {
    debugger;
    var teamDto = new TeamDTO();
    teamDto.members = [];
    teamDto.alias = this.alias;
    teamDto.id = this.name;    
    if(this.player1) { teamDto.members.push(this.player1); }
    if(this.player2) { teamDto.members.push(this.player2); }
    if(this.player3) { teamDto.members.push(this.player3); }
    if(this.player4) { teamDto.members.push(this.player4); }
    this.profileService.createTeam(teamDto)
    .then(p => this.profileService.uploadTeamLogo(this.fileHolder, this.name));
    
  }

  uploadTeamLogo() {
    this.profileService.uploadTeamLogo(this.fileHolder, this.currentTeam.id)
    .then(p => {      
      this.modalUploadLogo.close();      
      this.profileService.getTeamImageUrl(this.currentTeam.id);      
      if(this.teamLogoImage.search("\\?") == -1){
        this.teamLogoImage += "?a" + this.userLogoImage.length + "=o"
      }  else {
        this.teamLogoImage += "&a" + this.userLogoImage.length + "=o"
      }      
    });
  }

  uploadProfileLogo() {
    this.profileService.uploadProfileLogo(this.fileHolder, window.localStorage.getItem("id"))
    .then(p => {      
      this.modalUploadLogo.close();            
      alert("Imagem upada com sucesso");
      this.modalProfileLogo.close();
      var newVariable = "";       
      var oi =this.userLogoImage;
      debugger;
      if(this.userLogoImage.search("\\?") == -1){
        this.userLogoImage += "?a" + this.userLogoImage.length + "=o"
      }  else {
        this.userLogoImage += "&a" + this.userLogoImage.length + "=o"
      }      
    });
  }

  getImageUrl(player:PlayerPontuation){
    return this.rankingService.getUrlImagePlayer(player.name);
  }

  isTeam(player:PlayerPontuation) : boolean{    
    return this.teamPontuations[0].name == player.name;
  }
  
  
   public radarChartType:string = 'radar';
  
   // events
   public chartClicked(e:any):void {
     console.log(e);
   }
  
   public chartHovered(e:any):void {
     console.log(e);
   }

   onChangeCharFilter(value) {    
     debugger;
    this.type = value;
    this.rankingService.getLineGraph(this.period, this.type)
    .then(p =>{
      this.lineChartData = [
        {data: p.losts, label: "Losts"},
        {data: p.wins, label: "Wins"}
      ];
       this.lineChartLabels = p.labels;       
    });
   }

   onChangeFilter(value) {
     debugger;
    this.period = value;
    this.rankingService.getLineGraph(this.period, this.type)
    .then(p =>{
      this.drawLineGraph(p);
    });
  }
  charEnums:CharEnum[];

    
  public lineChartOptions:any = {
    responsive: true,
    scales: {
      yAxes: [{id: 'y-axis-1', type: 'linear', position: 'left', ticks: {min: 0, max:100}}]
    }
  };

  getLineChartOption(min:number,max:number){
    return {
      responsive: true,
      scales: {
        yAxes: [{id: 'y-axis-1', type: 'linear', position: 'left', ticks: {min: min, max:max}}]
      }
    }
  }
  
  
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';
 
  public randomize():void {
    let _lineChartData:Array<any> = new Array(this.lineChartData.length);
    for (let i = 0; i < this.lineChartData.length; i++) {
      _lineChartData[i] = {data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label};
      for (let j = 0; j < this.lineChartData[i].data.length; j++) {
        _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
      }
    }
    this.lineChartData = _lineChartData;
  } 

  selectedChar :number = -1;
  onDateInicialChanged(event: IMyDateModel) {
    var fromDate = moment(event.formatted, "DD/MM/YYYY");
    var untilDate = moment(this.selectedDateAte, "DD/MM/YYYY");
    this.selectedDateDe = event.formatted;      
    if(fromDate > untilDate){
      alert("Until date is lower than from.");     
    } else {
      this.filtroPlayer = 3;
      this.checked(3);      
      this.busy = this.rankingService.getLoggedPlayerPontuationBetween(fromDate.format("DD-MM-YYYY"), untilDate.format("DD-MM-YYYY"))
      .then(p => {
        debugger;
        var tmp = new List<PlayerPontuation>(p);
        //this.headerPontuation = tmp.FirstOrDefault(p => p.name == window.localStorage.getItem("login"));        
        this.selectedPlayerPontuation = tmp;
        this.playerPontuation = tmp.RemoveAll(p => p.name == window.localStorage.getItem("login")).ToArray();        

        var vanguard = tmp.FirstOrDefault(p => p.name == "Vanguard");
        var ass = tmp.FirstOrDefault(p => p.name == "Assassin");
        var marks = tmp.FirstOrDefault(p => p.name == "Marksmen");
        var specialist = tmp.FirstOrDefault(p => p.name == "Specialist");
  
        if(vanguard == null){
          vanguard = new PlayerPontuation("Vanguard", -2);        
        }
        if(ass == null){
          ass = new PlayerPontuation("Assassin", -3);        
        }
        if(marks == null){
          marks = new PlayerPontuation("Marksmen", -4);        
        }
        if(specialist == null){
          specialist = new PlayerPontuation("Specialist", -5);        
        }
        
         var wins = [ vanguard.percentualWins, 
              ass.percentualWins, 
              marks.percentualWins, 
              specialist.percentualWins]; 
        var losts = [ vanguard.percentualLosts, 
          ass.percentualLosts, 
          marks.percentualLosts, 
          specialist.percentualLosts];
          this.radarChartData = [
            {data: wins, label: 'Wins'},
            {data: losts, label: 'Loss'}
          ];
  
      });
    }
    
  }

  lastRun:number;
  checked(n:number){
    if(n == this.filtroPlayer){
      if(this.lastRun != n){        
        this.lastRun = n;
        if(n == 1) {
          this.playerPontuation = this.selectedPlayerPontuation
          .Where(p => p.type == 1).ToArray();
        } else if(n == 2){
          this.playerPontuation = this.selectedPlayerPontuation
          .Where(p => p.type == 2).ToArray();
        } else {
          this.playerPontuation = this.selectedPlayerPontuation.ToArray();          
        }        
      }
    }    
    return n == this.filtroPlayer;
  }

  onDateFinalChanged(event: IMyDateModel) {        
    var untilDate = moment(event.formatted, "DD/MM/YYYY");
    var fromDate = moment(this.selectedDateDe, "DD/MM/YYYY");
    this.selectedDateAte = event.formatted;      
    if(fromDate > untilDate){
      alert("Until date is lower than from.");         
    } else {      
      this.filtroPlayer = 3;
      this.checked(3);            
      this.busy = this.rankingService.getLoggedPlayerPontuationBetween(fromDate.format("DD-MM-YYYY"), untilDate.format("DD-MM-YYYY"))
      .then(p => {
        debugger;
        var tmp = new List<PlayerPontuation>(p);
        //this.headerPontuation = tmp.FirstOrDefault(p => p.name == window.localStorage.getItem("login"));        
        this.selectedPlayerPontuation = tmp;
        this.playerPontuation = tmp.RemoveAll(p => p.name == window.localStorage.getItem("login")).ToArray();        
      });
    }
  }

  invitePlayer(){
    this.profileService.inviteTeam(this.teamHeaderPontuation.name, this.emailToInvite)
    .then(p => this.inviteModal.close());
  }

}
