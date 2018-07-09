import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Caminhao } from '../model/caminhao';
import { UF } from '../model/uf';
import { Empresa } from '../../_model/empresa';
import { Estado } from '../../_model/cep/estado';
import { BaseService } from '../../_services/base.service';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class CaminhaoService extends BaseService {

  constructor(http: Http) {
    super(http);
  }

  getEstados(): Observable<Estado[]> {
    return this.doGet<Estado[]>('estado');
  }

  getUfFranquia(): Observable<UF> {
    return this.doGet<UF>('empresa-uf');
  }

  getCaminhaoById(id): Observable<Caminhao> {
    return this.doGet<Caminhao>('caminhao/' + id);
  }

  getCaminhoes(): Observable<Caminhao[]> {
    return this.doGet<Caminhao[]>('caminhao');
  }

  deleteCaminhao(caminhao: Caminhao): Observable<any> {
    return this.http.delete(this.BasePath() + 'caminhao/' + caminhao.DocumentId);
  }

  salvarCaminhao(caminhao: Caminhao) {
    if (caminhao.DocumentId) {
      return this.doPut<Caminhao>(caminhao, 'caminhao/' + caminhao.DocumentId);
    } else {
      return this.doPost<Caminhao>(caminhao, 'caminhao');
    }
  }
}