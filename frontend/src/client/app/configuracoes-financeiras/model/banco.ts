export class Banco {
    DocumentId: string;
    Codigo: number;
    Descricao: string;
    RetornoRemessa: boolean;

    constructor(documentId: string, codigo: number, descricao: string, retornoRemessa: boolean) {
        this.DocumentId = documentId;
        this.Codigo = codigo;
        this.Descricao = descricao;
        this.RetornoRemessa = retornoRemessa;
    }
}