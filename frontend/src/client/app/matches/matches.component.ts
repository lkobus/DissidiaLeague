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
import { List } from 'linqts';

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

  activePage:number = 1;
  listUsuarios: Match[];
  cacheUsuarios: List<Match>;
  selectedUser: Match;
  inputSearch: any;
  activeUser:string;
  filtroMatch:number = 1;

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
    .then(usuarios => {
      this.cacheUsuarios = new List(usuarios);
      this.listUsuarios = usuarios;
    });
  }

  ngOnInit(): void {
    debugger;
    if(window.location.href.includes("CACHE=true")){
      this.loadFromCache();
    } else {
      this.getUsuarios();
    }    
  }

  loadFromCache(){
    this.activeUser = window.localStorage.getItem("CACHE_MATCH_ITEM_SELECIONADO");    
    this.listUsuarios = JSON.parse(window.localStorage.getItem("CACHE_MATCH_COLLECTION"));
    this.activePage = Number(window.localStorage.getItem("CACHE_MATCH_PAGINA_ATIVA"));
    this.filtroMatch = Number(window.localStorage.getItem("CACHE_MATCH_FILTRO_ATIVO"));
  }

  abrirConfirmacaoExclusao(user: Usuario) {
    this.modalConfirmacao.openModal('Deseja realmente excluir o usuário "' + user.nome + '"?', user);
  }

  onSelect(user: Match): void {
    this.selectedUser = user;
  }

  gotoDetail(id:string): void {
    debugger;
    this.saveCache(id);
    this.router.navigateByUrl("/matchDetail/" + id);
  }


  lastRun:number;
  checked(n:number){
    if(this.cacheUsuarios){
      if(n == this.filtroMatch){
        if(this.lastRun != n){        
          this.lastRun = n;
          if(n == 1) {
            this.listUsuarios = this.cacheUsuarios.ToArray();          
          } else {
            this.listUsuarios = 
              this.cacheUsuarios.Where(p => p.status == 1)
              .ToArray();          
          }        
        }
      }    
    }
    
    return n == this.filtroMatch;
  }

  saveCache(id:string){
    window.localStorage.setItem("CACHE_MATCH_PAGINA_ATIVA", this.activePage.toString());
    window.localStorage.setItem("CACHE_MATCH_ITEM_SELECIONADO", id);
    window.localStorage.setItem("CACHE_MATCH_COLLECTION", JSON.stringify(this.listUsuarios));
    window.localStorage.setItem("CACHE_MATCH_FILTRO_ATIVO", this.filtroMatch.toString());
  }
  
}
