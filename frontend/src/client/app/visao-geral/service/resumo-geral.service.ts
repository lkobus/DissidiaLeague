import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, RequestOptionsArgs } from '@angular/http'; import { Observable } from 'rxjs/Rx';

import { BaseService } from '../../_services/base.service';
import { ResumoGeral, HistoricoVendas, ProdutosMaisVendidos } from '../model/resumo-geral';

@Injectable()
export class ResumoGeralService extends BaseService {

    constructor(http: Http) {
        super(http);
    }

    GetResumo(path: string): Observable<ResumoGeral[]> {
        var headers = new Headers();
        super.contentTypeApplicationJson(headers);
        return this.http.get(this.BasePath() + 'empresa/resumo/' + path, { headers: headers })
            .map(response => {
                var result = response.json() as ResumoGeral[];
                return result;
            })
            .catch(this.handleError);
    }


    GetResumoDetalhadoDia(path: string): Observable<HistoricoVendas[]> {
        var headers = new Headers();
        super.contentTypeApplicationJson(headers);
        return this.http.get(this.BasePath() + 'empresa/resumo/' + path + '/detalhado', { headers: headers })
            .map(response => response.json())
            .catch(this.handleError);
    }

    GetResumoProdutosMaisVendidos(path: string, limit: number): Observable<ProdutosMaisVendidos[]> {
        var headers = new Headers();
        super.contentTypeApplicationJson(headers);
        return this.http.get(this.BasePath() + 'empresa/produtos/maisVendidos/' + path + '/' + limit, { headers: headers })
            .map(response => (response.json() as ProdutosMaisVendidos[]).sort((a, b) => b.quantidade - a.quantidade))
            .catch(this.handleError);
    }
}
