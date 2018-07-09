export class EstoqueMovimento {

    Id: string;
    TipoMovimento: number;
    Usuario: UsuarioMovimento;
    Valor: number;
    Origem: number;
    OrigemId: string;
    Data: string;

    constructor() {
        this.Usuario = new UsuarioMovimento(null, -1, null);
    }
}

export class UsuarioMovimento {

    Id: string;
    Codigo: number;
    Nome: string;

    constructor(Id: string, Codigo: number, Nome: string) {
        this.Id = Id;
        this.Codigo = Codigo;
        this.Nome = Nome;
    }
}

export class TipoMovimento {

    static readonly ENTRADA: TipoMovimento = new TipoMovimento(1, 'ENTRADA');
    static readonly SAIDA: TipoMovimento = new TipoMovimento(2, 'SAÍDA');

    Codigo: number;
    Valor: string;

    constructor(codigo: number, valor: string) {
        this.Codigo = codigo;
        this.Valor = valor;
    }
}

export class Origem {

    static readonly ENTRADA_MANUAL: Origem = new Origem(1, 'ENTRADA MANUAL');
    static readonly ENTRADA_NOTA: Origem = new Origem(2, 'ENTRADA POR NOTA');
    static readonly SAIDA_MANUAL: Origem = new Origem(3, 'SAÍDA MANUAL');
    static readonly VENDA_PRODUTO: Origem = new Origem(4, 'VENDA DE PRODUTO');
    static readonly CANCELAMENTO_VENDA: Origem = new Origem(5, 'CANCELAMENTO DE VENDA');
    static readonly TRANSFERENCIA_ESTOQUE: Origem = new Origem(6, 'TRANSFERÊNCIA DE ESTOQUE');
    static readonly CANCELAMENTO_NFE: Origem = new Origem(7, 'CANCELAMENTO DE NOTA FISCAL');
    static readonly DEVOLUCAO_NFE: Origem = new Origem(8, 'DEVOLUÇÃO DE NOTA FISCAL');
    static readonly RETORNO_ATIVOGIRO: Origem = new Origem(9, 'RETORNO DE ATIVO DE GIRO');
    static readonly CARGA_INICIAL: Origem = new Origem(10, 'CARGA INICIAL');
    static readonly CONSUMO_INTERNO: Origem = new Origem(11, 'CONSUMO INTERNO');
    static readonly PERDA_QUEBRA_ROUBO: Origem = new Origem(12, 'PERDA/QUEBRA/ROUBO');
    static readonly CANCELAMENTO_CONSUMO_INTERNO: Origem = new Origem(13, 'CANCELAMENTO DE CONSUMO INTERNO');
    static readonly CANCELAMENTO_PERDA_QUEBRA_ROUBO: Origem = new Origem(14, 'CANCELAMENTO DE PERDA/QUEBRA/ROUBO');

    Codigo: number;
    Valor: string;

    constructor(codigo: number, valor: string) {
        this.Codigo = codigo;
        this.Valor = valor;
    }
}
