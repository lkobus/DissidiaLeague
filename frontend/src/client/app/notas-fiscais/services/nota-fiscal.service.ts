import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { BaseService } from '../../_services/base.service';
import { NotaFiscal } from '../model/nota-fiscal';
import { Usuario } from '../../_model/usuario';
import { NotaFiscalFilter } from '../model/nota-fiscal-filter';

@Injectable()
export class NotaFiscalService extends BaseService {

    private readonly INVENTTI_URL: string = 'http://186.250.185.246/NFePackMonitor';

    constructor(http: Http) {
        super(http);
    }

    getNotaFiscalResumo(id: string): Promise<NotaFiscal> {
        return this.doGet<NotaFiscal>('empresa/notasFiscais/resumo/' + id)
            .toPromise();
    }

    getNotas(tipoNota: number, dataInicial: Date, dataFinal: Date): Promise<NotaFiscal[]> {
        return this.doGet<NotaFiscal[]>('empresa/notasFiscais/' + tipoNota + '/' + dataInicial.toISOString().split('T')[0] +
            '/' + dataFinal.toISOString().split('T')[0])
            .toPromise()
            .catch(this.handleErrorPromise);
    }

    baixarDanfe(notaId: string): Promise<any> {
        return this.doDownloadFile('empresa/notasFiscais/' + notaId + '/download/danfe')
            .toPromise()
            .catch(this.handleErrorPromise);
    }

    gerarBoleto(notaId: string): Promise<any> {
        return this.doDownloadFile('empresa/financeiro/' + notaId + '/download/boleto')
            .toPromise()
            .catch(this.handleErrorPromise);
    }

    baixarXml(notaId: string): Promise<any> {
        return this.doDownloadFile('empresa/notasFiscais/' + notaId + '/download/xml')
            .toPromise()
            .catch(this.handleErrorPromise);
    }

    cancelarNotaFiscal(notaId: string): Promise<NotaFiscal> {
        //o que  era aqui
        return this.doPost<NotaFiscal>(null, 'empresa/notasFiscais/' + notaId + '/cancelarDevolver')
            .toPromise();
    }

    getProdutoImageURL(produtoId: string) {
        return this.BasePath() + 'empresa/produtos/' + produtoId + '/upload/imagem';
    }

    exportCSV(notaFilter: NotaFiscalFilter): Observable<any> {
        var headers = new Headers();
        return this.http.get(this.BasePath() + this.getMethodExport('exportCSV', notaFilter), { headers: headers });
    }

    exportXML(notaFilter: NotaFiscalFilter): Promise<any> {
        return this.doDownloadFile(this.getMethodExport('exportXML', notaFilter))
            .toPromise()
            .catch(this.handleErrorPromise);
    }

    private getMethodExport(method: string, notaFilter: NotaFiscalFilter) {
        var url = 'empresa/notasFiscais/' + method + '/' + notaFilter.TipoNota + '/' + notaFilter.Periodo.DataInicial +
            '/' + notaFilter.Periodo.DataFinal + '/' + notaFilter.ClienteId + '/' + notaFilter.VendedorId;
        return url;
    }

    public forToInventti(): void {
        window.open(this.INVENTTI_URL);
    }
}
