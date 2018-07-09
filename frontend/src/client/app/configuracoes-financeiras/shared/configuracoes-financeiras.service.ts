import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { ConfiguracoesFinanceiras } from '../../configuracoes-financeiras/model/configuracoes-financeiras';
import { Empresa } from '../../_model/empresa';
import { BaseService } from '../../_services/base.service';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';
import { Banco } from '../model/banco';

@Injectable()
export class ConfiguracoesFinanceirasService extends BaseService {

    constructor(http: Http) {
        super(http);
    }

    getConfiguracoesFinanceirasById(bancoId: string): Observable<ConfiguracoesFinanceiras> {
        return this.doGet<ConfiguracoesFinanceiras>('configuracoes-financas/' + bancoId)
    }

    salvarConfiguracoesFinanceiras(configFinanceiras: ConfiguracoesFinanceiras): Observable<ConfiguracoesFinanceiras> {
        return this.doPost<ConfiguracoesFinanceiras>(configFinanceiras, 'configuracoes-financas')
    }
}