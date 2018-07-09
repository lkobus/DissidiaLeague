import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Empresa } from '../../_model/empresa';
import { BaseService } from '../../_services/base.service';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';
import { Indicadores } from '../model/indicadores';
import { TipoCalculo } from '../model/tipo-calculo';
import { RegraCalculo } from '../model/regra-calculo';
import { IndicadoresEnum } from '../model/indicadores-enum';

@Injectable()
export class IndicadorMetaService extends BaseService {

    constructor(http: Http) {
        super(http);
    }

    getIndicadores(): Observable<Indicadores[]> {
        return this.doGet<Indicadores[]>('indicador');
    }

    getIndicadoresEnum(): Observable<IndicadoresEnum[]> {
        return this.doGet<IndicadoresEnum[]>('indicadores-enum');
    }

    getRegraCalculo(): Observable<RegraCalculo[]> {
        return this.doGet<RegraCalculo[]>('regra-calculo');
    }

    getTipoCalculo(): Observable<TipoCalculo[]> {
        return this.doGet<TipoCalculo[]>('tipo-calculo');
    }

    getIndicadorById(id): Observable<Indicadores> {
        return this.doGet<Indicadores>('indicadores/' + id);
    }
}