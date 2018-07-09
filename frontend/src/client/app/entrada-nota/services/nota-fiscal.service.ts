import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, RequestOptionsArgs } from '@angular/http';

import { BaseService } from '../../_services/base.service';
import { NotaFiscal, Item } from '../model/nota-fiscal';
import { ProdutoEntrada } from '../model/produto-entrada';

@Injectable()
export class NotaFiscalService extends BaseService {

    private readonly BASE_PATH = this.BasePath() + 'empresa/fiscal/nota';

    constructor(http: Http) {
        super(http);
    }

    efetuarEntradaNotaFiscal(notaFiscal: NotaFiscal, file: any): Promise<any> {
        var headers = new Headers();
        this.contentTypeApplicationJson(headers);

        var formData = new FormData();
        formData.append('xml', file);
        formData.append('json', this.ConvertParamsJSON(notaFiscal));
       // return this.http.post(this.BASE_PATH + '/entrada', formData, { headers: headers })
       return this.http.post(this.BASE_PATH + '/entrada', formData)
            .toPromise()
            .catch(this.handleErrorPromise);
    }

    previewXmlEntrada(file: any): Promise<NotaFiscal> {
        var formData = new FormData();
        formData.append('xml', file);
        return this.http.post(this.BASE_PATH + '/preview', formData)
            .map(response => response.json() as NotaFiscal)
            .toPromise()
            .catch(this.handleErrorPromise);
    }

    previewProdutoEntrada(produto: ProdutoEntrada): Promise<Item> {
        var h = new Headers();
        this.contentTypeApplicationJson(h);
        return this.http.post(this.BASE_PATH + '/produto/preview', produto, { headers: h })
            .toPromise()
            .then(response => response.json() as Item)
            .catch(this.handleErrorPromise);
    }
}
