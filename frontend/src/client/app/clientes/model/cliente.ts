import { Contato } from '../../_model/contato';
import { Endereco } from '../../_model/endereco';
import { Frequencia } from '../../frequencia-visita/model/frequencia';
import { Telefone } from '../../_model/telefone';
import { FormaPagamentoCliente } from '../../_model/formaPagametoCliente';

export class Cliente {
    Id: string;
    TipoPessoa: number;
    CnpjCpf: string;
    RazaoSocial: string;
    NomeFantasia: string;
    InscricaoEstadual: string;
    InscricaoMunicipal: string;
    TipoTributacao: number;
    Segmento: number;
    Email: string;
    Contato: Contato;
    Endereco: Endereco;
    Telefones: Telefone[];
    Latitude: number;
    Longitude: number;
    FrequenciasVisita: Frequencia[];
    FormasPagamento: FormaPagamentoCliente[];
    Status: number;
    LimiteCredito: number;

    constructor() {
        this.Endereco = new Endereco();
        this.Contato = new Contato();
        this.Telefones = [];
        this.FormasPagamento = [];
    }
}

export class StatusCliente {

    Codigo: number;
    Valor: string;

    public static readonly ATIVO: StatusCliente = new StatusCliente(1, "ATIVO");
    public static readonly INATIVO: StatusCliente = new StatusCliente(2, "INATIVO");
    public static readonly INDADIMPLENTE: StatusCliente = new StatusCliente(3, "INADIMPLENTE");

    private constructor(codigo: number, valor: string) {
        this.Codigo = codigo;
        this.Valor = valor;
    }
}

export class TipoPessoa {

    Codigo: number;
    Valor: string;

    public static readonly JURIDICA: TipoPessoa = new TipoPessoa(1, "PESSOA JURÍDICA");
    public static readonly FISICA: TipoPessoa = new TipoPessoa(2, "PESSOA FÍSICA");

    private constructor(codigo: number, valor: string) {
        this.Codigo = codigo;
        this.Valor = valor;
    }
}

export class TipoTributacao {
      Codigo: number;
      Valor: string;

      public static readonly VAREJISTA: TipoTributacao = new TipoTributacao(1, 'VAREJISTA');
      public static readonly ATACADISTA: TipoTributacao = new TipoTributacao(2, 'ATACADISTA');

      private constructor(codigo: number, valor: string) {
          this.Codigo = codigo;
          this.Valor = valor;
      }
  }

export class TipoImagem {

    Codigo: number;
    Valor: string;

    public static readonly FACHADA: TipoImagem = new TipoImagem(1, "FACHADA");
    public static readonly CNPJ: TipoImagem = new TipoImagem(2, "CNPJ");
    public static readonly ALVARA_FUNCIONAMENTO: TipoImagem = new TipoImagem(3, "ALVARA_FUNCIONAMENTO");
    public static readonly ALVARA_VIGILANCIA_SANITARIA: TipoImagem = new TipoImagem(4, "ALVARA_VIGILANCIA_SANITARIA");

    private constructor(codigo: number, valor: string) {
        this.Codigo = codigo;
        this.Valor = valor;
    }
}
