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
import { ProfileService } from './shared/profile.service';
import { RankingService } from '../ranking/shared/ranking.service';
import { PlayerPontuation } from '../ranking/model/player.pontuation';

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

  @ViewChild("modalProfileLogo")
  modalProfileLogo: Modal;

  fileHolder: any;
  inputSearch: any;
  currentTeam:TeamDTO;
  teamLogoImage:string;
  name:string;
  alias:string;
  player1:string;
  player2:string;
  player3:string;
  player4:string;
  userLogoImage: string;
  playerPontuation: PlayerPontuation;
  teamPontuations: PlayerPontuation[];


  constructor(
    private page: ElementRef,    
    private router: Router,
    private profileService: ProfileService,
    private rankingService: RankingService
  ) {
    super();
  }

  getUsuarios(): void {    
    
  }

  ngOnInit(): void {
    
    this.profileService.getTeam()
    .then(p => { 
        this.teamLogoImage = this.profileService.getTeamImageUrl(p.id);
        this.currentTeam = p;
        this.rankingService.getTeamPontuation(p.id)
        .then(p => this.teamPontuations = p);      
        ;
    });    
    this.rankingService.getLoggedPlayerPontuation()
    .then(p => this.playerPontuation = p);

    this.userLogoImage = this.profileService.getProfileUrl(window.localStorage.getItem("id"));
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
    debugger;
    return this.teamPontuations[0].name == player.name;
  }
  
}
