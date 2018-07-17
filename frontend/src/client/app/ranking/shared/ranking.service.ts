import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Usuario, Perfil } from '../../_model/usuario';
import { BaseService } from '../../_services/base.service';
import { PlayerPontuation } from '../model/player.pontuation';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Injectable()
export class RankingService extends BaseService {

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

  getPlayersPontuation(): Promise<PlayerPontuation[]>{
    var headers = new Headers();
    this.contentTypeApplicationJson(headers);
    var url = this.BasePath() + "dissidia/player/pontuations";
    return this.http.get(url, { headers: headers })
      .toPromise()
      .then(response => response.json() as PlayerPontuation[])
      .catch(this.handleErrorPromise);
  }

  getLoggedPlayerPontuation(): Promise<PlayerPontuation>{
    var headers = new Headers();
    this.contentTypeApplicationJson(headers);
    var url = this.BasePath() + "dissidia/player/pontuations/" + window.localStorage.getItem("id");
    return this.http.get(url, { headers: headers })
      .toPromise()
      .then(response => response.json() as PlayerPontuation)
      .catch(this.handleErrorPromise);
  }

  
  getTeamPontuation(teamId:string): Promise<PlayerPontuation[]>{
    var headers = new Headers();
    this.contentTypeApplicationJson(headers);
    var url = this.BasePath() + "dissidia/team/pontuations/" + teamId;
    return this.http.get(url, { headers: headers })
      .toPromise()
      .then(response => response.json() as PlayerPontuation)
      .catch(this.handleErrorPromise);
  }

  getUrlImagePlayer(name:string){
    return this.BasePath() + "dissidia/user/image/nickname/" + name;
  }
  
  private getUserUrl(id: string) {
    return this.BasePath() + 'empresa/usuarios/' + id;
  }

}
