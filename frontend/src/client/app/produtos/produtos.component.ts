import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Produto } from './model/produto';
import { ProdutosService } from './shared/produtos.service';
import { PuxadaService } from '../puxada/services/puxada.service';
import { Subject } from 'rxjs/Subject';
import { Modal } from 'ngx-modal';
import { BaseTableComponent } from '../shared/table/base-table-component';

import { AppComponent } from '../app.component';

@Component({
    moduleId: module.id,
    selector: 'produtos',
    templateUrl: 'produtos.component.html',
    styleUrls: ['produtos.component.css']
})
export class ProdutosComponent extends BaseTableComponent implements OnInit {

    @Output() searchChangeEmitter: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('modalImportarProdutos') modalImportarProdutos: Modal;
    inputSearch: any = null;
    isLoading: boolean;
    produtos: Produto[];
    data: Produto[];
    selectedProduto: Produto;
    isDesc: boolean = false;
    currentFilter: string;
    direction: number;
    isParaActive: boolean = false;
    isBtnActive: boolean = false;
    viewMode: boolean = false;
    isImporting: boolean = false;
    fileHolder: any;
    private searchUpdated: Subject<string> = new Subject<string>();

    toggleClass() {
        this.isParaActive = !this.isParaActive;
        this.isBtnActive = !this.isBtnActive;
    }

    constructor(
        private appComponent: AppComponent,
        private produtoService: ProdutosService,
        private puxadaService: PuxadaService,
        private router: Router
    ) {
        super();
        this.searchChangeEmitter = <any>this.searchUpdated.asObservable()
            .debounceTime(500)
            .distinctUntilChanged()
            .subscribe(item => this.filter(item));
        this.currentFilter = 'none';
    }

    canAddProduto(): boolean {
        return true;
    }

    getProdutos(): void {
        this.isLoading = true;
        this.produtoService
            .getProdutosWithPrices()
            .then(produtos => { this.produtos = produtos; this.data = produtos; })
            .then(produtos => this.isLoading = false);
    }

    getImagemProduto(produto: Produto) {
        return this.produtoService.getProdutoImageURL(produto.id);
    }

    ngOnInit(): void {
        this.getProdutos();
    }

    onSelect(produto: Produto): void {
        this.selectedProduto = produto;
    }

    deleteProduct(produto: Produto): void {
        if (confirm('Excluir produto ' + produto.nome + '?')) {
            this.produtoService.deleteProduct(produto.id).then(() => {
                this.removeItem(produto.id);
            });
        }
    }

    detailsProduto(produto: Produto): void {
        this.router.navigate(['/updateProduto', produto.id]);
    }

    removeItem(id: string) {
        this.produtos.forEach((u: Produto, i: number) => {
            if (u.id == id) {
                this.produtos.splice(i, 1);
            }
        });
    }

    filter(searchText) {
        var textoBusca = '';
        if (searchText) {
            textoBusca = searchText.toLowerCase();
        }
        var filter = this.currentFilter;
        this.data = this.produtos.filter(function (produto) {
            var find = false;

            var matchFilter = false;
            if (produto.nome.toLowerCase().indexOf(textoBusca) > -1) {
                find = true;
            } else if (produto.codigo.toString().toLowerCase() === textoBusca) {
                find = true;
            } else if (String(produto.codigoEAN) === textoBusca) {
                find = true;
            }
            if (!filter.match('none')) {
                if (filter.toLowerCase().match('-cerveja-')) {
                    if (String(produto.tipo.toLowerCase()).indexOf('cerveja') > -1) {
                        matchFilter = true;
                    }
                } else if (filter.toLowerCase().match('-refrigerante-')) {
                    if (String(produto.tipo.toLowerCase()).indexOf('refrigerante') > -1) {
                        matchFilter = true;
                    }
                } else if (filter.toLowerCase().match('-promovido-')) {
                    if (String(produto.promovido).indexOf('true') > -1) {
                        matchFilter = true;
                    }
                } else if (filter.toLowerCase().match('-externo-')) {
                    if (String(produto.produtoExterno).indexOf('externo') > -1) {
                        matchFilter = true;
                    }
                } else if (filter.toLowerCase().match('-franquia-')) {
                    if (String(produto.produtoExterno).indexOf('franquia') > -1) {
                        matchFilter = true;
                    }
                } else if (filter.toLowerCase().match('-outros-')) {
                    if ((produto.tipo.toLowerCase().indexOf('cerveja') <= -1) &&
                        (produto.tipo.toLowerCase().indexOf('refri') <= -1)) {
                            matchFilter = true;
                    }
                }

                if (matchFilter && textoBusca === '') {
                    find = true;
                } else if (!matchFilter) {
                    find = false;
                }
            }
            return find;
        });
    }

    onChangeFilter(value) {
        if (value.toLowerCase().match('filtrar...')) {
            this.currentFilter = 'none';
        }
        if (value.toLowerCase().match('produto')) {
            if (value.toLowerCase().match('promovido')) {
                this.currentFilter = '-promovido-';
            } else if (value.toLowerCase().match('externo')) {
                this.currentFilter = '-externo-';
            } else if (value.toLowerCase().match('franquia')) {
                this.currentFilter = '-franquia-';
            }
        }
        if (value.toLowerCase().match('cerveja')) {
            this.currentFilter = '-cerveja-';
        }
        if (value.toLowerCase().match('refri')) {
            this.currentFilter = '-refrigerante-';
        }
        if (value.toLowerCase().match('outros')) {
            this.currentFilter = '-outros-'
        }

        this.filter(this.inputSearch);
    }

    uploadCSV(event: any): void {
        this.fileHolder = event;
    }

    onUploadFinished(event: any): void {
        console.log('opa 2');
    }

    importCSV(): void {
        if (this.fileHolder !== undefined) {
            this.isImporting = true;
            this.produtoService.uploadCSVTributacao(this.fileHolder)
                .then(() => {
                    this.isImporting = false;
                    var modal = this.modalImportarProdutos;
                    modal.close();
                }).catch(error => {
                    this.isImporting = false;
                    var modal = this.modalImportarProdutos;
                    modal.close();
                });
        }
    }

    private onSearchType(value: string) {
        console.log(value);
        this.searchUpdated.next(value); // Emit the event to all listeners that signed up - we will sign up in our contractor
    }

    private solicitarPuxada(): void {
        this.puxadaService.solicitarPuxada();
    }

}
