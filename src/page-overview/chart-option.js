/* eslint-disable guard-for-in */
const color = ['#61BA46', '#2592FF', '#355FF9', '#6C41FA', '#FD5071', '#0099cc']

const fontColor = 'rgba(22,50,78,0.85)'
const titleColor = '#16324E'

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


// 客户转化率
export function funnelOption(funnelData, dataIndex = 0) {
  const {data = [], type = []} = funnelData
  if (!data.length) {
    return {
      title: [
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
    color: [new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
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
    }])],
    itemStyle: {
      opacity: 0.8,
    },
    series: [{
      top: 32,
      type: 'funnel',
      sort: 'none',
      height: '260',
      gap: 1,
      zlevel: 2,
      minSize: 150,
      // left: '5%',
      left: 'center',
      width: '60%',
      selectedMode: 'single',
      select: {
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 4,
          // color: color[dataIndex],
        },
      },
      label: {
        show: true,
        position: 'inside',
        fontSize: '14',
        color: '#fff',
        textBorderColor: '#fff',
        // fontWeight: 400,
        formatter(d) {
          const ins = `${d.name}{aa|}`
          return ins
        },
        rich: {
          aa: {
            padding: [8, 0, 6, 0],
          },
        },
      },
      data: data.map(item => ({
        name: item.name, 
        value: item.count,
      })),
    }, {
      top: 32,
      type: 'funnel',
      sort: 'none',
      height: '260',
      gap: 0,
      zlevel: 1,
      minSize: 150,
      // left: '5%',
      left: 'center',
      width: '60%',
      selectedMode: 'single',
      select: {
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 4,
          // color: color[dataIndex],
        },
      },
      label: {
        show: true,
        position: 'right',
        fontSize: '14',
        color: fontColor,
        textBorderColor: '#fff',
        // fontWeight: 400,
        formatter(d) {
          const ins = `${d.value}`
          return ins
        },
        rich: {
          aa: {
            padding: [8, 0, 6, 0],
          },
        },
      },
      labelLine: {
        show: false,
      },
      data: data.map(item => ({
        name: item.name, 
        value: item.count,
      })),
    },
    ],
  })
}

// 各区域转化率
export function cbarOption(barData, type) {
  const {data = [], x = [], y = []} = barData
  return {
    title: {
      text: `各区域${type}转化率`,
      top: 18,
      textStyle: {
        fontSize: 14,
        color: titleColor,
        fontWeight: 500,
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter(item) {
        const obj = item[0] || {}
        return `${obj.name}: ${obj.value}%`
      },
    },
    grid: {
      top: 72,
      bottom: 64,
      left: 80,
      right: 72,
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
        fontSize: 14,
        color: fontColor,
      },
      axisLabel: {
        textStyle: {
          fontSize: 14,
          color: fontColor,
          left: 256,
        },
      },
      data: y,
    },
    series: [
      {
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(22,50,78,0.05)',
          borderRadius: 12,
        },
        labelLayout(params) {
          return {
            // x: 48,
            x: '97%',
            y: params.rect.y + params.rect.height / 2,
            verticalAlign: 'middle',
            align: 'right',
          }
        },
        barWidth: 16,
        itemStyle: {
          barBorderRadius: 12,
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
            offset: 0,
            color: '#86D4FF',
          }, {
            offset: 1,
            color: '#2592FF',
          }]),
        },
        label: {
          show: true,
          position: 'right',
          // position: 'inside',
          formatter(d) {
            const ins = `${d.value}%`
            return ins
          },
        },
        name: type,
        data: data.map(sitem => {
          return sitem[type]
        }),
      }, 
    ],
  }
}

// 转化趋势
export function lineOption(lineData) {
  const {data = [], type = []} = lineData
  const xData = []
  // eslint-disable-next-line no-restricted-syntax
  // for (const item in data) {
  //   xData.unshift({name: item, value: data[item]})
  // }
  const keys = Object.keys(data).length ? Object.keys(data).sort() : []
  for (let i = 0; i < keys.length; i++) {
    xData.push({name: keys[i], value: data[keys[i]]})
  }
  return {
    grid: {
      top: 40,
      bottom: 24,
      right: 16,
      left: 48,
    },
    legend: {
      top: 0,
      right: 8,
      data: type,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    // dataZoom: [
    //   {
    //     show: true,
    //     realtime: true,
    //     start: 0,
    //     end: 50,
    //   },
    //   {
    //     type: 'inside',
    //     realtime: true,
    //     start: 0,
    //     end: 50,
    //   },
    // ],
    xAxis: {
      type: 'category',
      data: xData.map(item => item.name),
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
      },
      axisLine: {
        lineStyle: {
          type: 'dashed',
          color: '#ccc',
        },
      },
    },
    yAxis: [
      {
        type: 'value',
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
            color: '#fff',
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
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
    tooltip: {
      trigger: 'item',
      formatter(item) {
        const ins = `${item.name}<br /> 客户人数：${item.value || '-'}`
        return ins
      },
    },
    dataRange: {
      itemWidth: 8,
      itemHeight: 72,
      min: 0,
      max: counts.length ? Math.max(...counts) : 0,
      show: true,
      x: 'left',
      y: 'bottom',
      width: 12,
      inRange: {
        // color: ['rgba(105, 137, 255, 0.1)', 'rgba(105, 137, 255, 1)'], // 渐变颜色
        color: ['rgba(187, 202, 255, 1)', 'rgba(105, 137, 255, 1)'], // 渐变颜色
      },
      text: ['高', '低'], // 文本，默认为数值文本
      calculable: false,
    },
    // geo: {
    //   map: mapType,
    //   zoom: 1.2,
    //   regions: [
    //     {
    //       name: '南海诸岛',
    //       itemStyle: {
    //         // 隐藏地图
    //         normal: {
    //           opacity: 0, // 为 0 时不绘制该图形
    //         },
    //       },
    //       label: {
    //         show: false, // 隐藏文字
    //       },
    //     },
    //   ],
    // },
    // emphasis: {
    //   itemStyle: {
    //     areaColor: '#A88EFF',
    //     color: '#fff',
    //   },
    //   label: {
    //     color: '#fff',
    //   },
    // },
    series: [
      {
        // name: '客户人数',
        type: 'map',
        label: {
          show: false, // 显示省份标签
        },
        itemStyle: {
          borderColor: '#ccccf6',
          areaColor: 'rgba(105, 137, 255, 0.1)', // 这里是重点
        },
        emphasis: { // 对应的鼠标悬浮效果
          show: true,
          itemStyle: {
            areaColor: '#A88EFF',
            borderColor: '#ccccf6',
            borderWidth: 2,
          },
          label: {
            show: true, // 显示省份标签
            textStyle: {
              color: '#fff',
            }, // 省份标签字体颜色
          },
        },
        select: {
          show: true,
          itemStyle: {
            areaColor: '#A88EFF',
            borderColor: '#ccccf6',
            borderWidth: 2,
          },
          label: {
            show: true, // 显示省份标签
            textStyle: {
              color: '#fff',
            }, // 省份标签字体颜色
          },
        },
        mapType,
        geoIndex: 0,
        top: 120,
        left: '30%',
        roam: false,
        zoom: 1.7,
        data: data.map(item => ({name: item.name, value: item.count})),
      },
    ],
  }
}

// 客户分布
export function dbarOption(data) {
  return {
    title: {
      text: '客户分布排名',
      top: 16,
      textStyle: {
        fontSize: 14,
        color: titleColor,
        fontWeight: 500,
      },
    },
    tooltip: {
      trigger: 'axis',
      formatter(item) {
        if (!item[0]) {
          return '-'
        }
        const ins = `${item[0].name}<br /> 客户人数：${item[0].value || '-'}`
        return ins
      },
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: 128,
      bottom: 12,
      top: 48,
      right: 60,
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
        fontSize: 14,
        color: fontColor,
      },
      axisLabel: {
        textStyle: {
          fontSize: 14,
          color: fontColor,
          left: 256,
        },
      },
      data: data.map(item => item.name),
    },
    series: [
      {
        type: 'bar',
        barWidth: 6,
        itemStyle: {
          barBorderRadius: 12,
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
            offset: 0,
            color: '#CABAFF',
          }, {
            offset: 1,
            color: '#7F59FB',
          }]),
        },
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(22,50,78,0.05)',
          borderRadius: 12,
        },
        labelLayout(params) {
          return {
            x: '96%',
            y: params.rect.y + params.rect.height / 2,
            verticalAlign: 'middle',
            align: 'right',
          }
        },
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

    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c}',
    },
    
    series: {
      type: 'sunburst',
      data: data.map((item, index) => {
        item.itemStyle = {
          normal: {
            color: colors[index % colors.length],
          },
        }
        return item
      }),
      sort: null,
      center: ['50%', '50%'],
      radius: ['0%', '80%'],
      label: {
        // rotate: 'radial',
        color: '#fff',
        fontSize: 12,
        // minAngle: 30,
      },
    },
  }
}
