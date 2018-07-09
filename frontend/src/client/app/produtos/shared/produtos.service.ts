import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Produto } from '../model/produto';
import { Tributacao, Cfop } from '../../_model/tributacao';
import { BaseService } from '../../_services/base.service';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ProdutosService extends BaseService {

  constructor(http: Http) {
    super(http);
  }


  //---------------GET PRODUTO---------------
  getProdutos(): Promise<Produto[]> {
    var headers = new Headers();
    this.contentTypeApplicationJson(headers);

    return this.http.get(this.BasePath() + 'empresa/produtos', { headers: headers })
      .toPromise()
      .then(response => response.json() as Produto[])
      .catch(this.handleErrorPromise);
  }

  //---------------GET SPECIFIC PRODUTO---------------
  getProduct(id: string): Promise<Produto> {
    var headers = new Headers();
    this.contentTypeApplicationJson(headers);
    return this.http.get(this.BasePath() + 'empresa/produtos/' + id, { headers: headers })
      .toPromise()
      .then(response => response.json() as Produto)
      .catch(this.handleErrorPromise);
  }

  //---------------GET SPECIFIC PRODUTO---------------
  getProductWithPrices(id: string): Promise<Produto> {
    var headers = new Headers();
    this.contentTypeApplicationJson(headers);
    return this.http.get(this.BasePath() + 'empresa/produtos/' + id + '/precos', { headers: headers })
      .toPromise()
      .then(response => response.json() as Produto)
      .catch(this.handleErrorPromise);
  }

  //---------------GET PRODUTO---------------
  getProdutosWithPrices(): Promise<Produto[]> {
    var headers = new Headers();
    this.contentTypeApplicationJson(headers);

    return this.http.get(this.BasePath() + 'empresa/produtos/precos', { headers: headers })
      .toPromise()
      .then(response => response.json() as Produto[])
      .catch(this.handleErrorPromise);
  }

  //---------------GET TRIBUTACAO---------------
  getTributacao(): Promise<Tributacao> {
    var headers = new Headers();
    this.contentTypeApplicationJson(headers);

    return this.http.get(this.BasePath() + 'empresa/tributacao', { headers: headers })
      .toPromise()
      .then(response => response.json() as Tributacao)
      .catch(this.handleErrorPromise);
  }

  getCfop(procedencia: boolean, cst: string): Promise<Cfop> {
    var headers = new Headers();
    this.contentTypeApplicationJson(headers);

    return this.http.get(this.BasePath() + 'empresa/tributacao/cfop/' + procedencia + '/' + cst, { headers: headers })
      .toPromise()
      .then(response => response.json() as Cfop)
      .catch(this.handleErrorPromise);
  }

  //---------------DELETE SPECIFIC PRODUTO---------------
  deleteProduct(id: string): Promise<void> {
    var headers = new Headers();
    this.contentTypeApplicationJson(headers);
    return this.http.delete(this.BasePath() + 'empresa/produtos/' + id, { headers: headers })
      .toPromise()
      .catch(this.handleErrorPromise);
  }

  //---------------ADD PRODUTO---------------
  addProduct(product: Produto): Promise<Produto> {
    var headers = new Headers();
    this.contentTypeApplicationFormUrlEncoded(headers);

    const body = this.convertParams(product);
    return this.http.post(this.BasePath() + 'empresa/produtos', body.toString(), { headers: headers })
      .toPromise()
      .then(response => response.json() as Produto)
      .catch(this.handleErrorPromise);
  }

  uploadImagem(fileholder: any, product: Produto): Promise<any> {
    var url = this.getProdutoImageURL(product.id);
    var formData = new FormData();
    formData.append('image', fileholder.file);
    return this.http.post(url, formData)
      .toPromise()
      .then(() => Produto)
      .catch(this.handleErrorPromise);
  }

  getAtivoGiroImageURL(id: string) {
    return this.BasePath() + 'empresa/ativo-giro/' + id + '/upload/imagem';
  }

  getProdutoImageURL(id: string) {
    return this.BasePath() + 'empresa/produtos/' + id + '/upload/imagem';
  }

  //---------------UPDATE PRODUTO---------------`
  updateProduct(product: Produto): Promise<Produto> {
    var headers = new Headers();
    this.contentTypeApplicationFormUrlEncoded(headers);

    const body = this.convertParams(product);
    return this.http.put(this.BasePath() + 'empresa/produtos/' + product.id, body.toString(), { headers: headers })
      .toPromise()
      .then(() => Produto)
      .catch(this.handleErrorPromise);
  }

  //---------------IMPORT PRODUTO TRIBUTACO---------------`
  uploadCSVTributacao(fileholder: any) : Promise<any> {
    var url = this.BasePath() + 'empresa/produtos/tributacao/upload';
    var formData = new FormData();
    formData.append('csv', fileholder.file);
    return this.http.post(url, formData)
      .toPromise()
      .catch(this.handleError);
  }

  private convertParams(product: Produto): URLSearchParams {
    const body = new URLSearchParams();
    if (product.id === undefined) {
      body.set('id', '');
    } else { body.set('id', product.id.toString()); }
    body.set('codigo', product.codigo.toString());
    body.set('nome', product.nome);
    body.set('codigoEAN', product.codigoEAN.toString());
    body.set('precoUnitario', product.precoVendaBalcao.precoUnitarioVendaBalcao.toString().replace('.', ','));
    body.set('ncm', product.ncm);
    body.set('cest', product.cest);
    body.set('origem', product.origem.toString());
    body.set('ProcedenciaPropria', product.procedenciaPropria.toString());
    body.set('cstNFe', product.cstNFe);
    body.set('cstNFCe', product.cstNFCe);
    body.set('cfopNFCe', product.cfopNFCe);
    body.set('cstPIS', product.cstPIS);
    body.set('cstCOFINS', product.cstCOFINS);
    body.set('aliquotaIcms', product.aliquotaIcms.toString().replace('.', ','));
    body.set('valorBaseIcmsSt', product.valorBaseIcmsSt.toString().replace('.', ','));
    body.set('reducaoIcms', product.reducaoIcms.toString().replace('.', ','));
    body.set('aliquotaPisVarejo', product.aliquotaPisVarejo.toString().replace('.', ','));
    body.set('aliquotaPisAtacado', product.aliquotaPisAtacado.toString().replace('.', ','));
    body.set('aliquotaCofinsVarejo', product.aliquotaCofinsVarejo.toString().replace('.', ','));
    body.set('aliquotaCofinsAtacado', product.aliquotaCofinsAtacado.toString().replace('.', ','));
    body.set('valorMinimoPis', product.valorMinimoPis.toString().replace('.', ','));
    body.set('valorMinimoCofins', product.valorMinimoCofins.toString().replace('.', ','));
    body.set('pesoBruto', product.pesoBruto.toString().replace('.', ','));
    body.set('volume', product.volume.toString().replace('.', ','));
    return body;
  }
}
