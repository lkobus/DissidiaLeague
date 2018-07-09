import { TipoCalculo } from "./tipo-calculo";
import { RegraCalculo } from "./regra-calculo";
import { IndicadoresEnum } from "./indicadores-enum";
import { Empresa } from "../../_model/empresa";

export class Indicadores {
    DocumentId: string;
    Valor: number;
    TipoCalculo: TipoCalculo;
    RegraCalculo: RegraCalculo;
    IndicadoresEnum: IndicadoresEnum;
    IdRazaoSocialFranquia: string;
    NomeFranquia: string;
    DataMesMeta: Date;

    constructor() {
        this.DocumentId = null;
        this.Valor = null;
        this.TipoCalculo = new TipoCalculo();
        this.RegraCalculo = new RegraCalculo();
        this.IndicadoresEnum = new IndicadoresEnum();
        this.IdRazaoSocialFranquia = null;
        this.NomeFranquia = null;
        this.DataMesMeta = null;
    }
}