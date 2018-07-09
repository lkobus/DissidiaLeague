export class InformacaoVenda {

    CpfConsumidor: string;
    FormasPagamento: VendaBalcaoTipoPagamento[];
    Produtos: ProdutoVenda[];

    constructor() {
        this.CpfConsumidor = '';
        this.FormasPagamento = [];
        this.Produtos = [];
    }

    public AddFormaPagamento(pagamento: VendaBalcaoTipoPagamento) {
        this.FormasPagamento.push(pagamento);
    }

    public AddProduto(produto: ProdutoVenda) {
        this.Produtos.push(produto);
    }
}

export class VendaBalcaoTipoPagamento {

    Valor: number;
    Codigo: number;

    constructor(codigo: number, valor: number) {
        this.Codigo = codigo;
        this.Valor = valor;
    }
}

export class ProdutoVenda {
    Id: string;
    Quantidade: number;
    PrecoUnitario:number;
    DescontoUnitario:number;

    constructor(id: string, quantidade: number, precoUnitario: number, descontoUnitario: number) {
        this.Id = id;
        this.Quantidade = quantidade;
        this.PrecoUnitario = precoUnitario;
        this.DescontoUnitario = descontoUnitario;
    }
}
