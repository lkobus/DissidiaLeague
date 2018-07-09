import { Component, OnInit } from '@angular/core';

import { NotificacaoService } from './shared/notificacao.service';
import { Notificacao } from './model/notificacao';

@Component({
    moduleId: module.id,
    selector: 'sd-notificacao',
    templateUrl: 'notificacao.component.html',
    styleUrls: ['notificacao.component.css']
})

export class NotificacaoComponent implements OnInit {

    notificacoes: Notificacao[];

    constructor(private notificacaoService: NotificacaoService) {
    }

    ngOnInit(): void {
        this.notificacaoService.requestNotificacoesNaoLidas()
            .then(notificacoes => {
                this.notificacoes = notificacoes;
                this.notificacaoService.marcarTodasComoLida();
            });
    }

}
