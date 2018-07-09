export class PrecoSegmentos {
    CodigoSegmento: number;
    DescricaoSegmento: string;
    PrecoPack: number;
    PrecoUnitario: number;
}

export class PrecoBalcao {
    precoUnitarioVendaBalcao: number = 0;
    precoPackVendaBalcao: number = 0;
}

export class Produto {
    id:string;
    codigo:number;
    nome:string;
    codigoEAN:string;
    produtoExterno: string = '';
    canEdit:boolean;
    promovido:boolean;
    tipo:string;
    precoSegmentos: PrecoSegmentos[];
    precoVendaBalcao: PrecoBalcao = new PrecoBalcao;
    origem: number = 0;
    ncm: string;
    cest: string;
    procedenciaPropria: boolean = false;
    cstNFCe: string = '';
    cstNFe: string = '';
    cfopNFCe: string = '';
    cstPIS: string = '';
    cstCOFINS: string = '';
    aliquotaIcms: number = 0;
    valorBaseIcmsSt: number = 0;
    reducaoIcms: number = 0;
    aliquotaPisVarejo: number = 0;
    aliquotaPisAtacado: number = 0;
    aliquotaCofinsVarejo: number = 0;
    aliquotaCofinsAtacado: number = 0;
    valorMinimoPis: number = 0;
    valorMinimoCofins: number = 0;
    unidadeMedida: string = 'UN';
    pesoBruto: number = 0;
    volume: number = 0;    

    attributeNames: string[] = ['id', 'codigo', 'nome', 'codigoEAN', 'produtoExterno', 'canEdit', 'promovido', 'precos'];

}
