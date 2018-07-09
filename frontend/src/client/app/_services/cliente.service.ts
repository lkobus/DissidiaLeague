import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, RequestOptionsArgs } from '@angular/http';

import { Estado } from '../_model/cep/estado';
import { Municipio } from '../_model/cep/municipio';

import { Cliente, StatusCliente, TipoPessoa, TipoTributacao } from '../clientes/model/cliente';
import { SegmentoPreco } from '../_model/segmento-preco';
import { Telefone, TipoTelefone } from '../_model/telefone';
import { Empresa } from '../_model/empresa';
import { Endereco } from '../_model/endereco';

import * as moment from 'moment'
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { EnvConfiguration } from '../shared/config/env.config';
import { BaseService } from './base.service';
import { Frequencia } from '../frequencia-visita/model/frequencia';

@Injectable()
export class ClienteService extends BaseService {

    private readonly _path = this.BasePath() + 'empresa/clientes/';
    private readonly _mapsAPI = 'https://maps.googleapis.com/maps/api/geocode/json?address=';

    constructor(http: Http) {
        super(http);
    }

    GetById(id: string): Observable<Cliente> {
        var headers = new Headers();
        this.contentTypeApplicationJson(headers);
        return this.http.get(this._path + '/' + id, { headers: headers })
            .map(response => response.json())
            .catch(this.handleError);
    }

    getAllClientes(): Observable<Cliente[]> {
        var headers = new Headers();
        return this.http.get(this._path, { headers: headers })
            .map(response => response.json() as Cliente[]);
    }

    getCliente(id: string): Promise<Cliente> {
        var headers = new Headers();
        return this.http.get(this._path + id, { headers: headers })
            .toPromise()
            .then(response => response.json() as Cliente);
    }

    addCliente(cliente: Cliente): Promise<Cliente> {
        var headers = new Headers();
        this.contentTypeApplicationJson(headers);

        const body = this.convertParams(cliente);
        return this.http.post(this._path, body.toString(), { headers: headers })
            .toPromise()
            .then(response => response.json() as Cliente)
            .catch(this.handleErrorPromise);
    }

    updateCliente(cliente: Cliente): Promise<Cliente> {
        var headers = new Headers();
        this.contentTypeApplicationJson(headers);

        const body = this.convertParams(cliente);
        return this.http.put(this._path + cliente.Id, body.toString(), { headers: headers })
            .toPromise()
            .then(response => response.json() as Cliente)
            .catch(this.handleErrorPromise);
    }

    deleteCliente(id: string): Promise<void> {
        var headers = new Headers();
        this.contentTypeApplicationJson(headers);

        return this.http.delete(this._path + id, { headers: headers })
            .toPromise()
            .catch(this.handleErrorPromise);
    }

    inativarCliente(id: string): Promise<void> {
        var headers = new Headers();
        this.contentTypeApplicationJson(headers);

        return this.http.post(this._path + id + "/inativar", { headers: headers })
            .toPromise()
            .catch(this.handleErrorPromise);
    }

    reativarCliente(id: string): Promise<void> {
        var headers = new Headers();
        this.contentTypeApplicationJson(headers);

        return this.http.post(this._path + id + "/reativar", { headers: headers })
            .toPromise()
            .catch(this.handleErrorPromise);
    }

    getSegmentosPreco(): Observable<SegmentoPreco[]> {
        var headers = new Headers();
        return this.http.get(this.BasePath() + 'segmentos', { headers: headers })
            .map(response => response.json() as SegmentoPreco[]);
    }

    getStatusCliente(): Observable<StatusCliente[]> {
        var headers = new Headers();
        return this.http.get(this._path + 'status', { headers: headers })
            .map(response => response.json() as StatusCliente[]);
    }

    getTiposTelefone(): Observable<TipoTelefone[]> {
        var headers = new Headers();
        return this.http.get(this.BasePath() + 'telefone/tipos', { headers: headers })
            .map(response => response.json() as TipoTelefone[]);
    }

    getTiposPessoa(): Observable<TipoPessoa[]> {
        var headers = new Headers();
        return this.http.get(this.BasePath() + 'pessoa/tipos', { headers: headers })
            .map(response => response.json() as TipoPessoa[]);
    }

    getTiposTributacao(): Observable<TipoTributacao[]> {
        var headers = new Headers();
        return this.http.get(this.BasePath() + 'tributacao/tipos', { headers: headers })
            .map(response => response.json() as TipoTributacao[]);
    }

    getEstados(): Observable<Estado[]> {
        return this.doGet<Estado[]>('baseCep/estados');
    }

    getEstadosAny(): Observable<any> {
        return this.doGetAny('baseCep/estados');
    }

    getMunicipios(codigoEstado: number): Observable<Municipio[]> {
        return this.doGet<Municipio[]>('baseCep/municipios/' + codigoEstado);
    }

    getMunicipiosAny(codigoEstado: number): Observable<any> {
        return this.doGetAny('baseCep/municipios/' + codigoEstado);
    }

    getMunicipiosFranquia(): Observable<any> {
        return this.doGet<Municipio[]>('baseCep/municipios/');
    }

    getEmpresaInfo(): Observable<Empresa> {
        var headers = new Headers();
        return this.http.get(this.BasePath() + 'empresa/info', { headers: headers })
            .map(response => response.json() as Empresa);
    }

    uploadImagem(fileholder: any, id: string, tipoImagem: number): Promise<any> {
        var url = this.getImagemClienteUrl(id, tipoImagem);
        var formData = new FormData();
        formData.append('image', fileholder.file);
        return this.http.post(url, formData)
            .toPromise()
            .catch(this.handleErrorPromise);
    }

    getImagemClienteUrl(id: string, tipoImagem: number): string {
        return this._path + id + '/imagem/' + tipoImagem;
    }

    getGeoLocation(address: string[]): Promise<any> {
        if (!address || address.length == 0) {
            let result: any = {
                lat: 0,
                lng: 0
            };
            return Promise.resolve().then(result);
        }

        let pattern = /\s/g;
        let params: string = '';
        address.forEach(a => params += ',' + a.replace(pattern, '+'));
        params = params.substring(1);

        return this.http.get(this._mapsAPI + params)
            .toPromise()
            .then(response => {
                let result: any = { lat: 0, lng: 0 };
                let apiResult = response.json();
                if (apiResult.status == 'OK') {
                    result.lat = apiResult.results[0].geometry.location.lat;
                    result.lng = apiResult.results[0].geometry.location.lng;
                }
                return result;
            });
    }

    SalvarFrequencia(id: string, frequencia: Frequencia) {
        var headers = new Headers();
        this.contentTypeApplicationJson(headers);
        return this.http.put(this._path + '/' + id + '/' + 'frequencia', frequencia, { headers: headers })
            .map(response => {
                try {
                    response.json();
                } catch (error) { }
            })
            .catch(this.handleError);
    }

    GetProximaVisita(frequencia: Frequencia) {
        var headers = new Headers();
        this.contentTypeApplicationJson(headers);
        return this.http.post(this._path + 'proximaVisita', frequencia, { headers: headers })
            .map(response => response.json())
            .catch(this.handleError);
    }

    exportClientes(): Observable<any> {
        var headers = new Headers();
        return this.http.get(this._path + '/export', { headers: headers });
    }

    uploadCSV(fileholder: any): Promise<any> {
        var formData = new FormData();
        formData.append('csv', fileholder.file);
        return this.http.post(this._path + '/upload', formData)
            .toPromise()
            .catch(this.handleError);
    }

    private convertParams(cliente: Cliente): string {
        return JSON.stringify(cliente);
    }

}
