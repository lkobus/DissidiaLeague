import { Produto } from './../../produtos/model/produto';

export class ProdutoEdicao {

    public Id: string;
    public Codigo: number;
    public CodigoEAN: string;
    public Nome: string;
    public FatorConversao: number;
    public Preco: number;
    public DescontoMaximoPermitido: number;
    public PrecoMinimoPermitido: number;

    public PrecoVenda: number;
    public Quantidade: number = 0;

    constructor(id: string, codigo: number, codigoEAN: string, nome: string, fatorConversao: number,
        preco: number, precoVenda: number, descontoMaximoPermitido: number, precoMinimoPermitido: number, quantidade: number) {
        this.Id = id;
        this.Codigo = codigo;
        this.CodigoEAN = codigoEAN;
        this.Nome = nome;
        this.FatorConversao = fatorConversao;
        this.Preco = preco;
        this.DescontoMaximoPermitido = descontoMaximoPermitido;
        this.PrecoMinimoPermitido = precoMinimoPermitido;
        this.PrecoVenda = precoVenda;
        this.Quantidade = quantidade;
    }
}
