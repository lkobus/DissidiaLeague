import { ContagemFrequenciaDTO } from './contagem-frequencia-dto';

export class ContagemFrequenciaVendedorDTO {
    nomeVendedor : string;
    origem: string;
    contagens: ContagemFrequenciaDTO[];
    idVendedor : string;
    perfil : number;
}
