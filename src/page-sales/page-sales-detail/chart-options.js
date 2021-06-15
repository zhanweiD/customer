import _ from 'lodash'

const fontColor = 'rgba(0,0,0,0.65)'
const titleColor = 'rgba(0,0,0,0.85)'
const color = ['#1cd389', '#668eff', '#ffc751', '#ff6e73', '#8683e6', '#9692ff']

export const circleOneOption = {
  title: {
    // text: `{name|${title}}\n{val|${total}}`,
    text: '计划触达',
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
  series: [
    {
      name: '访问来源',
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center',
      },
      labelLine: {
        show: false,
      },
      data: [
        {value: 2000, name: '计划触达'},
      ],
    },
  ],
  color: '#3f5ff4',
}

const handred = 100
const point = 42

export const circleTwoOption = {
  title: {
    text: `${point}%\n目标完成率`,
    x: 'center',
    y: 'center',
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
  tooltip: {
    formatter(params) {
      return `${params.name}：${params.percent} %`
    },
  },
  legend: {
    show: false,
    itemGap: 12,
    data: ['占比', '剩余'],
  },

  series: [{
    name: 'circle',
    type: 'pie',
    clockWise: true,
    radius: ['50%', '70%'],
    itemStyle: {
      normal: {
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
      },
    },
    hoverAnimation: false,
    data: [{
      value: point,
      name: '占比',
      itemStyle: {
        normal: {
          color: { // 颜色渐变
            colorStops: [{
              offset: 0,
              color: '#FF9254', // 0% 处的颜色
            }, {
              offset: 1,
              color: '#FFE800', // 100% 处的颜色1
            }],
          },
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
        },
      },
    }, {
      name: '剩余',
      value: handred - point,
      itemStyle: {
        normal: {
          color: '#E1E8EE',
        },
      },
    }],
  }],
}

export const lineOption = {
  title: {
    text: '目标完成人数',
  },
  xAxis: {
    type: 'category',
    data: ['5-1', '5-2', '5-3', '5-4', '5-5', '5-6', '5-7'],
  },
  yAxis: {
    type: 'value',
  },
  tooltip: {
    trigger: 'axis',
  },
  series: [{
    data: [820, 932, 901, 934, 1290, 1330, 1320],
    type: 'line',
    name: '目标完成人数',
    smooth: true,
  }],
  color: '#3f5ff4',
}

const COLOR = ['#6c9ff6', '#5cd9f7', '#ffe381', '#ffa8b4', '#c5a8f9']
const data = [{
  value: 2000,
  label: '计划触达',
}, {
  value: 1200,
  label: '进入活动',
}, {
  value: 500,
  label: '报名成功',
},
{
  value: 100,
  label: '购房成交',
}]


export function barOption(barData) {
  if (!barData.length) {
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

  return {
    grid: {
      top: 70,
      left: 33,
      right: 150,
      bottom: 15,
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
    },
    yAxis: [
      {
        type: 'category',
        inverse: true,
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          show: false,
          inside: false,
        },
        data: _.map(barData, 'label'),
      }, {
        type: 'category',
        inverse: true,
        axisTick: 'none',
        axisLine: 'none',
        show: true,
        axisLabel: {
          textStyle: {
            color: '#333333',
            fontSize: '14',
          },
          formatter(a, b) {
            return `${a}(人)`
          },
        },
        data: _.map(barData, 'value'),
      },
    ],
    series: [
      {
        name: '背景',
        type: 'bar',
        barWidth: 20,
        barGap: '-100%',
        zLevel: 1,
        data: barData.map(({
          value,
        }, index) => {
          return {
            value: 2000,
            label: {
              color: '#e2e3ef',
            },
            itemStyle: {
              color: '#e2e3ef',
            },
          }
        }),
        itemStyle: {
          normal: {
            color: 'rgba(103,150,253,0.3)',
            barBorderRadius: 10,
          },
        },
      },
      {
        name: '',
        type: 'bar',
        zlevel: 2,
        barWidth: 20,
        data: barData,
        animationDuration: 1500,
        label: {
          normal: {
            color: '#333',
            show: true,
            position: [0, '-24px'],
            textStyle: {
              fontSize: 16,
            },
            formatter(a, b) {
              return a.label
            },
          },
        },
        itemStyle: {
          normal: {
            barBorderRadius: 10,
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
              offset: 0,
              color: 'rgb(57,89,255,1)',
            }, {
              offset: 1,
              color: 'rgb(46,200,207,1)',
            }]),
          },
        },
      },
    ],
  }
}


export function funnelOption(funnelData) {
  if (!funnelData.length) {
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
    color,
    series: [{
      top: 40,
      type: 'funnel',
      sort: (a, b) => funnelData[b],
      height: '350',
      gap: 0,
      minSize: 150,
      left: '10%',
      width: '60%',
      label: {
        show: true,
        position: 'inside',
        fontSize: '14',
        formatter(d) {
          const ins = `${d.data.value}`
          return ins
        },
        rich: {
          aa: {
            padding: [8, 0, 6, 0],
          },
        },
      },
      data: funnelData,
    },
    {
      top: 40,
      type: 'funnel',
      sort: (a, b) => funnelData[b],
      height: '350',
      gap: -1,
      minSize: 150,
      left: '10%',
      width: '60%',
      z: 2,
      label: {
        normal: {
          color: '#333',
          position: 'right',
          formatter(d) {
            const ins = `${d.data.label}\n${d.data.per}`
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
      },
      labelLine: {
        show: false,
      },
      data: funnelData,
    },
    ],
  })
}
