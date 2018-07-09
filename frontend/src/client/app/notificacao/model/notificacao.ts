export class Notificacao {

    public Id: string;
    public Tipo: number;
    public Status: number;
    public Modulo: number;
    public Titulo: string;
    public Descricao: string;
    public SubTitulo: string;
    public ImagemUri: string;
    public DataNotificacao: Date;
    public DataLeitura: Date;
    public UsuarioId: string;

    constructor(Id: string, Tipo: number, Status: number, Modulo: number,
        Titulo: string, Descricao: string, SubTitulo: string, ImagemUri: string,
        DataNotificacao: Date, DataLeitura: Date, UsuarioId: string) {
        this.Id = Id;
        this.Tipo = Tipo;
        this.Status = Status;
        this.Modulo = Modulo;
        this.Titulo = Titulo;
        this.Descricao = Descricao;
        this.SubTitulo = SubTitulo;
        this.ImagemUri = ImagemUri;
        this.DataNotificacao = DataNotificacao;
        this.DataLeitura = DataLeitura;
        this.UsuarioId = UsuarioId;
    }

}
