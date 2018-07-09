import { Login } from '../login/model/login';

export class Usuario {
    id: string;
    codigo: number;
    nome: string;
    cpf: string;
    perfil: number;
    senhaTemporaria: string = null;
    credentials: Login;

    attributeNames: string[] = ['id', 'codigo', 'nome', 'cpf', 'perfil', 'credentials'];

    constructor(id: string, codigo: number, nome: string, cpf: string, perfil: number, credentials: Login) {
        this.id = id;
        this.codigo = codigo;
        this.nome = nome;
        this.cpf = cpf;
        this.perfil = perfil;
        this.credentials = credentials;
    }
}

export class Perfil {
    Codigo: number;
    Nome: string;

    attributeNames: string[] = ['Codigo', 'Nome'];

    constructor(codigo: number, nome: string) {
        this.Codigo = codigo;
        this.Nome = nome;
    }

    public static ADMIN = new Perfil(1, "Admin");
    public static VDE = new Perfil(2, "Vendedor Externo");
    public static VENDA_BALCAO = new Perfil(3, "Venda Balcão");
    public static FINANCEIRO = new Perfil(4, "Financeiro");
    public static VDI = new Perfil(5, "Vendedor Interno");

    public static From(codigo) {
        if (codigo == Perfil.ADMIN.Codigo) {
            return Perfil.ADMIN;
        } else if (codigo == Perfil.VDE.Codigo) {
            return Perfil.VDE;
        } else if (codigo == Perfil.VENDA_BALCAO.Codigo) {
            return Perfil.VENDA_BALCAO;
        } else if (codigo == Perfil.FINANCEIRO.Codigo) {
            return Perfil.FINANCEIRO;
        } else if (codigo == Perfil.VDI.Codigo) {
            return Perfil.VDI;
        }
        return null;
    }

}
