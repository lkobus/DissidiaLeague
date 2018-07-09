import { Telefone } from '../_model/telefone';

export class Contato {   
    TipoContato: number;
    RG: string;
    CPF: string;
    Nome: string;
    Fone: Telefone;
    Email: string;

    constructor() {
        this.Fone = new Telefone(0, null);
     }
}