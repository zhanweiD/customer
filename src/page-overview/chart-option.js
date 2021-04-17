/* eslint-disable guard-for-in */
// const color = ['#1cd389', '#668eff', '#ffc751', '#ff6e73', '#8683e6', '#9692ff', '#8C8D8']
const color = ['#1cd389', '#668eff', '#ffc751', '#ff6e73', '#8683e6', '#0099cc']

const fontColor = 'rgba(0,0,0,0.65)'
const titleColor = 'rgba(0,0,0,0.85)'
// 转化对比
export function cbarOption(barData) {
  const {data = [], type = [], x = [], y = []} = barData
  return {
    color,
    title: {
      text: '转化对比',
      textStyle: {
        fontSize: 14,
        color: titleColor,
        fontWeight: 400,
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      top: 96,
      bottom: 64,
      left: 32,
      // right: 0,
    },
    legend: {
      top: 32,
      data: type,
    },
    xAxis: [
      {
        type: 'category',
        // min: 0,
        // max: 100,
        // type: 'value',
        data: y,
        color: fontColor,
        axisTick: {
          show: false,
          color: fontColor,
        },
        nameTextStyle: {
          fontSize: 12,
          color: fontColor,
        },
        axisLabel: {
          textStyle: {
            fontSize: 12,
            color: fontColor,
          },
        },
        axisLine: {
          lineStyle: {
            color: '#ccc',
          },
        },
      },
    ],
    dataZoom: [
      {
        show: true,
        realtime: true,
        start: 0,
        end: 50,
      },
      {
        type: 'inside',
        realtime: true,
        start: 0,
        end: 50,
      },
    ],
    yAxis: [
      {
        name: '转化率',
        type: 'value',
        min: 0,
        max: 100,
        // data: y,
        nameTextStyle: {
          fontSize: 12,
          color: fontColor,
        },
        axisLabel: {
          textStyle: {
            fontSize: 12,
            color: fontColor,
          },
          // rotate: 40,
        },
        axisLine: {
          lineStyle: {
            color: '#ccc',
          },
        },
      },
    ],
    series: type.length ? (type.map((item, index) => ({
      name: item,
      data: data.map(sitem => {
        return sitem[item]
      }),
      barWidth: '30%',
      type: 'bar',
      stack: 'total',
      // yAxisIndex: 1,
      // color: color[index],
    }))) : [],
  }
}

// 转化趋势
export function lineOption(lineData) {
  const {data = [], type = []} = lineData
  const xData = []
  // eslint-disable-next-line no-restricted-syntax
  for (const item in data) {
    xData.push({name: item, value: data[item]})
  }
  return {
    title: {
      // text: area === 'china' ? '转化趋势' : '供需情况',
      text: '转化趋势',
      textStyle: {
        fontSize: 14,
        color: titleColor,
        fontWeight: 400,
      },
    },
    grid: {
      top: 96,
      bottom: 64,
    },
    legend: {
      top: 32,
      // data: area === 'china' ? ['来访', '成交'] : ['高层', '别墅'],
      data: type,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    dataZoom: [
      {
        show: true,
        realtime: true,
        start: 0,
        end: 50,
      },
      {
        type: 'inside',
        realtime: true,
        start: 0,
        end: 50,
      },
    ],
    xAxis: {
      type: 'category',
      data: xData.map(item => item.name),
      axisTick: {
        show: false,
        color: fontColor,
      },
      nameTextStyle: {
        fontSize: 12,
        color: fontColor,
      },
      axisLabel: {
        textStyle: {
          fontSize: 12,
          color: fontColor,
        },
      },
      axisLine: {
        lineStyle: {
          color: '#ccc',
        },
      },
    },
    yAxis: [
      {
        type: 'value',
        nameTextStyle: {
          fontSize: 12,
          color: fontColor,
        },
        axisLabel: {
          textStyle: {
            fontSize: 12,
            color: fontColor,
          },
        },
        axisLine: {
          lineStyle: {
            color: '#ccc',
          },
        },
      },
    ],
    series: type.map((item, index) => ({
      name: item,
      type: 'line',
      color: color[index],
      smooth: true,
      seriesLayoutBy: 'row',
      emphasis: {focus: 'series'},
      data: xData.map(sItem => (sItem.value)[item]),
    })),
    // series: xData.map((item, index) => ({
    //   name: item,
    //   type: 'line',
    //   color: color[index],
    //   smooth: true,
    //   seriesLayoutBy: 'row',
    //   emphasis: {focus: 'series'},
    //   data: type.map(sItem => data[item][sItem]),
    // })),
  }
}

// 客户分布
export function mapOption(mapType, data) {
  const counts = data.map(item => item.count)
  return {
    title: {
      text: '客户分布',
      x: 'left',
    },
    tooltip: {
      trigger: 'item',
      formatter(item) {
        const ins = `${item.name}<br /> 客户人数：${item.value || '-'}`
        return ins
      },
    },
    dataRange: {
      min: 0,
      max: counts.length ? Math.max(...counts) : 0,
      show: true,
      x: 'left',
      y: 'bottom',
    // text: ['高', '低'], // 文本，默认为数值文本
    // calculable: false,
    },
    series: [
      {
        // name: '客户人数',
        type: 'map',
        mapType,
        top: 128,
        left: 56,
        roam: false,
        zoom: 1.2,
        itemStyle: {
          normal: {label: {show: false}},
          emphasis: {label: {show: true}},
        },
        data: data.map(item => ({name: item.name, value: item.count})),
      },
    ],
  }
}

// 客户分布
export function dbarOption(data) {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: 96,
    },
    xAxis: {
      type: 'value',
      show: false,
    },
    yAxis: {
      type: 'category',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      nameTextStyle: {
        fontSize: 12,
        color: fontColor,
      },
      axisLabel: {
        textStyle: {
          fontSize: 12,
          color: fontColor,
          left: 256,
        },
      },
      data: data.map(item => item.name),
    },
    series: [
      {
        type: 'bar',
        barWidth: '40%',
        color: color[1],
        label: {
          show: true,
          position: 'right',
          // position: 'inside',
        },
        data: data.map(item => item.count),
      }, 
    ],
  }
}

// 渠道分布
export function sunOption(data) {
  return {
    color,
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c}',
    },
    series: {
      type: 'sunburst',
      color,
      data,
      sort: null,
      center: ['50%', '50%'],
      radius: ['0%', '100%'],
      label: {
        // rotate: 'radial',
        minAngle: 30,
      },
    },
  }
}

// 客户转化率
export function funnelOption(funnelData) {
  const {data = [], type = []} = funnelData
  if (!data.length) {
    return {
      title: [{
        text: '客户转化率',
        top: 12,
        left: 16,
        textStyle: {
          fontSize: 14,
          color: titleColor,
          fontWeight: 400,
        }},
      {text: '暂无数据',
        top: '50%',
        left: '30%',
        textStyle: {
          fontSize: 32,
          color: titleColor,
          fontWeight: 400,
        }},
      ],
    } 
  }
  return ({
    title: {
      text: '客户转化率',
      top: 12,
      left: 16,
      textStyle: {
        fontSize: 14,
        color: titleColor,
        fontWeight: 400,
      },
    },
    color,
    legend: {
      top: 42,
      left: 'center',
      data: type,
    },
    series: [{
      top: 84,
      type: 'funnel',
      sort: 'none',
      height: '250',
      gap: 0,
      minSize: 150,
      // left: '5%',
      left: 'center',
      width: '60%',
      label: {
        show: true,
        position: 'inside',
        fontSize: '14',
        formatter(d) {
          const ins = `${d.name}{aa|}\n${d.value}`
          return ins
        },
        rich: {
          aa: {
            padding: [8, 0, 6, 0],
          },
        },
      },
      data: data.map(item => ({name: item.name, value: item.count})),
    }, 
    // {
    //   top: 96,
    //   type: 'funnel',
    //   // sort: (a, b) => data.map(item => item.count)[b],
    //   sort: 'descending',
    //   height: '300',
    //   gap: -1,
    //   minSize: 150,
    //   left: '5%',
    //   width: '60%',
    //   z: 2,
    //   label: {
    //     normal: {
    //       color: '#333',
    //       position: 'right',
    //       // formatter(d) {
    //       //   const ins = `{bb|${d.data.goal}}\n{aa|${d.name}}`
    //       //   return ins
    //       // },
    //       // rich: {
    //       //   aa: {
    //       //     align: 'center',
    //       //     color: fontColor,
    //       //     fontSize: '12',
    //       //     lineHeight: '30',
    //       //   },
    //       //   bb: {
    //       //     align: 'center',
    //       //     color: titleColor,
    //       //     fontSize: '22',
    //       //   },
    //       // },
    //     },
    //   },
    //   labelLine: {
    //     show: false,
    //   },
    //   data: data.map(item => ({name: item.name, value: item.count})),
    // },
    ],
  })
}
