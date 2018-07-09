import { Class } from "@angular/core/src/util/decorators";

export class Pedido {
  public Id: string;
  public Data: string;
  public Valor: number = 0;
  public Desconto: number = 0;
  public DataPagamento: string = "";
  public DataEntrega: string = "";
  public StatusCodigo: number;
  public StatusValor: string;
  public FormaPagamentoCodigo: number;
  public FormaPagamento: string;
  public VencimentoPagamento: string;
  public Cliente: Pessoa;
  public Vendedor: Pessoa;
  public Produtos: Produto[];
  public AtivosDeGiro: AtivoDeGiro[];
  public ItemsComodato: ItemComodato[];
  public TipoOperacaoCodigo: number;
  public InformacaoComplementar: string;
  public AlertDetail: string;
  public MapaCodigo: number;
  public MapaDescricao: string;
  public MapaStatusCodigo: number;
  public MapaStatusDescricao: string;

  constructor() {
    this.Cliente = new Pessoa();
    this.Vendedor = new Pessoa();
    this.Produtos = [];
  }
}

export class Pessoa {
  public Id: string;
  public Nome: string;

  constructor() {}
}

export class Produto {
  public Id: string;
  public Codigo: number;
  public Nome: string;
  public Quantidade: number;
  public Estoque: number;
  public ValorUnitario: number;
  public ValorUnidade: number;
  public ValorDesconto: number;
  public ValorTotal: number;
  public ValorTotalDesconto: number;
  public UnidadeMedida: string;
  public Alert: number;

  constructor() {}
}

export class AtivoDeGiro {
  public Id: string;
  public Codigo: number;
  public Nome: string;
  public TipoCodigo: number;
  public Quantidade: number;

  constructor() {}
}


export class ItemComodato {
  public Id: string;
  public Codigo: number;
  public Nome: string;
  public TipoCodigo: number;
  public Quantidade: number;

  constructor() {}
}
