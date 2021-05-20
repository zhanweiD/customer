
const bgColor = '#fff'
const title = '评价次数'
const color = ['#1cd389', '#668eff', '#ff6e73', '#8683e6', '#06d3c4']
const fontColor = 'rgba(0,0,0,0.65)'
const titleColor = 'rgba(0,0,0,0.85)'

export function pieOption(data, total) {
  if (!data.length) {
    return ({
      title: [{
        text: '评价结果分布',
        top: 0,
        left: 0,
        textStyle: {
          fontSize: 14,
          color: titleColor,
          fontWeight: 400,
        },
      }, {
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
    color,
    tooltip: {
      trigger: 'item',
    },
    title: [{
      text: `{name|${title}}\n{val|${total}}`,
      top: 'center',
      left: 'center',
      triggerEvent: true,
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
    {
      text: '评价结果分布',
      top: 0,
      left: 0,
      textStyle: {
        fontSize: 14,
        color: titleColor,
        fontWeight: 400,
      },
    },
    ],
    series: [{
      type: 'pie',
      radius: ['35%', '48%'],
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
              fontSize: 12,
              padding: [0, 4, 0, 4],
              color: fontColor,
            },
            percent: {
              fontSize: 12,
              padding: [0, 4, 0, 4],
              color: fontColor,
            },
            value: {
              fontSize: 12,
              color: fontColor,
            },
          },
        },
      },
    }],
  })
}

export function scatterOption(data) {
  const option = {
    tooltip: {
      position: 'top',
      formatter: params => {
        if (data.y[params.seriesIndex] === '未知') {
          return `${params.value[1]}人未进行${params.name}评价`
        }
        return `${params.value[1]}人对${params.name}结果${data.y[params.seriesIndex]}`
      },
    },
    title: [
      {
        text: '客户心声',
        top: 0,
        left: 0,
        textStyle: {
          fontSize: 14,
          color: titleColor,
          fontWeight: 400,
        },
      },
    ],
    singleAxis: [],
    series: [],
  }

  echarts.util.each(data.y, (day, idx) => {
    option.title.push({
      textBaseline: 'middle',
      top: `${(idx + 0.7) * 100 / 6}%`,
      text: day,
      textStyle: {
        fontSize: 14,
      },
    })
    option.singleAxis.push({
      left: 96,
      type: 'category',
      boundaryGap: false,
      data: data.x,
      top: `${(idx + 0.3) * 100 / 6}%`,
      height: `${100 / 6 - 10}%`,
      axisLabel: {
        interval: 0,
      },
      axisLine: {
        lineStyle: {
          width: 1,
          color: '#333',
        },
      },
      axisTick: {
        lineStyle: {
          width: 1,
          color: '#333',
        },
      },
    })
    option.series.push({
      singleAxisIndex: idx,
      coordinateSystem: 'singleAxis',
      type: 'scatter',
      data: [],
      symbolSize(dataItem) {
        if (dataItem[1] / 200 > 35) return 35
        if (dataItem[1] / 200 < 10) return 10
        return dataItem[1] / 200
      },
    })
  })

  echarts.util.each(data.data, dataItem => {
    option.series[dataItem[0]].data.push([dataItem[1], dataItem[2]])
  })
  return option
}
