import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, RequestOptionsArgs, ResponseContentType } from '@angular/http';

import { Notificacao } from '../model/notificacao';
import { BaseService } from '../../_services/base.service';
import { AuthenticationService } from '../../_services/authentication.service';

@Injectable()
export class NotificacaoService extends BaseService {

    notificacoesNaoLidas: Notificacao[] = [];

    private readonly BASE_PATH = 'empresa/notificacoes/';

    constructor(http: Http, private authenticationService: AuthenticationService) {
        super(http);
    }

    requestNotificacoesLidas(): Promise<Notificacao> {
        return this.doGet<Notificacao>(this.BASE_PATH + 'lidas')
            .toPromise();
    }

    requestNotificacoesNaoLidas(): Promise<Notificacao[]> {
        return this.doGet<Notificacao[]>(this.BASE_PATH + 'naolidas')
            .toPromise()
            .then(notificacoes =>
                this.notificacoesNaoLidas = notificacoes
            );
    }

    marcarTodasComoLida(): Promise<any> {
        var usuarioId = this.authenticationService.getUserId();
        var method = this.BASE_PATH + usuarioId + '/todasLida';
        return this.doPostWithoutBody(method)
            .toPromise()
            .then(value => this.notificacoesNaoLidas = []);
    }

    marcarNotificacaoComoLida(notificacao: Notificacao): Promise<any> {
        var usuarioId = this.authenticationService.getUserId();
        var method = this.BASE_PATH + notificacao.Id + '/' + usuarioId + '/lida';
        return this.doPostWithoutBody(method)
            .toPromise()
            .then(value => this.notificacoesNaoLidas.splice(this.notificacoesNaoLidas.indexOf(notificacao), 1));
    }

    getUrlImagemNotificacao(imagemUri: string): string {
        return this.BasePath() + imagemUri;
    }

}
