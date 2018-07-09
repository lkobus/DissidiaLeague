export class NotaFiscal {
    public Id: string;
    public ChaveAcesso: string;
    public TipoNota: number;
    public DataEmissao: string;
    public DataCancelamento: string;
    public NumeroNota: string;
    public SerieNota: string;
    public Operacao: string;
    public ClienteNomeFantasia: string;
    public FormaPagamento: string;
    public CodigoFormaPagamento: number;
    public DataVencimentoBoleto: string;
    public Valor: number = 0;
    public Desconto: number = 0;
    public Mapa: string;
    public StatusMapa: string;
    public DataEntrega: string;
    public StatusCodigo: number;
    public StatusValor: string;
    public StatusEvento: string;
    public AlertDetail: string;
    public Itens: Itens[];

    constructor() {
        this.Itens = [];
        this.Id = '';
        this.DataEmissao = '';
        this.DataCancelamento = '';
        this.NumeroNota = '';
        this.SerieNota = '';
        this.Operacao = '';
        this.ClienteNomeFantasia = '';
        this.FormaPagamento = '';
        this.DataVencimentoBoleto = '';
        this.Valor = 0;
        this.Desconto = 0;
        this.Mapa = '';
        this.StatusMapa = '';
        this.StatusCodigo = 0;
        this.AlertDetail = '';
        this.StatusEvento = '';
    }
}

export class Itens {
    public Id: string;
    public CodigoProduto: number;
    public NomeProduto: string;
    public Quantidade: number;
    public CFO: number;
    public PrecoUnitario: number;
    public Desconto: number;
    public PrecoTotal: number;
    public UnidadeMedida: string;
    public ICMS: ICMS;
    public IPI: IPI;
    public PIS: PIS;
    public COFINS: COFINS;

    constructor() { }
}

export class ICMS {
      public ORIG: number;
      public CST: number;
      public Aliquota: string;

      constructor() { }
}

export class IPI {
  public CST: number;
  public qUnid: number;
  public vUnid: number;
  public vIPI: number;

  constructor() { }
}

export class PIS {
  public CST: number;
  public vBC: number;
  public pPIS: number;
  public vPIS: number;

  constructor() { }
}

export class COFINS {
  public CST: number;
  public vBC: number;
  public pCOFINS: number;
  public vCOFINS: number;

  constructor() { }
}

