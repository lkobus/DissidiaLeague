import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Usuario, Perfil } from '../../_model/usuario';
import { BaseService } from '../../_services/base.service';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { TeamDTO } from '../model/team.dto';
import { PositionDTO } from '../model/positionDTO';

@Injectable()
export class ProfileService extends BaseService {

  constructor(http: Http) {
    super(http);
  }


  getNickName(userId:string): Promise<string>{    
    var headers = new Headers();
    this.contentTypeApplicationJson(headers);
    var url = this.BasePath() + "dissidia/user/nickname/" + userId;    
    return this.http.get(url, { headers: headers })
    .toPromise()
    .then(response => response.json() as string)
    .catch(this.handleErrorPromise);
  }

  getLoggedUserPositionPontuation(): Promise<PositionDTO>{    
    var headers = new Headers();
    var loggedId = window.localStorage.getItem("id");
    this.contentTypeApplicationJson(headers);
    var url = this.BasePath() + "dissidia/player/pontuations/position/" + loggedId;    
    return this.http.get(url, { headers: headers })
    .toPromise()
    .then(response => response.json() as PositionDTO)
    .catch(this.handleErrorPromise);
  }

  createTeam(team:TeamDTO): Promise<void>{
    var founder = window.localStorage.getItem("id");
    var headers = new Headers();
    this.contentTypeApplicationJson(headers);
    var url = this.BasePath() + "dissidia/team/create/" + founder;    
    return this.http.post(url, JSON.stringify(team), { headers: headers })
    .toPromise()
    .then(() => alert("Team created and invites sents"))
    .catch(this.handleErrorPromise);
  }  

  getTeam(): Promise<TeamDTO> {
    var founder = window.localStorage.getItem("id");
    var headers = new Headers();
    this.contentTypeApplicationJson(headers);
    var url = this.BasePath() + "dissidia/team/user/" + founder;    
    return this.http.get(url, { headers: headers })
    .toPromise()
    .then(response => response.json() as TeamDTO)
    .catch(this.handleErrorPromise);
  }

  inviteTeam(teamId:string, email:string){        
    var headers = new Headers();
    this.contentTypeApplicationJson(headers);
    var url = this.BasePath() + "dissidia/team/invite/" + teamId + "/" + email;    
    return this.http.put(url, "", { headers: headers })
    .toPromise()
    .then(() => alert("Invite has been sent."))
    .catch(this.handleErrorPromise);
  }

  uploadTeamLogo(fileholder: any, teamId: string): Promise<any> {
    var url = this.BasePath() + "dissidia/team/image/" + teamId;
    var formData = new FormData();
    formData.append('image', fileholder.file);            
    return this.http.put(url, formData)
      .toPromise()      
      .catch(this.handleErrorPromise);
  }

  getTeamImageUrl(teamId:string) {
    return this.BasePath() + "dissidia/team/image/" + teamId;
  }

  uploadProfileLogo(fileholder: any, teamId: string): Promise<any> {
    var url = this.BasePath() + "dissidia/user/image/" + teamId;
    var formData = new FormData();
    formData.append('image', fileholder.file);            
    return this.http.put(url, formData)
      .toPromise()      
      .catch(this.handleErrorPromise);
  }  

  getProfileUrl(teamId:string) {
    return this.BasePath() + "dissidia/user/image/" + teamId;
  }

}
