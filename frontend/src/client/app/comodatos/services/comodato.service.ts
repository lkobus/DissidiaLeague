import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Comodato, ComodatoSolicitado } from '../model/comodato';
import { Refrigerador } from '../model/refrigerador';
import { BaseService } from '../../_services/base.service';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ComodatoService extends BaseService {

  constructor(http: Http) {
    super(http);
  }

  //---------------GET PRODUTO---------------
  getRefrigeradoresEstoque(): Promise<Refrigerador[]> {
    var headers = new Headers();
    this.contentTypeApplicationJson(headers);

    return this.http.get(this.BasePath() + 'empresa/refrigeradores/estoque', { headers: headers })
      .toPromise()
      .then(response => response.json() as Refrigerador[]);
  }

  GerarSolicitacaoComodato(comodato: ComodatoSolicitado): Observable<void> {
    return this.doPost(comodato, 'empresa/refrigeradores/solicitacao');
  }

  getRefrigeradorImageURL(id: string) {
    return this.BasePath() + 'empresa/refrigeradores/' + id + '/upload/imagem';
  }

  getComodatos(): Observable<Comodato[]> {
    return this.doGet<Comodato[]>('comodatos');
  }

  getRefrigeradores(): Observable<Refrigerador[]> {
    return this.doGet<Refrigerador[]>('empresa/refrigerador');
  }
}