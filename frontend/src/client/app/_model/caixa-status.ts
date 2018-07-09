
import { Usuario } from './usuario';
import { VendaBalcao } from '../venda-balcao/model/venda-balcao';

export class CaixaStatus {

    CaixaDisponivel: boolean;
    DataAbertura: string;
    DataFechamento: string;
    Saldo: number;
    TrocaOperador: CaixaMovimento[];
    Suprimentos: CaixaMovimento[];
    Vendas: CaixaMovimento[];
    Sangrias: CaixaMovimento[];
    Aberturas: CaixaMovimento[];
    VendaCancelamentos: CaixaMovimento[];
    Fechamentos: CaixaMovimento[];
    Movimentos: CaixaMovimento[];

    public static SaldoCartao(statusCaixa: CaixaStatus): number {
        let vendaCartao = statusCaixa.Vendas.filter(p => {
            return p.FormaPagamento.Codigo === FormaPagamento.CartaoCredito.Codigo
                || p.FormaPagamento.Codigo === FormaPagamento.CartaoDebito.Codigo;
        });
        let saldoCartao = vendaCartao.reduce((a, b) => a + b.Valor, 0);

        let cancelCartao = statusCaixa.VendaCancelamentos.filter(p => {
            return p.FormaPagamento.Codigo === FormaPagamento.Dinheiro.Codigo
                || p.FormaPagamento.Codigo === FormaPagamento.Cheque.Codigo;
        });
        let saldoCancelCartao = cancelCartao.reduce((a, b) => a + b.Valor, 0);

        return saldoCartao - saldoCancelCartao;
    }

    public static GetSaldoDinheiroCheque(statusCaixa: CaixaStatus): number {
        var _this = statusCaixa;
        let vendaDinheiro = _this.Vendas.filter(p => {
            return p.FormaPagamento.Codigo === FormaPagamento.Dinheiro.Codigo
                || p.FormaPagamento.Codigo === FormaPagamento.Cheque.Codigo;
        });
        let saldoDinheiro = vendaDinheiro.reduce((a, b) => a + b.Valor, 0);

        let cancelDinheiro = _this.VendaCancelamentos.filter(p => {
            return p.FormaPagamento.Codigo === FormaPagamento.Dinheiro.Codigo
                || p.FormaPagamento.Codigo === FormaPagamento.Cheque.Codigo;
        });
        let saldoCancelDinheiro = cancelDinheiro.reduce((a, b) => a + b.Valor, 0);

        var temp = _this.Aberturas
            .concat(_this.Fechamentos)
            .concat(_this.Sangrias)
            .concat(_this.Suprimentos)
            .reduce((a, b) => CaixaMovimento.CalculaSaldo(a, b), 0);
        return saldoDinheiro - saldoCancelDinheiro + temp;
    }
}

export class CaixaMovimento {
    Usuario: Usuario;
    Venda: VendaBalcao;
    FormaPagamento: FormaPagamento;
    Operacao: OperacoesCaixa;
    Valor: number;
    Data: string;

    public static CalculaSaldo(saldo: number, movimento: CaixaMovimento): number {
        if (movimento.Operacao.Codigo === OperacoesCaixa.Abertura.Codigo) {
            saldo += movimento.Valor;
        }
        else if (movimento.Operacao.Codigo === OperacoesCaixa.Venda.Codigo) {
            saldo += movimento.Valor;
        }
        else if (movimento.Operacao.Codigo === OperacoesCaixa.Fechamento.Codigo) {
            saldo -= movimento.Valor;
        }
        else if (movimento.Operacao.Codigo === OperacoesCaixa.Sangria.Codigo) {
            saldo -= movimento.Valor;
        }
        else if (movimento.Operacao.Codigo === OperacoesCaixa.Suprimento.Codigo) {
            saldo += movimento.Valor;
        }
        else if (movimento.Operacao.Codigo === OperacoesCaixa.VendaCancelamento.Codigo) {
            saldo -= movimento.Valor;
        }
        return saldo;
    }
}

export enum TipoOperacao {
    Positivo = 0,
    Negativo = 1
}

export class OperacoesCaixa {

    public static Abertura = new OperacoesCaixa(1, "Abertura de caixa", 0);
    public static Fechamento = new OperacoesCaixa(2, "Fechamento de caixa", 0);
    public static Venda = new OperacoesCaixa(3, "Venda", 0);
    public static Sangria = new OperacoesCaixa(4, "Sangria", 0);
    public static Suprimento = new OperacoesCaixa(5, "Suprimento", 0);
    public static TrocaOperador = new OperacoesCaixa(6, "Troca operador", 0);
    public static VendaCancelamento = new OperacoesCaixa(7, "Cancelamento de venda", 0);
    public static Saldo = new OperacoesCaixa(999, "Saldo", 0);

    Codigo: number;
    Descricao: string;
    Tipo: number;
    private constructor(codigo: number, descricao: string, tipo: number) {
        this.Codigo = codigo;
        this.Descricao = descricao;
        this.Tipo = tipo;
    }
}

export class FormaPagamento {
    public static Dinheiro = new FormaPagamento(1, "Dinheiro");
    public static CartaoCredito = new FormaPagamento(2, "Cartão Crédito");
    public static CartaoDebito = new FormaPagamento(3, "Cartão Débito");
    public static Cheque = new FormaPagamento(4, "Cheque");

    Codigo: number;
    Descricao: string;
    private constructor(codigo: number, descricao: string) {
        this.Codigo = codigo;
        this.Descricao = descricao;
    }
}
