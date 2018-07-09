import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, RequestOptionsArgs } from '@angular/http';

import { BaseService } from '../../_services/base.service';
import { Estoque } from '../model/estoque';
import { EstoqueMovimento } from '../model/estoque-movimento';
import { Empresa } from '../../_model/empresa';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class EstoqueService extends BaseService {

    private readonly BASE_PATH = this.BasePath() + 'empresa/estoque';
    private readonly BASE_PATH_BALCAO = this.BASE_PATH + '/balcao';
    private readonly BASE_PATH_EXTERNO = this.BASE_PATH + '/externo';

    constructor(http: Http) {
        super(http);
    }

    getProdutosEstoqueBalcaoTransferencia(): Promise<Estoque[]> {
        let headers = new Headers();
        return this.http.get(this.BASE_PATH_BALCAO + "/transferencia", { headers: headers })
            .map(response => response.json() as Estoque[])
            .toPromise();
    }

    getAtivosGiroEstoqueExterno(): Observable<Estoque[]> {
        let headers = new Headers();
        return this.http.get(this.BASE_PATH_EXTERNO + "/ativos-giro", { headers: headers })
            .map(response => response.json() as Estoque[]);
    }

    getMovimentacaoAtivoGiroEstoqueExterno(id: string): Observable<EstoqueMovimento[]> {
        let headers = new Headers();
        return this.http.get(this.BASE_PATH_EXTERNO + '/ativos-giro/' + id + '/movimentacao', { headers: headers })
            .map(response => response.json() as EstoqueMovimento[]);
    }

    getProdutosEstoqueExternoTransferencia(): Promise<Estoque[]> {
        let headers = new Headers();
        return this.http.get(this.BASE_PATH_EXTERNO + "/transferencia", { headers: headers })
            .map(response => response.json() as Estoque[])
            .toPromise();
    }

    getEstoqueBalcaoBaixo(): Promise<Estoque[]> {
        var headers = new Headers();
        return this.http.get(this.BASE_PATH_BALCAO + "/baixo", { headers: headers })
            .map(response => response.json() as Estoque[])
            .toPromise();
    }

    getEstoqueBalcaoAlto(): Promise<Estoque[]> {
        var headers = new Headers();
        return this.http.get(this.BASE_PATH_BALCAO + "/alto", { headers: headers })
            .map(response => response.json() as Estoque[])
            .toPromise();
    }

    getEstoqueBalcaoTodos(): Observable<Estoque[]> {
        let headers = new Headers();
        return this.http.get(this.BASE_PATH_BALCAO, { headers: headers })
            .map(response => response.json() as Estoque[]);
    }

    getEstoqueExternoBaixo(): Promise<Estoque[]> {
        var headers = new Headers();
        return this.http.get(this.BASE_PATH_EXTERNO + "/baixo", { headers: headers })
            .map(response => response.json() as Estoque[])
            .toPromise();
    }

    getEstoqueExternoAlto(): Promise<Estoque[]> {
        var headers = new Headers();
        return this.http.get(this.BASE_PATH_EXTERNO + "/alto", { headers: headers })
            .map(response => response.json() as Estoque[])
            .toPromise();
    }

    getEstoqueExternoTodos(): Observable<Estoque[]> {
        var headers = new Headers();
        return this.http.get(this.BASE_PATH_EXTERNO, { headers: headers })
            .map(response => response.json() as Estoque[]);
    }

    transferirProdutoBalcao(produtoId: string, quantidade: number): Promise<any> {
        var headers = new Headers();
        return this.http.post(this.BASE_PATH_BALCAO + "/transferir/" + produtoId, { quantidade: quantidade }, { headers: headers })
            .toPromise()
            .catch(this.handleErrorPromise);
    }

    transferirProdutoExterno(produtoId: string, quantidade: number): Promise<any> {
        var headers = new Headers();
        return this.http.post(this.BASE_PATH_EXTERNO + "/transferir/" + produtoId, { quantidade: quantidade }, { headers: headers })
            .toPromise()
            .catch(this.handleErrorPromise);
    }

    alterarEstoqueMinimoBalcao(estoqueId: string, estoqueMinimo: number): Promise<any> {
        let headers = new Headers();
        return this.http.put(this.BASE_PATH_BALCAO + "/" + estoqueId, { estoqueMinimo: estoqueMinimo }, { headers: headers })
            .toPromise()
            .catch(this.handleErrorPromise);
    }

    alterarEstoqueMinimoExterno(estoqueId: string, estoqueMinimo: number): Promise<any> {
        let headers = new Headers();
        return this.http.put(this.BASE_PATH_EXTERNO + "/" + estoqueId, { estoqueMinimo: estoqueMinimo }, { headers: headers })
            .toPromise()
            .catch(this.handleErrorPromise);
    }

    getMovimentacaoEstoqueBalcao(estoqueId: string): Promise<EstoqueMovimento[]> {
        let headers = new Headers();
        return this.http.get(this.BASE_PATH_BALCAO + "/" + estoqueId + "/movimentacao", { headers: headers })
            .map(response => response.json() as EstoqueMovimento[])
            .toPromise()
            .catch(this.handleErrorPromise);
    }

    getMovimentacaoEstoqueExterno(estoqueId: string): Promise<EstoqueMovimento[]> {
        let headers = new Headers();
        return this.http.get(this.BASE_PATH_EXTERNO + "/" + estoqueId + "/movimentacao", { headers: headers })
            .map(response => response.json() as EstoqueMovimento[])
            .toPromise()
            .catch(this.handleErrorPromise);
    }

    exportEstoqueBalcao(): Promise<any> {
        let headers = new Headers();
        return this.http.get(this.BASE_PATH_BALCAO + "/exportar", { headers: headers })
            .toPromise()
            .catch(this.handleErrorPromise);
    }

    exportEstoqueExterno(): Promise<any> {
        let headers = new Headers();
        return this.http.get(this.BASE_PATH_EXTERNO + "/exportar", { headers: headers })
            .toPromise()
            .catch(this.handleErrorPromise);
    }

    getEmpresaInfo(): Promise<Empresa> {
        var headers = new Headers();
        return this.http.get(this.BasePath() + 'empresa/info', { headers: headers })
            .map(response => response.json() as Empresa)
            .toPromise();
    }
}