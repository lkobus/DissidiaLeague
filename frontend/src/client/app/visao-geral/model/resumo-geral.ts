export class ResumoGeral {


    public static readonly Entrada = 1;
    public static readonly Saida = 2;

    tipo: number;
    origem: string;
    valorAtual: number;
    valorAnterior: number;
    constructor(tipo: number, origem: string, valorAtual: number, valorAnterior: number) {
        this.origem = origem;
        this.tipo = tipo;
        this.valorAtual = valorAtual;
        this.valorAnterior = valorAnterior;
    }
}

export class HistoricoVendas {

    agrupador: string;
    valor: number;
    data: string;
    constructor(data: string, valor: number, agrupador: string) {
        this.data = data;
        this.agrupador = agrupador;
        this.valor = valor;
    }
}


export class ProdutosMaisVendidos {

    categoria: string;
    quantidade: number;
    descricao: string;
    constructor(categoria: string, quantidade: number, descricao: string) {
        this.descricao = descricao;
        this.quantidade = quantidade;
        this.categoria = categoria;
    }
}