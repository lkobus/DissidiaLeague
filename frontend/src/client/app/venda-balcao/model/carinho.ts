import { Produto } from './produto';
import { CondicaoPagamento } from './condicao-pagamento';

export class Carinho {
    produtos: Produto[] = [];
    condicaoPagamentoPrincipal: CondicaoPagamento = new CondicaoPagamento;
    condicoesPagamentosAdicionais: CondicaoPagamento[] = [];
    valorReceber: number = 0.00;

    constructor() {}
}
