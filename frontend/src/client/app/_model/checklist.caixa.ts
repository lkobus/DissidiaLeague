
export class Questionario {
    Id: string;
    Tipo: number;
    Descricao: string;
    Opcoes: QuestionarioOpcoes[];
    Ativo: boolean;
    Obrigatorio: boolean;
    constructor(id : string, nome: string, opcoes: QuestionarioOpcoes[]) {
        this.Id = id;
        this.Descricao = nome;
        this.Opcoes = opcoes;
        this.Ativo = true;
        this.Obrigatorio = false;
    } 
}

export class QuestionarioOpcoes {
    Tipo: number;
    Texto: string;
    
    constructor() {
        this.Tipo = 0;
        this.Texto = "";
    }
}

export class QuestionarioResposta {

    Pergunta: Questionario;
    Resposta: any;
}

export class TipoRespostaEnum {
    public static TEXT = new TipoRespostaEnum(1, "Texto");
    public static NUMERIC = new TipoRespostaEnum(2, "Numerico");
    public static SINGLE_SELECT = new TipoRespostaEnum(3, "Verdadeiro / Falso");

    Tipo: number;
    Texto: string;    
    constructor(codigo: number, descricao: string) {
        this.Tipo = codigo;
        this.Texto = descricao;
    }
}