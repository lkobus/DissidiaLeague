import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Banco } from '../model/banco';
import { Empresa } from '../../_model/empresa';
import { BaseService } from '../../_services/base.service';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class BancoService extends BaseService {

  constructor(http: Http) {
    super(http);
  }

  getBancos(): Observable<Banco[]> {
    return this.doGet<Banco[]>('banco');
  }
}