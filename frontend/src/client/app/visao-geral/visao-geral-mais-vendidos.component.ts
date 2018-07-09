import { Component, OnInit, Input, OnChanges, SimpleChange, ViewChild, Output, EventEmitter } from '@angular/core';
import { ChartExtratoModel, ChartExtratoAxis, ChartExtratoSeries } from '../financas/demo/chart-extrato';

import { ResumoGeralService } from './service/resumo-geral.service';
import { ResumoGeral, ProdutosMaisVendidos } from './model/resumo-geral';

import * as moment from 'moment'

import { Subscription } from 'rxjs/Subscription';
import { Tab } from '../shared/tabs/tab';

@Component({
    moduleId: module.id,
    selector: 'visao-geral-produtos-mais-vendidos',
    templateUrl: 'visao-geral-mais-vendidos.component.html'
})
export class VisaoGeralProdutosMaisVendidosComponent {
    @Output() isLoading: boolean = false;
    @Output() dataLoaded = new EventEmitter();
    @Input("dateFilter") dateFilter: any;
    ChartProdutos: ChartExtratoModel[];

    selected: string;
    busy: Subscription;
    valores: any[];
    graphData: any[];

    constructor(private resumoService: ResumoGeralService) {
        this.ChartProdutos = [];
    }

    ngOnChanges(changes: SimpleChange) {
        this.ChangeFilterDate();
    }

    ngOnInit() {
    }

    FillCharts() {
        this.valores.forEach(p => {
            this.ChartProdutos[p.key] = new ChartExtratoModel();
            this.PrepareChart(this.ChartProdutos[p.key], p.values);
        });
        console.log();
    }

    private PrepareChart(chart: ChartExtratoModel, valores: any[]) {
        var series = chart.CreateSerie('Mais Vendidos', '#00e07e');
        chart.ShowYAxisLine(false);
        valores.forEach(element => {
            chart.AddXAxis(element.x);
            series.addData(element.y);
        });
    }

    private ChangeFilterDate() {
        this.isLoading = true;
        this.busy = this.resumoService
            .GetResumoProdutosMaisVendidos(this.dateFilter.path, 5)
            .subscribe((valores) => this.OnResumoLoaded(valores));
    }

    private OnResumoLoaded(valores: ProdutosMaisVendidos[]) {
        this.valores = [];
        this.graphData = [];

        var groups = valores.reduce((obj, item) => {
            obj[item.categoria] = obj[item.categoria] || [];
            obj[item.categoria].push(item);
            return obj;
        }, {});


        Object.keys(groups).map((key) => {
            var values: any[] = [];
            var items = groups[key];
            items.forEach((element: ProdutosMaisVendidos) => {
                var temp = { x: element.descricao, y: element.quantidade };
                values.push(temp);
            });
            this.valores.push({ key: key, values: values });
        });

        this.FillCharts();
        this.isLoading = false;
        this.dataLoaded.emit();
    }
}
