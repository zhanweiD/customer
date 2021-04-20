const color = ['#1cd389', '#668eff', '#ff6e73', '#8683e6', '#06d3c4', '#42b1cc']
const fontColor = 'rgba(0,0,0,0.65)'
const titleColor = 'rgba(0,0,0,0.85)'
const bgColor = '#fff'
const title = '触点总数'

export function pieOption(data, total) {
  if (!data.length) {
    return {
      title: [{
        text: '业务类型分布',
        top: 16,
        left: 16,
        textStyle: {
          fontSize: 14,
          color: titleColor,
          fontWeight: 400,
        },
      }, {
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
    color,
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
    }, {
      text: '业务类型分布',
      top: 0,
      left: 0,
      textStyle: {
        fontSize: 14,
        color: titleColor,
        fontWeight: 400,
      },
    }],
    grid: {
      left: -48,
      right: 0,
    },
    series: [{
      type: 'pie',
      left: -48,
      right: 8,
      radius: ['58%', '78%'],
      center: ['50%', '50%'],
      data,
      // hoverAnimation: false,
      itemStyle: {
        normal: {
          borderColor: bgColor,
          borderWidth: 2,
        },
      },
      labelLine: {
        show: false,
      },
      label: {
        show: false,
      },
    }],
  })
}

export function barOption(data) {
  return ({
    title: {
      text: '触点类型分布',
      top: 0,
      left: 0,
      textStyle: {
        fontSize: 14,
        color: titleColor,
        fontWeight: 400,
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'none',
      },
    },
    legend: {
      data: ['线下触点', '线上触点'],
      top: 48,
      right: 0,
    },
    grid: {
      top: 96,
      left: 8,
      right: 0,
    },
    xAxis: {
      type: 'value',
      show: false,
    },
    yAxis: {
      type: 'category',
      data: ['触点类型'],
      show: false,
    },
    series: [
      {
        name: '线下触点',
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
        },
        barWidth: '100%',
        data: [data[0] ? data[0].value : null],
        color: color[0],

      },
      {
        name: '线上触点',
        type: 'bar',
        stack: 'total',
        color: color[1],
        label: {
          show: true,
        },
        barWidth: '100%',
        data: [data[1] ? data[1].value : null],
      },
    ],
  }
  )
}
