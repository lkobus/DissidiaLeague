export class ConfiguracoesFinanceiras {
    public BancoId: string;
    public NumeroRemessa: number;
    public CodigoAgencia: number;
    public DigitoAgencia: number;
    public ContaCorrente: number;
    public DigitoContaCorrente: number;
    public TarifaBancaria: number;
    public NumeroConvenio: number;
    public PrimeiraInstrucao: number;
    public SegundaInstrucao: number;
    public PercentualMulta: number;
    public JurosMes: number;
    public NossoNumero: number;
    public CodigoVariacaoCarteira: number;
    public CodigoCarteira: number;

    constructor(bancoId: string, numeroRemessa: number, codigoAgencia: number, digitoAgencia: number, contaCorrente: number,
        digitoContaCorrente: number, tarifaBancaria: number, numeroConvenio: number, primeiraInstrucao: number,
        segundaInstrucao: number, percentualMulta: number, jurosMes: number, nossoNumero: number, codigoVariacaoCarteira: number, codigoCarteira: number) {
        this.BancoId = bancoId;
        this.NumeroRemessa = numeroRemessa;
        this.CodigoAgencia = codigoAgencia;
        this.DigitoAgencia = digitoAgencia;
        this.ContaCorrente = contaCorrente;
        this.DigitoContaCorrente = digitoContaCorrente;
        this.TarifaBancaria = tarifaBancaria;
        this.NumeroConvenio = numeroConvenio;
        this.PrimeiraInstrucao = primeiraInstrucao;
        this.SegundaInstrucao = segundaInstrucao;
        this.PercentualMulta = percentualMulta;
        this.JurosMes = jurosMes;
        this.NossoNumero = nossoNumero;
        this.CodigoVariacaoCarteira = codigoVariacaoCarteira;
        this.CodigoCarteira = codigoCarteira;
    }
}