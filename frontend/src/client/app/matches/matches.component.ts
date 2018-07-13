import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Usuario } from '../_model/usuario';
import { PaginationInstance } from '../../../../node_modules/ngx-pagination/dist/ngx-pagination';
import { BaseTableComponent } from '../shared/table/base-table-component';
import { ModalConfirmacaoComponent } from '../_directives/modal-confirmacao/modal-confirmacao.component';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { Match } from './model/match';
import { MatchesService } from './shared/matches.service';

@Component({
  moduleId: module.id,
  selector: 'matches',
  templateUrl: 'matches.component.html',
  styleUrls: ['matches.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})

export class MatchesComponent extends BaseTableComponent implements OnInit {

  @ViewChild('modalConfirmar')
  modalConfirmacao: ModalConfirmacaoComponent;

  listUsuarios: Match[];
  selectedUser: Match;
  inputSearch: any;

  constructor(
    private page: ElementRef,
    private matchService: MatchesService,
    private router: Router
  ) {
    super();
  }

  getUsuarios(): void {    
    this.matchService
    .getMatches()
    .then(usuarios => this.listUsuarios = usuarios);
  }

  ngOnInit(): void {
    this.getUsuarios();
  }

  abrirConfirmacaoExclusao(user: Usuario) {
    this.modalConfirmacao.openModal('Deseja realmente excluir o usuário "' + user.nome + '"?', user);
  }

  onSelect(user: Match): void {
    this.selectedUser = user;
  }

  gotoDetail(): void {
    this.router.navigate(['/updateUsuario', this.selectedUser.date]);
  }
  
}
