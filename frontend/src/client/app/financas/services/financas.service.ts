import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BaseService } from '../../_services/base.service';
import { ExtratoFinanceiro, Titulo, Categoria, Remessas } from '../model/financas';
import { FormaPagamento } from '../model/forma-pagamento';

@Injectable()
export class FinanceiroService extends BaseService {

  constructor(http: Http) {
    super(http);
  }

  exportCSV(filter: string): Observable<any> {
    var headers = new Headers();
    return this.http.get(this.BasePath() + 'empresa/financeiro/titulos/exportCSV/' + filter + '', { headers: headers });
  }

  exportCSVReceber(filter: string): Observable<any> {
    var headers = new Headers();
    return this.http.get(this.BasePath() + 'empresa/financeiro/titulos/receber/exportCSV/' + filter + '', { headers: headers });
  }

  exportCSVPagar(filter: string): Observable<any> {
    var headers = new Headers();
    return this.http.get(this.BasePath() + 'empresa/financeiro/titulos/pagar/exportCSV/' + filter + '', { headers: headers });
  }

  GetCategorias(): Observable<Categoria[]> {
    return this.doGet<Categoria[]>('categorias');
  }

  GetFormasPagamento(): Observable<FormaPagamento[]> {
    return this.doGet<FormaPagamento[]>('formasPagamento');
  }

  CriarTitulosReceber(titulos: Titulo[]): Observable<void> {
    return this.doPost(titulos, 'empresa/financeiro/titulos/receber')
      .catch(this.handleError);
  }

  CriarTitulosPagar(titulos: Titulo[]): Observable<void> {
    return this.doPost(titulos, 'empresa/financeiro/titulos/pagar')
      .catch(this.handleError);
  }

  PagarContas(titulos: Titulo[]): Observable<void> {
    return this.doPost(titulos, 'empresa/financeiro/baixar')
      .catch(this.handleError);
  }

  EfetuarCancelarmento(titulos: Titulo[]): Observable<void> {
    return this.doPost(titulos, 'empresa/financeiro/cancelar')
      .catch(this.handleError);
  }
  
  GetExtratoMes(): Observable<ExtratoFinanceiro> {
    return this.GetExtrato('mes');
  }

  GetExtratoAno(): Observable<ExtratoFinanceiro> {
    return this.GetExtrato('ano');
  }

  GetExtratoSemana(): Observable<ExtratoFinanceiro> {
    return this.GetExtrato('semana');
  }

  GetExtratoDia(): Observable<ExtratoFinanceiro> {
    return this.GetExtrato('dia');
  }

  GetRemessas(): Observable<Remessas> {
    return this.doGet<Remessas>('remessaBancaria');
  }

  GerarRemessa(id: string): Promise<any> {
    return this.doDownloadFile('remessaBancaria/arquivoRemessa/' + id)
        .toPromise()
        .catch(this.handleErrorPromise);
  }

  GetArquivoRemessa(id: string): Promise<any> {
    return this.doDownloadFile('remessaBancaria/' + id + '/download')
        .toPromise()
        .catch(this.handleErrorPromise);
  }

  GetDetalheRemessa(id: string): Observable<Titulo[]> {
    return this.doGet<Titulo[]>('remessaBancaria/' + id);
  }

  uploadRetornoBancario(id: string, fileholder: any): Promise<any> {
    var formData = new FormData();
    formData.append('txt', fileholder.file);
    return this.http.post(this.BasePath() + '/remessaBancaria/' + id + '/import', formData)
        .toPromise()
        .catch(this.handleError);
}

  private GetExtrato(path: string): Observable<ExtratoFinanceiro> {
    return this.doGet<ExtratoFinanceiro>('empresa/financeiro/resumo/' + path);
  }
}
