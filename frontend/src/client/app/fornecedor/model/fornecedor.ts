export class Fornecedor{
    Id: string;
    CNPJ: string;
    RazaoSocial: string;

    constructor(DocumentId: string, CNPJ: string, RazaoSocial: string){
        this.Id = DocumentId;
        this.CNPJ = CNPJ;
        this.RazaoSocial = RazaoSocial;
    }
}