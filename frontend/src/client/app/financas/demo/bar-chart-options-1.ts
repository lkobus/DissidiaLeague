export const BarChartOptions1 = () => ({
  color: ['#00e07e'],
  tooltip: {
    trigger: 'axis',
    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
      type: 'shadow'          // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
      axisTick: {
        alignWithLabel: true
      }
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: 'Valor',
      type: 'bar',
      barWidth: '60%',
      icon: 'https://ecomfe.github.io/echarts-doc/public/en/images/favicon.png'
    }
  ]
});

export const BarChartDataset1 = [
  [10, 52, 200, 334, 390, 330, 220]
];

export const BarChartDataset2 = [
  [200, 32, 444, 666, 88, 352, 380]
];
