import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { BaseService } from '../../_services/base.service';
import { Cliente } from '../../clientes/model/cliente';
import { UpdateFrequenciaDto } from './../dto/update-frequencia-dto';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';
import { ContagemFrequenciaVendedorDTO } from './../dto/contagem-frequencia-vendedor-dto';

@Injectable()
export class ManuntencaoFrequenciaService extends BaseService {

  constructor(http: Http) {
    super(http);
  }

  getContagemFrequenciasVendedores(): Promise<ContagemFrequenciaVendedorDTO[]> {
    var headers = new Headers();
    this.contentTypeApplicationJson(headers);

    return this.http.get(this.BasePath() + 'frequencia/contagem/vendedores', { headers: headers })
      .toPromise()
      .then(response => response.json() as ContagemFrequenciaVendedorDTO[])
      .catch(this.handleErrorPromise);

  }

  getListagemClientes(idVendedor:string, dia:number): Promise<Cliente[]> {
    var headers = new Headers();
    this.contentTypeApplicationJson(headers);
    var retorno =  this.http.get(
      this.BasePath() + 'frequencia/vendedor/clientes/' + idVendedor + '/' + dia, { headers: headers })
      .toPromise()
      .then(response => response.json() as Cliente[])
      .catch(this.handleErrorPromise);
      return retorno;
  }

  getClientesSemVisita(): Promise<Cliente[]> {
    var headers = new Headers();
    this.contentTypeApplicationJson(headers);
    var retorno =  this.http.get(
      this.BasePath() + 'frequencia/clientes/semvisitas', { headers: headers })
      .toPromise()
      .then(response => response.json() as Cliente[])
      .catch(this.handleErrorPromise);
      return retorno;
  }


  updateFrequenciaVendedor(body:UpdateFrequenciaDto[]) {
    var headers = new Headers();
    this.contentTypeApplicationJson(headers);
    return this.http.put(this.BasePath() + 'frequencia/clientes', JSON.stringify(body), { headers: headers })
      .toPromise()
      .then(response => response)
      .catch(this.handleErrorPromise);
  }

  export(): Observable<any> {
    var headers = new Headers();
    return this.http.get(this.BasePath() + 'frequencia/export', { headers: headers });
  }

  uploadCSV(fileholder: any): Promise<any> {
      var formData = new FormData();
      formData.append('csv', fileholder.file);
      return this.http.post(this.BasePath() + 'frequencia/import', formData)
          .toPromise()
          .catch(this.handleError);
  }

}
