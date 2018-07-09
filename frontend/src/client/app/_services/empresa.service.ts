import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, RequestOptionsArgs } from "@angular/http";
import { BaseService } from "../_services/base.service";

import "rxjs/add/operator/toPromise";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import "rxjs/add/operator/catch";

import { Observable } from "rxjs/Rx";
import { NomeFantasiaEmpresa } from "./../_model/nome-fantasia";
import { Empresa } from "./../_model/empresa";
import { Cliente } from "../clientes/model/cliente";

@Injectable()
export class EmpresaService extends BaseService {
  constructor(http: Http) {
    super(http);
  }

  getEmpresaInfo(): Observable<Empresa> {
    return this.doGet<Empresa>("empresa/info");
  }

  uploadImagem(fileholder: any): Promise<any> {
    var url = this.BasePath() + "dissidia/match/upload";
    var formData = new FormData();
    formData.append('image', fileholder.file);
    return this.http.post(url, formData)
      .toPromise()      
      .catch(this.handleErrorPromise);
  }

  getEmpresaCliente(): Observable<Cliente> {
    return this.doGet<Cliente>("empresa/cliente");
  }

  //Busca nome fantasia da empresa para mostrar no toolbar
  getNomeFantasia(): Observable<NomeFantasiaEmpresa> {
    return this.doGet<NomeFantasiaEmpresa>("empresa");
  }
}
