export class AtivoGiroEdicao {
  public Id: string;
  public Codigo: number;
  public Nome: string;
  public Quantidade: number = 0;

  constructor(id: string, codigo: number, nome: string, quantidade: number) {
    this.Id = id;
    this.Codigo = codigo;
    this.Nome = nome;
    this.Quantidade = quantidade;
  }
}
