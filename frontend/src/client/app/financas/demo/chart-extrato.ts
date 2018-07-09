import { CurrencyFormat } from "../../_pipe/currency-pipe";

export class ChartExtratoModel {
  tooltip: any;
  legend: ChartExtratoLegend;
  toolbox: ChartExtratoToolbox;
  calculable: boolean;

  xAxis: ChartExtratoAxis[];
  yAxis: ChartExtratoAxis[];
  series: ChartExtratoSeries[];

  constructor() {
    this.legend = new ChartExtratoLegend();
    this.toolbox = new ChartExtratoToolbox();
    this.calculable = true;
    this.tooltip = { trigger: 'item' };
    this.series = [];
    this.xAxis = [];
    this.yAxis = [];

    this.yAxis.push(new ChartExtratoAxis('value'));
    this.xAxis.push(new ChartExtratoAxis('category'));
  }
  
  ShowYAxisLine(aValue: boolean) {
    this.yAxis[0].ShowAxisLine(aValue);
  }
  
  ShowXAxisLine(aValue: boolean) {
    this.xAxis[0].ShowAxisLine(aValue);
  }

  TooltipFormatter() {
    this.tooltip = {
      trigger: 'item',
      formatter: function (params, ticket, callback) {
        var t = new CurrencyFormat().transform(params.value as number);
        return t + '<br/>' + params.name;
      }
    };
  }

  YAxisFormatter() {
    this.yAxis[0].SetAxisLabel();
  }

  public AddXAxis(data: string) {
    if (!(this.xAxis[0].data.indexOf(data) > -1)) {
      this.xAxis[0].data.push(data);
    }
  }

  public CreateSerie(name: string, color: string): ChartExtratoSeries {
    var series = new ChartExtratoSeries(name, color);
    this.series.push(series);
    this.legend.data.push(name);

    return series;
  }
}

export class ChartExtratoToolbox {

  show: boolean;
  feature: any;
  constructor() {
    this.show = true;
    this.feature = {
      dataView: { title: 'Dados', show: false, readOnly: false },
      magicType: { title: 'Alterar visualização', show: true, type: ['line', 'bar'] },
      restore: { title: 'Recarregar', show: true },
      saveAsImage: { title: 'Baixar imagem', show: true }
    };
  }
}

export class ChartExtratoAxis {
  type: string;
  data: any[];
  axisLabel: any;
  show: boolean = true;

  ShowAxisLine(aValue: boolean) {
    this.show = aValue;
  }

  SetAxisLabel() {
    this.axisLabel = {
      formatter: function (value) {
        var t = new CurrencyFormat().transform(value as number);
        return t;
      }
    };
  }

  constructor(type: string) {
    this.type = type;
    this.data = [];
  }
}

export class ChartExtratoSeries {
  name: string;
  type: string;
  data: number[];
  color: string[];
  itemStyle: {
    normal: {
      color: '#C1232B',
      label: {
        show: true,
        position: 'top',
        formatter: 'aaaaa'
      }
    }
  };  

  constructor(name: string, color: string) {
    this.type = 'bar';
    this.name = name;
    this.color = [];
    this.data = [];
    this.color.push(color);
  }

  public addData(value: number) {
    value = Math.round(value * 100) / 100;
    this.data.push(value);
  }
}

export class ChartExtratoLegend {
  data: string[];

  constructor() {
    this.data = [];
  }
}
