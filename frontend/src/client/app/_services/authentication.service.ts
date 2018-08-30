import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { EnvConfiguration } from '../shared/config/env.config';
import { LoginResponse } from '../_model/login-response';
import { GenericResponse } from '../_model/generic-response';
import { BaseService } from '../_services/base.service';
import { Modulo, Empresa } from '../_model/index';
import { Login } from '../login/model/login';


@Injectable()
export class AuthenticationService extends BaseService {

  private _loggedUser: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private _showModulos: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  public loggedUserEmitter: Observable<any> = this._loggedUser.asObservable();
  public showModulosEmitter: Observable<boolean> = this._showModulos.asObservable();

  constructor(http: Http) {
    super(http);
  }

  showUserLogged() {
    this._loggedUser.next(this.getUserLogged());
  }

  showModulos(modulos: boolean) {
    this._showModulos.next(modulos);
  }

  getUserLogged() {
    if (window.localStorage.getItem('login') != null) {
      return window.localStorage.getItem('login');
    } else {
      return 'anonimo';
    }
  }

  getUserId() {
    return window.localStorage.currentUser;
  }

  getEmpresa(): Empresa {
    try {
      return JSON.parse(window.localStorage.getItem('franquia')) as Empresa;
    } catch (err) {
      return null;
    }
  }

  validate(password: string): Observable<LoginResponse> {
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Accept', 'application/json');

    const body = new URLSearchParams();
    body.set('Username', this.getUserLogged());
    body.set('Password', password);

    return this.http.post(localStorage.getItem("CONFIG_API") + 'empresa/usuarios/login/validate', body.toString(), { headers: headers })
      .map(response => {
        if (response.status == 202) {
          var loginResponse = response.json() as LoginResponse;
          return loginResponse;
        } else {
          return Observable.throw(new GenericResponse(0, response.statusText));
        }
      })
      .catch(this.handleError);
  }

  getCurrentVersion(): Observable<Response> { 
    return this.http.get(EnvConfiguration.API + 'update/CurrentVersion');                
  }

  getStartProgress(): Observable<Response> {
    var headers = new Headers();
    headers.append('Accept', 'application/json');
    return this.http.get(localStorage.getItem("CONFIG_API") + "status/pull/percent", { headers: headers });
  }

  login(username: string, password: string): Observable<string> {

    var user = new Login(username, password);
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Accept', 'application/json');    

    return this.http.post(localStorage.getItem("CONFIG_API") + 'dissidia/login', JSON.stringify(user), { headers: headers })
      .map(response => {        
        if (response.status == 202) {                              
          window.localStorage.setItem("id", response.json());
          window.localStorage.setItem("login", username);          
          this.showUserLogged();        
          window.localStorage.setItem('userModulos', "true");            
          this.showModulos(true);
          this._loggedUser.next(this.getUserLogged());
          return username;
        } else if(response.status == 401){
          return Observable.throw(new GenericResponse(0, "Usuário ou senha inválidos"));
        }        
        else {
          return Observable.throw(new GenericResponse(0, response.statusText));
        }
      })
      .catch(this.handleError);
  }

  logout() {
    if (localStorage.getItem('currentUser')) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('login');
      localStorage.removeItem('userModulos');      
    }
  }
}
