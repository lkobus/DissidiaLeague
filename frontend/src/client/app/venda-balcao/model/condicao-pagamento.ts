import { FormaPagamentoVendaBalcao } from '../../configuracoes/model/configuracoes';

export class CondicaoPagamento {
    formaPagamento: FormaPagamentoVendaBalcao;
    valorReceber: number = 0.00;
    troco: number = 0.00;

    constructor() { }
}
