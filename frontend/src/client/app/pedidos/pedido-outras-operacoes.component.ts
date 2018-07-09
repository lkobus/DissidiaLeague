import { Component, OnInit, EventEmitter, Output, ViewChild, ViewChildren } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { ToastService } from "../_services/toast.service";
import { Observable } from "rxjs/Rx";
import { Subject } from "rxjs/Subject";
import { List } from "linqts";

import { Pedido, Produto, Pessoa, AtivoDeGiro } from "./model/pedido";
import { GenericResponse } from "../_model/generic-response";
import { ProdutoEdicao } from "./model/produto-edicao";
import { TipoOperacao } from "../_model/caixa-status";
import { PedidoService } from "./services/pedido.service";
import { EmpresaService } from "./../_services/empresa.service";
import { AtivoGiroEdicao } from "./model/ativo-giro-edicao";
import { Cliente } from "../clientes/model/cliente";
import { TranslationProviders } from "../i18n.providers";
import { ProdutoPreco } from "./model/produto-preco";
import { VendaBalcaoTrocaOperadorComponent } from "../venda-balcao/venda-balcao-troca-operador.component";

@Component({
  moduleId: module.id,
  selector: "pedido-outras-operacoes",
  templateUrl: "pedido-outras-operacoes.component.html",
  styleUrls: ["pedido-outras-operacoes.component.css"]
})
export class PedidoOutrasOperacoesComponent implements OnInit {
  private sourceProdutos: List<ProdutoEdicao>;
  private sourceAtivosGiro: List<AtivoGiroEdicao>;

  @ViewChildren("inputProdutoSearch") private vcInputSearchProduto;
  @Output() private searchProdutoChangeEmitter: EventEmitter<any> = new EventEmitter<any>();
  private searchProdutoUpdated: Subject<string> = new Subject<string>();

  @ViewChildren("inputAtivoGiroSearch") private vcInputSearchAtivoGiro;
  @Output() private searchAtivoGiroChangeEmitter: EventEmitter<any> = new EventEmitter<any>();
  private searchAtivoGiroUpdated: Subject<string> = new Subject<string>();

  public isLoading: boolean = false;
  public isInserting: boolean = false;
  public allowEdit: boolean = false;
  public allowCancel: boolean = false;

  public inputSearchProduto: string;
  public inputSearchAtivoGiro: string;

  public pedido: Pedido;
  public viewProdutos: ProdutoEdicao[];
  public viewAtivosGiro: AtivoGiroEdicao[];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private pedidoService: PedidoService,
    private empresaService: EmpresaService
  ) {
    this.initSources();
    this.searchProdutoChangeEmitter = <any>this.searchProdutoUpdated
      .asObservable()
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(item => this.searchProduto(item));
    this.searchAtivoGiroChangeEmitter = <any>this.searchAtivoGiroUpdated
      .asObservable()
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(item => this.searchAtivoGiro(item));
  }

  ngOnInit() {
    this.activatedRoute.paramMap
      .switchMap((params: ParamMap) => {
        if (params.get("id")) {
          let sucess = params.get("sucess");
          if (sucess === "ok") {
            this.toastService.sucessNotification(
              "",
              "Pedido realizado com sucesso"
            );
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

  private initSources(): void {
    this.pedido = new Pedido();
    this.sourceProdutos = new List<ProdutoEdicao>();
    this.sourceAtivosGiro = new List<AtivoGiroEdicao>();
    this.viewProdutos = [];
    this.viewAtivosGiro = [];
  }

  private resetSources(): void {
    this.pedido.ItemsComodato = [];
    this.pedido.Produtos = [];
    this.pedido.AtivosDeGiro = [];
    this.pedido.Valor = 0;
    this.sourceProdutos = new List<ProdutoEdicao>();
    this.sourceAtivosGiro = new List<AtivoGiroEdicao>();
    this.viewProdutos = [];
    this.viewAtivosGiro = [];
  }

  private loadSourcesForInsert(): void {
    this.resetSources();
    this.isLoading = true;
    this.getClienteEmpresa()
      .then(cliente => {
        this.pedido.Cliente.Id = cliente.Id;
        this.pedido.Cliente.Nome = cliente.Nome;
        this.isLoading = false;
      })
      .catch(error => {
        this.isLoading = false;
        this.handleServerError(error);
      });
  }

  private loadSourcesForEdit(): void {
    this.isLoading = true;
    this.activatedRoute.paramMap
      .switchMap((params: ParamMap) => {
        let id = params.get("id");
        return this.pedidoService.getPedidoResumo(id);
      })
      .flatMap(data => {
        this.isLoading = false;
        this.setPedido(data);
        if (this.allowEdit) {
          this.loadProdutosEAtivos();
        }
        return Observable.of(true);
      })
      .catch(error => {
        this.isLoading = false;
        this.handleServerError(error);
        return Observable.of(false);
      })
      .subscribe();
  }

  private loadProdutosEAtivos(): void {
    if (this.pedido.TipoOperacaoCodigo == 102) {
      this.isLoading = true;
      this.getProdutosComPrecoPorSegmentoSemDesconto()
        .then(produtos => {
          this.sourceProdutos = produtos;
          this.isLoading = false;
        })
        .catch(error => {
          this.isLoading = false;
          this.handleServerError(error);
        });
    } else if (this.pedido.TipoOperacaoCodigo == 108) {
      this.isLoading = true;
      this.getProdutosComPrecoMedio()
        .then(produtos => {
          this.sourceProdutos = produtos;
          this.getAtivosDeGiro()
            .then(ativos => {
              this.sourceAtivosGiro = ativos;
              this.isLoading = false;
            })
            .catch(error => {
              this.isLoading = false;
              this.handleServerError(error);
            });
        })
        .catch(error => {
          this.isLoading = false;
          this.handleServerError(error);
        });
    }
  }

  private setPedido(pedido: Pedido): void {
    this.pedido = pedido;
    if (this.pedido.Id) {
      this.allowEdit = this.pedido.StatusCodigo == 2 || this.pedido.StatusCodigo == 7;
      this.allowCancel = this.allowEdit || this.pedido.StatusCodigo == 9 || this.pedido.StatusCodigo == 13;;
      if (this.allowEdit && this.pedido.AlertDetail) {
        this.toastService.errorNotification("Atenção", this.pedido.AlertDetail);
      }
    }
  }

  private handleServerError(error: GenericResponse): void {
    if (error.message) {
      this.toastService.errorNotification("", error.message);
    } else {
      this.toastService.errorNotification("", "Falha ocorrida");
    }
  }

  private getClienteEmpresa(): Promise<Pessoa> {
    return this.empresaService
      .getEmpresaCliente()
      .map(cliente => {
        let pessoa = new Pessoa();
        if (cliente) {
          pessoa.Id = cliente.Id;
          pessoa.Nome = cliente.NomeFantasia;
        }
        return pessoa;
      })
      .toPromise();
  }

  private getProdutosComPrecoMedio(): Promise<List<ProdutoEdicao>> {
    return this.pedidoService
      .getProdutosComPrecoMedio(this.pedido.Cliente.Id)
      .map((data: ProdutoPreco[]) => {
        let produtos = new List<ProdutoPreco>(data);
        return produtos.Select(
          p =>
            new ProdutoEdicao(
              p.Id,
              p.Codigo,
              p.CodigoEAN,
              p.Nome,
              p.FatorConversao,
              p.Preco,
              p.Preco,
              p.DescontoMaximoPermitido,
              p.PrecoMinimoPermitido,
              1
            )
        );
      })
      .toPromise();
  }

  private getProdutosComPrecoPorSegmentoSemDesconto(): Promise<
    List<ProdutoEdicao>
    > {
    return this.pedidoService
      .getProdutosComPrecoPorSegmentoSemDesconto(this.pedido.Cliente.Id)
      .map((data: ProdutoPreco[]) => {
        let produtos = new List<ProdutoPreco>(data);
        return produtos.Select(
          p =>
            new ProdutoEdicao(
              p.Id,
              p.Codigo,
              p.CodigoEAN,
              p.Nome,
              p.FatorConversao,
              p.Preco,
              p.Preco,
              p.DescontoMaximoPermitido,
              p.PrecoMinimoPermitido,
              1
            )
        );
      })
      .toPromise();
  }

  private getAtivosDeGiro(): Promise<List<AtivoGiroEdicao>> {
    return this.pedidoService
      .getAtivosGiro()
      .map((data: AtivoGiroEdicao[]) => {
        return new List<AtivoGiroEdicao>(data);
      })
      .toPromise();
  }

  private searchProduto(searchText: string): void {
    if (searchText == "") {
      this.viewProdutos = [];
    } else {
      searchText = searchText.toLocaleLowerCase();
      this.viewProdutos = this.sourceProdutos
        .Where(p => {
          let result = false;

          if (p.Codigo.toString().indexOf(searchText) > -1) {
            result = true;
          } else if (p.Nome.toLowerCase().indexOf(searchText) > -1) {
            result = true;
          } else if (p.CodigoEAN == searchText) {
            result = true;
          }

          if (result) {
            result =
              this.pedido.Produtos.find(i => i.Codigo == p.Codigo) == null;
          }
          return result;
        })
        .ToArray();
    }
  }

  private searchAtivoGiro(searchText: string): void {
    if (searchText == "") {
      this.viewAtivosGiro = [];
    } else {
      searchText = searchText.toLocaleLowerCase();
      this.viewAtivosGiro = this.sourceAtivosGiro
        .Where(a => {
          let result = false;

          if (a.Codigo.toString().indexOf(searchText) > -1) {
            result = true;
          } else if (a.Nome.toLowerCase().indexOf(searchText) > -1) {
            result = true;
          }

          if (result) {
            result =
              this.pedido.AtivosDeGiro.find(i => i.Codigo == a.Codigo) == null;
          }
          return result;
        })
        .ToArray();
    }
  }

  private calcTotalPedido(): void {
    let total: number = 0;
    this.pedido.Produtos.forEach(produto => {
      total += produto.ValorTotal;
    });
    this.pedido.Valor = total;
  }

  public salvar(): void {
    if (this.isInserting) {
      this.salvarInsercao();
    } else {
      this.salvarEdicao();
    }
  }

  public salvarInsercao(): void {
    if (!this.pedido.Cliente.Id) {
      this.toastService.errorNotification("Atenção", "Nenhum cliente informado");
      return;
    }

    if (!this.pedido.TipoOperacaoCodigo || this.pedido.TipoOperacaoCodigo == 0) {
      this.toastService.errorNotification("Atenção", "Tipo de operação informado é inválido");
      return;
    }

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

    let ativos = this.pedido.Produtos.filter(a => !Number(a.Quantidade));
    if (ativos.length > 0) {
      this.toastService.errorNotification("Atenção", "Informe uma quantidade válida para o ativo de giro " +
        ativos[0].Codigo + " - " + ativos[0].Nome);
      return;
    }

    this.isLoading = true;
    if (this.pedido.TipoOperacaoCodigo == 102) {
      this.pedidoService.solicitarPedidoConsumoInterno(this.pedido)
        .then(data => {
          this.router.navigateByUrl('/pedidoResumo/outrasOperacoes/' + data.Id + "/ok");
        })
        .catch(error => {
          this.isLoading = false;
          this.handleServerError(error);
        })
    } else if (this.pedido.TipoOperacaoCodigo == 108) {
      this.pedidoService.solicitarPedidoPerda(this.pedido)
        .then(data => {
          this.router.navigateByUrl('/pedidoResumo/outrasOperacoes/' + data.Id + "/ok");
        })
        .catch(error => {
          this.isLoading = false;
          this.handleServerError(error);
        })
    }
  }

  public salvarEdicao(): void {
    if (this.allowEdit) {
      if (!this.pedido.TipoOperacaoCodigo || this.pedido.TipoOperacaoCodigo == 0) {
        this.toastService.errorNotification("Atenção", "Tipo de operação informado é inválido");
        return;
      }

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

      let ativos = this.pedido.Produtos.filter(a => !Number(a.Quantidade));
      if (ativos.length > 0) {
        this.toastService.errorNotification("Atenção", "Informe uma quantidade válida para o ativo de giro " +
          ativos[0].Codigo + " - " + ativos[0].Nome);
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

  public cancelarPedido(): void {
    this.isLoading = true;
    this.pedidoService.cancelarPedido(this.pedido.Id)
      .then(data => {
        this.isLoading = false;
        this.goBack();
      })
      .catch(error => {
        this.isLoading = false;
        this.handleServerError(error);
      })
  }

  public incQtdProdutoView(produto: ProdutoEdicao): void {
    produto.Quantidade = Number(produto.Quantidade) + 1;
  }

  public decQtdProdutoView(produto: ProdutoEdicao): void {
    if (produto.Quantidade > 1) {
      produto.Quantidade = Number(produto.Quantidade) - 1;
    }
  }

  public addProdutoEdicao(produto: ProdutoEdicao): void {
    if (!produto.PrecoVenda || produto.PrecoVenda <= 0) {
      this.toastService.errorNotification(
        "Atenção",
        "Valor informado inválido"
      );
      return;
    }
    if (!produto.Quantidade || produto.Quantidade < 1) {
      this.toastService.errorNotification(
        "Atenção",
        "Quantidade informada inválida"
      );
      return;
    }

    this.isLoading = true;
    this.pedidoService
      .previewProdutoEdicao(this.pedido.Id, produto)
      .then(data => {
        this.isLoading = false;
        this.inputSearchProduto = "";
        this.searchProduto("");
        this.pedido.Produtos.push(data);
        this.calcTotalPedido();
        this.vcInputSearchProduto.first.nativeElement.focus();
      })
      .catch(error => {
        this.isLoading = false;
        this.inputSearchProduto = "";
        this.searchProduto("");
        this.handleServerError(error);
      });
  }

  public quicklyAddProdutoEdicao(): void {
    if (this.viewProdutos[0]) {
      this.addProdutoEdicao(this.viewProdutos[0]);
    }
  }

  public removeProdutoEdicao(produtoId: string): void {
    this.pedido.Produtos = this.pedido.Produtos.filter(p => p.Id != produtoId);
    this.calcTotalPedido();
  }

  public incQtdProdutoPedido(produto: Produto): void {
    produto.Quantidade = Number(produto.Quantidade) + 1;
    this.onChangeProdutoPedido(produto);
  }

  public decQtdProdutoPedido(produto: Produto): void {
    produto.Quantidade = Number(produto.Quantidade);
    if (produto.Quantidade > 0) {
      produto.Quantidade = Number(produto.Quantidade) - 1;
      this.onChangeProdutoPedido(produto);
    }
  }

  public getComodatoImageURL(id: string): string {
    return this.pedidoService.getComodatoImageURL(id);
  }

  public getProdutoImageURL(pedidoId: string): string {
    return this.pedidoService.getProdutoImageURL(pedidoId);
  }

  public getAtivoGiroImageURL(ativoId: string): string {
    return this.pedidoService.getAtivoGiroImageURL(ativoId);
  }

  public incQtdAtivoView(ativo: AtivoGiroEdicao): void {
    ativo.Quantidade = Number(ativo.Quantidade) + 1;
  }

  public decQtdAtivoView(ativo: AtivoGiroEdicao): void {
    if (ativo.Quantidade > 1) {
      ativo.Quantidade = Number(ativo.Quantidade) - 1;
    }
  }

  public addAtivoEdicao(ativo: AtivoGiroEdicao): void {
    if (!ativo.Quantidade || ativo.Quantidade < 1) {
      this.toastService.errorNotification(
        "Atenção",
        "Quantidade informada inválida"
      );
      return;
    }

    this.inputSearchAtivoGiro = "";
    this.searchAtivoGiro("");
    let ativoPedido = new AtivoDeGiro();
    ativoPedido.Id = ativo.Id;
    ativoPedido.Codigo = ativo.Codigo;
    ativoPedido.Nome = ativo.Nome;
    ativoPedido.Quantidade = ativo.Quantidade;
    this.pedido.AtivosDeGiro.push(ativoPedido);
    this.vcInputSearchAtivoGiro.first.nativeElement.focus();
  }

  public quicklyAddAtivoEdicao(): void {
    if (this.viewAtivosGiro[0]) {
      this.addAtivoEdicao(this.viewAtivosGiro[0]);
    }
  }

  public removeAtivoEdicao(ativoId: string): void {
    this.pedido.AtivosDeGiro = this.pedido.AtivosDeGiro.filter(
      a => a.Id != ativoId
    );
  }

  public incQtdAtivoPedido(ativo: AtivoDeGiro): void {
    ativo.Quantidade = Number(ativo.Quantidade) + 1;
  }

  public decQtdAtivoPedido(ativo: AtivoDeGiro): void {
    ativo.Quantidade = Number(ativo.Quantidade);
    if (ativo.Quantidade > 1) {
      ativo.Quantidade = Number(ativo.Quantidade) - 1;
    }
  }

  public goBack(): void {
    this.toastService.clearAllNotifications();
    this.router.navigateByUrl("/pedidos");
  }

  public onChangeProdutoPedido(produto: Produto) {
    if (produto.Quantidade < 1) {
      produto.Quantidade = 1;
    }

    var prodPreco = this.sourceProdutos.FirstOrDefault(p => p.Id == produto.Id);
    if (produto.ValorUnidade <= 0) {
      produto.ValorUnidade = prodPreco.Preco;
      this.toastService.errorNotification(
        "Atenção",
        "Valor informado inválido"
      );
    }

    produto.ValorUnitario = Number(
      produto.ValorUnidade / prodPreco.FatorConversao
    );
    produto.ValorTotal = produto.ValorUnidade * produto.Quantidade;
    produto.Alert =
      produto.Quantidade > produto.Estoque
        ? produto.Alert | 4
        : produto.Alert & 3;
    this.calcTotalPedido();
  }

  public onChangeTipoOperacao(): void {
    this.resetSources();
    this.loadProdutosEAtivos();
  }

  public onInputSearchProduto(searchText: string): void {
    this.searchProdutoUpdated.next(searchText);
  }

  public onInputSearchAtivoGiro(searchText: string): void {
    this.searchAtivoGiroUpdated.next(searchText);
  }
}
