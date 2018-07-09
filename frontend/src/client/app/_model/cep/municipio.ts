import { Estado } from './estado';

export class Municipio {
    Codigo: number;
    Nome: string;
    Estado: Estado;

    constructor(Codigo: number, Nome: string, Estado: Estado) {
        this.Codigo = Codigo;
        this.Nome = Nome;
        this.Estado = Estado;
    }

}
