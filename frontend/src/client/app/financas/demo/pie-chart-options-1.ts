export const PieChartOptions1 = {
  tooltip: {
    trigger: 'item',
    formatter: "{a} <br/>{b}: {c} ({d}%)"
  },
  legend: {
    orient: 'vertical',
    x: 'left',
    data: ['Luz', 'Aluguel', 'Despesa 3', 'Despesa 4', 'Despesa 5', 'Despesa 6', 'Despesa 7', 'Despesa 8', 'Despesa 9', 'Despesa 10']
  },
  series: [
    {
      name: 'Categorias',
      type: 'pie',
      selectedMode: 'single',
      radius: [0, '30%'],

      label: {
        normal: {
          position: 'inner'
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      data: [
        { value: 335, name: 'Luz', selected: true },
        { value: 679, name: 'Aluguel' },
        { value: 1548, name: 'Despesa 3' }
      ]
    },
    {
      name: 'Categorias',
      type: 'pie',
      radius: ['40%', '55%'],

      data: [
        { value: 335, name: 'Luz' },
        { value: 310, name: 'Despesa 4' },
        { value: 234, name: 'Despesa 5' },
        { value: 135, name: 'Despesa 6' },
        { value: 1048, name: 'Despesa 7' },
        { value: 251, name: 'Despesa 8' },
        { value: 147, name: 'Despesa 9' },
        { value: 102, name: 'Despesa 10' }
      ]
    }
  ]
};
