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
import { CharEnum } from '../model/charEnum';
import { SalvarMatchDto } from '../model/salvarMatchDto';

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

  getChars(): Promise<CharEnum[]>{
    var headers = new Headers();
    this.contentTypeApplicationJson(headers);
    var url = this.BasePath() + "dissidia/characters";
    return this.http.get(url, { headers: headers })
      .toPromise()
      .then(response => response.json() as CharEnum[])
      .catch(this.handleErrorPromise);
  }

  getMatch(id:string): Promise<Match>{
    var headers = new Headers();
    this.contentTypeApplicationJson(headers);
    var url = this.BasePath() + "dissidia/matches/" + id;
    return this.http.get(url, { headers: headers })
      .toPromise()
      .then(response => response.json() as Match[])
      .catch(this.handleErrorPromise);
  }

  updateMatch(match:SalvarMatchDto, matchId:string, userId:string): Promise<void>{
    var headers = new Headers();
    this.contentTypeApplicationJson(headers);
    var url = this.BasePath() + "dissidia/matches/" + matchId +"/" +userId;    
    return this.http.put(url, JSON.stringify(match), { headers: headers })
    .toPromise()
    .then(() => alert("usuario atualizado com sucesso"))
    .catch(this.handleErrorPromise);
  }

  getMatchImageUrl(id:string) {
    return this.BasePath() + "dissidia/matches/imagem/" + id;
  }

  private getUserUrl(id: string) {
    return this.BasePath() + 'empresa/usuarios/' + id;
  }

}
