export class FormaPagamentoEnum {
    public static readonly DINHEIRO: FormaPagamentoEnum = new FormaPagamentoEnum(1, "Dinheiro");
    public static readonly CARTAO_CREDITO: FormaPagamentoEnum = new FormaPagamentoEnum(2, "Cartão Crédito");
    public static readonly CARTAO_DEBITO: FormaPagamentoEnum = new FormaPagamentoEnum(3, "Cartão Débito");
    public static readonly CHEQUE: FormaPagamentoEnum = new FormaPagamentoEnum(4, "Cheque");
    public static readonly BOLETO: FormaPagamentoEnum = new FormaPagamentoEnum(14, "Boleto");

    codigo: number;
    descricao: string;

    constructor(codigo: number, valor: string) {
        this.codigo = codigo;
        this.descricao = valor;
    }

    public static From(codigo): FormaPagamentoEnum {
        switch (codigo) {
            case 1: return FormaPagamentoEnum.DINHEIRO;
            case 2: return FormaPagamentoEnum.CARTAO_CREDITO;
            case 3: return FormaPagamentoEnum.CARTAO_DEBITO;
            case 4: return FormaPagamentoEnum.CHEQUE;
            case 14: return FormaPagamentoEnum.BOLETO;
            default: return null;
        }
    }
}