import { FiltroRange } from "../../_directives/export-modal/export-modal.component";

export class NotaFiscalFilter {
    TipoNota: number;
    VendedorId: string;
    ClienteId: string;
    Periodo: FiltroRange;

    constructor(tipoNota: number, vendedorId: string, clienteId: string, initial: Date, final: Date) {
        this.TipoNota = tipoNota;
        this.VendedorId = vendedorId;
        this.ClienteId = clienteId;
        this.Periodo = new FiltroRange(initial, final);
    }
}