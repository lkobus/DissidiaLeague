import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RankingService } from './shared/ranking.service';
import { Usuario } from '../_model/usuario';
import { BaseTableComponent } from '../shared/table/base-table-component';
import { ModalConfirmacaoComponent } from '../_directives/modal-confirmacao/modal-confirmacao.component';
import { PlayerPontuation } from './model/player.pontuation';

@Component({
  moduleId: module.id,
  selector: 'rankings',
  templateUrl: 'ranking.component.html',
  styleUrls: ['ranking.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})

export class RankingComponent extends BaseTableComponent implements OnInit {

  @ViewChild('modalConfirmar')
  modalConfirmacao: ModalConfirmacaoComponent;

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
  view:number = 1;

  listUsuarios: PlayerPontuation[];
  selectedUser: PlayerPontuation;
  inputSearch: any = -1;
  duo = 1;
  constructor(
    private page: ElementRef,
    private usuarioService: RankingService,
    private router: Router
  ) {
    super();
  }

  getUsuarios(): void {        
    this.busy = this.usuarioService
    .getTeamSoloPontuation(-1, this.duo == 1 ? false : true, this.view)
    .then(usuarios => this.listUsuarios = usuarios);
  }

  ngOnInit(): void {
    this.getUsuarios();
  }

  getMinMatches(){
    this.busy = this.usuarioService.getTeamSoloPontuation(this.inputSearch,  this.duo == 1 ? false : true, this.view)
    .then(u => this.listUsuarios = u);
  }   

  abrirConfirmacaoExclusao(user: Usuario) {
    this.modalConfirmacao.openModal('Deseja realmente excluir o usuário "' + user.nome + '"?', user);
  }

  onSelect(user: PlayerPontuation): void {
    this.selectedUser = user;
  }

  gotoDetail(): void {
    this.router.navigate(['/updateUsuario', this.selectedUser.name]);
  }
  
}
