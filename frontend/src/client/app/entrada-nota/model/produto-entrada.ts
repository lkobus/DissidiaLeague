import { Produto } from './../../produtos/model/produto';

export class ProdutoEntrada {

    public Id: string;
    public Codigo: number;
    public Nome: string;
    public CodigoEAN: string;
    public Valor: number;
    public Desconto: number;
    public Quantidade: number = 0;

    constructor() { }
}