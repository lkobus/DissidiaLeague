import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { GenericResponse } from '../_model/index';
import { AlertService } from '../_services/alert.service';
import { VendaBalcaoService } from './services/venda-balcao.service';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
    moduleId: module.id,
    selector: 'venda-balcao-cancelar',
    templateUrl: 'venda-balcao-cancelar.component.html',
    styleUrls: []
})
export class VendaBalcaoCancelarComponent implements OnInit {

    vendaId: string;
    motivo: string
    serverError: any;

    constructor(
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private location: Location,
        private alertService: AlertService,
        private vendaBalcaoService: VendaBalcaoService
    ) { }

    ngOnInit(): void {
        this.activatedRouter.paramMap
            .subscribe((params: ParamMap) => {
                this.vendaId = params.get('id');
            });
    }

    cancelarVenda() {
        this.serverError = null;
        this.vendaBalcaoService
            .cancelarVenda(this.vendaId, this.motivo)
            .then(response => this.goBack())
            .catch(error => this.handleServerError(error));
    }

    goBack() {
        this.location.back();
    }

    private handleServerError(serverResponse: GenericResponse) {
        this.serverError = serverResponse.message;
        window.scrollTo(0, 0);
    }
}