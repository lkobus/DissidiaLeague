
export class Configuracoes {

}

export class FormaPagamentoVendaBalcao {
  Codigo: number;
  Descricao: string;
}

export class FormaPagamentoVendaExterna {
  Codigo: number;
  Descricao: string;
  PrazoMaximo: number;
  DisponivelParaClientesNovos: boolean;
}
