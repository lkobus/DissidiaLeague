import { Component } from '@angular/core';

import * as chartData from './chart-data/index';

@Component({
    moduleId: module.id,
    selector: 'painel-performance',
    templateUrl: 'painel-performance.component.html'
})
export class PainelPerformanceComponent {

    isParaActive: boolean = false;
    isBtnActive: boolean = false;

    toggleClass() {
        this.isParaActive = !this.isParaActive;
        this.isBtnActive = !this.isBtnActive;
    }

  //Charts
  ChartIndicators = chartData.ChartIndicators;
  ChartBeer = chartData.ChartBeer;
  ChartSoda = chartData.ChartSoda;

}
