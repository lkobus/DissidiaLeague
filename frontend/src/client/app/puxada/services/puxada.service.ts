import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';

import { BaseService } from '../../_services/base.service';

@Injectable()
export class PuxadaService extends BaseService {

    private readonly PARCEIRO_AMBEV_URL: string = 'https://www.parceiroambev.com.br/';

    constructor(http: Http) {
        super(http);
    }

    public solicitarPuxada(): void {
        window.open(this.PARCEIRO_AMBEV_URL);
    }

}
