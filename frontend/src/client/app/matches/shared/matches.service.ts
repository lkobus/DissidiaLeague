import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Usuario, Perfil } from '../../_model/usuario';
import { BaseService } from '../../_services/base.service';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Match } from '../model/match';

@Injectable()
export class MatchesService extends BaseService {

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

  getMatches(): Promise<Match[]>{
    var headers = new Headers();
    this.contentTypeApplicationJson(headers);
    var url = this.BasePath() + "dissidia/matches/all";
    return this.http.get(url, { headers: headers })
      .toPromise()
      .then(response => response.json() as Match[])
      .catch(this.handleErrorPromise);
  }

  private getUserUrl(id: string) {
    return this.BasePath() + 'empresa/usuarios/' + id;
  }

}
