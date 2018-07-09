import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Produto } from '../model/produto';
import { FormaPagamentoVendaBalcao } from '../../configuracoes/model/configuracoes';
import { VendaBalcao } from '../model/venda-balcao';
import { StatusConfirmacao } from '../model/status-confirmacao';

import { BaseService } from '../../_services/base.service';
import { FiltroRange } from '../../_directives/export-modal/export-modal.component';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class VendaBalcaoService extends BaseService {

  readonly BASE_VENDA_BALCAO_URL = 'empresa/venda-balcao/';

  constructor(http: Http) {
    super(http);
  }

  //---------------GET PRODUTO---------------
  getProdutos(): Promise<Produto[]> {
    var headers = new Headers();
    this.contentTypeApplicationJson(headers);

    return this.http.get(this.BasePath() + this.BASE_VENDA_BALCAO_URL + 'produtos', { headers: headers })
      .toPromise()
      .then(response => response.json() as Produto[])
      .catch(this.handleErrorPromise);
  }

  getFormasPagamento(): Promise<FormaPagamentoVendaBalcao[]> {
    var headers = new Headers();
    this.contentTypeApplicationJson(headers);

    return this.http.get(this.BasePath() + this.BASE_VENDA_BALCAO_URL + 'formasPagamentoVendaBalcao', { headers: headers })
      .toPromise()
      .then(response => response.json() as FormaPagamentoVendaBalcao[])
      .catch(this.handleErrorPromise);
  }

  getVendasEfetuadas(dataInicial: Date): Promise<VendaBalcao[]> {
    var headers = new Headers();
    this.contentTypeApplicationJson(headers);

    return this.http.get(this.BasePath() + this.BASE_VENDA_BALCAO_URL + dataInicial.toISOString().split('T')[0], { headers: headers })
      .toPromise()
      .then(response => response.json() as VendaBalcao[])
      .catch(this.handleErrorPromise);
  }

  getVendaStatusConfirmacao(): Promise<StatusConfirmacao[]> {
    var headers = new Headers();
    this.contentTypeApplicationJson(headers);

    return this.http.get(this.BasePath() + this.BASE_VENDA_BALCAO_URL + 'status-confirmacao', { headers: headers })
      .toPromise()
      .then(response => response.json() as StatusConfirmacao[])
      .catch(this.handleErrorPromise);
  }

  cancelarVenda(vendaId: string, motivo: string): Promise<any> {
    var headers = new Headers();
    this.contentTypeApplicationJson(headers);

    return this.http.post(this.BasePath() + this.BASE_VENDA_BALCAO_URL + vendaId + '/cancelar', { 'Motivo': motivo }, { headers: headers })
      .toPromise()
      .catch(this.handleErrorPromise);
  }

  exportar(filtroRange: FiltroRange): Observable<any> {
    var headers = new Headers();
    var method = this.BasePath() + 'empresa/venda-balcao/export/' + filtroRange.DataInicial + '/' + filtroRange.DataFinal;

    return this.http.get(method, { headers: headers });
  }

}
