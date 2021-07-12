
const bgColor = '#fff'
const title = '客户总数'
const color = ['#1cd389', '#668eff', '#ffc751', '#ff6e73', '#8683e6', '#9692ff']
const fontColor = 'rgba(22,50,78,0.85)'
const titleColor = 'rgba(22,50,78,1)'

const colors = [new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
  offset: 0,
  color: '#BFEEA9',
}, {
  offset: 1,
  color: '#61BA46',
}]), new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
  offset: 0,
  color: '#86D4FF',
}, {
  offset: 1,
  color: '#2592FF',
}]), new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
  offset: 0,
  color: '#8D9FFF',
}, {
  offset: 1,
  color: '#355FF9',
}]), new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
  offset: 0,
  color: '#AE95FF',
}, {
  offset: 1,
  color: '#6C41FA',
}]), new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
  offset: 0,
  color: '#FFA1BC ',
}, {
  offset: 1,
  color: '#FD5071',
}])]

export function pieOption(data, total) {
  if (!data.length) {
    return {
      title: [
        {
          text: '暂无数据',
          top: '50%',
          left: '50%',
          textStyle: {
            fontSize: 32,
            color: titleColor,
            fontWeight: 400,
          },
        }],
    } 
  }
  return ({
    backgroundColor: bgColor,
    color: colors,
    tooltip: {
      trigger: 'item',
    },
    title: [{
      text: `{name|${title}}\n{val|${total}}`,
      top: 'center',
      left: 'center',
      textStyle: {
        rich: {
          name: {
            fontSize: 14,
            fontWeight: 'normal',
            color: fontColor,
            padding: [10, 0],
          },
          val: {
            fontSize: 32,
            fontWeight: 'bold',
            color: titleColor,
          },
        },
      },
    }, 
    ],
    series: [{
      type: 'pie',
      radius: ['40%', '55%'],
      center: ['50%', '50%'],
      data,
      hoverAnimation: false,
      itemStyle: {
        normal: {
          borderColor: bgColor,
          borderWidth: 2,
        },
      },
      label: {
        normal: {
          formatter: params => {
            return (
              `{name|${params.name}}{value|${params.value}}\n{percent|${params.percent.toFixed(2)}%}`
            )
          },
          rich: {
            name: {
              fontSize: 14,
              padding: [0, 4, 0, 4],
              color: fontColor,
            },
            percent: {
              fontSize: 14,
              padding: [0, 4, 0, 4],
              color: fontColor,
            },
            value: {
              fontSize: 14,
              color: fontColor,
            },
          },
        },
      },
    }],
  })
}

export function funnelOption(data1, data2) {
  if (!data1.length) {
    return {
      title: [{
        text: '暂无数据',
        top: '50%',
        left: '40%',
        textStyle: {
          fontSize: 32,
          color: titleColor,
          fontWeight: 400,
        },
      }],
    } 
  }
  return ({
    opacity: 1,
    legend: {
      top: 16,
      left: '10%',
      data: data1 && data1.map(item => item.name),
    },
    series: [{
      color: colors,
      top: 48,
      type: 'funnel',
      sort: (a, b) => data1[b],
      height: '400',
      gap: 0,
      zlevel: 2,
      minSize: 150,
      left: '10%',
      width: '60%',
      label: {
        show: true,
        position: 'inside',
        fontSize: '14',
        color: '#fff',
        textBorderColor: '#fff',
        formatter(d) {
          const ins = `${d.name}{aa|}\n${d.data.num}`
          return ins
        },
        rich: {
          aa: {
            padding: [8, 0, 6, 0],
          },
        },
      },
      emphasis: {
        label: {
          color: '#fff',
        },
      },
      data: data1,
    },
    {
      top: 48,
      type: 'funnel',
      color: colors,
      sort: (a, b) => data1[b],
      height: '400',
      gap: -1,
      zlevel: 1,
      minSize: 150,
      left: '10%',
      // width: 0,
      width: '60%',
      // z: 2,
      itemStyle: {
        opacity: 1,
      },
      label: {
        show: true,
        color: fontColor, 
        position: 'right',
        formatter(d) {
          const ins = `{bb|${d.data.goal}}\n{aa|${d.name}}`
          return ins
        },
        rich: {
          aa: {
            align: 'center',
            color: fontColor,
            fontSize: '12',
            lineHeight: '30',
          },
          bb: {
            align: 'center',
            color: titleColor,
            fontSize: '22',
          },
        },
      },
      labelLine: {
        show: false,
      },
      data: data2,
    },
    ],
  })
}
