export class Tributacao {
    CRT: number;
    CfopNFCe:Cfop[];
    CsosnCstNFCe:CsnsoCst[];
    CsosnCstNFe:CsnsoCst[];
    CstPIS: CstPIS[];
    CstCOFINS: CstCOFINS[];

    constructor(crt: number, cfopNFCe : Cfop[], csosnCstNFCe: CsnsoCst[], csosnCstNFe: CsnsoCst[],
                cstPIS: CstPIS[], cstCOFINS: CstCOFINS[] ) {
        this.CRT = crt;
        this.CfopNFCe = cfopNFCe;
        this.CsosnCstNFCe = csosnCstNFCe;
        this.CsosnCstNFe = csosnCstNFe;
        this.CstPIS = cstPIS;
        this.CstCOFINS = cstCOFINS;
    }
}

export class Cfop {
    Codigo: string;
    Descricao: string;
    IsDefault: boolean;

    constructor(codigo : string, descricao: string, isDefault: boolean) {
      this.Codigo = codigo;
      this.Descricao = descricao;
      this.IsDefault = isDefault;
    }
}

export class CstPIS {
  Codigo: string;
  Descricao: string;
  IsDefault: boolean;

  constructor(codigo : string, descricao: string, isDefault: boolean) {
    this.Codigo = codigo;
    this.Descricao = descricao;
    this.IsDefault = isDefault;
  }
}

export class CstCOFINS {
  Codigo: string;
  Descricao: string;
  IsDefault: boolean;

  constructor(codigo : string, descricao: string, isDefault: boolean) {
    this.Codigo = codigo;
    this.Descricao = descricao;
    this.IsDefault = isDefault;
  }
}

export class CsnsoCst {
    Codigo: string;
    Descricao: string;
    IsDefault: boolean;

    constructor(codigo : string, descricao: string, isDefault: boolean) {
      this.Codigo = codigo;
      this.Descricao = descricao;
      this.IsDefault = isDefault;
    }
}
