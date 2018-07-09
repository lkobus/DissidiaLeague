import { Component, OnInit, EventEmitter, Output, ViewChild, ViewChildren } from '@angular/core';
import { ToastService } from '../_services/toast.service';
import { GenericResponse } from '../_model/index';
import { EstoqueService } from './../estoque/services/estoque.service';
import { ProdutosService } from './../produtos/shared/produtos.service';
import { NotaFiscalService } from './services/nota-fiscal.service';
import { Estoque } from './../estoque/model/estoque';
import { NotaFiscal, Item } from './model/nota-fiscal';
import { ProdutoEntrada } from './model/produto-entrada';
import { Produto } from './../produtos/model/produto';
import { Empresa } from '../_model/empresa';
import { FormaPagamentoEnum } from '../_model/forma-pagamento';
import { FormaPagamento } from '../financas/model/forma-pagamento';
import { FinanceiroService } from '../financas/services/financas.service';

import { ImageUploadComponent } from '../angular2-image-upload/src/image-upload/image-upload.component';

import { Modal } from 'ngx-modal';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import * as moment from 'moment';

@Component({
  moduleId: module.id,
  selector: 'entrada-nota',
  templateUrl: 'entrada-nota.component.html'
})

export class EntradaNotaComponent implements OnInit {

  @ViewChild(ImageUploadComponent)
  private uploadComponent: ImageUploadComponent;

  public selectedDataVencimento = moment().format('DD/MM/YYYY');
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
    dayLabels: {
      su: 'Dom', mo: 'Seg', tu: 'Ter', we: 'Qua', th: 'Qui',
      fr: 'Sex', sa: 'Sab'
    },
    monthLabels: {
      1: 'Jan', 2: 'Fev', 3: 'Mar', 4: 'Abr', 5: 'Mar', 6: 'Jun', 7: 'Jul',
      8: 'Ago', 9: 'Set', 10: 'Out', 11: 'Nov', 12: 'Dez'
    },
    yearSelector: true,
    monthSelector: true,
    showClearDateBtn: false,
    markCurrentDay: true,
    showTodayBtn: false,
    markCurrentMonth: true,
    markCurrentYear: true,
    alignSelectorRight: true,
    disableHeaderButtons: false,
    showDecreaseDateBtn: true,
    showIncreaseDateBtn: true
  };

  isLoading: boolean = false;
  isImporting: boolean = false;

  fileHolder: any;

  importacaoManual: boolean = true;
  sourceProdutos: ProdutoEntrada[] = [];
  listProdutos: ProdutoEntrada[] = [];
  notaPreview: NotaFiscal;
  listaPagamentos: FormaPagamentoEnum[] = [];

  valor: number;
  desconto: number;
  quantidade: number;

  @Output() searchChangeEmitter: EventEmitter<any> = new EventEmitter<any>();
  searchUpdated: Subject<string> = new Subject<string>();
  inputSearch: string;

  @ViewChildren('inputProductSearch') vcInputSearch;

  constructor(
    private toastService: ToastService,
    private estoqueService: EstoqueService,
    private notaFiscalService: NotaFiscalService,
    private produtoService: ProdutosService
  ) {
    this.notaPreview = new NotaFiscal;
    this.searchChangeEmitter = <any>this.searchUpdated.asObservable()
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(item => this.searchProduto(item));
  }

  ngOnInit() {
    this.carregaFormasPagamentosDisponiveis();
    this.loadSources();
  }

  carregaFormasPagamentosDisponiveis() {
    this.listaPagamentos = [];
    this.listaPagamentos.push(FormaPagamentoEnum.BOLETO);
    this.listaPagamentos.push(FormaPagamentoEnum.DINHEIRO);
  }

  loadSources(): void {
    this.isLoading = true;
    this.produtoService.getProdutos()
      .then(data => {
        data.forEach(d => {
          let produto = new ProdutoEntrada;
          produto.Id = d.id;
          produto.Codigo = d.codigo;
          produto.Nome = d.nome;
          produto.CodigoEAN = d.codigoEAN;
          this.sourceProdutos.push(produto);
        });
        this.isLoading = false;
      });
  }

  GetFormaPagamentoDescricao(notaPreview: NotaFiscal) {
    if (notaPreview.Pagamento.Tipo) {
      return FormaPagamentoEnum.From(notaPreview.Pagamento.Tipo).descricao + ' ( R$' + notaPreview.Pagamento.Valor.toFixed(2) + ' )';
    }
    return '';
  }

  uploadXml(event: any): void {
    this.fileHolder = event;
    this.previewXmlEntrada();
  }

  removeXml(event: any): void {
    this.fileHolder = null;
    this.notaPreview = new NotaFiscal;
    this.importacaoManual = true;
  }

  efetuarEntradaXml() {
    this.isImporting = true;
    if (this.notaPreview) {
      var file = null;
      if (this.fileHolder) {
        file = this.fileHolder.file;
      }

      if (this.notaPreview.Pagamento.Valor <= 0) {
        this.notaPreview.Pagamento.Valor = this.notaPreview.Totais.vNF;
      }

      this.notaFiscalService.efetuarEntradaNotaFiscal(this.notaPreview, file)
        .then(data => {
          this.isImporting = false;
          this.notaPreview = new NotaFiscal;
          this.toastService.sucessNotification('', 'Nota fiscal importada com sucesso');
        })
        .catch(error => {
          this.isImporting = false;
          this.handleServerError(error);
        });
    }
  }

  previewXmlEntrada(): void {
    if (this.fileHolder) {
      this.isImporting = true;
      this.importacaoManual = true;
      this.notaFiscalService.previewXmlEntrada(this.fileHolder.file)
        .then(data => {
          this.isImporting = false;
          this.importacaoManual = false;
          this.notaPreview = data;
          this.selectedDataVencimento = moment(data.Pagamento.Vencimento).format('DD/MM/YYYY');;
        })
        .catch(error => {
          this.isImporting = false;
          this.handleServerError(error);
        });
    }
  }

  getImagemProdutoUrl(imageUri: string): any {
    return this.produtoService.BasePath() + imageUri;
  }

  onSearchType(value: string) {
    this.searchUpdated.next(value);
  }

  searchProduto(searchText: string) {
    if (searchText == '') {
      this.listProdutos = [];
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
          result = this.notaPreview.Itens.find(i => i.CodigoProduto == p.Codigo) == null;
        }

        return result;
      });
    }
  }

  onDataVencimentoChanged(event: IMyDateModel) {
    this.selectedDataVencimento = event.formatted;
    this.notaPreview.Pagamento.Vencimento = event.jsdate;
  }

  incQuantidade(produto: any): void {
    produto.Quantidade = Number(produto.Quantidade) + 1;
  }

  decQuantidade(produto: any): void {
    if (produto.Quantidade > 0) {
      produto.Quantidade = Number(produto.Quantidade) - 1;
    }
  }

  addProdutoEntrada(produto: ProdutoEntrada): void {
    if (!produto.Valor || produto.Valor <= 0) {
      this.toastService.errorNotification('', 'Valor inválido');
      return;
    }
    if (!produto.Quantidade || produto.Quantidade < 1) {
      this.toastService.errorNotification('', 'Quantidade inválida');
      return;
    }

    if (!produto.Desconto) {
      produto.Desconto = 0;
    }

    this.isLoading = true;
    this.notaFiscalService.previewProdutoEntrada(produto)
      .then(data => {
        this.isLoading = false;
        this.notaPreview.Itens.push(data);
        this.notaPreview.Totais.vNF = Number(this.notaPreview.Totais.vNF);
        this.notaPreview.Totais.vNF += data.Valores.ValorTotal;

        produto.Valor = null;
        produto.Desconto = null;
        produto.Quantidade = 0;
        this.inputSearch = '';
        this.searchProduto('');
        this.vcInputSearch.first.nativeElement.focus();
      })
      .catch(error => {
        this.isLoading = false;
        this.handleServerError(error);
      });
  }

  removeItem(item: Item): void {
    this.notaPreview.Totais.vNF -= item.Valores.ValorTotal;
    this.notaPreview.Itens = this.notaPreview.Itens.filter(i => i.Id != item.Id);
  }

  importarNota(): void {
    if (!this.notaPreview.Cabecalho.ChaveDeAcesso || this.notaPreview.Cabecalho.ChaveDeAcesso.length !== 44) {
      this.toastService.errorNotification('', 'Chave da nota inválida (Deve conter 44 caracteres)');
      return;
    }

    if (!this.notaPreview.Totais.vNF || this.notaPreview.Totais.vNF < 0) {
      this.toastService.errorNotification('', 'Valor da nota inválido');
      return;
    }

    if (this.notaPreview.Itens.length < 1) {
      this.toastService.errorNotification('', 'Nenhum item informado');
      return;
    }

    this.isImporting = true;
    var file = null;
    if (this.fileHolder) {
      file = this.fileHolder.file;
    }
    this.notaFiscalService.efetuarEntradaNotaFiscal(this.notaPreview, file)
      .then(data => {
        this.isImporting = false;
        this.uploadComponent.deleteAll();
        this.toastService.sucessNotification('', 'Nota fiscal importada com sucesso');
      })
      .catch(error => {
        this.isImporting = false;
        this.handleServerError(error);
      });
  }

  handleServerError(error: GenericResponse): void {
    if (error.message) {
      this.toastService.errorNotification('', error.message);
    } else {
      this.toastService.errorNotification('', 'Falha ocorrida');
    }
  }
}
