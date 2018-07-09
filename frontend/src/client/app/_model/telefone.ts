export class Telefone {

    TipoTelefone: number;
    NumeroTelefoneCompleto: string;

    constructor(tipoTelefone: number, numeroTelefoneCompleto: string) {
        this.TipoTelefone = tipoTelefone;
        this.NumeroTelefoneCompleto = numeroTelefoneCompleto;
    }
}

export class TipoTelefone {

    Codigo: number;
    Valor: string;

    public static FIXO: TipoTelefone = new TipoTelefone(1, "FIXO");
    public static CELULAR: TipoTelefone = new TipoTelefone(2, "CELULAR");

    private constructor(codigo: number, valor: string) {
        this.Codigo = codigo;
        this.Valor = valor;
    }
}