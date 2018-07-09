import { Pais } from './pais';
import { Estado } from './estado';
import { Municipio } from './municipio';

export class Cep {
    Pais: Pais;
    Estado: Estado;
    Municipio: Municipio;

    Codigo: string;
    Bairro: string;
    Rua: string;

    constructor(Pais: Pais, Estado: Estado, Municipio: Municipio,
        Codigo: string, Bairro: string, Rua: string) {
        this.Pais = Pais;
        this.Estado = Estado;
        this.Municipio = Municipio;
        this.Codigo = Codigo;
        this.Bairro = Bairro;
        this.Rua = Rua;
    }

}
