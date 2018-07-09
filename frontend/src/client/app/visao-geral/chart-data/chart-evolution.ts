let base = +new Date(2015, 9, 3);
let oneDay = 24 * 3600 * 1000;
let date = [];

let data = [Math.random() * 300];

for (let i = 1; i < 20000; i++) {
  let now = new Date(base += oneDay);
  date.push([now.getDate(), now.getMonth() + 1,now.getFullYear()].join('/'));
  data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
}

export const ChartEvolution = {

  tooltip: {
    trigger: 'axis',
    position: function (pt) {
      return [pt[0], '10%'];
    }
  },
  toolbox: {
    feature: {
      dataZoom: {
        yAxisIndex: 'none'
      },
      restore: {},
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: date
  },
  yAxis: {
    type: 'value',
    boundaryGap: [0, '100%']
  },
  dataZoom: [{
    type: 'inside',
    start: 0,
    end: 10
  }, {
    start: 0,
    end: 10,
    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
    handleSize: '80%',
    handleStyle: {
      color: '#fff',
      shadowBlur: 3,
      shadowColor: 'rgba(0, 0, 0, 0.6)',
      shadowOffsetX: 2,
      shadowOffsetY: 2
    }
  }],
  series: [
    {
      name:'Volume HL',
      type:'line',
      smooth:true,
      symbol: 'none',
      sampling: 'average',
      itemStyle: {
        normal: {
          color: 'rgb(67, 129, 243)'
        }
      },
      areaStyle: {
        normal: {
          color: ""
        }
      },
      data: data
    },
    {
      name:'Média necessária',
      type:'line',
      data:[200],

      markLine: {
        silent: true,
        data: [{
          yAxis: 200
        }]
      },
      areaStyle: {
        normal: {
          color: {
            offset: 0,
            color: 'rgb(67, 129, 243)'
          }
        }
      },
    }
  ]
};