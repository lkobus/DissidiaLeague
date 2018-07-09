export class FormaPagamentoCliente {

    Codigo: number;
    Descricao: string;
    PrazoMaximo: number;

    constructor(codigo: number, descricao: string, prazoMaximo: number) {
        this.Codigo = codigo;
        this.Descricao = descricao;
        this.PrazoMaximo = prazoMaximo;
    }
}
