import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FileHolder } from '../angular2-image-upload/src/image-upload/image-upload.component';
import { FileSaverService } from 'ngx-filesaver';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';

import { Configuracoes, FormaPagamentoVendaBalcao, FormaPagamentoVendaExterna } from './model/configuracoes';
import { OperacaoSaida } from './model/operacao-saida';
import { Importacao } from './model/importacao';
import { Empresa } from '../_model/empresa';
import { ConfiguracoesService } from './shared/configuracoes.service';
import { GenericResponse } from '../_model/generic-response';
import { ToastService } from '../_services/toast.service';

/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
    moduleId: module.id,
    selector: 'sd-config',
    templateUrl: 'configuracoes.component.html',
    styleUrls: ['configuracoes.component.css']
})


export class ConfiguracoesComponent implements OnInit {
    csvCargaInicial: FileHolder;
    isImporting: boolean;

    isLoading: boolean;
    formasPagamentoVendaBalcaoPermitidos: FormaPagamentoVendaBalcao[];
    formasPagamentoVendaExternaPermitidos: FormaPagamentoVendaExterna[];
    operacoesSaida: OperacaoSaida[];
    empresa: Empresa;

    importacao: Importacao;
    importacoes: Importacao[] = [];

    constructor(
        private configuracoesService: ConfiguracoesService,
        private _toastService: ToastService,
        private router: Router,
        private fileSaverService: FileSaverService
    ) { }

    getConfiguracoes(): void {
        this.isLoading = true;
        this.configuracoesService.getEmpresaInfo()
            .flatMap(response => {
                this.empresa = response;
                return this.configuracoesService.getFormasPagamentoPermitidos();
            })
            .flatMap((response: FormaPagamentoVendaBalcao[]) => {
                this.formasPagamentoVendaBalcaoPermitidos = response;
                return this.configuracoesService.getFormasPagamentoExterna();
            })
            .flatMap((response: FormaPagamentoVendaExterna[]) => {
                this.formasPagamentoVendaExternaPermitidos = response;
                return this.configuracoesService.getOperacoes();
            })
            .flatMap((response: OperacaoSaida[]) => {
                this.operacoesSaida = response;
                return Observable.of(true);
            })
            .subscribe(result => {
                this.isLoading = false;
                console.log(this.empresa);
            });

        this.configuracoesService.getTiposImportacoes()
            .subscribe(importacoes => {
                this.importacoes = importacoes;
                if (importacoes.length > 0) {
                    this.importacao = importacoes[0];
                }
            });
    }

    ngOnInit(): void {
        this.getConfiguracoes();
    }

    throwAndReturn(message: string): Observable<any> {
        this._toastService.errorNotification('', message);
        return Observable.of(true);
    }

    save() {
        this.isLoading = true;
        this.configuracoesService.alteraFormaPagamentoEmpresa(this.empresa)
            .flatMap((response) => {
                return this.configuracoesService.alteraUtilizaCupomFiscal(this.empresa).catch((err) => this.throwAndReturn('Erro salvar \'utiliza cupom fiscal\''));
            })
            .flatMap((response) => {
                return this.configuracoesService.alteraCpfVendaBalcao(this.empresa).catch((err) => this.throwAndReturn('Erro salvar \'utiliza cpf nota\''));
            })
            .flatMap((response) => {
                return this.configuracoesService.alteraCaixasDisponiveisEmpresa(this.empresa).catch((err) => this.throwAndReturn('Erro salvar \'caixas disponíveis\''));
            })
            .flatMap((response) => {
                return this.configuracoesService.alteraPercentualDesconto(this.empresa).catch((err) => this.throwAndReturn('Erro salvar \'percentual de desconto venda balcão\''));
            })
            .flatMap((response) => {
                return this.configuracoesService.alteraPercentualDescontoExterno(this.empresa).catch((err) => this.throwAndReturn('Erro salvar \'percentual de desconto venda externa\''));
            })
            .flatMap((response) => {
                return this.configuracoesService.alteraRaioGps(this.empresa).catch((err) => this.throwAndReturn('Erro salvar \'raio de gps\''));
            })
            .flatMap((response) => {
                return this.configuracoesService.alteraPrazoCancelamentoCupomFiscal(this.empresa).catch((err) => this.throwAndReturn('Erro salvar \'prazo de cancelamento cupom fiscal \''));
            })
            .flatMap((response) => {
                return this.configuracoesService.alteraPrazoCancelamentoNFe(this.empresa).catch((err) => this.throwAndReturn('Erro salvar \'prazo cancelamento NFe\''));
            })
            .flatMap((response) => {
                return this.configuracoesService.alteraFormaPagamentoExternaEmpresa(this.empresa).catch((err) => this.throwAndReturn('Erro salvar \'forma de pagamento venda externa\''));
            })
            .flatMap((response) => {
                return this.configuracoesService.alteraLimiteCreditoPadrao(this.empresa).catch((err) => this.throwAndReturn('Erro salvar \'limite de credito\''));
            })
            .flatMap((response) => {
                return this.configuracoesService.alteraEstoqueMinimoPadraoBalcao(this.empresa).catch((err) => this.throwAndReturn('Erro salvar \'estoque mínimo padrão venda balcão\''));
            })
            .flatMap((response) => {
                return this.configuracoesService.alteraEstoqueMinimoPadraoExterno(this.empresa).catch((err) => this.throwAndReturn('Erro salvar \'estoque mínimo venda externa\''));
            })
            .flatMap((response) => {
                return this.configuracoesService.alteraOperacoesSaida(this.operacoesSaida).catch((err) => this.throwAndReturn('Erro salvar \'operações de saída\''));
            })
            .subscribe(data => {
                this.isLoading = false;
                this._toastService.sucessNotification('', 'Configuração alterada com Sucesso.');
            }, err => {
                this.isLoading = false;
                this._toastService.errorNotification('', 'Ocorreu algum erro ao salvar.');
                console.log(err);
            });
    }

    importarCsv() {
        if (this.csvCargaInicial != null) {
            this.isImporting = true;
            this.configuracoesService.importCargaInicial(this.importacao, this.csvCargaInicial)
                .then(response => {
                    var body = (<any>response)._body;

                    if (body != '') {
                        this.fileSaverService.save(body, 'LogImportacao.txt');
                        this._toastService.errorNotification('Atenção', 'Nem todos registros foram importados. Confira o LogImportacao para mais detalhes');
                    } else {
                        this.csvCargaInicial = null;
                        this._toastService.sucessNotification('Sucesso', 'Importação realizada');
                    }

                    this.isImporting = false;
                }).catch(error => {
                    this._toastService.errorNotification('Erro', 'Falha ao realizar importação.');
                    this.isImporting = false;
                });
        }
    }

    exportCargaInicial(): void {
        this.isImporting = true;
        this.configuracoesService.exportCargaInicial(this.importacao)
            .subscribe(data => {
                if ((<any>data)._body != null) {
                    this.fileSaverService.save((<any>data)._body, this.importacao.Valor + '.csv');
                } else {
                    this._toastService.errorNotification('Erro', 'Falha ao realizar importação.');
                }

                this.isImporting = false;
            });
    }

    uploadCSV(file: FileHolder) {
        this.csvCargaInicial = file;
    }

    onChange(event: any, item: FormaPagamentoVendaBalcao): void {
        var index = this.empresa.FormasPagamentoVendaBalcao.findIndex(p => p.Codigo === item.Codigo);
        if (index >= 0) {
            this.empresa.FormasPagamentoVendaBalcao.splice(index, 1);
        }

        if (event) {
            this.empresa.FormasPagamentoVendaBalcao.push(item);
        }
    }

    isChecked(item: FormaPagamentoVendaBalcao): boolean {
        var tempItem = this.empresa.FormasPagamentoVendaBalcao.find(p => p.Codigo === item.Codigo);
        var checked = false;
        if (tempItem !== undefined && tempItem !== null) {
            checked = true;
        }
        return checked;
    }

    onChangeExterna(event: any, item: FormaPagamentoVendaExterna): void {
        var index = this.empresa.FormasPagamentoVendaExterna.findIndex(p => p.Codigo === item.Codigo);
        if (index >= 0) {
            this.empresa.FormasPagamentoVendaExterna.splice(index, 1);
        }
        if (event) {
            this.empresa.FormasPagamentoVendaExterna.push(
                {
                    'Codigo': item.Codigo,
                    'Descricao': item.Descricao,
                    'PrazoMaximo': 0,
                    'DisponivelParaClientesNovos': false
                });
        }
    }

    isCheckedExterna(item: FormaPagamentoVendaExterna): boolean {
        var tempItem = this.empresa.FormasPagamentoVendaExterna.find(p => p.Codigo === item.Codigo);
        var checked = false;
        if (tempItem !== undefined && tempItem !== null) {
            checked = true;
        }
        return checked;
    }

    setPrazoMaximo(event: any, item: FormaPagamentoVendaExterna): void {
        var prazoMaximo = event.currentTarget.valueAsNumber;
        var tempItem = this.empresa.FormasPagamentoVendaExterna.find(p => p.Codigo === item.Codigo);
        if (tempItem !== undefined && tempItem !== null) {
            tempItem.PrazoMaximo = prazoMaximo;
        }
    }

    getPrazoMaximo(item: FormaPagamentoVendaExterna): number {
        var tempItem = this.empresa.FormasPagamentoVendaExterna.find(p => p.Codigo === item.Codigo);
        var prazoMaximo = 0;
        if (tempItem !== undefined && tempItem !== null) {
            prazoMaximo = tempItem.PrazoMaximo;
        }
        return prazoMaximo;
    }

    setDisponivel(event: any, item: FormaPagamentoVendaExterna): void {
        var isChecked = event.checked;
        var tempItem = this.empresa.FormasPagamentoVendaExterna.find(p => p.Codigo === item.Codigo);
        if (tempItem !== undefined && tempItem !== null) {
            tempItem.DisponivelParaClientesNovos = isChecked;
        }
    }

    getDisponivelParaClientesNovos(item: FormaPagamentoVendaExterna): boolean {
        var tempItem = this.empresa.FormasPagamentoVendaExterna.find(p => p.Codigo === item.Codigo);
        var disponivel = false;
        if (tempItem !== undefined && tempItem !== null) {
            disponivel = tempItem.DisponivelParaClientesNovos;
        }
        return disponivel;
    }

    validateOnlyNumbers(evt) {
        var theEvent = evt || window.event;
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
        var regex = /[0-9]|\./;
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }
    }

}
