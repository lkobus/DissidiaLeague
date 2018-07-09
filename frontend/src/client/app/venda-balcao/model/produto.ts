export class Produto {
    id:string;
    codigo:number;
    nome:string;
    codigoEAN:string;
    precoUnitario:number;
    precoVenda:number = 0;
    descontoPermitido: number = 0.00;
    quantidade: number;
    tipoProduto:string;
    imageProductURL: string;
    quantidadeVendidaUltimosMeses: number;
    
    attributeNames: string[] = ['id', 'codigo', 'nome', 'codigoEAN', 'precoUnitario', 'tipoProduto', 'imageProductURL'];

    constructor() {}
}
