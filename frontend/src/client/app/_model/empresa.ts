import { Configuracoes, FormaPagamentoVendaBalcao, FormaPagamentoVendaExterna } from '../configuracoes/model/configuracoes';
import { Endereco } from '../_model/endereco';

export class Empresa {

    Id: string;
    Nome: string;
    Cnpj: string;
    Processos: any[];
    SegmentoPreco: any;
    FormasPagamentoVendaBalcao: FormaPagamentoVendaBalcao[];
    FormasPagamentoVendaExterna: FormaPagamentoVendaExterna[];
    LimiteCreditoPadrao: number;
    RaioGps: number;
    PercentualDescontoExterno: number;
    EstoqueMinimoPadraoBalcao: number;
    EstoqueMinimoPadraoExterno: number;
    CaixasDisponiveis: number;
    permiteCadastroProduto: boolean;
    PercentualDesconto: number;
    UtilizaCupomFiscal: boolean = true;
    PrazoCancelamentoCupomFiscal: number;
    PrazoCancelamentoNFe: number;
    Endereco: Endereco;
    TokenVendaExterna: string;
    latitude: number;
    longitude: number;
    PedeCpfBalcao: boolean;

    constructor() {
        this.Nome = '';
        this.Cnpj = '';
        this.Processos = null;
        this.SegmentoPreco = null;
        this.FormasPagamentoVendaBalcao = [];
        this.FormasPagamentoVendaExterna = [];
        this.CaixasDisponiveis = 1;
        this.PercentualDesconto = 0;
        this.UtilizaCupomFiscal = true;
        this.PrazoCancelamentoCupomFiscal = 0;
        this.PrazoCancelamentoNFe = 0;
        this.LimiteCreditoPadrao = 0;
        this.RaioGps = 0;
        this.PercentualDescontoExterno = 0;
        this.EstoqueMinimoPadraoBalcao = 0;
        this.EstoqueMinimoPadraoExterno = 0;
        this.TokenVendaExterna = '';
        this.latitude = 0;
        this.longitude = 0;
        this.PedeCpfBalcao = false;
    }
}
