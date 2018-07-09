import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ToastService } from '../_services/toast.service';
import { Modal } from 'ngx-modal';
import { Subject } from 'rxjs/Subject';

import { Empresa } from '../_model/empresa';
import { GenericResponse } from '../_model/index';
import { EstoqueMovimento, UsuarioMovimento, TipoMovimento, Origem } from './model/estoque-movimento';
import { Estoque, EstoqueItem, TipoEstoqueItem } from './model/estoque';
import { EstoqueService } from './services/estoque.service';
import { ProdutosService } from '../produtos/shared/produtos.service';
import { BaseTableComponent } from '../shared/table/base-table-component';

@Component({
    moduleId: module.id,
    selector: 'estoque-ativos-giro',
    templateUrl: 'estoque-ativos-giro.component.html',
    styleUrls: ['estoque.component.css']
})

export class EstoqueAtivosGiroComponent extends BaseTableComponent implements OnInit {
    @Output() searchChangeEmitter: EventEmitter<any> = new EventEmitter<any>();
    searchUpdated: Subject<string> = new Subject<string>();

    isLoading: boolean;
    dataList: Estoque[] = [];
    inputSearch: any;

    @ViewChild('modalEditar') modalEditar: Modal;
    estoqueEdicao: Estoque;
    estoqueEdicaoTipo: number;
    sourceEstoqueEdicaoMovimentacao: EstoqueMovimento[] = [];
    listEstoqueEdicaoMovimentacao: EstoqueMovimento[] = [];
    urlImageProdutoEdicao: string = '';
    isLoadingMovimentacao: boolean = false;
    movimentoSortingDesc: boolean = false;

    private ativosGiro: Estoque[] = [];

    constructor(
        private estoqueService: EstoqueService,
        private produtoService: ProdutosService,
        private toastService: ToastService,
        private route: Router
    ) {
        super();

        this.searchChangeEmitter = <any>this.searchUpdated.asObservable()
            .debounceTime(500)
            .distinctUntilChanged()
            .subscribe(item => this.filter(item));
    }

    ngOnInit() {
        this.loadSource();
    }

    loadSource(): void {
        this.inputSearch = '';
        this.isLoading = true;
        this.estoqueService.getAtivosGiroEstoqueExterno()
            .subscribe(data => {
                this.ativosGiro = data;
                this.filter('');
                this.isLoading = false;
            }, (this.handleServerError));
    }

    inputSearchOnFilter(searchText: string): void {
        this.searchUpdated.next(searchText);
    }

    getMovimentoOrigemDescricao(valor): string {
        if (valor == Origem.ENTRADA_MANUAL.Codigo) {
            return Origem.ENTRADA_MANUAL.Valor;
        }
        if (valor == Origem.ENTRADA_NOTA.Codigo) {
            return Origem.ENTRADA_NOTA.Valor;
        }
        if (valor == Origem.SAIDA_MANUAL.Codigo) {
            return Origem.SAIDA_MANUAL.Valor;
        }
        if (valor == Origem.VENDA_PRODUTO.Codigo) {
            return Origem.VENDA_PRODUTO.Valor;
        }
        if (valor == Origem.CANCELAMENTO_VENDA.Codigo) {
            return Origem.CANCELAMENTO_VENDA.Valor;
        }
        if (valor == Origem.TRANSFERENCIA_ESTOQUE.Codigo) {
            return Origem.TRANSFERENCIA_ESTOQUE.Valor;
        }
        if (valor == Origem.CANCELAMENTO_NFE.Codigo) {
            return Origem.CANCELAMENTO_NFE.Valor;
        }
        if (valor == Origem.DEVOLUCAO_NFE.Codigo) {
            return Origem.DEVOLUCAO_NFE.Valor;
        }
        if (valor == Origem.CARGA_INICIAL.Codigo) {
            return Origem.CARGA_INICIAL.Valor;
        }
        if (valor == Origem.RETORNO_ATIVOGIRO.Codigo) {
            return Origem.RETORNO_ATIVOGIRO.Valor;
        }
        if (valor == Origem.CONSUMO_INTERNO.Codigo) {
          return Origem.CONSUMO_INTERNO.Valor;
        }
        if (valor == Origem.PERDA_QUEBRA_ROUBO.Codigo) {
          return Origem.PERDA_QUEBRA_ROUBO.Valor;
        }
        if (valor == Origem.CANCELAMENTO_CONSUMO_INTERNO.Codigo) {
          return Origem.CANCELAMENTO_CONSUMO_INTERNO.Valor;
        }
        if (valor == Origem.CANCELAMENTO_PERDA_QUEBRA_ROUBO.Codigo) {
          return Origem.CANCELAMENTO_PERDA_QUEBRA_ROUBO.Valor;
        }

        return '';
    }

    editarEstoqueProduto(id, tipo): void {
        this.estoqueEdicao = null;
        this.urlImageProdutoEdicao = '';
        this.sourceEstoqueEdicaoMovimentacao = [];
        this.listEstoqueEdicaoMovimentacao = [];
        this.estoqueEdicaoTipo = tipo;

        this.estoqueEdicao = { ...this.dataList.find(e => e.Id == id) };
        this.isLoadingMovimentacao = true;
        this.estoqueService.getMovimentacaoAtivoGiroEstoqueExterno(id)
            .subscribe(data => {
                this.sourceEstoqueEdicaoMovimentacao = data;
                this.listEstoqueEdicaoMovimentacao = this.sourceEstoqueEdicaoMovimentacao;
                this.isLoadingMovimentacao = false;
            }, (this.handleServerError));


        this.urlImageProdutoEdicao = this.produtoService.getAtivoGiroImageURL(this.estoqueEdicao.Item.Id);
        this.modalEditar.open();
    }

    fecharEdicaoEstoque(): void {
        this.estoqueEdicao = null;
        this.urlImageProdutoEdicao = '';
        this.sourceEstoqueEdicaoMovimentacao = [];
        this.listEstoqueEdicaoMovimentacao = [];
        this.modalEditar.close();
    }

    goBack(): void {
        this.route.navigate(['estoque']);
    }

    private filter(searchText): void {
        if (searchText) {
            searchText = searchText.toLowerCase();
        } else {
            searchText = '';
        }

        this.dataList = this.ativosGiro.filter((e: any) => {
            let found = false;

            let codigo = e.Item.Codigo;
            if (!codigo) {
                codigo = '';
            }
            let nome = e.Item.Nome;
            if (!nome) {
                nome = '';
            }
            if (searchText != '' && (codigo.toString().toLowerCase().indexOf(searchText) > -1
                || nome.toLowerCase().indexOf(searchText) > -1)) {
                found = true;
            }

            return (found || searchText == '');
        });
    }

    private handleServerError(error: GenericResponse): void {
        this.isLoading = false;
        if (error.message) {
            this.toastService.errorNotification('', 'Falha ao carregar informações. ' + error.message);
        } else {
            this.toastService.errorNotification('', 'Falha ao carregar informações');
        }
    }
}
