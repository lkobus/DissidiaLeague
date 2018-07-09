export class MapaEntrega {

    Id: string;
    StatusCodigo: number;
    StatusValor: string;
    Codigo: number;
    Descricao: string;
    UsuarioNome: string;
    ValorTotal: number = 0;
    ValorReal: number = 0;
    Data: string;
    PesoTotal: number = 0;
    VolumeTotal: number = 0;
    VeiculoId: string;
    VeiculoPlaca: string;

    PedidosQuantidade: number;
    Pedidos: PedidoMapa[];

    ContasFinanceiras: ContaFinanceira[];
    ContasFisicas: ContaFisica[];

    constructor() {
        this.Pedidos = [];
        this.ContasFinanceiras = [];
        this.ContasFisicas = [];
    }
}

export class PedidoMapa {

    Id: string;
    Valor: number = 0;
    FormaPagamento: string;
    DataEntrega: string;
    PesoTotal: number = 0;
    VolumeTotal: number = 0;
    VendedorId: string;
    ClienteId: string;
    ClienteFantasia: string;
    ClienteLat: number;
    ClienteLng: number;
    NotaFiscal: NotaMapaNew;
    NotaAlerta: string;
    Selecionado: boolean = true;

    constructor() {
        this.NotaFiscal = new NotaMapaNew;
    }
}

export class NotaMapaNew {

    Id: string;
    Serie: string;
    Numero: string;
    StatusCodigo: number;
    StatusValor: string;
    DataEntrega: string;

    constructor() { }
}

export class ContaFinanceira {

    FormaPagamentoCodigo: number;
    FormaPagamentoDescricao: string;
    Valor: number = 0;
    ValorReal: number = 0;

    constructor() { }
}

export class ContaFisica {

    AtivoGiroId: string;
    AtivoGiroCodigo: number;
    AtivoGiroDescricao: string;
    AtivoGiroTipo: string;
    Quantidade: number = 0;
    QuantidadeReal: number = 0;
    QuantidadeRetorno: number = 0;

    constructor() { }
}
