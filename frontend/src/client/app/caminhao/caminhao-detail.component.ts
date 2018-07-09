import {
    Component, OnInit, EventEmitter, Output, ViewChild, ElementRef
} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Caminhao } from './model/caminhao';
import { UF } from './model/uf';
import { Estado } from '../_model/cep/estado';
import { CaminhaoService } from './shared/caminhao.service';
import { Subject } from 'rxjs/Subject';
import { ToastService } from '../_services/toast.service';
import { AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

@Component({
    moduleId: module.id,
    selector: 'sd-caminhao-detail',
    templateUrl: 'caminhao-detail.component.html'
})
export class CaminhaoDetailComponent implements OnInit {

    caminhao: Caminhao;
    restError: any;
    listEstados: Estado[];
    estados: Estado[];
    submitted = false;
    ufFranquia: string;
    desabilitaBotao = false;
    estadoUf: string;

    constructor(
        private caminhaoService: CaminhaoService,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private _toastService: ToastService
    ) { }

    ngOnInit(): void {
        this.route.paramMap
            .switchMap((params: ParamMap) => {
                var id = params.get('id');
                if (id) {
                    return this.caminhaoService.getCaminhaoById(id);
                } else {
                    return Promise.resolve().then(p => new Caminhao());
                }
            })
            .flatMap(caminhao => {
                this.caminhao = caminhao

                return this.caminhaoService.getUfFranquia();
            })
            .flatMap(dado => {
               if(this.caminhao.UF == null) {
                    this.caminhao.UF = dado.UF;
                } else {
                    this.caminhao.UF = this.caminhao.UF;
                }

                return this.caminhaoService.getEstados();
            })
            .flatMap(p => {
                this.estados = p

                return Observable.of(true);
            })
            .subscribe();
    }

    save(form: AbstractControl): void {
        this.restError = null;
        this.caminhao.VeiculoProprio = true;

        this.submitted = true;
        if (!form.valid) {
            this._toastService.errorNotification('', 'Por favor, verifique os campos informados');
            console.log('Form is invalid');
            this.desabilitaBotao = false;
            return;
        }

        this.caminhaoService.salvarCaminhao(this.caminhao)
            .subscribe(
            () => this.goBack(),
            (erro) => this.handleError(erro)
            );
        this.desabilitaBotao = true;
        this._toastService.sucessNotification('', 'Caminhão salvo com sucesso.');
    }

    getUfFranquia() {
        this.caminhaoService.getUfFranquia()
            .subscribe(response => {
                this.ufFranquia = response.UF;
            });
    }

    goBack(): void {
        this.router.navigate(['caminhao']);
    }

    private handleError(error: any) {
        if (error.Message) {
            this.restError = error.Message;
        }
    }
}