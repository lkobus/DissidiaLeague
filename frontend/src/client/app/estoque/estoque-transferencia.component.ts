import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ToastService } from '../_services/toast.service';

import { Subject } from 'rxjs/Subject';

import { GenericResponse } from '../_model/index';
import { Estoque, EstoqueItem, TipoEstoqueItem } from './model/estoque';
import { EstoqueService } from './services/estoque.service';
import { Empresa } from '../_model/empresa';

@Component({
    moduleId: module.id,
    selector: 'estoque-transferencia',
    templateUrl: 'estoque-transferencia.component.html',
    styleUrls: []
})

export class EstoqueTransferenciaComponent implements OnInit {

    isLoading: boolean;
    quantidadeTransferir: number;

    origem: any;
    destino: any;

    estoqueBalcao: Estoque[] = [];
    estoqueExterno: Estoque[] = [];

    origemList: Estoque[] = [];
    origemSortingDesc: boolean = false;

    destinoList: Estoque[] = []
    destinoSortingDesc: boolean = false;

    inputSearchOrigem: any;
    inputSearchDestino: any;

    @Output() searchChangeEmitterOrigem: EventEmitter<any> = new EventEmitter<any>();
    searchUpdatedOrigem: Subject<string> = new Subject<string>();

    @Output() searchChangeEmitterDestino: EventEmitter<any> = new EventEmitter<any>();
    searchUpdatedDestino: Subject<string> = new Subject<string>();

    constructor(
        private estoqueService: EstoqueService,
        private toastService: ToastService,
        private route: Router
    ) {
        this.searchChangeEmitterOrigem = <any>this.searchUpdatedOrigem.asObservable()
            .debounceTime(500)
            .distinctUntilChanged()
            .subscribe(item => this.filterOrigem(item));

        this.searchChangeEmitterDestino = <any>this.searchUpdatedDestino.asObservable()
            .debounceTime(500)
            .distinctUntilChanged()
            .subscribe(item => this.filterDestino(item));
    }

    ngOnInit() {
        this.origem = 2;
        this.destino = 1;
        this.loadSource();
    }

    loadSource(): void {
        this.isLoading = true;
        this.estoqueService.getProdutosEstoqueBalcaoTransferencia()
            .then(data => {
                this.estoqueBalcao = data;
                return this.estoqueService.getProdutosEstoqueExternoTransferencia();
            })
            .then(data => {
                this.estoqueExterno = data;
                this.setEstoque();
                this.isLoading = false;
                return Promise.resolve(true);
            })
            .catch(this.handleServerError);
    }

    setEstoque(): void {
        this.inputSearchOrigem = '';
        this.inputSearchDestino = '';
        this.origemList = this.getOrigemEstoque();
        this.destinoList = this.getDestinoEstoque();
    }

    getOrigemEstoque(): Estoque[] {
        let result: Estoque[];
        if (this.origem == 1) {
            result = this.estoqueBalcao;
        } else {
            result = this.estoqueExterno;
        }
        return result.filter(e => e.Quantidade > 0);
    }

    getDestinoEstoque(): Estoque[] {
        if (this.destino == 1) {
            return this.estoqueBalcao;
        } else {
            return this.estoqueExterno;
        }
    }

    onChangeQuantidade(quantidade: any): void {
        this.quantidadeTransferir = quantidade;
    }

    transferirEstoque(produtoId: any) {
        if (!produtoId) {
            this.toastService.errorNotification("", "Produto inválido");
            return;
        }
        var produto = this.getOrigemEstoque().find(e => e.Item.Id == produtoId);
        if (this.quantidadeTransferir > produto.Quantidade) {
            this.toastService.errorNotification("", "Quantidade não disponível no estoque de origem");
            return;
        }
        if (!this.quantidadeTransferir || this.quantidadeTransferir < 1) {
            this.toastService.errorNotification("", "Quantidade inválida");
            return;
        }

        let quantidade = this.quantidadeTransferir;
        this.quantidadeTransferir = 0;
        if (this.origem == 1) {
            this.estoqueService.transferirProdutoBalcao(produtoId, quantidade)
                .then(response => {
                    this.toastService.sucessNotification("", "Transferência realizada com sucesso");
                    this.loadSource();
                })
                .catch(error => {
                    this.toastService.errorNotification("", error.message);
                    this.loadSource();
                });
        } else {
            this.estoqueService.transferirProdutoExterno(produtoId, quantidade)
                .then(response => {
                    this.toastService.sucessNotification("", "Transferência realizada com sucesso");
                    this.loadSource();
                })
                .catch(error => {
                    this.toastService.errorNotification("", error.message);
                    this.loadSource();
                });
        }
    }

    onChangeOrigem(value: any): void {
        if (value == 1) {
            this.origem = 1;
            this.destino = 2;
        } else {
            this.origem = 2;
            this.destino = 1;
        }
        this.setEstoque();
    }

    sortOrigem(property) {
        this.origemSortingDesc = !this.origemSortingDesc;
        let direction = this.origemSortingDesc ? 1 : -1;

        this.origemList = this.origemList.sort(function (a, b) {
            if (a[property] < b[property]) {
                return -1 * direction;
            } else if (a[property] > b[property]) {
                return 1 * direction;
            }
            return 0;
        });
    }

    sortOrigemItem(property) {
        this.origemSortingDesc = !this.origemSortingDesc;
        let direction = this.origemSortingDesc ? 1 : -1;

        this.origemList = this.origemList.sort(function (a, b) {
            if (a.Item[property] < b.Item[property]) {
                return -1 * direction;
            } else if (a.Item[property] > b.Item[property]) {
                return 1 * direction;
            }
            return 0;
        });
    }

    sortDestino(property) {
        this.destinoSortingDesc = !this.destinoSortingDesc;
        let direction = this.destinoSortingDesc ? 1 : -1;

        this.destinoList = this.destinoList.sort(function (a, b) {
            if (a[property] < b[property]) {
                return -1 * direction;
            } else if (a[property] > b[property]) {
                return 1 * direction;
            }
            return 0;
        });
    }

    sortDestinoItem(property) {
        this.destinoSortingDesc = !this.destinoSortingDesc;
        let direction = this.destinoSortingDesc ? 1 : -1;

        this.destinoList = this.destinoList.sort(function (a, b) {
            if (a.Item[property] < b.Item[property]) {
                return -1 * direction;
            } else if (a.Item[property] > b.Item[property]) {
                return 1 * direction;
            }
            return 0;
        });
    }

    filterOrigem(searchText): void {
        if (searchText) {
            searchText = searchText.toLowerCase();
        } else {
            searchText = '';
        }

        this.origemList = this.getOrigemEstoque().filter((e: any) => {
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

    filterDestino(searchText): void {
        if (searchText) {
            searchText = searchText.toLowerCase();
        } else {
            searchText = '';
        }

        this.destinoList = this.getDestinoEstoque().filter((e: any) => {
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

    inputSearchOrigemOnFilter(searchText: string): void {
        this.searchUpdatedOrigem.next(searchText);
    }

    inputSearchDestinoOnFilter(searchText: string): void {
        this.searchUpdatedDestino.next(searchText);
    }

    goBack(): void {
        this.route.navigate(['estoque']);
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