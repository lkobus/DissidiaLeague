export class PedidoEntrega {

    Id: string;
    Valor: number;
    FormaPagamento: string;
    DataEntrega: string;
    PesoTotal: number = 0;
    VolumeTotal: number = 0;
    VendedorId: string;
    ClienteId: string;
    ClienteFantasia: string;
    ClienteLat: number;
    ClienteLng: number;
    Selecionado: boolean = true;

    constructor() { 
        this.Selecionado = true;
    }
}
