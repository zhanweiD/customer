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

export const mapOption = {
  title: {
    text: '客户分布',
    x: 'left',
  },
  tooltip: {
    trigger: 'item',
  },
  dataRange: {
    min: 0,
    max: 2500,
    x: 'left',
    y: 'bottom',
    // text: ['高', '低'], // 文本，默认为数值文本
    calculable: false,
  },
  series: [
    {
      name: '客户人数',
      type: 'map',
      mapType: 'china',
      roam: false,
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
      ],
    }, 
  ],
}

export const lbOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999',
      },
    },
  },
  legend: {
    data: ['蒸发量', '降水量', '平均温度'],
  },
  xAxis: [
    {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      axisPointer: {
        type: 'shadow',
      },
    },
  ],
  yAxis: [
    {
      type: 'value',
      name: '水量',
      min: 0,
      max: 250,
      interval: 50,
      axisLabel: {
        formatter: '{value} ml',
      },
    },
    {
      type: 'value',
      name: '温度',
      min: 0,
      max: 25,
      interval: 5,
      axisLabel: {
        formatter: '{value} °C',
      },
    },
  ],
  series: [
    {
      name: '蒸发量',
      type: 'bar',
      stack: 'total',
      data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
    },
    {
      name: '降水量',
      stack: 'total',
      type: 'bar',
      data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
    },
    {
      name: '平均温度',
      type: 'line',
      yAxisIndex: 1,
      data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
    },
  ],
}
