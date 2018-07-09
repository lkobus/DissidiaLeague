export class Endereco {
    Estado: number;
    Logradouro: Logradouro;
    Complemento: string;
    Municipio: number;
    Pais: number;

    constructor() {
        this.Logradouro = new Logradouro();
    }
}

export class Pais {
    Codigo: number;
    Nome: string;

    constructor(codigo: number, nome: string) {
        this.Codigo = codigo;
        this.Nome = nome;
    }
}

export class Estado {
    Codigo: number;
    UF: string;
    Nome: string;

    constructor(codigo: number, uf: string, nome: string) {
        this.Codigo = codigo;
        this.UF = uf;
        this.Nome = nome;
    }
}

export class Municipio {
    Codigo: number;
    Nome: string;

    constructor(codigo: number, nome: string) {
        this.Codigo = codigo;
        this.Nome = nome;
    }
}

export class Logradouro {
    Rua: string;
    Numero: number;
    Bairro: string;
    CEP: string;

    // constructor(rua: string, numero: number, bairro: string, cep: string) {
    //     this.Rua = rua;
    //     this.Numero = numero;
    //     this.Bairro = bairro;
    //     this.CEP = cep;
    // }

}
