export class OperacaoSaida {
    OperacaoIdId: number;
    NomeOperacao: string;
    Configuracao: string;
    CfEstado: number;
    CfOutros: number;
    PisCofins: boolean;

    constructor(OperacaoId: number, NomeOperacao: string, Configuracao: string, CfEstado: number, CfOutros: number, PisCofins: boolean) {
        this.OperacaoIdId = OperacaoId;
        this.NomeOperacao = NomeOperacao;
        this.Configuracao = Configuracao;
        this.CfEstado = CfEstado;
        this.CfOutros = CfOutros;
        this.PisCofins = PisCofins;
    }
}
