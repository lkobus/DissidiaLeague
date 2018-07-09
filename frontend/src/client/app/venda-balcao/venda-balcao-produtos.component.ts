import { Component, OnInit, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgModel, NG_VALIDATORS, Validator, Validators, AbstractControl, Form, ValidatorFn } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Empresa, CaixaStatus, GenericResponse, InformacaoVenda, ProdutoVenda, VendaBalcaoTipoPagamento } from '../_model/index';
import { Produto } from './model/produto';
import { Carinho } from './model/carinho';
import { FormaPagamentoVendaBalcao } from '../configuracoes/model/configuracoes';
import { VendaBalcaoService } from './services/venda-balcao.service';
import { ProdutosService } from '../produtos/shared/produtos.service';
import { AlertService } from '../_services/alert.service';
import { ToastService } from '../_services/toast.service';
import { CaixaService } from '../_services/caixa.service';
import { SharedMaskModule } from '../shared-mask/shared-mask.module';
import { CondicaoPagamento } from './model/condicao-pagamento';
import { Modal } from 'ngx-modal';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';

import * as moment from 'moment';
import { EmpresaService } from '../_services/empresa.service';
import { Input } from '@angular/core/src/metadata/directives';
import { Observable } from 'rxjs/Observable';

@Component({
  moduleId: module.id,
  selector: 'venda-balcao-produtos',
  templateUrl: 'venda-balcao-produtos.component.html',
  styleUrls: []
})

export class VendaBalcaoProdutosComponent implements OnInit {

  dataPedido: string;

  @Output() searchChangeEmitter: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('busca') inputBuscaProduto: ElementRef;  
  @ViewChild('modalCpfNota') modalCpfNota: Modal;
  @ViewChild('inputCpfConsumidor') elCpfConsumidor: ElementRef;  
  
  busy: Promise<any>;
  isLoading: boolean;
  cpfConsumidor: string = '';
  produtos: Produto[];
  carrinho: Carinho = new Carinho;
  produtosTela: Produto[];
  empresa: Empresa;
  formasPagamento: FormaPagamentoVendaBalcao[] = [];
  selectedProduto: Produto;
  selectedFormaPagamento: FormaPagamentoVendaBalcao;
  isCervejaActive: boolean = true;
  isRefriActive: boolean = false;
  isOutrosActive: boolean = false;
  inputSearch: any = null;
  isDinheiro: boolean = true;

  templateLoading: string =
    '<div class="loading-overlay">' +
    '<img src="assets/logo-promax-blue.png" alt="logo Promax" width="123" height="15" class="img-loader" />'+
    '<div class="spinner">'+
    '<div class="bounce1"></div>'+
    '<div class="bounce2"></div>'+
    '<div class="bounce3"></div>'+
    '</div>'+
    '<h1 class="loading-venda">' +
    '{{message}}' +
    '</h1>' +
    '</div>';

  private searchUpdated: Subject<string> = new Subject<string>();

  constructor(
    private alertService: AlertService,
    private vendaBalcaoService: VendaBalcaoService,
    private produtosService: ProdutosService,
    private empresaService: EmpresaService,
    private caixaService: CaixaService,
    private toastService: ToastService,
    private decimalPipe: DecimalPipe,
    private router: Router
  ) {
    this.searchChangeEmitter = <any>this.searchUpdated.asObservable()
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(item => this.searchProduct(item, false));
  }

  ngOnInit(): void {
    this.dataPedido = moment().format('DD-MM-YYYY');
    this.getProdutos();
    this.getEmpresaConfig();
    this.getFormasPagamento();
    this.inputBuscaProduto.nativeElement.focus();
  }

  getProdutos(): void {
    this.isLoading = true;
    this.vendaBalcaoService
      .getProdutos()
      .then(produtos => this.produtos = produtos)
      .then(produtos => this.onFilter('CERVEJA'))
      .then(produtos => this.isLoading = false);
  }

  getFormasPagamento(): void {
    this.vendaBalcaoService
      .getFormasPagamento()
      .then(formasPagamento => {
        this.formasPagamento = formasPagamento;
        this.selectedFormaPagamento = formasPagamento[0];
        this.onSelectFormaPagamento(formasPagamento[0]);
      });
  }

  getEmpresaConfig() {
    this.empresaService.getEmpresaInfo()
      .subscribe((empresa) => {
        this.empresa = empresa;
        console.log('empresa => ' + JSON.stringify(this.empresa));
      });
  }

  onSelect(produto: Produto): void {
    this.selectedProduto = produto;
  }

  onSelectFormaPagamento(formaPagamento: FormaPagamentoVendaBalcao): void {
    this.selectedFormaPagamento = formaPagamento;
    if (this.selectedFormaPagamento.Descricao.toLocaleUpperCase() === 'DINHEIRO') {
      this.isDinheiro = true;
    } else {
      this.isDinheiro = false;
    }
    this.carrinho.condicaoPagamentoPrincipal.valorReceber = this.getTotal();
    this.carrinho.valorReceber = this.carrinho.condicaoPagamentoPrincipal.valorReceber;
    this.carrinho.condicaoPagamentoPrincipal.troco = 0.00;
    this.carrinho.condicaoPagamentoPrincipal.formaPagamento = this.selectedFormaPagamento;
    this.carrinho.condicoesPagamentosAdicionais = [];
  }

  getImagemProduto(produto: Produto) {
    return this.produtosService.getProdutoImageURL(produto.id);
  }

  cervejaActive(): void {
    this.isOutrosActive = false;
    this.isCervejaActive = true;
    this.isRefriActive = false;
  }

  refriActive(): void {
    this.isOutrosActive = false;
    this.isCervejaActive = false;
    this.isRefriActive = true;
  }

  outrosActive(): void {
    this.isOutrosActive = true;
    this.isCervejaActive = false;
    this.isRefriActive = false;
  }

  onFilter(filtro: string) {
    this.produtosTela = this.produtos.filter(function (produto) {
      var find = false;
      if (filtro === 'CERVEJA') {
        if (produto.tipoProduto.toUpperCase().indexOf(filtro) > -1) {
          find = true;
        }
      } else if (filtro === 'REFRI') {
        if (produto.tipoProduto.toUpperCase().indexOf(filtro) > -1) {
          find = true;
        }
      } else {
        if ((produto.tipoProduto.toUpperCase().indexOf('CERVEJA') <= -1) &&
          (produto.tipoProduto.toUpperCase().indexOf('REFRI') <= -1)) {
          find = true;
        }
      }
      return find;
    }).sort((a, b) => {
      if (a.quantidadeVendidaUltimosMeses > b.quantidadeVendidaUltimosMeses)  {
        return -1;
      } else if (a.quantidadeVendidaUltimosMeses < b.quantidadeVendidaUltimosMeses)  {
        return 1;
      }else {
        return 0;
      }
    });
  }

  setFiltroAtual(): void {
    if (this.isOutrosActive) {
      this.onFilter('OUTROS');
    } else if (this.isCervejaActive) {
      this.onFilter('CERVEJA');
    } else if (this.isRefriActive) {
      this.onFilter('REFRI');
    }
  }

  addProdutoCarinho(produto: Produto) {
    this.inputSearch = '';
    this.onSearchType(this.inputSearch);
    this.setFiltroAtual();
    this.carrinho.condicaoPagamentoPrincipal.troco = 0.00;

    var produtoJaAdicionado = false;
    this.carrinho.produtos.forEach(produtoCarinho => {
      if (produtoCarinho.id === produto.id) {
        produtoJaAdicionado = true;
        produtoCarinho.quantidade++;
      }
    });
    if (!produtoJaAdicionado) {
      var produtoAdicionar = produto;
      produtoAdicionar.quantidade = 1;
      produtoAdicionar.precoUnitario = Number(produtoAdicionar.precoUnitario.toFixed(2));
      produtoAdicionar.precoVenda = produtoAdicionar.precoUnitario;
      this.carrinho.produtos.push(produtoAdicionar);
    }
    this.carrinho.condicaoPagamentoPrincipal.valorReceber = this.getTotal();
    this.carrinho.valorReceber = this.carrinho.condicaoPagamentoPrincipal.valorReceber;
    this.refreshValores();
  }

  removeProdutoCarrinho(produto: Produto) {
    this.carrinho.produtos = this.carrinho.produtos.filter(p => p !== produto);
    this.carrinho.condicaoPagamentoPrincipal.valorReceber = this.getTotal();
    this.carrinho.valorReceber = this.carrinho.condicaoPagamentoPrincipal.valorReceber;
    this.refreshValores();
  }

  setFocusElement(idElemento: string) {
    document.getElementById(idElemento).focus();
  }

  searchProduct(searchText: string, adicionarCarinho: boolean) {
    var textoBusca = '';
    if (searchText) {
      textoBusca = searchText.toLowerCase();
    }
    if (searchText === '') {
      this.setFiltroAtual();
    } else {
      var foundByEAN = false;
      var produtosEncontrados = this.produtos.filter(function (produto) {
        var find = false;
        if (String(produto.codigo).indexOf(textoBusca) > -1) {
          find = true;
        } else if (produto.nome.toLowerCase().indexOf(textoBusca) > -1) {
          find = true;
        } else if (produto.codigoEAN === textoBusca) {
          foundByEAN = true;
          find = true;
        }
        return find;
      });
      if (produtosEncontrados.length === 1 && (adicionarCarinho || foundByEAN)) {
        this.addProdutoCarinho(produtosEncontrados[0]);
      } else {
        this.produtosTela = produtosEncontrados;
      }
    }
  }

  getTotalProduto(produto: Produto): number {
    var preco = Number(produto.precoVenda);
    return Number((Number(preco.toFixed(2)) * produto.quantidade).toFixed(2));
  }

  getTotal(): number {
    var amountTotal = 0;
    this.carrinho.produtos.forEach(produto => {
      if (produto.quantidade) {
        var preco = Number(produto.precoVenda);
        amountTotal += Number((Number(preco.toFixed(2)) * produto.quantidade).toFixed(2));
      }
    });
    return Number(amountTotal.toFixed(2));
  }

  addQuantidadeCarinho(index: number): void {
    var indexAux = this.carrinho.produtos.length - (index + 1);
    this.carrinho.condicaoPagamentoPrincipal.troco = 0.00;
    this.carrinho.produtos[indexAux].quantidade += 1;
    this.carrinho.condicaoPagamentoPrincipal.valorReceber = this.getTotal();
    this.carrinho.valorReceber = this.carrinho.condicaoPagamentoPrincipal.valorReceber;
    this.refreshValores();
  }

  subQuantidadeCarinho(index: number): void {
    var indexAux = this.carrinho.produtos.length - (index + 1);
    this.carrinho.condicaoPagamentoPrincipal.troco = 0.00;
    this.carrinho.produtos[indexAux].quantidade -= 1;
    this.removeItem(index);
    this.carrinho.condicaoPagamentoPrincipal.valorReceber = this.getTotal();
    this.carrinho.valorReceber = this.carrinho.condicaoPagamentoPrincipal.valorReceber;
    this.refreshValores();
  }

  removeItem(index: number): void {
    var indexAux = this.carrinho.produtos.length - (index + 1);
    this.carrinho.condicaoPagamentoPrincipal.troco = 0.00;
    if (this.carrinho.produtos[indexAux].quantidade < 0) {
      this.carrinho.produtos.splice(indexAux, 1);
    }
    this.carrinho.condicaoPagamentoPrincipal.valorReceber = this.getTotal();
    this.carrinho.valorReceber = this.carrinho.condicaoPagamentoPrincipal.valorReceber;
    this.refreshValores();
  }

  verificaDesconto(index: number): void {    
    var indexAux = this.carrinho.produtos.length - (index + 1);
    this.carrinho.produtos[indexAux].precoVenda = Number(this.carrinho.produtos[indexAux].precoVenda);
    this.carrinho.condicaoPagamentoPrincipal.valorReceber = this.getTotal();
    this.carrinho.valorReceber = this.carrinho.condicaoPagamentoPrincipal.valorReceber;

    return;
  }

  isTemDescontoInconsistente(index: number): boolean {    
    var retorno = false;
    if(this.isDescontoMaiorQuePermitido(index)) {
      retorno = true;
    }
    if(this.isPrecoMaiorQuePrecoOriginal(index)) {
      retorno = true;
    }
    return retorno;
  }

  isDescontoMaiorQuePermitido(index: number): boolean {
    var indexAux = this.carrinho.produtos.length - (index + 1);
    var retorno = false;

    if( (this.carrinho.produtos[indexAux].precoUnitario - this.carrinho.produtos[indexAux].precoVenda) >
      this.carrinho.produtos[indexAux].descontoPermitido) {
      retorno = true;
    }
    return retorno;
  }

  isPrecoMaiorQuePrecoOriginal(index: number): boolean {
    var retorno = false;

    /*if(this.carrinho.produtos[index].precoVenda > this.carrinho.produtos[index].precoUnitario) {
      retorno = true;
    }*/
    return retorno;
  }

  getDescontoUnitarioRealizado(index) {
    return (this.carrinho.produtos[index].precoUnitario - this.carrinho.produtos[index].precoVenda);
  }

  refreshValores(): void {
    this.carrinho.valorReceber = this.carrinho.condicaoPagamentoPrincipal.valorReceber;
    let valorRestante = this.getTotal() - this.carrinho.condicaoPagamentoPrincipal.valorReceber;
    this.carrinho.condicoesPagamentosAdicionais.forEach((cp, index) => {
      if (valorRestante > 0) {
        cp.valorReceber = Number((valorRestante / this.carrinho.condicoesPagamentosAdicionais.length).toFixed(2));

        if (index === (this.carrinho.condicoesPagamentosAdicionais.length - 1)) {
          let diff = this.getTotal() - (Number(this.carrinho.valorReceber) + Number(cp.valorReceber));
          cp.valorReceber += Number(diff.toFixed(2));
        }

        this.carrinho.valorReceber = Number((Number(this.carrinho.valorReceber) + Number(cp.valorReceber)).toFixed(2));
      } else {
        cp.valorReceber = 0.00;
      }
    });

    if (this.isDinheiro) {
      this.calcTroco();
    }
    let pagAdicDinheiro = this.carrinho.condicoesPagamentosAdicionais.filter(
      cp => cp.formaPagamento.Descricao.toLocaleUpperCase() === 'DINHEIRO')[0];
    if (pagAdicDinheiro) {
      this.calcTrocoPagAdicional(pagAdicDinheiro);
    }
  }

  refreshValoresPagAdicional(): void {
    this.carrinho.valorReceber = Number(this.carrinho.condicaoPagamentoPrincipal.valorReceber) + this.getTotalCondicoesPagamentosAdicionais();

    let pagAdicDinheiro = this.carrinho.condicoesPagamentosAdicionais.filter(cp => cp.formaPagamento.Descricao.toLocaleUpperCase() === 'DINHEIRO')[0];
    if (pagAdicDinheiro) {
      this.calcTrocoPagAdicional(pagAdicDinheiro);
    }
    if (this.isDinheiro) {
      this.calcTroco();
    }
  }

  calcTroco(): void {
    var valorTotalItens = this.getTotal();
    if (this.carrinho.valorReceber > valorTotalItens) {
      this.carrinho.condicaoPagamentoPrincipal.troco = Number((this.carrinho.valorReceber - valorTotalItens).toFixed(2));
    } else {
      this.carrinho.condicaoPagamentoPrincipal.troco = 0.00;
    }
  }

  calcTrocoPagAdicional(condicaoPagamentoAdicional: CondicaoPagamento): void {
    var valorTotalItens = this.getTotal();
    if (this.carrinho.valorReceber > valorTotalItens) {
      condicaoPagamentoAdicional.troco = Number((this.carrinho.valorReceber - valorTotalItens).toFixed(2));
    } else {
      condicaoPagamentoAdicional.troco = 0.00;
    }
  }

  isReadyToFinish(): boolean {
    var ready = true;

    if (this.getTotal() === 0.00) {
      ready = false;
    } else if (this.carrinho.valorReceber < this.getTotal()) {
      ready = false;
    } else if (this.getTotalCondicoesPagamentosNaoDinheiro() > this.getTotal()) {
      ready = false;
    }

    if (ready) {
      this.carrinho.produtos.forEach( (produto, index) => {
        if (this.isTemDescontoInconsistente(index)) {
          ready = false;
        }
      });
    }

    return ready;
  }
  submitted: boolean;
  fecharVenda(informouCpf: boolean, form: AbstractControl): void {
    
    if (form && form.valid == false && this.cpfConsumidor != null && this.cpfConsumidor != '' && this.cpfConsumidor != "") {
      console.log('Form is invalid');
      return;
    }

    this.submitted = informouCpf;

    this.modalCpfNota.close();
    if (informouCpf == false && this.empresa.PedeCpfBalcao == true) {
      this.modalCpfNota.open();
      Observable.of(true).delay(300)
      .subscribe(() => {
        this.cpfConsumidor = '';
        this.elCpfConsumidor.nativeElement.focus();
        this.elCpfConsumidor.nativeElement.value = '';
      });
    } else {
      this.addLancamentoVendaNoCaixa();
    } 
  }

  addLancamentoVendaNoCaixa(): void {
    let venda = new InformacaoVenda();
    venda.CpfConsumidor = this.cpfConsumidor;
    let pagamentos = this.getPagamentos();
    pagamentos.forEach(p => venda.AddFormaPagamento(new VendaBalcaoTipoPagamento(p.formaPagamento.Codigo, p.valorReceber)));
    this.carrinho.produtos.forEach( (produto, index) => venda.AddProduto(
      new ProdutoVenda(produto.id,
                       produto.quantidade,
                       Number(produto.precoVenda.toFixed(2)),
                       Number(this.getDescontoUnitarioRealizado(index).toFixed(2))
                      )
    ));

    this.busy = this.caixaService.VenderItemPelaData(venda, this.dataPedido).toPromise()
      .then(data => {
        this.toastService.sucessNotification('', 'Venda gerada com sucesso!');
        this.PreparaNovaVenda();
      })
      .catch(error => {
        this.PreparaNovaVenda();
      });
  }

  addCondicaoPagamentoAdicional(): void {
    let formasPagamentoAdicionais = this.getFormaPagamentosAdicionais(null);
    if (formasPagamentoAdicionais.length > 0) {
      let newCondicao = new CondicaoPagamento;
      newCondicao.formaPagamento = formasPagamentoAdicionais[0];
      this.carrinho.condicoesPagamentosAdicionais.push(newCondicao);
      if (this.carrinho.condicoesPagamentosAdicionais.length === 1) {
        this.refreshValores();
      }
    }
  }

  removeCondicaoPagamentoAdicional(condicaoPagamentoAdicional: CondicaoPagamento): void {
    this.carrinho.condicoesPagamentosAdicionais = this.carrinho.condicoesPagamentosAdicionais.
      filter(cpa => cpa != condicaoPagamentoAdicional);
    if (this.carrinho.condicoesPagamentosAdicionais.length === 0) {
      this.carrinho.condicaoPagamentoPrincipal.valorReceber = this.getTotal();
    }
    this.refreshValores();
  }

  getTotalCondicoesPagamentosAdicionais(): number {
    let result = 0;
    this.carrinho.condicoesPagamentosAdicionais.forEach(cp => result += Number(cp.valorReceber));
    return Number(result.toFixed(2));
  }

  getTotalCondicoesPagamentosNaoDinheiro(): number {
    let result = 0;
    try {
      var descricao = this.carrinho.condicaoPagamentoPrincipal.formaPagamento.Descricao.toLocaleUpperCase();

      if (this.carrinho.condicaoPagamentoPrincipal.formaPagamento.Descricao.toLocaleUpperCase() !== 'DINHEIRO') {
        result += Number(this.carrinho.condicaoPagamentoPrincipal.valorReceber);
      }

      this.carrinho.condicoesPagamentosAdicionais
        .filter(cp => cp.formaPagamento.Descricao.toLocaleUpperCase() !== 'DINHEIRO')
        .forEach(cp => result += Number(cp.valorReceber));
    } catch(error) {}

    return Number(result.toFixed(2));
  }

  getPagamentos(): CondicaoPagamento[] {
    let result = [];

    result.push(this.carrinho.condicaoPagamentoPrincipal);
    if (result[0].formaPagamento.Descricao.toLocaleUpperCase() === 'DINHEIRO') {
      result[0].valorReceber -= result[0].troco;
      result[0].troco = 0.00;
    }

    this.carrinho.condicoesPagamentosAdicionais.forEach(cp => {
      if (cp.formaPagamento.Descricao.toLocaleUpperCase() === 'DINHEIRO') {
        cp.valorReceber -= cp.troco;
        cp.troco = 0.00;
      }
      result.push(cp);
    });

    return result.filter(cp => cp.valorReceber);
  }

  getFormaPagamentosAdicionais(formaPagamentoAdicional: FormaPagamentoVendaBalcao): FormaPagamentoVendaBalcao[] {
    return this.formasPagamento.filter(fp => {
      return fp != this.selectedFormaPagamento &&
        (!this.carrinho.condicoesPagamentosAdicionais.some(cp => cp.formaPagamento == fp) || fp == formaPagamentoAdicional);
    });
  }

  onChangeFormaPagamentoAdicional(index: number, codigoFormaPag: number): void {
    this.carrinho.condicoesPagamentosAdicionais[index].formaPagamento = this.formasPagamento.filter(fp => fp.Codigo == codigoFormaPag)[0];
  }

  private PreparaNovaVenda() {
    this.submitted = false;
    this.cpfConsumidor = null;
    this.carrinho = new Carinho;
    this.cervejaActive();
    this.selectedProduto = null;
    this.selectedFormaPagamento = this.formasPagamento[0];
    this.carrinho.condicaoPagamentoPrincipal.formaPagamento = this.selectedFormaPagamento;
    this.carrinho.condicoesPagamentosAdicionais = [];
    this.inputSearch = '';
    this.isDinheiro = true;
    this.setFiltroAtual();
    this.inputBuscaProduto.nativeElement.focus();
  }

  private handleError(error: GenericResponse) {
    if (error.message) {
      this.alertService.error(error.message);
    }

    window.scrollTo(0, 0);
  }

  private onSearchType(value: string) {
    console.log(value);
    this.searchUpdated.next(value);
  }
}

