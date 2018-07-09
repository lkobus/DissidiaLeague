import {
    Component, OnInit, EventEmitter, Output, ViewChild, ElementRef
} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Router } from '@angular/router';
import { Indicadores } from './model/indicadores';
import { IndicadorMetaService } from './shared/indicador-meta.service';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import * as moment from 'moment';

@Component({
    moduleId: module.id,
    selector: 'sd-indicador-meta-detail',
    templateUrl: 'indicador-meta-detail.component.html'
})
export class IndicadoresDetailComponent implements OnInit {

    public inputSearch: any;
    public indicador: Indicadores;
    public DataIndicador: string;
    public ValorIndicador: string;
    public RegraCalculo: string;

    private indicadorUpdate: any;
    
    constructor(
        private indicadoresService: IndicadorMetaService,
        private route: ActivatedRoute,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.route.paramMap
            .switchMap((params: ParamMap) => {
                var id = params.get('id');
                if (id) {
                    return this.indicadoresService.getIndicadorById(id);
                } else {
                    return Observable.of(new Indicadores());
                }
            })
            .flatMap(indicador => {
                this.indicador = indicador;
                this.DataIndicador = this.formatDate(this.indicador.DataMesMeta);
                this.ValorIndicador = this.formatValor(this.indicador.Valor, this.indicador.IndicadoresEnum.Valor);
                this.RegraCalculo = this.formatRegraCalculo(this.indicador.RegraCalculo.Codigo);

                return Observable.of(true);
            })
            .subscribe();
    }

    public goBack(): void {
        this.router.navigate(['indicador-meta']);
    }

    public formatDate(dateConvert: Date): string {
        return moment(dateConvert.toString()).format('MM/YYYY');
    }

    public formatValor(valor: number, nomeEnum: string): string {
        if (nomeEnum == 'Positivação' || nomeEnum == 'Visitas' || nomeEnum == 'GPS') {
            var mascara = valor + ' %';
            return mascara;
        } else {
            var semMascara = valor.toString();
            return semMascara;
        }
    }

    public formatRegraCalculo(codigo: number): string {
        var array = ["", "Maior que", "Menor que", "Maior igual", "Menor igual", "Igual"];
        return array[codigo];
    }
} 