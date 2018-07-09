export class Frequencia {
    Vendedor: string;
    Perfil: number;
    Sazonalidade: number;
    DiasAtendimento: any[];
    DataInicio: string;
    DataUltimaVisita: string;

}

export class Sazonalidade {

    codigo: number;
    valor: string;

    constructor(codigo: number, valor: string) {
        this.codigo = codigo;
        this.valor = valor;
    }

    public static Quinzenal = new Sazonalidade(1, "Quinzenal");
    public static Mensal = new Sazonalidade(2, "Mensal");
    public static Semanal = new Sazonalidade(3, "Semanal");
}