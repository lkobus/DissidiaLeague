import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions, RequestOptionsArgs } from "@angular/http";

import { BaseService } from "../../_services/base.service";
import { Pedido, Produto } from "../model/pedido";
import { Usuario } from "../../_model/usuario";
import { ProdutoEdicao } from "../model/produto-edicao";
import { ProdutoPreco } from "../model/produto-preco";
import { Empresa } from "../../_model/empresa";
import { FormaPagamentoVendaExterna } from "../../configuracoes/model/configuracoes";
import { Observable } from "rxjs/Observable";
import { AtivoGiroEdicao } from '../model/ativo-giro-edicao';

@Injectable()
export class PedidoService extends BaseService {
  constructor(http: Http) {
    super(http);
  }

  getPedidoResumo(id: string): Promise<Pedido> {
    return this.doGet<Pedido>("empresa/pedidos/resumo/" + id).toPromise();
  }

  getPedidos(dataInicial: Date): Promise<Pedido[]> {
    return this.doGet<Pedido[]>(
      "empresa/pedidos/" + dataInicial.toISOString().split("T")[0]
    ).toPromise();
  }

  getProdutosComPrecoMedio(clienteId: string): Observable<ProdutoPreco[]> {
    return this.doGet<ProdutoPreco[]>("empresa/pedidos/cliente/" + clienteId + "/produtos/preco/medio");
  }

  getProdutosComPrecoPorSegmento(clienteId: string): Observable<ProdutoPreco[]> {
    return this.doGet<ProdutoPreco[]>("empresa/pedidos/cliente/" + clienteId + "/produtos/preco/segmento");
  }

  getProdutosComPrecoPorSegmentoSemDesconto(clienteId: string): Observable<ProdutoPreco[]> {
    return this.doGet<ProdutoPreco[]>("empresa/pedidos/cliente/" + clienteId + "/produtos/preco/segmento/semdesconto");
  }

  getAtivosGiro(): Observable<AtivoGiroEdicao[]> {
    return this.doGet<AtivoGiroEdicao[]>("empresa/pedidos/ativosgiro");
  }

  faturarPedidos(pedidos: string[]): Promise<any> {
    let body: any[] = [];
    pedidos.forEach(p => {
      body.push({ Id: p });
    });
    return this.doPost<any>(body, "empresa/pedidos/faturar").toPromise();
  }

  baixarDanfe(pedidoId: string): Promise<any> {
    return this.doDownloadFile(
      "empresa/pedidos/" + pedidoId + "/download/danfe"
    ).toPromise();
  }

  baixarXml(pedidoId: string): Promise<any> {
    return this.doDownloadFile(
      "empresa/pedidos/" + pedidoId + "/download/xml"
    ).toPromise();
  }

  alterarPedido(pedido: Pedido): Promise<any> {
    return this.doPut<Pedido>(
      pedido,
      "empresa/pedidos/" + pedido.Id
    ).toPromise();
  }

  cancelarPedido(pedidoId: string): Promise<any> {
    return this.doPost<any>(
      {},
      "empresa/pedidos/" + pedidoId + "/cancelar"
    ).toPromise();
  }

  solicitarPedido(pedido: Pedido): Promise<Pedido> {
    return this.doPost<Pedido>(pedido, "empresa/pedidos/solicitar").toPromise();
  }

  solicitarPedidoConsumoInterno(pedido: Pedido): Promise<Pedido> {
    return this.doPost<Pedido>(pedido, "empresa/pedidos/consumointerno/solicitar").toPromise();
  }

  solicitarPedidoPerda(pedido: Pedido): Promise<Pedido> {
    return this.doPost<Pedido>(pedido, "empresa/pedidos/perda/solicitar").toPromise();
  }

  getProdutoImageURL(pedidoId: string) {
    return this.BasePath() + "empresa/produtos/" + pedidoId + "/upload/imagem";
  }

  getComodatoImageURL(id: string) {
    return this.BasePath() + "empresa/refrigeradores/" + id + "/upload/imagem";
  }

  getAtivoGiroImageURL(ativoId: string) {
    return this.BasePath() + "/empresa/ativo-giro/" + ativoId + "/upload/imagem";
  }

  previewProdutoEdicao(pedidoId: string, produto: ProdutoEdicao): Promise<Produto> {
    const headers = new Headers();
    this.contentTypeApplicationJson(headers);
    return this.http
      .post(
        this.BasePath() + "empresa/pedidos/edicao/produto/preview/" + pedidoId,
        produto,
        { headers: headers }
      )
      .toPromise()
      .then(response => response.json() as Produto)
      .catch(this.handleErrorPromise);
  }
}
