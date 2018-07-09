export class Categorias{
    Codigo: number;
    Descricao: string;
    Id: string;

    constructor(Codigo: number, DocumentId: string, Descricao: string) {
        this.Codigo = Codigo;
        this.Id = DocumentId;
        this.Descricao = Descricao;
    }
}

