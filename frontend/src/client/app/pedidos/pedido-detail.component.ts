import { Component, OnInit, EventEmitter, Output, ViewChild, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ToastService } from '../_services/toast.service';
import { GenericResponse } from '../_model/index';
import { PedidoService } from './services/pedido.service';
import { ClienteService } from '../_services/cliente.service';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import * as moment from 'moment';
import { Observable } from 'rxjs/Rx';

import { Pedido, Produto, Pessoa, ItemComodato } from './model/pedido';
import { ProdutoEdicao } from './model/produto-edicao';
import { Cliente } from './../clientes/model/cliente';
import { FormaPagamentoCliente } from '../_model/formaPagametoCliente';

import { Subject } from 'rxjs/Subject';

@Component({
    moduleId: module.id,
    selector: 'resumoPedido',
    templateUrl: 'pedido-detail.component.html',
    styleUrls: ['pedido-detail.component.css']
})
export class PedidoDetailComponent implements OnInit {

    isLoading: boolean = false;
    isInserting: boolean = false;
    allowEdit: boolean = false;
    allowCancel: boolean = false;

    pedido: Pedido = new Pedido;
    dataVencimentoPag: any = null;

    listClientes: Cliente[] = [];
    sourceClientes: Cliente[] = [];

    sourceProdutos: ProdutoEdicao[] = [];
    listProdutos: ProdutoEdicao[] = [];

    listFormasPagamento: FormaPagamentoCliente[] = [];

    @ViewChildren("inputProdutoSearch") vcInputSearch;
    @Output() searchChangeEmitter: EventEmitter<any> = new EventEmitter<any>();
    searchUpdated: Subject<string> = new Subject<string>();
    inputSearch: string;

    @ViewChildren("inputClienteSearch") vcInputClientSearch;
    @Output() searchChangeEmitterCliente: EventEmitter<any> = new EventEmitter<any>();
    searchClienteUpdated: Subject<string> = new Subject<string>();
    inputSearchCliente: string;

    public myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'dd/mm/yyyy',
        yearSelector: false,
        dayLabels: {
            su: 'Dom', mo: 'Seg', tu: 'Ter', we: 'Qua', th: 'Qui',
            fr: 'Sex', sa: 'Sab'
        },
        monthLabels: {
            1: 'Jan', 2: 'Fev', 3: 'Mar', 4: 'Abr', 5: 'Mar', 6: 'Jun', 7: 'Jul',
            8: 'Ago', 9: 'Set', 10: 'Out', 11: 'Nov', 12: 'Dez'
        },
        showClearDateBtn: false,
        disableWeekdays: []
    };

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private toastService: ToastService,
        private pedidoService: PedidoService,
        private clienteService: ClienteService
    ) {
        this.searchChangeEmitter = <any>this.searchUpdated.asObservable()
            .debounceTime(300)
            .distinctUntilChanged()
            .subscribe(item => this.searchProduto(item));

        this.searchChangeEmitterCliente = <any>this.searchClienteUpdated.asObservable()
            .debounceTime(300)
            .distinctUntilChanged()
            .subscribe(item => this.searchCliente(item));
    }

    ngOnInit() {
        this.activatedRoute.paramMap
            .switchMap((params: ParamMap) => {
                if (params.get('id')) {
                    let sucess = params.get('sucess');
                    if (sucess === 'ok') {
                        this.toastService.sucessNotification('', 'Pedido realizado com sucesso');
                    }
                    return Observable.of(false);
                } else {
                    return Observable.of(true);
                }
            })
            .flatMap(inserting => {
                this.isInserting = inserting;
                if (this.isInserting) {
                    this.allowEdit = true;
                    this.loadSourcesForInsert();
                } else {
                    this.loadSourcesForEdit();
                }
                return Promise.resolve();
            })
            .subscribe();
    }


    loadSourcesForEdit(): any {
        this.isLoading = true;
        this.activatedRoute.paramMap
            .switchMap((params: ParamMap) => {
                let id = params.get('id');
                return this.pedidoService.getPedidoResumo(id);
            })
            .flatMap(data => {
                this.isLoading = false;
                this.setPedido(data)
                this.loadProdutos();
                return Observable.of(true);
            })
            .catch(error => {
                this.isLoading = false;
                this.handleServerError(error);
                return Observable.of(new Pedido);
            })
            .subscribe();
    }

    loadSourcesForInsert(): any {
        this.isLoading = true;
        return this.clienteService.getAllClientes().toPromise()
            .then(data => {
                this.sourceClientes = data;
                this.isLoading = false;
            })
            .catch(error => {
                this.isLoading = false;
                this.handleServerError(error);
            })
    }

    loadProdutos(): Promise<any> {
        return this.pedidoService.getProdutosComPrecoPorSegmento(this.pedido.Cliente.Id)
            .toPromise()
            .then(data => {
                this.sourceProdutos = [];
                data.forEach(d => {
                    let produto = new ProdutoEdicao(d.Id, d.Codigo, d.CodigoEAN, d.Nome, d.FatorConversao,
                        d.Preco, d.Preco, d.DescontoMaximoPermitido, d.PrecoMinimoPermitido, 1);
                    this.sourceProdutos.push(produto);
                });
            })
            .catch(error => {
                this.isLoading = false;
                this.handleServerError(error);
            })
    }

    setPedido(pedido: Pedido): void {
        this.pedido = pedido;
        if (this.pedido.Id) {
            this.allowEdit = !this.pedido.MapaCodigo && (this.pedido.StatusCodigo == 2 || this.pedido.StatusCodigo == 7);
            this.allowCancel = this.allowEdit || this.pedido.StatusCodigo == 9 || this.pedido.StatusCodigo == 13;
            if (this.allowEdit && this.pedido.AlertDetail) {
                this.toastService.errorNotification("Atenção", this.pedido.AlertDetail);
            }
        }
    }

    removerProduto(produtoId: string): void {
        this.pedido.Produtos = this.pedido.Produtos.filter(p => p.Id != produtoId);
        this.calcTotalPedido();
    }

    incProdutoQuantidade(produto: Produto): void {
        produto.Quantidade = Number(produto.Quantidade) + 1;
        this.onChangeProduto(produto)
    }

    decProdutoQuantidade(produto: Produto): void {
        if (produto.Quantidade > 1) {
            produto.Quantidade = Number(produto.Quantidade) - 1;
            this.onChangeProduto(produto);
        }
    }

    onChangeProduto(produto: Produto): void {
        if (produto.Quantidade < 1) {
            produto.Quantidade = 1;
        }

        var prodPreco = this.sourceProdutos.find(p => p.Id == produto.Id);
        if (produto.ValorUnidade < 0) {
            produto.ValorUnidade = prodPreco.Preco;
            this.toastService.errorNotification("Atenção", "Valor informado inválido");
        }
        if (produto.ValorUnidade < prodPreco.PrecoMinimoPermitido) {
            produto.ValorUnidade = prodPreco.Preco;
            this.toastService.errorNotification("Atenção", "Valor desse produto não pode ser menor que " +
                this.formatCurrency(prodPreco.PrecoMinimoPermitido) + ". Desconto máximo permitido: " +
                this.formatCurrency(prodPreco.DescontoMaximoPermitido));
        }

        produto.ValorUnitario = Number(produto.ValorUnidade / prodPreco.FatorConversao);
        produto.ValorDesconto = produto.ValorUnidade > prodPreco.Preco ? 0 : prodPreco.Preco - produto.ValorUnidade;
        produto.ValorTotal = produto.ValorUnidade * produto.Quantidade;
        produto.ValorTotalDesconto = produto.ValorDesconto * produto.Quantidade;
        produto.Alert = produto.Quantidade > produto.Estoque ? produto.Alert | 4 : produto.Alert & 3;
        this.calcTotalPedido();
    }

    calcTotalPedido(): void {
        let total: number = 0;
        let totalDesconto: number = 0;
        this.pedido.Produtos.forEach(produto => {
            total += produto.ValorTotal;
            totalDesconto += produto.ValorTotalDesconto;
        });
        this.pedido.Valor = total;
        this.pedido.Desconto = totalDesconto;
    }

    cancelarPedido(): void {
        this.isLoading = true;
        this.pedidoService.cancelarPedido(this.pedido.Id)
            .then(() => {
                return this.pedidoService.getPedidoResumo(this.pedido.Id);
            })
            .then(data => {
                this.isLoading = false;
                this.goBack();
            })
            .catch(error => {
                this.isLoading = false;
                this.handleServerError(error);
            })
    }

    salvar(): void {
        if (this.isInserting) {
            this.salvarInsercao();
        } else {
            this.salvarEdicao();
        }
    }

    salvarInsercao(): void {
        if (!this.pedido.Cliente.Id) {
            this.toastService.errorNotification("Atenção", "Informe um cliente");
            return;
        }

        if (!this.pedido.FormaPagamentoCodigo) {
            this.toastService.errorNotification("Atenção", "Informe uma forma de pagamento");
            return;
        }

        if (!this.dataVencimentoPag) {
            this.toastService.errorNotification("Atenção", "Para a forma de pagamento selecionada é necessário informar uma data de vencimento");
            return;
        }

        if (this.pedido.Produtos.length < 1) {
            this.toastService.errorNotification("Atenção", "Nenhum produto informado");
            return;
        }

        this.pedido.VencimentoPagamento = this.dataVencimentoPag.year + "-" + this.dataVencimentoPag.month + "-" + this.dataVencimentoPag.day;
        this.isLoading = true;
        this.pedidoService.solicitarPedido(this.pedido)
            .then(data => {
                this.router.navigateByUrl('/pedidoResumo/' + data.Id + "/ok");
            })
            .catch(error => {
                this.isLoading = false;
                this.handleServerError(error);
            })
    }

    salvarEdicao(): void {
        if (this.allowEdit) {
            if (this.pedido.Produtos.length < 1) {
                this.toastService.errorNotification("Atenção", "Nenhum produto informado");
                return;
            }

            let produtos = this.pedido.Produtos.filter(p => !Number(p.ValorUnidade));
            if (produtos.length > 0) {
                this.toastService.errorNotification("Atenção", "Informe um valor válido para o produto " +
                    produtos[0].Codigo + " - " + produtos[0].Nome);
                return;
            }

            produtos = this.pedido.Produtos.filter(p => !Number(p.Quantidade));
            if (produtos.length > 0) {
                this.toastService.errorNotification("Atenção", "Informe uma quantidade válida para o produto " +
                    produtos[0].Codigo + " - " + produtos[0].Nome);
                return;
            }

            this.isLoading = true;
            this.pedidoService.alterarPedido(this.pedido)
                .then(() => {
                    this.isLoading = false;
                    this.goBack();
                })
                .catch(error => {
                    this.isLoading = false;
                    this.handleServerError(error);
                });
        }
    }

    incQuantidade(produto: Produto): void {
        produto.Quantidade = Number(produto.Quantidade) + 1;
    }

    decQuantidade(produto: Produto): void {
        produto.Quantidade = Number(produto.Quantidade);
        if (produto.Quantidade > 0) {
            produto.Quantidade -= 1;
        }
    }

    addProdutoEdicao(produto: ProdutoEdicao): void {
        if (!produto.PrecoVenda || produto.PrecoVenda <= 0) {
            this.toastService.errorNotification("Atenção", "Valor informado inválido");
            return;
        }
        if (produto.PrecoVenda < produto.PrecoMinimoPermitido) {
            this.toastService.errorNotification("Atenção", "Valor desse produto não pode ser menor que " +
                this.formatCurrency(produto.PrecoMinimoPermitido) + ". Desconto máximo permitido: " +
                this.formatCurrency(produto.DescontoMaximoPermitido));
            return;
        }
        if (!produto.Quantidade || produto.Quantidade < 1) {
            this.toastService.errorNotification("Atenção", "Quantidade informada inválida");
            return;
        }

        this.isLoading = true;
        this.pedidoService.previewProdutoEdicao(this.pedido.Id, produto)
            .then(data => {
                this.isLoading = false;
                this.inputSearch = "";
                this.searchProduto("");
                this.pedido.Produtos.push(data);
                this.calcTotalPedido();
                this.vcInputSearch.first.nativeElement.focus();
            })
            .catch(error => {
                this.isLoading = false;
                this.inputSearch = "";
                this.searchProduto("");
                this.handleServerError(error);
            })
    }

    searchProduto(searchText: string) {
        if (searchText == '') {
            this.listProdutos = []
        } else {
            searchText = searchText.toLocaleLowerCase();
            this.listProdutos = this.sourceProdutos.filter(p => {
                let result = false;

                if (p.Codigo.toString().indexOf(searchText) > -1) {
                    result = true;
                } else if (p.Nome.toLowerCase().indexOf(searchText) > -1) {
                    result = true;
                } else if (p.CodigoEAN == searchText) {
                    result = true;
                }

                if (result) {
                    result = this.pedido.Produtos.find(i => i.Codigo == p.Codigo) == null;
                }

                return result;
            });
        }
    }

    searchCliente(searchText: string) {
        if (searchText == '') {
            this.listClientes = []
        } else {
            searchText = searchText.toLocaleLowerCase();
            this.listClientes = this.sourceClientes.filter((c: Cliente) => {
                let result = false;

                if (c.CnpjCpf && c.CnpjCpf.toString().indexOf(searchText) > -1) {
                    result = true;
                } else if (c.NomeFantasia && c.NomeFantasia.toLowerCase().indexOf(searchText) > -1) {
                    result = true;
                }

                return result;
            });
        }
    }

    onSearchType(value: string) {
        this.searchUpdated.next(value);
    }

    onSearchTypeCliente(value: string) {
        this.searchClienteUpdated.next(value);
    }

    onSelectCliente(cliente: Cliente) {
        this.pedido.Cliente.Id = cliente.Id;
        this.pedido.Cliente.Nome = cliente.NomeFantasia;

        this.listFormasPagamento = [];
        cliente.FormasPagamento.forEach(fp => {
            this.listFormasPagamento.push(new FormaPagamentoCliente(fp.Codigo, fp.Descricao,
                fp.PrazoMaximo))
        });

        this.inputSearchCliente = "";
        this.searchCliente("");

        this.isLoading = true;
        this.loadProdutos()
            .then(_ => { this.isLoading = false; })
            .catch(error => {
                this.isLoading = true;
                this.handleServerError(error);
            })
    }

    onClearClienteSelected() {
        this.listFormasPagamento = [];
        this.pedido.FormaPagamentoCodigo = 0;
        this.pedido.Cliente = new Pessoa;
        this.pedido.Produtos = [];
    }

    onChangeFormaPagamento(codigo: number) {
        var formaPag = this.listFormasPagamento.find(fp => fp.Codigo == codigo);
        if (formaPag) {
            let dataVenc = new Date;

            if (formaPag.Codigo != 1) {
                dataVenc.setDate(dataVenc.getDate() + formaPag.PrazoMaximo);
                let dataMin = new Date;
                dataMin.setDate(dataMin.getDate() - 1);
                let dataMax = new Date(dataVenc.getFullYear(), dataVenc.getMonth(), dataVenc.getDate());
                dataMax.setDate(dataMax.getDate() + 1);

                let copy = this.getCopyOfDatePickerOptions();
                copy.disableUntil = {
                    year: dataMin.getFullYear(),
                    month: dataMin.getMonth() + 1,
                    day: dataMin.getDate()
                }
                copy.disableSince = {
                    year: dataMax.getFullYear(),
                    month: dataMax.getMonth() + 1,
                    day: dataMax.getDate()
                };
                this.myDatePickerOptions = copy;
            }

            this.dataVencimentoPag = {
                year: dataVenc.getFullYear(),
                month: dataVenc.getMonth() + 1,
                day: dataVenc.getDate()
            };
        }
    }

    onChangeDataVencimento(event: IMyDateModel) {
        this.dataVencimentoPag = {
            year: event.date.year,
            month: event.date.month,
            day: event.date.day
        };
    }

    getCopyOfDatePickerOptions(): IMyDpOptions {
        return JSON.parse(JSON.stringify(this.myDatePickerOptions));
    }

    quickAddProduto() {
        if (this.listProdutos[0]) {
            this.addProdutoEdicao(this.listProdutos[0])
        }
    }

    quickAddCliente() {
        if (this.listClientes[0]) {
            this.onSelectCliente(this.listClientes[0])
        }
    }

    getProdutoImageURL(pedidoId: string): string {
        return this.pedidoService.getProdutoImageURL(pedidoId);
    }

    getStateClassMapa(mapaStatusCodigo: number): string {
        if (mapaStatusCodigo == 2 || mapaStatusCodigo == 4) {
            return 'c-ok';
        }
        return 'c-warning';
    }

    goBack(): void {
        this.toastService.clearAllNotifications();
        this.router.navigate(['pedidos']);
    }

    formatCurrency(value: number): string {
        var formatter = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2
        });

        return formatter.format(value);
    }

    private handleServerError(error: GenericResponse): void {
        if (error.message) {
            this.toastService.errorNotification('', error.message);
        } else {
            this.toastService.errorNotification('', 'Falha ocorrida');
        }
    }
}
