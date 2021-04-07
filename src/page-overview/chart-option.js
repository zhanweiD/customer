const color = ['#1cd389', '#668eff', '#ffc751', '#ff6e73', '#8683e6', '#9692ff']
const fontColor = 'rgba(0,0,0,0.65)'
const titleColor = 'rgba(0,0,0,0.85)'
// 转化对比
export function cbarOption(area) {
  return {
    title: {
      text: area === 'china' ? '转化对比' : '客户变化趋势',
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
      bottom: 50,
    },
    legend: {
      top: 32,
      data: area === 'chaina' ? ['报备', '来访', '成交'] : ['报备', '来访', '成交', '成交转化率'],
    },
    xAxis: [
      {
        type: 'category',
        color: fontColor,
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
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
          interval: 1,
        },
        axisLine: {
          lineStyle: {
            color: '#ccc',
          },
        },
      },
    ],
    yAxis: area === 'chaina' ? [
      {
        type: 'value',
        name: '人数',
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
    ] : [
      {
        type: 'value',
        name: '人数',
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
      {
        type: 'value',
        name: '成交率',
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
    
    series: area === 'china' ? [
      {
        name: '报备',
        type: 'bar',
        stack: 'total',
        color: color[0],
        data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
      },
      {
        name: '来访',
        stack: 'total',
        type: 'bar',
        color: color[1],
        data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
      },
      {
        name: '成交',
        stack: 'total',
        type: 'bar',
        color: color[2],
        data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
      },
    ] : [
      {
        name: '报备',
        type: 'bar',
        stack: 'total',
        color: color[0],
        data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
      },
      {
        name: '来访',
        stack: 'total',
        type: 'bar',
        color: color[1],
        data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
      },
      {
        name: '成交',
        stack: 'total',
        type: 'bar',
        color: color[2],
        data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
      },
      {
        name: '成交转化率',
        type: 'line',
        yAxisIndex: 1,
        color: color[3],
        data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
      },
    ],
  }
}

// 转化趋势
export function lineOption(area) {
  return {
    title: {
      text: area === 'china' ? '转化趋势' : '供需情况',
      textStyle: {
        fontSize: 14,
        color: titleColor,
        fontWeight: 400,
      },
    },
    grid: {
      top: 96,
      bottom: 50,
    },
    legend: {
      top: 32,
      data: area === 'china' ? ['来访', '成交'] : ['高层', '别墅'],
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },

    xAxis: {
      type: 'category',
      data: ['2012', '2013', '2014', '2015', '2016', '2017'],
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
        interval: 1,
      },
      axisLine: {
        lineStyle: {
          color: '#ccc',
        },
      },
    },
    yAxis: area === 'china' ? [
      {
        type: 'value',
        name: '趋势',
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
    ] : [
      {
        type: 'value',
        name: '销售量',
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
    series: area === 'china' ? [
      {
        name: '来访',
        type: 'line',
        color: color[0],
        smooth: true,
        seriesLayoutBy: 'row',
        emphasis: {focus: 'series'},
        data: [56.5, 82.1, 88.7, 70.1, 53.4, 85.1],
          
      },
      {
        name: '成交',
        type: 'line',
        color: color[1],
        smooth: true,
        seriesLayoutBy: 'row',
        emphasis: {focus: 'series'},
        data: [51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
      },
    ] : [
      {
        name: '高层',
        type: 'line',
        color: color[0],
        smooth: true,
        seriesLayoutBy: 'row',
        emphasis: {focus: 'series'},
        data: [56.5, 82.1, 88.7, 70.1, 53.4, 85.1],
          
      },
      {
        name: '别墅',
        type: 'line',
        color: color[1],
        smooth: true,
        seriesLayoutBy: 'row',
        emphasis: {focus: 'series'},
        data: [51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
      },
    ],
  }
}

// 客户分布
export function mapOption(mapType) {
  return {
    title: {
      text: '客户分布',
      x: 'left',
    },
    tooltip: {
      trigger: 'item',
    },
    dataRange: {
    // min: 0,
    // max: 2500,
      show: true,
      x: 'left',
      y: 'bottom',
    // text: ['高', '低'], // 文本，默认为数值文本
    // calculable: false,
    },
    series: [
      {
        name: '客户人数',
        type: 'map',
        mapType,
        top: 128,
        left: 56,
        roam: false,
        zoom: 1.2,
        itemStyle: {
          normal: {label: {show: true}},
          emphasis: {label: {show: true}},
        },
        data: [
          {name: '北京', value: Math.round(Math.random() * 1000)},
          {name: '天津', value: Math.round(Math.random() * 1000)},
          {name: '上海', value: Math.round(Math.random() * 1000)},
          {name: '重庆', value: Math.round(Math.random() * 1000)},
          {name: '河北', value: Math.round(Math.random() * 1000)},
          {name: '河南', value: Math.round(Math.random() * 1000)},
          {name: '云南', value: Math.round(Math.random() * 1000)},
          {name: '辽宁', value: Math.round(Math.random() * 1000)},
          {name: '黑龙江', value: Math.round(Math.random() * 1000)},
          {name: '湖南', value: Math.round(Math.random() * 1000)},
          {name: '安徽', value: Math.round(Math.random() * 1000)},
          {name: '山东', value: Math.round(Math.random() * 1000)},
          {name: '新疆', value: Math.round(Math.random() * 1000)},
          {name: '江苏', value: Math.round(Math.random() * 1000)},
          {name: '浙江', value: Math.round(Math.random() * 1000)},
          {name: '江西', value: Math.round(Math.random() * 1000)},
          {name: '湖北', value: Math.round(Math.random() * 1000)},
          {name: '广西', value: Math.round(Math.random() * 1000)},
          {name: '甘肃', value: Math.round(Math.random() * 1000)},
          {name: '山西', value: Math.round(Math.random() * 1000)},
          {name: '内蒙古', value: Math.round(Math.random() * 1000)},
          {name: '陕西', value: Math.round(Math.random() * 1000)},
          {name: '吉林', value: Math.round(Math.random() * 1000)},
          {name: '福建', value: Math.round(Math.random() * 1000)},
          {name: '贵州', value: Math.round(Math.random() * 1000)},
          {name: '广东', value: Math.round(Math.random() * 1000)},
          {name: '青海', value: Math.round(Math.random() * 1000)},
          {name: '西藏', value: Math.round(Math.random() * 1000)},
          {name: '四川', value: Math.round(Math.random() * 1000)},
          {name: '宁夏', value: Math.round(Math.random() * 1000)},
          {name: '海南', value: Math.round(Math.random() * 1000)},
          {name: '台湾', value: Math.round(Math.random() * 1000)},
          {name: '香港', value: Math.round(Math.random() * 1000)},
          {name: '澳门', value: Math.round(Math.random() * 1000)},
          {name: '杭州市', value: Math.round(Math.random() * 1000)},
        ],
      }, 
    ],
  }
}

// 客户分布
export function dbarOption() {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: ['2011年'],
    },
    grid: {
      left: 56,
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
        },
      },
      data: ['浙江', '河南', '山东', '上海', '北京', '深圳'],
    },
    series: [
      {
      // name: '2011年',
        type: 'bar',
        barWidth: '40%',
        left: 96,
        color: color[1],
        label: {
          show: true,
          position: 'inside',
        },
        data: [12, 13, 14, 22, 24, 50],
      }, 
    ],
  }
}

const data = [{
  name: '自渠',
  children: [{
    name: '线上',
    value: 15,
  }, 
  {
    name: '线下',
    value: 10,
  }],
}, {
  name: '外渠',
  children: [{
    name: '广告',
    value: 15,
  }, 
  {
    name: '网站',
    value: 10,
  }],
}]

// 渠道分布
export function sunOption() {
  return {
    title: {
      text: '客户渠道分布',
      textStyle: {
        fontSize: 14,
        color: titleColor,
        fontWeight: 400,
      },
    },
    tooltip: {
      trigger: 'item',
    },
    series: {
      type: 'sunburst',
      data,
      radius: [0, '100%'],
      label: {
        rotate: 'radial',
      },
    },
  }
}

// 客户转化率
export function funnelOption(data1, data2) {
  if (!data1) {
    return {
      title: [{
        text: '暂无数据',
        top: '50%',
        left: '30%',
        textStyle: {
          fontSize: 32,
          color: titleColor,
          fontWeight: 400,
        },
      }],
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
      top: 48,
      left: '5%',
      data: data1 && data1.map(item => item.name),
    },
    series: [{
      top: 96,
      type: 'funnel',
      sort: (a, b) => data1[b],
      height: '300',
      minSize: 150,
      left: '5%',
      width: '60%',
      label: {
        show: true,
        position: 'inside',
        fontSize: '14',
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
      data: data1,
    },
    {
      top: 96,
      type: 'funnel',
      sort: (a, b) => data1[b],
      height: '300',
      minSize: 50,
      left: '15%',
      width: '60%',
      label: {
        normal: {
          color: '#333',
          position: 'right',
          rich: {
            aa: {
              align: 'left',
              color: fontColor,
              fontSize: '12',
            },
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
