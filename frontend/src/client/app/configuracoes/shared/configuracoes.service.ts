import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Configuracoes, FormaPagamentoVendaBalcao, FormaPagamentoVendaExterna } from '../model/configuracoes';
import { Importacao } from '../model/importacao';
import { OperacaoSaida } from '../model/operacao-saida';
import { Empresa } from '../../_model/empresa';

import { AuthenticationService } from '../../_services/authentication.service';
import { BaseService } from '../../_services/base.service';

import { FileHolder } from '../../angular2-image-upload/src/image-upload/image-upload.component';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ConfiguracoesService extends BaseService {

    constructor(private authenticationService: AuthenticationService, http: Http) {
        super(http);
    }

    /* GET */
    getFormasPagamentoPermitidos(): Observable<Configuracoes[]> {
        return this.doGet<FormaPagamentoVendaBalcao[]>('formasPagamento/balcao');
    }

    getFormasPagamentoExterna(): Observable<Configuracoes[]> {
        return this.doGet<FormaPagamentoVendaExterna[]>('formasPagamento/externa');
    }

    getEmpresaInfo(): Observable<Empresa> {
        return this.doGet<Empresa>('empresa/info');
    }

    getOperacoes(): Observable<OperacaoSaida[]> {
        return this.doGet<OperacaoSaida[]>('operacoesSaida');
    }

    getTiposImportacoes(): Observable<Importacao[]> {
        return this.doGet<Importacao[]>('cargaInicial/importacoes');
    }

    importCargaInicial(importacao: Importacao, file: FileHolder): Promise<any> {
        var userId = this.authenticationService.getUserId();
        return this.doPostCsv(file, 'cargaInicial/' + importacao.Codigo + '/' + userId);
    }

    exportCargaInicial(importacao: Importacao): Observable<any> {
        var headers = new Headers();
        return this.http.get(this.BasePath() + 'cargaInicial/' + importacao.Codigo, { headers: headers });
    }

    /* PUT */
    alteraFormaPagamentoEmpresa(empresa: Empresa): Observable<any> {
        var method = 'empresa/' + empresa.Id + '/alteraFormaPagamentoBalcao/';
        return this.doPut<FormaPagamentoVendaBalcao[]>(empresa.FormasPagamentoVendaBalcao, method);
    }

    alteraCpfVendaBalcao(empresa: Empresa): Observable<any> {
        var method = 'empresa/' + empresa.Id + '/PedeCpfVendaBalcao/' + empresa.PedeCpfBalcao;
        return this.doPutWithoutBody<any>(method);
    }

    alteraFormaPagamentoExternaEmpresa(empresa: Empresa): Observable<any> {
        var method = 'empresa/' + empresa.Id + '/alteraFormaPagamentoExterna/';
        return this.doPut<FormaPagamentoVendaExterna[]>(empresa.FormasPagamentoVendaExterna, method);
    }

    alteraOperacoesSaida(operacoesSaida: OperacaoSaida[]): Observable<any> {
        return this.doPut<OperacaoSaida[]>(operacoesSaida, 'operacoesSaida/');
    }

    alteraCaixasDisponiveisEmpresa(empresa: Empresa): Observable<any> {
        var method = 'empresa/' + empresa.Id + '/AlterarNumeroCaixas/' + empresa.CaixasDisponiveis;
        return this.doPutWithoutBody<any>(method);
    }

    alteraPercentualDesconto(empresa: Empresa): Observable<any> {
        var method = 'empresa/' + empresa.Id + '/AlterarPercentualDesconto/' + empresa.PercentualDesconto;
        return this.doPutWithoutBody<any>(method);
    }

    alteraPercentualDescontoExterno(empresa: Empresa): Observable<any> {
        var method = 'empresa/' + empresa.Id + '/AlterarPercentualDescontoExterno/' + empresa.PercentualDescontoExterno;
        return this.doPutWithoutBody<any>(method);
    }

    alteraRaioGps(empresa: Empresa): Observable<any> {
        var method = 'empresa/' + empresa.Id + '/AlterarRaioGps/' + empresa.RaioGps;
        return this.doPutWithoutBody<any>(method);
    }

    alteraUtilizaCupomFiscal(empresa: Empresa): Observable<any> {
        var method = 'empresa/' + empresa.Id + '/AlterarUtilizaCupomFiscal/' + empresa.UtilizaCupomFiscal;
        return this.doPutWithoutBody<any>(method);
    }

    alteraPrazoCancelamentoCupomFiscal(empresa: Empresa): Observable<any> {
        var method = 'empresa/' + empresa.Id + '/AlterarPrazoCancelamentoCupomFiscal/' + empresa.PrazoCancelamentoCupomFiscal;
        return this.doPutWithoutBody<any>(method);
    }

    alteraPrazoCancelamentoNFe(empresa: Empresa): Observable<any> {
        var method = 'empresa/' + empresa.Id + '/AlterarPrazoCancelamentoNFe/' + empresa.PrazoCancelamentoNFe;
        return this.doPutWithoutBody<any>(method);
    }

    alteraLimiteCreditoPadrao(empresa: Empresa): Observable<any> {
        var method = 'empresa/' + empresa.Id + '/AlterarLimiteCreditoPadrao/' + empresa.LimiteCreditoPadrao;
        return this.doPutWithoutBody<any>(method);
    }

    alteraEstoqueMinimoPadraoBalcao(empresa: Empresa): Observable<any> {
        var method = 'empresa/' + empresa.Id + '/alteraEstoqueMinimoPadraoBalcao/' + empresa.EstoqueMinimoPadraoBalcao;
        return this.doPutWithoutBody<any>(method);
    }

    alteraEstoqueMinimoPadraoExterno(empresa: Empresa): Observable<any> {
        var method = 'empresa/' + empresa.Id + '/alteraEstoqueMinimoPadraoExterno/' + empresa.EstoqueMinimoPadraoExterno;
        return this.doPutWithoutBody<any>(method);
    }
}
