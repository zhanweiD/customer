const color = ['#1cd389', '#668eff', '#ff6e73', '#8683e6', '#06d3c4', '#42b1cc']
const fontColor = 'rgba(22,50,78,0.85)'
const titleColor = 'rgba(22,50,78, 1)'
const bgColor = '#fff'
const title = '触点总数'

export function cloudOption(data, maskImage) {
  return {
    series: [{
      type: 'wordCloud',
      // left: 32, 
      // right: 24,
      // top: 24,
      // bottom: 24,
      // sizeRange: [10, 20],
      rotationRange: [0, 0],
      // gridSize: 24,
      // rotationStep: 45,
      gridSize: 21,
      shape: 'circle',
      maskImage,
      drawOutOfBound: false, // 画布之外显示
      // shrinkToFit: true, // 画布内字体自适应大小
      maskGapWidth: 0, // 方块之间的间隙宽度
      drawMask: true, // 绘制正方形
      rotateRatio: 0,
      rotationSteps: 0,
      
      // textStyle: {
      //   color() {
      //     return `rgb(${[
      //       Math.round(Math.random() * 160),
      //       Math.round(Math.random() * 160),
      //       Math.round(Math.random() * 160),
      //     ].join(',')})`
      //   },
      // },
      // emphasis: {
      //   textStyle: {
      //     color: 'red',
      //   },
      // },
      data,
    }],
  }
}

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
    color: [new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
      offset: 0,
      color: '#61BA46',
    }, {
      offset: 1,
      color: '#BFEEA9',
    }]), new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
      offset: 0,
      color: '#2592FF',
    }, {
      offset: 1,
      color: '#86D4FF',
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
            color: titleColor,
          },
        },
      },
    }, {
      text: '业务类型分布',
      top: 0,
      left: 24,
      textStyle: {
        fontSize: 14,
        color: titleColor,
        fontWeight: 400,
      },
    }],
    // grid: {
    //   left: 0,
    //   right: 0,
    // },
    series: [{
      type: 'pie',
      radius: ['65%', '85%'],
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
    label: {
      color: '#fff',
    },
    // itemStyle: {
    //   barBorderRadius: 12,
    // },
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
        barWidth: 24,
        data: [data[0] ? data[0].value : null],
        color: [new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
          offset: 0,
          color: '#86D4FF',
        }, {
          offset: 1,
          color: '#2592FF',
        }])],
      },
      {
        name: '线上触点',
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
        },
        barWidth: 24,
        data: [data[1] ? data[1].value : null],
        color: [new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
          offset: 0,
          color: '#FFA1BC',
        }, {
          offset: 1,
          color: '#FD5071',
        }])],
      },
    ],
  }
  )
}
