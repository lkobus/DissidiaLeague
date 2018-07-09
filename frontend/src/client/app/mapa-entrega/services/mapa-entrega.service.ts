import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, RequestOptionsArgs } from '@angular/http';

import { BaseService } from '../../_services/base.service';
import { Observable } from 'rxjs/Observable';

import { MapaEntrega, PedidoMapa, NotaMapaNew } from '../model/mapa-entrega';
import { PedidoEntrega } from '../model/pedido-entrega';

@Injectable()
export class MapaEntregaService extends BaseService {

    private readonly BASE_PATH = 'empresa/entrega';

    constructor(http: Http) {
        super(http);
    }

    getMapa(mapaId: string): Promise<MapaEntrega> {
        return this.doGet<MapaEntrega>(this.BASE_PATH + "/mapas/" + mapaId)
            .toPromise()
    }

    getMapasAbertos(): Promise<MapaEntrega[]> {
        return this.doGet<MapaEntrega[]>(this.BASE_PATH + "/mapas/abertos")
            .toPromise()
    }

    getMapasFechados(dataIni: Date, dataFin: Date): Promise<MapaEntrega[]> {
        return this.doGet<MapaEntrega[]>(this.BASE_PATH + "/mapas/fechados/" +
            dataIni.toISOString().split('T')[0] + "/" + dataFin.toISOString().split('T')[0])
            .toPromise()
    }

    getMapasFaturamento(): Promise<MapaEntrega[]> {
        return this.doGet<MapaEntrega[]>(this.BASE_PATH + "/mapas/faturamento")
            .toPromise();
    }

    getMapasProntoCarregar(): Promise<MapaEntrega[]> {
        return this.doGet<MapaEntrega[]>(this.BASE_PATH + "/mapas/prontocarregar")
            .toPromise();
    }

    getPedidosDisponiveis(): Promise<PedidoEntrega[]> {
        return this.doGet<PedidoEntrega[]>(this.BASE_PATH + "/pedidosdisponiveis")
            .toPromise()
    }

    createMapa(mapa: MapaEntrega): Promise<any> {
        return this.doPost<MapaEntrega>(mapa, this.BASE_PATH + "/mapas")
            .toPromise()
    }

    deleteMapa(mapaId: string): Promise<any> {
        return this.http.delete(this.BasePath() + this.BASE_PATH + "/mapas/" + mapaId)
            .toPromise();
    }

    updateVeiculo(mapaId: string, veiculoId: string): Promise<any> {
        return this.doPostWithoutBody(this.BASE_PATH + "/mapas/" + mapaId + "/veiculo/" + veiculoId)
            .toPromise();
    }

    updatePedidosMapa(mapaId: string, pedidos: any[]): Promise<any> {
        return this.doPut<PedidoMapa[]>(pedidos, this.BASE_PATH + "/mapas/" + mapaId)
            .toPromise()
    }

    recalcularMapa(mapaId: string, notas: NotaMapaNew[]): Promise<MapaEntrega> {
        return this.doPostOtherResult<NotaMapaNew[], MapaEntrega>(notas, this.BASE_PATH + "/mapas/" + mapaId + "/recalcular")
            .toPromise();
    }

    fecharMapa(mapa: MapaEntrega) {
        return this.doPost<MapaEntrega>(mapa, this.BASE_PATH + "/mapas/" + mapa.Id + "/fechar")
            .toPromise();
    }

    faturarMapa(mapa: MapaEntrega) {
        return this.doPostWithoutBody(this.BASE_PATH + "/mapas/" + mapa.Id + "/faturar")
            .toPromise();
    }

    removerNotaRejeitada(mapaId: string, notaFiscalId: string): Promise<any> {
        return this.doPostWithoutBody(this.BASE_PATH + "/mapas/" + mapaId + "/removernota/" + notaFiscalId)
            .toPromise();
    }

    imprimirMapa(mapaId: string): Promise<any> {
        return this.doDownloadFile(this.BASE_PATH + "/mapas/" + mapaId + "/imprimir")
            .toPromise()
    }
}
