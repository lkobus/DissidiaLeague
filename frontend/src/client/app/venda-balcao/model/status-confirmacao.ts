export class StatusConfirmacao {
    Valor: string;
    Codigo: number;

    constructor(codigo: number, valor: string) {
        this.Codigo = codigo;
        this.Valor = valor;
    }

    public static OK = new StatusConfirmacao(1, "OK");
    public static Rejeitado = new StatusConfirmacao(2, "Rejeitada");
    public static EmProgresso = new StatusConfirmacao(3, "Em progresso");
    public static Cancelado = new StatusConfirmacao(4, "Cancelada");
}