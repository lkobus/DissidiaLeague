import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Rx';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  FormsModule, NgModel, NG_VALIDATORS, Validator,
  Validators, AbstractControl, Form, ValidatorFn
} from '@angular/forms';
import { Usuario, Perfil } from '../_model/usuario';
import { Login } from '../login/model/login';
import { UsuariosService } from './shared/usuarios.service';
import { ToastService } from '../_services/toast.service';

@Component({
  moduleId: module.id,
  selector: 'usuario-detail',
  templateUrl: 'usuario-detail.component.html',
  styleUrls: ['usuario-detail.component.css']
})

export class UsuarioDetailComponent implements OnInit {

  usuario: Usuario;
  perfis: Perfil[];
  submitted = false;
  restError: any;
  desabilitaBotao = false;

  constructor(
    private toastService: ToastService,    
    private usuarioService: UsuariosService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.usuarioService.getPerfis().then(
      perfis => {
        this.perfis = perfis;
      }
    );
    this.route.paramMap
      .switchMap((params: ParamMap) => {
        var id = params.get('id');
        if (id) {
          return this.usuarioService.getUser(id);
        } else {
          return this.usuarioService.getCodigoDisponivel().toPromise().then(codigo => new Usuario('', codigo, '', '', null, new Login('', '')));
        }
      })
      .subscribe(usuario => this.usuario = usuario);
  }

  save(form: AbstractControl): void {
    this.submitted = true;
    if (!form.valid) {
      console.log('Form is invalid');
      this.desabilitaBotao = false;
      return;
    }
    this.restError = null;

    if (this.usuario.id) {
      this.usuarioService.updateUser(this.usuario)
        .then(() => {
          this.toastService.sucessNotification('', 'Usuário alterado com sucesso.');
          this.goBack();
        }).catch((erro) => {
          this.handleError(erro);
        });
    } else {
      this.usuarioService.addUser(this.usuario)
        .then(() => {
          this.toastService.sucessNotification('', 'Usuário salvo com sucesso.');
          this.goBack();
        }).catch((erro) => {
          this.desabilitaBotao = false;
          this.handleError(erro);
        });
    }
    this.desabilitaBotao = true;
  }

  goBack(): void {
    this.router.navigate(['usuarios']);
  }

  private handleError(error: any) {
    var message = 'Erro desconhecido ao salvar';
    if (error.Message || error.message) {
      message = error.Message != null ? error.Message : error.message;
    }

    this.toastService.errorNotification('Erro', message);
  }
}

