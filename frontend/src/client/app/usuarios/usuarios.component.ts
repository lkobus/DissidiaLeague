import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UsuariosService } from './shared/usuarios.service';
import { Usuario } from '../_model/usuario';
import { PaginationInstance } from '../../../../node_modules/ngx-pagination/dist/ngx-pagination';
import { BaseTableComponent } from '../shared/table/base-table-component';
import { ModalConfirmacaoComponent } from '../_directives/modal-confirmacao/modal-confirmacao.component';

@Component({
  moduleId: module.id,
  selector: 'usuarios',
  templateUrl: 'usuarios.component.html',
  styleUrls: ['usuarios.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})

export class UsuariosComponent extends BaseTableComponent implements OnInit {

  @ViewChild('modalConfirmar')
  modalConfirmacao: ModalConfirmacaoComponent;

  listUsuarios: Usuario[];
  selectedUser: Usuario;
  inputSearch: any;

  constructor(
    private page: ElementRef,
    private usuarioService: UsuariosService,
    private router: Router
  ) {
    super();
  }

  getUsuarios(): void {
    this.usuarioService
      .getUsers()
      .then(usuarios => this.listUsuarios = usuarios);
  }

  ngOnInit(): void {
    this.getUsuarios();
  }

  abrirConfirmacaoExclusao(user: Usuario) {
    this.modalConfirmacao.openModal('Deseja realmente excluir o usuário "' + user.nome + '"?', user);
  }

  excluirUsuario(user: Usuario): void {
    this.usuarioService.deleteUser(user.id)
      .then(() => {
        this.listUsuarios.forEach((u: Usuario, i: number) => {
          if (u.id === user.id) {
            this.listUsuarios.splice(i, 1);
          }
        });
      });
  }

  onSelect(user: Usuario): void {
    this.selectedUser = user;
  }

  gotoDetail(): void {
    this.router.navigate(['/updateUsuario', this.selectedUser.id]);
  }

  selectAutoComplete(event: Event) {
    this.onSelect(new Usuario(this.inputSearch.id,
      this.inputSearch.codigo,
      this.inputSearch.nome,
      this.inputSearch.cpf,
      this.inputSearch.perfil,
      null));
    var page = this.page.nativeElement.querySelector('#page');
    this.gotoDetail();
  }
}
