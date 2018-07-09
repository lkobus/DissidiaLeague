import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { ToastService } from '../_services/toast.service';

import { Modal } from 'ngx-modal';
import { Subject } from 'rxjs/Subject';
import { FileSaverService } from 'ngx-filesaver';

import { GenericResponse } from '../_model/index';
import { Estoque, EstoqueItem, TipoEstoqueItem } from './model/estoque';
import { EstoqueMovimento, UsuarioMovimento, TipoMovimento, Origem } from './model/estoque-movimento';
import { EstoqueService } from './services/estoque.service';
import { ProdutosService } from '../produtos/shared/produtos.service';
import { PuxadaService } from '../puxada/services/puxada.service';
import { Empresa } from '../_model/empresa';
import { BaseTableComponent } from '../shared/table/base-table-component';

@Component({
  moduleId: module.id,
  selector: 'estoque',
  templateUrl: 'estoque.component.html',
  styleUrls: ['estoque.component.css']
})
export class EstoqueComponent extends BaseTableComponent implements OnInit {

  public selectTableRowExterno: string = '';
  public selectTableRowBalcao: string = '';
  public sortingBalcaoDesc: boolean[] = [];
  public sortingExternoDesc: boolean[] = [];


  isLoading: boolean;
  isExporting: boolean;

  acessoVendaBalcao: boolean = false;
  acessoVendaExterna: boolean = false;

  filtroBalcao: any = 0;
  filtroExterno: any = 0;

  sourceEstoqueBalcaoEsgotado: Estoque[] = [];
  sourceEstoqueBalcaoBaixo: Estoque[] = [];
  sourceEstoqueBalcaoAlto: Estoque[] = [];
  sourceEstoqueBalcaoTodos: Estoque[] = [];

  sourceEstoqueExternoEsgotado: Estoque[] = [];
  sourceEstoqueExternoBaixo: Estoque[] = [];
  sourceEstoqueExternoAlto: Estoque[] = [];
  sourceEstoqueExternoTodos: Estoque[] = [];

  sourceBalcao: Estoque[] = [];
  listBalcao: Estoque[] = [];
  sourceExterno: Estoque[] = [];
  listExterno: Estoque[] = [];

  visaoExtendidaBalcao: boolean = false;
  visaoExtendidaExterno: boolean = false;

  inputSearchBalcao: any;
  inputSearchExterno: any;

  @Output() searchChangeEmitterBalcao: EventEmitter<any> = new EventEmitter<any>();
  searchUpdatedBalcao: Subject<string> = new Subject<string>();

  @Output() searchChangeEmitterExterno: EventEmitter<any> = new EventEmitter<any>();
  searchUpdatedExterno: Subject<string> = new Subject<string>();

  @ViewChild('modalEditar') modalEditar: Modal;
  estoqueEdicao: Estoque;
  estoqueEdicaoTipo: number;
  sourceEstoqueEdicaoMovimentacao: EstoqueMovimento[] = [];
  listEstoqueEdicaoMovimentacao: EstoqueMovimento[] = [];
  urlImageProdutoEdicao: string = '';
  isLoadingMovimentacao: boolean = false;
  movimentoSortingDesc: boolean = false;

  constructor(
    private estoqueService: EstoqueService,
    private produtoService: ProdutosService,
    private puxadaService: PuxadaService,
    private fileSaverService: FileSaverService,
    private toastService: ToastService
  ) {
    super();
    this.searchChangeEmitterBalcao = <any>this.searchUpdatedBalcao.asObservable()
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(item => this.filterBalcao(item));

    this.searchChangeEmitterExterno = <any>this.searchUpdatedExterno.asObservable()
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(item => this.filterExterno(item));
  }

  ngOnInit() {
    this.loadSource();
  }

  loadSource() {
    this.isLoading = true;
    this.estoqueService.getEmpresaInfo()
      .then((data: any) => {
        this.acessoVendaBalcao = data.Modulos.find(p => p.Codigo == 1) != null;
        this.acessoVendaExterna = data.Modulos.find(p => p.Codigo == 2) != null;
        return this.estoqueService.getEstoqueBalcaoTodos().toPromise();
      })
      .then(data => {
        this.sourceEstoqueBalcaoTodos = data;
        this.sourceEstoqueBalcaoEsgotado = this.sourceEstoqueBalcaoTodos.filter(e => e.Quantidade <= 0 && e.Quantidade <= e.EstoqueMinimo)
        this.sourceEstoqueBalcaoBaixo = this.sourceEstoqueBalcaoTodos.filter(e => e.Quantidade > 0 && e.Quantidade <= e.EstoqueMinimo);
        this.sourceEstoqueBalcaoAlto = this.sourceEstoqueBalcaoTodos.filter(e => e.Quantidade > e.EstoqueMinimo);
        this.sourceEstoqueBalcaoAlto = this.sortEstoqueAlto(this.sourceEstoqueBalcaoAlto);
        return this.estoqueService.getEstoqueExternoTodos().toPromise();
      })
      .then(data => {
        this.sourceEstoqueExternoTodos = data;
        this.sourceEstoqueExternoEsgotado = this.sourceEstoqueExternoTodos.filter(e => e.Quantidade <= 0 && e.Quantidade <= e.EstoqueMinimo)
        this.sourceEstoqueExternoBaixo = this.sourceEstoqueExternoTodos.filter(e => e.Quantidade > 0 && e.Quantidade <= e.EstoqueMinimo);
        this.sourceEstoqueExternoAlto = this.sourceEstoqueExternoTodos.filter(e => e.Quantidade > e.EstoqueMinimo);
        this.sourceEstoqueExternoAlto = this.sortEstoqueAlto(this.sourceEstoqueExternoAlto);

        this.setSourceListBalcao();
        this.setSourceListExterno();
        this.isLoading = false;
        return Promise.resolve(true);
      })
      .catch(data => this.handleServerError(data))
  }

  getImagemProduto(estoque: Estoque) {
    return this.produtoService.getProdutoImageURL(estoque.Item.Id);
  }

  getListDetailBalcao(): Estoque[] {
    return this.sourceBalcao.slice(0, 9);
  }

  getListDetailExterno(): Estoque[] {
    return this.sourceExterno.slice(0, 9);
  }

  setSourceListBalcao(): void {
    this.inputSearchBalcao = '';
    if (this.filtroBalcao == 0) {
      this.sourceBalcao = this.sourceEstoqueBalcaoEsgotado;
    } else if (this.filtroBalcao == 1) {
      this.sourceBalcao = this.sourceEstoqueBalcaoBaixo;
    } else if (this.filtroBalcao == 2) {
      this.sourceBalcao = this.sourceEstoqueBalcaoAlto;
    } else if (this.filtroBalcao == 3) {
      this.sourceBalcao = this.sourceEstoqueBalcaoTodos;
    } else {
      this.sourceBalcao = [];
    }
    this.listBalcao = this.sourceBalcao.map(x => x);
  }

  setSourceListExterno(): void {
    this.inputSearchExterno = '';
    if (this.filtroExterno == 0) {
      this.sourceExterno = this.sourceEstoqueExternoEsgotado;
    } else if (this.filtroExterno == 1) {
      this.sourceExterno = this.sourceEstoqueExternoBaixo;
    } else if (this.filtroExterno == 2) {
      this.sourceExterno = this.sourceEstoqueExternoAlto;
    } else if (this.filtroExterno == 3) {
      this.sourceExterno = this.sourceEstoqueExternoTodos;
    } else {
      this.sourceExterno = [];
    }
    this.listExterno = this.sourceExterno.map(x => x);
  }

  sortEstoqueAlto(source: Estoque[]): Estoque[] {
    return source.sort(function (a, b) {
      if (a.Quantidade < b.Quantidade) {
        return 1;
      } else if (a.Quantidade > b.Quantidade) {
        return -1;
      }
      return 0;
    });
  }

  filterBalcao(searchText): void {
    if (searchText) {
      searchText = searchText.toLowerCase();
    } else {
      searchText = '';
    }

    this.listBalcao = this.sourceBalcao.filter((e: any) => {
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

  filterExterno(searchText): void {
    if (searchText) {
      searchText = searchText.toLowerCase();
    } else {
      searchText = '';
    }

    this.listExterno = this.sourceExterno.filter((e: any) => {
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

  onChangeFiltroBalcao(value: any): void {
    this.filtroBalcao = value;
    this.visaoExtendidaBalcao = false;
    this.setSourceListBalcao();
  }

  onChangeFiltroExterno(value: any): void {
    this.filtroExterno = value;
    this.visaoExtendidaExterno = false;
    this.setSourceListExterno();
  }

  inputSearchBalcaoOnFilter(searchText: string): void {
    this.searchUpdatedBalcao.next(searchText);
  }

  inputSearchExternoOnFilter(searchText: string): void {
    this.searchUpdatedExterno.next(searchText);
  }

  setVisaoBalcao(): void {
    this.visaoExtendidaBalcao = !this.visaoExtendidaBalcao;
  }

  setVisaoExterno(): void {
    this.visaoExtendidaExterno = !this.visaoExtendidaExterno;
  }

  exportarBalcao(): void {
    this.isExporting = true;
    this.estoqueService.exportEstoqueBalcao()
      .then(data => {
        this.fileSaverService.save((<any>data)._body, 'estoque_balcao.csv', 'text/CSV;charset=UTF-8');
        this.isExporting = false;
      });
  }

  exportarExterno(): void {
    this.isExporting = true;
    this.estoqueService.exportEstoqueExterno()
      .then(data => {
        this.fileSaverService.save((<any>data)._body, 'estoque_externo.csv', 'text/CSV;charset=UTF-8');
        this.isExporting = false;
      });
  }

  editarEstoqueProduto(id, tipo): void {
    this.estoqueEdicao = null;
    this.urlImageProdutoEdicao = '';
    this.sourceEstoqueEdicaoMovimentacao = [];
    this.listEstoqueEdicaoMovimentacao = [];
    this.estoqueEdicaoTipo = tipo;

    if (tipo == 1) {
      this.estoqueEdicao = { ...this.listBalcao.find(e => e.Id == id) };
      this.isLoadingMovimentacao = true;
      this.estoqueService.getMovimentacaoEstoqueBalcao(id)
        .then(data => {
          this.sourceEstoqueEdicaoMovimentacao = data;
          this.listEstoqueEdicaoMovimentacao = this.sourceEstoqueEdicaoMovimentacao;
          this.isLoadingMovimentacao = false;
        })
        .catch(this.handleServerError);
    } else {
      this.estoqueEdicao = { ...this.listExterno.find(e => e.Id == id) };
      this.isLoadingMovimentacao = true;
      this.estoqueService.getMovimentacaoEstoqueExterno(id)
        .then(data => {
          this.sourceEstoqueEdicaoMovimentacao = data;
          this.listEstoqueEdicaoMovimentacao = this.sourceEstoqueEdicaoMovimentacao;
          this.isLoadingMovimentacao = false;
        })
        .catch(this.handleServerError);
    }

    this.urlImageProdutoEdicao = this.produtoService.getProdutoImageURL(this.estoqueEdicao.Item.Id);
    this.modalEditar.open();
  }

  salvarEdicaoEstoque(): void {
    if (this.estoqueEdicao.EstoqueMinimo < 1) {
      this.toastService.errorNotification("", "Estoque mínimo inválido");
      return;
    }

    if (this.estoqueEdicaoTipo == 1) {
      this.estoqueService.alterarEstoqueMinimoBalcao(this.estoqueEdicao.Id, this.estoqueEdicao.EstoqueMinimo)
        .then(data => {
          this.fecharEdicaoEstoque();
          this.loadSource();
        })
        .catch(error => {
          this.toastService.errorNotification("", "Falha ao alterar estoque mínimo. " + error.message)
        })
    } else {
      this.estoqueService.alterarEstoqueMinimoExterno(this.estoqueEdicao.Id, this.estoqueEdicao.EstoqueMinimo)
        .then(data => {
          this.fecharEdicaoEstoque();
          this.loadSource();
        })
        .catch(error => {
          this.toastService.errorNotification("", "Falha ao alterar estoque mínimo. " + error.message)
        })
    }
  }

  fecharEdicaoEstoque(): void {
    this.estoqueEdicao = null;
    this.urlImageProdutoEdicao = '';
    this.sourceEstoqueEdicaoMovimentacao = [];
    this.listEstoqueEdicaoMovimentacao = [];
    this.modalEditar.close();
  }

  sortMovimento(property): void {
    this.movimentoSortingDesc = !this.movimentoSortingDesc;
    let direction = this.movimentoSortingDesc ? 1 : -1;

    this.listEstoqueEdicaoMovimentacao = this.listEstoqueEdicaoMovimentacao.sort(function (a, b) {
      if (a[property] < b[property]) {
        return -1 * direction;
      } else if (a[property] > b[property]) {
        return 1 * direction;
      }
      return 0;
    });
  }

  sortMovimentoUsuario(property): void {
    this.movimentoSortingDesc = !this.movimentoSortingDesc;
    let direction = this.movimentoSortingDesc ? 1 : -1;

    this.listEstoqueEdicaoMovimentacao = this.listEstoqueEdicaoMovimentacao.sort(function (a, b) {
      if (a.Usuario[property] < b.Usuario[property]) {
        return -1 * direction;
      } else if (a.Usuario[property] > b.Usuario[property]) {
        return 1 * direction;
      }
      return 0;
    });
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

  solicitarPuxada(): void {
    this.puxadaService.solicitarPuxada();
  }

  private handleServerError(error: GenericResponse): void {
    this.isLoading = false;
    this.isLoadingMovimentacao = false;
    if (error.message) {
      this.toastService.errorNotification('', 'Falha ao carregar informações. ' + error.message);
    } else {
      this.toastService.errorNotification('', 'Falha ao carregar informações');
    }
  }

}
