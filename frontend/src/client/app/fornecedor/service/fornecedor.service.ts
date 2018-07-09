import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Fornecedor } from '../../fornecedor/model/fornecedor';
import { Empresa } from '../../_model/empresa';
import { BaseService } from '../../_services/base.service';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class FornecedorService extends BaseService {

    constructor(http: Http) {
        super(http);
    }

    getFornecedores(): Observable<Fornecedor[]> {
        return this.doGet<Fornecedor[]>('fornecedor');
    }

    salvarFornecedor(fornecedoresNew: Fornecedor[], fornecedoresRemove: Fornecedor[]) {
        return this.doDelete<Fornecedor[]>(fornecedoresRemove, 'fornecedor')
            .flatMap(response => {
                return this.doPost<Fornecedor[]>(fornecedoresNew, 'fornecedor');
            });
    }
}
