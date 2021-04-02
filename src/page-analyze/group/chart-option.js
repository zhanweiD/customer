import {toJS} from 'mobx'

const bgColor = '#fff'
const color = ['#1cd389', '#668eff', '#ff6e73', '#8683e6', '#06d3c4']
const fontColor = 'rgba(0,0,0,0.65)'
const iconColor = 'rgba(0,0,0,0.45)'
const titleColor = 'rgba(0,0,0,0.85)'

export function pieOption(data, text) {
  if (data.length > 10) data.length = 10
  return ({
    backgroundColor: bgColor,
    color,
    toolbox: {
      feature: {
        magicType: {
          show: true,
          type: ['line', 'bar'],
        },
        restore: {
          show: true,
        },
      },
      iconStyle: {
        normal: {
          borderColor: iconColor,
        },
      },
      itemSize: 12,
      top: 8,
      right: 16,
    },
    tooltip: {
      trigger: 'item',
    },
    title: [{
      text: `{name|${toJS(text)}}\n{val|${data.reduce((total, item) => total + item.val, 0)}}`,
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
      text,
      top: 12,
      left: 16,
      textStyle: {
        fontSize: 14,
        color: titleColor,
        fontWeight: 400,
      },
    },
    ],
    series: [{
      type: 'pie',
      radius: ['40%', '55%'],
      center: ['50%', '50%'],
      data: data.map(item => ({name: item.name, value: item.val})),
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
              `{name|${params.name}}{value|${params.value}}`
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

export function barOption(dataList, type, text) {
  if (dataList.length > 10) dataList.length = 10
  return ({
    toolbox: {
      feature: {
        magicType: {
          show: true,
          type: ['line', 'bar'],
        },
        restore: {
          show: true,
        },
      },
      iconStyle: {
        normal: {
          borderColor: iconColor,
        },
      },
      itemSize: 12,
      top: 8,
      right: 16,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    title: [{
      text,
      top: 12,
      left: 16,
      textStyle: {
        fontSize: 14,
        color: titleColor,
        fontWeight: 400,
      },
    }],
    grid: {
      left: '8%',
      right: '15%',
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
      data: _.map(dataList, 'name'),
    }],
    yAxis: {
      type: 'value',
      name: '客户数/千人',
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
    series: [{
      name: '客户数',
      type,
      barWidth: '40%',
      lineStyle: {
        normal: {
          width: 2,
          color: color[0],
        },
      },
      data: dataList.map(item => {
        return {
          value: item.val,
          itemStyle: {
            color: color[1],
          },
        }
      }),
    }],
  })
}
