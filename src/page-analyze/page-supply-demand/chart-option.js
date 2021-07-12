
const bgColor = '#fff'
const title = '报备客户数'
const color = ['#32c5f4', '#1cd389', '#ff6e73', '#8683e6', '#06d3c4']
const fontColor = 'rgba(22,50,78,0.85)'
const titleColor = 'rgba(22,50,78,1)'
const colors = [new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
  offset: 0,
  color: '#BFEEA9',
}, {
  offset: 1,
  color: '#61BA46',
}]), new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
  offset: 0,
  color: '#86D4FF',
}, {
  offset: 1,
  color: '#2592FF',
}]), new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
  offset: 0,
  color: '#8D9FFF',
}, {
  offset: 1,
  color: '#355FF9',
}]), new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
  offset: 0,
  color: '#AE95FF',
}, {
  offset: 1,
  color: '#6C41FA',
}]), new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
  offset: 0,
  color: '#FFA1BC ',
}, {
  offset: 1,
  color: '#FD5071',
}])]

export function barOption(data) {
  if (!data.length) {
    return ({
      title: [{
        text: '暂无数据',
        top: '50%',
        left: '35%',
        textStyle: {
          fontSize: 32,
          color: titleColor,
          fontWeight: 400,
        },
      }],
    }) 
  }
  return ({
    backgroundColor: bgColor,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        lineStyle: {
          color: 'rgba(0, 255, 233,0)',
        },
      },
    },
    color: colors,
    legend: {
      top: 24,
      right: 16,
      data: ['匹配客户', '不匹配客户'],
    },
    grid: {
      left: 24,
      right: -32,
      bottom: -24,
      top: 32,
      containLabel: true,
    },
    xAxis: {
      show: false,
      type: 'value',
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'category',
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      data: data.map(item => item.index),
    },
    series: [{
      name: '匹配客户',
      type: 'bar',
      stack: 'Tik Tok',
      barWidth: 12,
      itemStyle: {
        shadowColor: 'rgba(22, 50, 78, .3)',
        // borderRadius: 12,
        shadowBlur: 1,
        shadowOffsetY: 1,
        shadowOffsetX: 0,
        emphasis: {
          borderWidth: '10',
          borderColor: colors[0],
          color: colors[0],
          opacity: 1,
          shadowColor: colors[0],
          shadowBlur: 0,
          shadowOffsetY: 0,
          shadowOffsetX: 0,
        },
      },
      data: data.map(item => item.fitCount),
    },
    {
      name: '不匹配客户',
      type: 'bar',
      stack: 'Tik Tok',
      barWidth: 12,
      itemStyle: {
        shadowColor: 'rgba(22, 50, 78, .3)',
        // borderRadius: 12,
        shadowBlur: 1,
        shadowOffsetY: 1,
        shadowOffsetX: 0,
        emphasis: {
          borderWidth: '10',
          borderColor: colors[1],
          color: colors[1],
          opacity: 1,
          shadowColor: colors[1],
          shadowBlur: 0,
          shadowOffsetY: 0,
          shadowOffsetX: 0,
        },
      },
      data: data.map(item => item.unFitCount),
    },
    ],
  })
}

export function lineOption(data) {
  if (!data.x) {
    return ({
      title: [{
        text: '暂无数据',
        top: '50%',
        left: '35%',
        textStyle: {
          fontSize: 32,
          color: titleColor,
          fontWeight: 400,
        },
      }],
    }) 
  }
  return ({
    backgroundColor: '#fff',
    legend: {
      show: true,
      icon: 'circle',
      top: 24,
      right: 16,
      itemWidth: 6,
      itemHeight: 6,
      itemGap: 25,
    },
    grid: {
      left: 24,
      right: 48,
      bottom: 16,
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: [{
      type: 'category',
      data: data.x,
      axisLine: {
        lineStyle: {
          color: '#ddd',
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        interval: 0,
        textStyle: {
          color: fontColor,
        },
        margin: 15,
      },
      boundaryGap: false,
    }],
    yAxis: [{
      type: 'value',
      name: '客户数/人',
      nameTextStyle: {
        fontSize: 14,
        color: fontColor,
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: '#ddd',
        },
      },
      axisLabel: {
        textStyle: {
          color: fontColor,
        },
      },
      splitLine: {
        show: false,
      },
    }],
    series: [{
      name: data.y[0].name,
      type: 'line',
      data: data.y[0].data.map(Number),
      symbolSize: 6,
      symbol: 'circle',
      smooth: true,
      lineStyle: {
        color: '#fe9a8b',
      },
      itemStyle: {
        normal: {
          color: '#fe9a8b',
          borderColor: '#fe9a8b',
        },
      },
      areaStyle: {
        color: '#fe9a8bb3',
      },
    }, {
      name: data.y[1].name,
      type: 'line',
      data: data.y[1].data.map(Number),
      symbolSize: 6,
      symbol: 'circle',
      smooth: true,
      lineStyle: {
        color: '#9E87FF',
      },
      itemStyle: {
        normal: {
          color: '#9E87FF',
          borderColor: '#9E87FF',
        },
      },
      areaStyle: {
        color: '#9E87FFb3',
      },
    },
    ],
  })
}
