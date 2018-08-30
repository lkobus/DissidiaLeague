import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RankingService } from './shared/ranking.service';
import { Usuario } from '../_model/usuario';
import { PaginationInstance } from '../../../../node_modules/ngx-pagination/dist/ngx-pagination';
import { BaseTableComponent } from '../shared/table/base-table-component';
import { ModalConfirmacaoComponent } from '../_directives/modal-confirmacao/modal-confirmacao.component';
import { PlayerPontuation } from './model/player.pontuation';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';

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

  listUsuarios: PlayerPontuation[];
  selectedUser: PlayerPontuation;
  inputSearch: any;

  constructor(
    private page: ElementRef,
    private usuarioService: RankingService,
    private router: Router
  ) {
    super();
  }

  getUsuarios(): void {    
    this.usuarioService
    .getTeamSoloPontuation()
    .then(usuarios => this.listUsuarios = usuarios);
  }

  ngOnInit(): void {
    this.getUsuarios();
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
