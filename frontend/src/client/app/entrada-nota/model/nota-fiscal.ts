export class NotaFiscal {

    public Id: string;
    public Cabecalho: Cabecalho;
    public Pagamento: Pagamento;
    public Itens: Item[];
    public Totais: Total;
    public Xml: File;

    constructor() {
        this.Cabecalho = new Cabecalho;
        this.Totais = new Total;
        this.Itens = [];
        this.Pagamento = new Pagamento();
    }
}

export class Pagamento {
    public Tipo: number;
    public Valor: number;
    public Vencimento: Date;
}

export class Cabecalho {

    public Fornecedor: string;
    public NotaSerie: string;
    public NaturezaOperacao: string;
    public DataEmissao: Date;
    public DataSaida: Date;
    public DataEntrada: Date;
    public CFO: string;
    public Especie: string;
    public Finalidade: string;
    public ChaveDeAcesso: string;
}

export class Item {

    public CodigoProduto: number;
    public NomeProduto: string;
    public Quantidade: number;
    public Operacao: string;
    public CFO: number;
    public Conta: string;
    public PrecoUnitario: number;
    public PrecoTotal: number;
    public Desconto: number;
    public UnidadeMedida: string;
    public icms: ICMS;
    public IPI: IPI;
    public PIS: PIS;
    public COFINS: COFINS;
    public Id: string;
    public ImageUri: string;
    public Valores: ProdutoValores;

    constructor() {
        this.icms = new ICMS;
        this.IPI = new IPI;
        this.PIS = new PIS;
        this.COFINS = new COFINS;
        this.Valores = new ProdutoValores;
    }
}

export class ProdutoValores {

    public Quantidade: number;
    public ValorUnidade: number;
    public ValorUnitario: number;
    public ValorTotal: number;
    public UnidadeMedida: string;
}

export class ICMS {

    public ORIG: number;
    public CST: number;
    public Aliquota: string;
    
}

export class IPI {

    public CST: number;
    public qUnid: number;
    public vUnid: number;
    public vIPI: number;
    
}

export class PIS {

    public CST: number;
    public vBC: number;
    public pPIS: number;
    public vPIS: number;
    
}

export class COFINS {

    public CST: number;
    public vBC: number;
    public pCOFINS: number;
    public vCOFINS: number;

}

export class Total {

    public vBC: number;
    public vICMS: number;
    public vICMSDeson: number;
    public vBCST: number;
    public vST: number;
    public vProd: number;
    public vFrete: number;
    public vSeg: number;
    public vDesc: number;
    public vII: number;
    public vIPI: number;
    public vCOFINS: number;
    public vOutro: number;
    public vNF: number = 0;
    public vPIS: number;

}
