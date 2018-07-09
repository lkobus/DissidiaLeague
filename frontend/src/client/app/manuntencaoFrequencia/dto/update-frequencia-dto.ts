import { Cliente } from '../../clientes/model/cliente';

export class UpdateFrequenciaDto {
    idVendedor: string;
    dia:number;
    cliente:string;
    tipoAlteracao:number;
    ordem:number;
    codigoPerfil:number;

}
