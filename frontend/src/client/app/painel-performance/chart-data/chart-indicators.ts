let labelTop = {
  normal : {
    label : {
      show : true,
      position : 'center',
      formatter : '{b}',
      textStyle: {
        baseline : 'top'
      }
    },
    labelLine : {
      show : false
    }
  }
};
let labelFromatter = {
  normal : {
    label : {
      formatter : function (params){
        return 100 - params.value + '%'
      },
      textStyle: {
        baseline : 'top'
      }
    }
  },
};
let labelBottom = {
  normal : {
    color: '#ccc',
    label : {
      show : true,
      position : 'center'
    },
    labelLine : {
      show : false
    }
  },
  emphasis: {
    color: '#afafaf'
  }
};
let radius = [35, 38];

export const ChartIndicators = {
  color: ['#EB5E55','#F7B267','#4CC9C3','#0AA2E9','#25235A','#64E9EE'],
  legend: {
    x : 'center',
    y : 'bottom',
    data:[
      'Visitas','Positivação','GPS'
    ]
  },
  toolbox: {
    show : false,
    feature : {
      dataView : {show: true, readOnly: false},
      magicType : {
        show: true,
        type: ['pie', 'funnel'],
        option: {
          funnel: {
            width: '20%',
            height: '30%',
            itemStyle : {
              normal : {
                label : {
                  formatter : function (params){
                    return 'other\n' + params.value + '%\n'
                  },
                  textStyle: {
                    baseline : 'middle'
                  }
                }
              },
            }
          }
        }
      },
      restore : {show: false},
      saveAsImage : {show: false}
    }
  },
  series : [
  {
    type : 'pie',
    center : ['18%', '42%'],
    radius : radius,
    x: '0%', // for funnel
    itemStyle : labelFromatter,
    data : [
      {name:'vazio', value:46, itemStyle : labelBottom},
      {name:'Visitas', value:54,itemStyle : labelTop}
    ]
  },
  {
    type : 'pie',
    center : ['50%', '42%'],
    radius : radius,
    x:'10%', // for funnel
    itemStyle : labelFromatter,
    data : [
      {name:'vazio', value:56, itemStyle : labelBottom},
      {name:'Positivação', value:44,itemStyle : labelTop}
    ]
  },
  {
    type : 'pie',
    center : ['83%', '42%'],
    radius : radius,
    x:'20%', // for funnel
    itemStyle : labelFromatter,
    data : [
      {name:'vazio', value:65, itemStyle : labelBottom},
      {name:'GPS', value:35,itemStyle : labelTop}
    ]
  }
]
};
