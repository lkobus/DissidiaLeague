import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ToastService } from '../_services/toast.service';
import { GenericResponse } from '../_model/index';
import { NotaFiscalService } from './services/nota-fiscal.service';
import { ProdutosService } from '../produtos/shared/produtos.service';
import { Observable } from 'rxjs/Rx';

import { NotaFiscal } from './model/nota-fiscal';

import { Subject } from 'rxjs/Subject';

@Component({
    moduleId: module.id,
    selector: 'nota-fiscal-resumo',
    templateUrl: 'nota-fiscal-detail.component.html'
})
export class NotaFiscalDetailComponent implements OnInit {

    isLoading: boolean = false;
    notaFiscal: NotaFiscal = new NotaFiscal;
    allowEdit: boolean = false;
    allowCancel: boolean = false;

    @Output() searchChangeEmitter: EventEmitter<any> = new EventEmitter<any>();
    searchUpdated: Subject<string> = new Subject<string>();
    inputSearch: string;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private toastService: ToastService,
        private notaFiscalService: NotaFiscalService,
        private produtoService: ProdutosService
    ) {
    }

    ngOnInit() {
        this.isLoading = true;
        this.activatedRoute.paramMap
            .switchMap((params: ParamMap) => {
                let id = params.get('id');
                return this.notaFiscalService.getNotaFiscalResumo(id);
            })
            .flatMap(data => {
                this.setNotaFiscal(data);
                return this.produtoService.getProdutos();
            })
            .catch(error => {
                this.handleServerError(error);
                return Observable.of(error);
            })
            .subscribe(() => this.isLoading = false);
    }

    setNotaFiscal(notaFiscal: NotaFiscal): void {
        this.notaFiscal = notaFiscal;
        this.allowCancel = false;
    }

    getStateMapa(statusMapa: string) {
        if (statusMapa.toLocaleUpperCase() == 'FECHADO'
            || statusMapa.toLocaleUpperCase() == 'PRONTO PARA CARREGAR') {
            return 'c-ok';
        }
        return 'c-warning';
    }

    cancelarNotaFiscal(): void {
        this.isLoading = true;
        this.notaFiscalService.cancelarNotaFiscal(this.notaFiscal.Id)
            .then(() => {
                return this.notaFiscalService.getNotaFiscalResumo(this.notaFiscal.Id);
            })
            .then(data => {
                this.isLoading = false;
                this.goBack();
            })
            .catch(error => {
                this.isLoading = false;
                this.handleServerError(error);
            });
    }

    getProdutoImageURL(produtoId: string): string {
        return this.notaFiscalService.getProdutoImageURL(produtoId);
    }

    goBack(): void {
        this.toastService.clearAllNotifications();
        this.router.navigate(['notas-fiscais']);
    }

    private handleServerError(error: GenericResponse): void {
        if (error.message) {
            this.toastService.errorNotification('', error.message);
        } else {
            this.toastService.errorNotification('', 'Falha ocorrida');
        }
    }
}
