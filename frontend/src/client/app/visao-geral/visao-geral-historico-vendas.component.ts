import { Component, OnInit, Input, OnChanges, SimpleChange, Output, EventEmitter } from '@angular/core';

import { ResumoGeralService } from './service/resumo-geral.service';
import { ResumoGeral, HistoricoVendas } from './model/resumo-geral';
import { ChartExtratoModel, ChartExtratoAxis, ChartExtratoSeries } from '../financas/demo/chart-extrato';

import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment'

@Component({
    moduleId: module.id,
    selector: 'visao-geral-historico-vendas',
    templateUrl: 'visao-geral-historico-vendas.component.html'
})
export class VisaoGeralHistoricoVendasComponent {
    @Output() isLoading: boolean = false;
    @Output() dataLoaded = new EventEmitter();
    @Input("dateFilter") dateFilter: any;
    ChartVendas: ChartExtratoModel;

    busy: Subscription;
    constructor(private resumoService: ResumoGeralService) {
        this.ChartVendas = new ChartExtratoModel();
    }

    ngOnChanges(changes: SimpleChange) {
        this.ChangeFilter();
    }

    ngOnInit() {

    }

    private ChangeFilter() {
        this.isLoading = true;
        this.SetXValues();
        this.busy = this.resumoService
            .GetResumoDetalhadoDia(this.dateFilter.path)
            .map((valores) => this.OnResumoLoaded(valores))
            .subscribe();
    }

    private GetDatesBetween(startDate, stopDate) {
        var dateArray = [];
        var currentDate = moment(startDate);
        stopDate = moment(stopDate);
        while (currentDate <= stopDate) {
            dateArray.push(moment(currentDate).format('YYYY-MM-DD'));
            currentDate = moment(currentDate).add(1, 'days');
        }
        return dateArray;
    }

    private GetDates(anterior: boolean): any {

        var filterDate: boolean = false;
        var temp = moment();
        var startDate;
        var finalDate;
        if (this.dateFilter.path === 'semana') {
            if (anterior) {
                temp = temp.clone().add('days', -7);
            }
            startDate = temp.clone().startOf('week');
            finalDate = temp.clone().endOf('week');

        } else if (this.dateFilter.path === 'mes') {
            if (anterior) {
                temp = temp.clone().add('month', -1);
            }
            startDate = temp.clone().startOf('month');
            finalDate = temp.clone().endOf('month');

        } else if (this.dateFilter.path === 'trimestre') {
            filterDate = true;
            if (anterior) {
                temp = temp.clone().add('year', -1);
            }

            startDate = temp.clone().add('month', -2).startOf('month');
            finalDate = temp.clone().endOf('month');

        } else if (this.dateFilter.path === 'ano') {
            filterDate = true;
            if (anterior) {
                temp = temp.clone().add('year', -1);
            }

            startDate = temp.clone().startOf('year');
            finalDate = temp.clone().endOf('year');
        }


        if (filterDate) {
            var dates = this.GetDatesBetween(startDate, finalDate)
            var set = new Set(dates.map(p => moment(p).format('YYYY-MM')));
            return set;
        }
        else {
            var dates = this.GetDatesBetween(startDate, finalDate)
            return dates;
        }
    }

    private OnResumoLoaded(valores: HistoricoVendas[]) {
        valores.sort((a, b) => {
            let date1 = moment(a.data);
            let date2 = moment(b.data);
            return (date1 > date2) ? 1 : -1;
        });

        let valuesAtual = [];
        let valuesAnterior = [];
        this.FillValues(valuesAtual, valores, false);
        this.FillValues(valuesAnterior, valores, true);

        this.ChartVendas = new ChartExtratoModel();
        this.ChartVendas.ShowYAxisLine(false);
        this.ChartVendas.YAxisFormatter();
        this.ChartVendas.TooltipFormatter();

        this.PrepareChart(this.dateFilter.label + ' atual', '#00e07e', valuesAtual);
        this.PrepareChart(this.dateFilter.label + ' anterior', '#7495d2', valuesAnterior);
        this.isLoading = false;
        this.dataLoaded.emit();
    }

    private PrepareChart(key: string, color: string, valores: any[]) {
        var chart = this.ChartVendas;
        var series = chart.CreateSerie(key, color);
        valores.forEach(element => {
            chart.AddXAxis(this._xValues[element.x]);
            series.addData(element.y);
        });
        console.log();
    }

    private FillValues(values: any[], list: HistoricoVendas[], anterior: boolean) {
        var i = 0;
        this.GetDates(anterior).forEach(element => {
            var longDate = moment(element).valueOf();
            var temp = list.filter(p => {
                var date = moment(p.data).format('YYYY-MM-DD');
                if (String(element).length === 7) {
                    var date = moment(p.data).format('YYYY-MM');
                }
                return date === element;
            }).reduce((a, b) => a + b.valor, 0);

            values.push({ x: i, y: temp || 0 });
            i++;
        });
    }

    _xValues: any[];
    private SetXValues() {
        var values = [];
        if (this.dateFilter.path === 'mes') {
            for (var index = 1; index <= 31; index++) {
                values.push(index);
            }

        } else if (this.dateFilter.path === 'semana') {
            values = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

        } else if (this.dateFilter.path === 'trimestre') {
            var temp = moment();
            var past = temp.clone().add('month', -2);

            while (past <= temp) {
                values.push(moment(past).format('MMM'));
                past = moment(past).add(1, 'month');
            }

        } else if (this.dateFilter.path === 'ano') {
            var temp = moment().clone().startOf('year');
            var past = temp.clone().endOf('year');

            while (temp <= past) {
                values.push(moment(temp).format('MMM'));
                temp = moment(temp).add(1, 'month');
            }

        }

        this._xValues = values;
    }
}
