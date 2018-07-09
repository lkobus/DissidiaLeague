import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Usuario, Perfil } from '../../_model/usuario';
import { BaseService } from '../../_services/base.service';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Injectable()
export class UsuariosService extends BaseService {

  constructor(http: Http) {
    super(http);
  }

  getUsers(): Promise<Usuario[]> {
    var headers = new Headers();
    this.contentTypeApplicationJson(headers);
    return this.http.get(this.getUserUrl(''), { headers: headers })
      .toPromise()
      .then(response => response.json() as Usuario[])
      .catch(this.handleErrorPromise);
  }

  getUser(id: string): Observable<Usuario> {
    return this.doGet<Usuario>('empresa/usuarios/' + id);
  }
  
  getCodigoDisponivel(): Observable<number> {
    return this.doGet<number>('empresa/usuarios/codigo-disponivel');
  }

  getUsersVendedores(): Promise<Usuario[]> {
    var headers = new Headers();
    this.contentTypeApplicationJson(headers);
    return this.http.get(this.getUserUrl('vendedores'), { headers: headers })
      .toPromise()
      .then(response => response.json() as Usuario[])
      .catch(this.handleErrorPromise);
  }

  //---------------ADD USER---------------
  addUser(user: Usuario): Promise<Usuario> {
    var headers = new Headers();
    this.contentTypeApplicationFormUrlEncoded(headers);

    const body = new URLSearchParams();
    body.set('codigo', user.codigo.toString());
    body.set('nome', user.nome);
    body.set('cpf', user.cpf);
    body.set('perfil', user.perfil.toString());
    body.set('login', user.credentials.username);
    body.set('password', user.credentials.password);

    return this.http.post(this.getUserUrl(''), body.toString(), { headers: headers })
      .toPromise()
      .then(() => Usuario)
      .catch(this.handleErrorPromise);
  }

  //---------------UPDATE USER---------------`
  updateUser(user: Usuario): Promise<Usuario> {
    var headers = new Headers();
    this.contentTypeApplicationFormUrlEncoded(headers);

    const body = new URLSearchParams();
    body.set('codigo', user.codigo.toString());
    body.set('nome', user.nome);
    body.set('cpf', user.cpf);
    body.set('perfil', user.perfil.toString());
    body.set('login', user.credentials.username);
    if (user.senhaTemporaria) {
      body.set('password', user.senhaTemporaria);
    }
    return this.http.post(this.getUserUrl(user.id), body.toString(), { headers: headers })
      .toPromise()
      .then(() => Usuario)
      .catch(this.handleErrorPromise);
  }

  //---------------DELETE USER---------------`
  deleteUser(id: string): Promise<void> {
    var headers = new Headers();
    this.contentTypeApplicationJson(headers);

    return this.http.delete(this.getUserUrl(id), { headers: headers })
      .toPromise()
      .then(() => null)
      .catch(this.handleErrorPromise);
  }

  //---------------GET PERFIS---------------
  getPerfis(): Promise<Perfil[]> {
    var headers = new Headers();
    this.contentTypeApplicationJson(headers);
    return this.http.get(this.BasePath() + 'empresa/perfil', { headers: headers })
      .toPromise()
      .then(response => response.json() as Perfil[])
      .catch(this.handleErrorPromise);
  }

  private getUserUrl(id: string) {
    return this.BasePath() + 'empresa/usuarios/' + id;
  }

}
