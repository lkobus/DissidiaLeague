export class Estoque {

    Id: string;
    Item: EstoqueItem;
    Quantidade: number;
    EstoqueMinimo: number;
    CustoMedio: number;
    DiasPrevisao: number;

    constructor() {
        this.Item = new EstoqueItem();
    }
}

export class EstoqueItem {

    Id: string;
    Tipo: number;
    Codigo: number;
    Nome: string;
    UnidadeMedida: string;    

    constructor() { }
}

export class TipoEstoqueItem {

    static readonly PRODUTO: TipoEstoqueItem = new TipoEstoqueItem(1, "PRODUTO");
    static readonly ATIVO_DE_GIRO: TipoEstoqueItem = new TipoEstoqueItem(2, "ATIVO DE GIRO");

    Codigo: number;
    Valor: string;

    constructor(codigo: number, valor: string) {
        this.Codigo = codigo;
        this.Valor = valor;
    }
}