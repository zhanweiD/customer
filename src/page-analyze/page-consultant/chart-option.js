
// eslint-disable-next-line max-len
// const color = ['#0090ff', '#06d3c4', '#ffbc32', '#2ccc44', '#ff3976', '#6173d6', '#914ce5', '#42b1cc', '#ff55ac', '#0090ff', '#06d3c4', '#ffbc32', '#2ccc44', '#ff3976', '#6173d6', '#914ce5', '#42b1cc', '#ff55ac', '#0090ff', '#06d3c4', '#ffbc32', '#2ccc44', '#ff3976', '#6173d6', '#914ce5', '#42b1cc', '#ff55ac', '#0090ff', '#06d3c4', '#ffbc32', '#2ccc44', '#ff3976', '#6173d6', '#914ce5', '#42b1cc', '#ff55ac', '#0090ff', '#06d3c4', '#ffbc32', '#2ccc44', '#ff3976', '#6173d6', '#914ce5', '#42b1cc', '#ff55ac', '#0090ff', '#06d3c4', '#ffbc32', '#2ccc44', '#ff3976', '#6173d6', '#914ce5', '#42b1cc', '#ff55ac', '#0090ff', '#06d3c4', '#ffbc32', '#2ccc44', '#ff3976', '#6173d6', '#914ce5', '#42b1cc', '#ff55ac', '#0090ff', '#06d3c4', '#ffbc32', '#2ccc44', '#ff3976', '#6173d6', '#914ce5', '#42b1cc', '#ff55ac', '#0090ff', '#06d3c4', '#ffbc32', '#2ccc44', '#ff3976', '#6173d6', '#914ce5', '#42b1cc', '#ff55ac', '#0090ff', '#06d3c4', '#ffbc32', '#2ccc44', '#ff3976', '#6173d6', '#914ce5', '#42b1cc', '#ff55ac', '#0090ff', '#06d3c4', '#ffbc32', '#2ccc44', '#ff3976', '#6173d6', '#914ce5', '#42b1cc', '#ff55ac']
const color = ['#1cd389', '#668eff', '#ff6e73', '#8683e6', '#06d3c4', '#42b1cc']
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

export function barOption(columnChart) {
  return ({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    title: [{
      text: '评价结果分布',
      top: 12,
      left: 16,
      textStyle: {
        fontSize: 14,
        color: titleColor,
        fontWeight: 400,
      },
    }],
    grid: {
      left: '5%',
      right: '5%',
      bottom: '5%',
      top: '15%',
      containLabel: true,
    },
    xAxis: [{
      type: 'category',
      axisTick: {
        show: false,
        color: fontColor,
      },
      nameTextStyle: {
        fontSize: 14,
        color: fontColor,
      },
      axisLabel: {
        textStyle: {
          fontSize: 14,
          color: fontColor,
        },
        interval: 1,
      },
      axisLine: {
        lineStyle: {
          color: '#ccc',
        },
      },
      data: columnChart.x,
    }],
    yAxis: {
      type: 'value',
      name: 'AB率/%',
      nameTextStyle: {
        fontSize: 14,
        color: fontColor,
      },
      axisLabel: {
        textStyle: {
          fontSize: 14,
          color: fontColor,
        },
      },
      axisLine: {
        lineStyle: {
          color: '#ccc',
        },
      },
    },
    series: [{
      name: 'AB率',
      type: 'bar',
      barWidth: '40%',
      // markLine: {
      //   data: [
      //     {
      //       name: '平均值',
      //       type: 'average', 
      //       itemStyle: {
      //         color: color[5],
      //       },
      //     },
      //   ],
      // },
      data: columnChart.y && columnChart.y.map((item, index) => {
        return {
          value: item,
          itemStyle: {
            color: colors[index % color.length],
          },
        }
      }),
    }],
  })
}

export function radarOption(radarChart) {
  return ({
    color,
    tooltip: {},
    title: [{
      text: '顾问团队能力象限',
      top: 12,
      left: 16,
      textStyle: {
        fontSize: 14,
        color: titleColor,
        fontWeight: 400,
      },
    }],
    legend: {
      top: 24,
      right: 24,
      orient: 'vertical',
      textStyle: {color: fontColor, fontSize: 14}, 
      data: radarChart.data && radarChart.data.map(item => item.name),
      icon: 'roundRect',
    },
    radar: {
      nameGap: 4, // 图中工艺等字距离图的距离
      // splitNumber: 3, //指示器轴的分割段数
      name: {
        textStyle: {
          color: fontColor,
          fontSize: 14,
        },
      },
      indicator: radarChart.indicator && radarChart.indicator.map(item => {
        return {
          name: item,
          max: 100,
        }
      }),
      axisLine: { // 指向外圈文本的分隔线样式
        lineStyle: {
          // color: '#1c368f',
        },
      },
      splitLine: {
        lineStyle: {
          // color: '#1c368f',
          // width: 2,
          // type: 'dotted'
        },
      },
      splitArea: {
        areaStyle: {
          // color: '#141845',
        },
      },
    },
    grid: {
      top: '18%',
      left: '3%',
      right: '4%',
      bottom: '6%',
      containLabel: true,
    },
    series: [{
      type: 'radar',
      data: radarChart.data && radarChart.data.map((item, index) => {
        item.areaStyle = {
          color: colors[index],
        }
        return item
      }),
    }],
  })
}
