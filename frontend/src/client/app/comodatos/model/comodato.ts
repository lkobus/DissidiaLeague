import { Cliente } from '../../clientes/model/cliente';
import { Refrigerador } from './refrigerador';

export class Comodato {
    id:string;
    refrigerador:Refrigerador;
    valor: number;
    cliente: Cliente;
    dataSolicitacao: string;
    dataVencimento: string;
    mensagemDanfe: string;
    nomeCliente: string;
    clienteId: string;
    refrigeradorId: string;
    status: number;

    constructor() {
      this.id = '';
      this.valor = 0;
      this.cliente = new Cliente();
      this.refrigerador = new Refrigerador();
      this.dataSolicitacao = '';
      this.dataVencimento = '';
      this.mensagemDanfe = '';
      this.nomeCliente = '';
      this.clienteId = '';
      this.refrigeradorId = '';
      this.status = 0;
  }
}

export class ComodatoSolicitado {
  ClienteId:string;
  RefrigeradorId:string;
  DataVencimento: string;
  mensagemDanfe: string;
  Valor: number;

  constructor() {
    this.ClienteId = '';
    this.RefrigeradorId = '';
    this.DataVencimento = '';
    this.mensagemDanfe = '';
    this.Valor - 0;
  }
}

export class FiltroComodatoEnum {
  public static TODOS = new FiltroComodatoEnum(1, "Todos");
  public static VIGOR = new FiltroComodatoEnum(2, "Em vigor");
  public static VENCIDOS = new FiltroComodatoEnum(3, "Vencidos");
  public static SOLICITACAO = new FiltroComodatoEnum(4, "Solicitação");

  Codigo: number;
  Descricao: string;
  private constructor(codigo: number, descricao: string) {
      this.Codigo = codigo;
      this.Descricao = descricao;
  }
}