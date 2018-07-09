export class TipoTitulo {
  static Pagar = new TipoTitulo(1, "Pagar");
  static Receber = new TipoTitulo(2, "Receber");

  public codigo: number;
  public descricao: string;

  constructor(codigo: number, descricao: string) {
    this.codigo = codigo;
    this.descricao = descricao;
  }
}
export class Beneficiario {

  public cnpj: number;
  public razaoSocial: string;

  constructor(codigo: number, descricao: string) {
    this.cnpj = codigo;
    this.razaoSocial = descricao;
  }
}

export class ExtratoFinanceiro {
  public pagamentos: Titulo[];
  public recebimentos: Titulo[];
}

interface IFormaPagamento {
  codigo: number;
  descricao: string;
}
export class FormaPagamento implements IFormaPagamento {
  codigo: number;
  descricao: string;

  constructor(formaPagamento?: IFormaPagamento) {
    this.codigo = formaPagamento == null ? 0 : formaPagamento.codigo;
    this.descricao = formaPagamento == null ? "" : formaPagamento.descricao;
  }
}

export class Remessas {
  public remessasBancarias: RemessasBancarias[];
  public totalBoletosPendentes: number;
}

export class RemessasBancarias {
  public documentId: string;
  public nomeBanco: string;
  public dataRemessa: string;
  public numero: number;
  public quantidadeBoletos: number;
  public titulos: Titulo[];
}

export class Titulo {

  public documentId: string;
  public valor: number;
  public dataDocumento: string;
  public dataVencimento: string;
  public dataPagamento: string;
  public beneficiario: Beneficiario;
  public categoria: Categoria;
  public formaPagamento: FormaPagamento;
  public status: Status;
  public valorPago: number;
  public valorReceber: number;

  constructor() {
    this.valorReceber = 0;
  }
}
export class Status {

  public static Todos = new Status(0, 'Todos');
  public static Pendente = new Status(1, 'Pendente');
  public static Recebido = new Status(2, 'Recebido');
  public static Atrasado = new Status(3, 'Atrasado');
  public static Cancelado = new Status(4, 'Cancelado');

  public codigo: number;
  public descricao: string;

  constructor(codigo: number, descricao: string) {
    this.codigo = codigo;
    this.descricao = descricao;
  }
}

export class FinalidadeCategoriaEnum {
  codigo: number;
  valor: string;

  public static Pagar: FinalidadeCategoriaEnum = new FinalidadeCategoriaEnum(1, "Pagar");
  public static Receber: FinalidadeCategoriaEnum = new FinalidadeCategoriaEnum(2, "Receber");

  constructor(codigo: number, valor: string) {
    this.codigo = codigo;
    this.valor = valor;
  }
}


export class Categoria {

  public static readonly Puxada = new Categoria(1, "Puxada", [FinalidadeCategoriaEnum.Pagar.codigo]);
  public static readonly Balcao = new Categoria(2, "Balcão", [FinalidadeCategoriaEnum.Receber.codigo]);
  public static readonly Pedido = new Categoria(3, "Pedido", [FinalidadeCategoriaEnum.Receber.codigo]);


  public codigo: number;
  public descricao: string;
  public finalidade: number[];

  constructor(codigo: number, descricao: string, finalidade: number[]) {
    this.finalidade = finalidade;
    this.descricao = descricao;
    this.codigo = codigo;
  }
}

