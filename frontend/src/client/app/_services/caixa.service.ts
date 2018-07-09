import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, RequestOptionsArgs } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { EnvConfiguration } from '../shared/config/env.config';
import { MoneyQuestion, DropdownQuestion, SingleSelectQuestion, QuestionBase, TextboxQuestion } from '../shared/dynamic-question/index';
import { BaseService } from './base.service';
import { TipoRespostaEnum, Questionario, QuestionarioOpcoes } from '../_model/checklist.caixa';
import { CaixaMovimento, CaixaStatus, VendaBalcaoTipoPagamento, InformacaoVenda, ProdutoVenda } from '../_model/index';

import * as moment from 'moment'

@Injectable()
export class CaixaService extends BaseService {
    private _statusCaixa: BehaviorSubject<CaixaStatus> = new BehaviorSubject<CaixaStatus>(null);
    public statusCaixaEmitter: Observable<CaixaStatus> = this._statusCaixa.asObservable();

    private numeroCaixa: number;
    constructor(http: Http) {
        super(http);
        this.numeroCaixa = EnvConfiguration.CAIXA;
    }

    GetStatusCaixa(): Observable<CaixaStatus> {
        var headers = new Headers();
        this.contentTypeApplicationJson(headers);
        return this.http.get(this.BasePath() + this.GetCaixaPath() + '/status', { headers: headers })
            .map(response => response.json())
            .do((data: CaixaStatus) => { this._statusCaixa.next(this.SortData(data)); })
            .catch(this.handleError);
    }

    GetStatusUltimoCaixa(): Observable<CaixaStatus> {
        var headers = new Headers();
        this.contentTypeApplicationJson(headers);
        return this.http.get(this.BasePath() + this.GetCaixaPath() + '/status/ultimo', { headers: headers })
            .map(response => response.json())
            .do((data: CaixaStatus) => { this._statusCaixa.next(this.SortData(data)); })
            .catch(this.handleError);
    }

    GetStatusCaixaDiario(): Observable<CaixaStatus> {
        var headers = new Headers();
        this.contentTypeApplicationJson(headers);
        return this.http.get(this.BasePath() + this.GetCaixaPath() + '/status/diario', { headers: headers })
            .map(response => response.json())
            .do((data: CaixaStatus) => { this._statusCaixa.next(this.SortData(data)); })
            .catch(this.handleError);
    }

    GetChecklistAbertura(): Observable<QuestionBase<any>[]> {
        var headers = new Headers();
        this.contentTypeApplicationJson(headers);
        return this.http.get(this.BasePath() + 'empresa/questionarios/1', { headers: headers })
            .map(response => {
                var questions = response.json() as Questionario[];
                return this.ToQuestionBase(questions);
            })
            .catch(this.handleError);
    }

    GetChecklistFechamento(): Observable<Questionario[]> {
        var headers = new Headers();
        this.contentTypeApplicationJson(headers);
        return this.http.get(this.BasePath() + 'empresa/questionarios/2', { headers: headers })
            .map(response => {
                var questions = response.json() as Questionario[];
                return this.ToQuestionBase(questions);
            })
            .catch(this.handleError);
    }

    AbrirCaixa(valor: number): Observable<CaixaStatus> {
        return this.EfetuaOperacaoCaixa('abrir', this.GetOperacaoCaixaBody(valor));
    }

    TrocaOperador(): Observable<CaixaStatus> {
        return this.EfetuaOperacaoCaixa('trocaOperador', '');
    }

    FecharCaixa(valor: number): Observable<CaixaStatus> {
        return this.EfetuaOperacaoCaixa('fechar', this.GetOperacaoCaixaBody(valor));
    }

    VenderItem(venda: InformacaoVenda): Observable<CaixaStatus> {
        var headers = new Headers();
        this.contentTypeApplicationJson(headers);
        return this.http.post(this.BasePath() + this.GetCaixaPath() + '/vender',
            this.GetOperacaoVendaBody(venda), { headers: headers })
            .do((data: any) => { })
            .catch(this.handleError);
    }

    VenderItemPelaData(venda: InformacaoVenda, data: string): Observable<CaixaStatus> {
        var headers = new Headers();
        this.contentTypeApplicationJson(headers);
        return this.http.post(this.BasePath() + this.GetCaixaPath() + '/vender/' + data,
            this.GetOperacaoVendaBody(venda), { headers: headers })
            .do((data: any) => { })
            .catch(this.handleError);
    }

    RetirarValor(valor: number): Observable<CaixaStatus> {
        return this.EfetuaOperacaoCaixa('sangria', this.GetOperacaoCaixaBody(valor));
    }

    SuprimentoCaixa(valor: number): Observable<CaixaStatus> {
        return this.EfetuaOperacaoCaixa('suprimento', this.GetOperacaoCaixaBody(valor));
    }

    private ToQuestionBase(questions: Questionario[]): QuestionBase<any>[] {
        var result: QuestionBase<any>[] = [];
        questions.forEach((item, index) => {
            var tipo = 0;
            var opcoesResposta: any = [];
            item.Opcoes.forEach((option, i) => {
                tipo = option.Tipo;
                if (tipo === TipoRespostaEnum.SINGLE_SELECT.Tipo) {
                    opcoesResposta.push({ key: item.Id + i, value: option.Texto });
                }

                else if (tipo === TipoRespostaEnum.TEXT.Tipo) {
                    opcoesResposta.push({ key: item.Id + i, value: "" });
                }

                else if (tipo === TipoRespostaEnum.NUMERIC.Tipo) {
                    opcoesResposta.push({ key: item.Id + i, value: "" });
                }
            });

            if (tipo === TipoRespostaEnum.SINGLE_SELECT.Tipo) {

                result.push(
                    new SingleSelectQuestion({
                        key: 'key-' + index,
                        label: item.Descricao,
                        options: opcoesResposta,
                        required: item.Obrigatorio,
                        order: index
                    }));
            }
            else if (tipo === TipoRespostaEnum.NUMERIC.Tipo) {
                result.push(
                    new MoneyQuestion({
                        key: 'key-' + index,
                        label: item.Descricao,
                        options: opcoesResposta,
                        value: "",
                        required: item.Obrigatorio,
                        order: index
                    }));
            }
            else if (tipo === TipoRespostaEnum.TEXT.Tipo) {
                result.push(
                    new TextboxQuestion({
                        key: 'key-' + index,
                        label: item.Descricao,
                        value: "",
                        options: opcoesResposta,
                        required: item.Obrigatorio,
                        order: index
                    }));
            }
        });

        return result;
    }

    private GetOperacaoCaixaBody(valor: number) {
        var loggedUser = localStorage.getItem('currentUser');
        var body = { 'Usuario': loggedUser, 'Valor': valor };
        return body;
    }

    private GetOperacaoVendaBody(venda: InformacaoVenda) {
        var body = JSON.stringify(venda);
        return body;
    }

    private EfetuaOperacaoCaixa(path: string, body: any): Observable<CaixaStatus> {
        var headers = new Headers();
        this.contentTypeApplicationJson(headers);
        return this.http.post(this.BasePath() + this.GetCaixaPath() + '/' + path, body, { headers: headers })
            .map(response => response.json())
            .do((data: CaixaStatus) => { this._statusCaixa.next(this.SortData(data)); })
            .catch(this.handleError);
    }

    private SortData(data: CaixaStatus) {
        data.Movimentos = data.Aberturas
            .concat(data.Fechamentos)
            .concat(data.TrocaOperador)
            .concat(data.Vendas)
            .concat(data.Sangrias)
            .concat(data.Suprimentos)
            .concat(data.VendaCancelamentos);

        let sorted = data.Movimentos.sort((a, b) => {
            let date1 = moment(a.Data, 'DD/MM/YYYY HH:mm:ss');
            let date2 = moment(b.Data, 'DD/MM/YYYY HH:mm:ss');
            return (date1 > date2) ? 1 : -1;
        });
        data.Movimentos = sorted;
        return data;
    }

    private GetCaixaPath(): string {
        return 'empresa/caixa';
    }
}
