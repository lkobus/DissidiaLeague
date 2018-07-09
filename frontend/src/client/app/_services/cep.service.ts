import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { BaseService } from './base.service';
import { Cep } from '../_model/cep/cep';
import { Municipio } from '../_model/cep/municipio';

import { Observable } from 'rxjs/Rx';

@Injectable()
export class CepService extends BaseService {

    constructor(http: Http) {
        super(http);
    }

    getBaseMunicipios(codigoUF: number): Observable<Municipio[]> {
        return this.doGet<Municipio[]>(`${'baseCep/municipios/' + codigoUF}`);
    }

    getCep(cep: string): Observable<Cep> {
        return this.doGet<Cep>("baseCep/" + cep);
    }

}
