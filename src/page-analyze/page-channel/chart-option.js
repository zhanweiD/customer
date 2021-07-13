
const bgColor = '#fff'
const title = '客户总数'
const color = ['#1cd389', '#668eff', '#ff6e73', '#8683e6', '#06d3c4']
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

export function pieOption(data, total) {
  if (!data.length) {
    return ({
      title: [{
        text: '暂无数据',
        top: '50%',
        left: '50%',
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
    color: colors,
    tooltip: {
      trigger: 'item',
      // formatter: params => {
      //   return (
      //     `${params.name}${params.value}\n'点击下转二级渠道'`
      //   )
      //   // return '点击下转二级渠道'
      // },
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
    ],
    series: [{
      type: 'pie',
      radius: ['50%', '65%'],
      center: ['50%', '50%'],
      top: 16,
      data: data.map(item => {
        return {name: item.name, value: item.sub, child: item.child}
      }),
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
              fontSize: 14,
              padding: [0, 4, 0, 4],
              color: fontColor,
            },
            percent: {
              fontSize: 14,
              padding: [0, 4, 0, 4],
              color: fontColor,
            },
            value: {
              fontSize: 14,
              color: fontColor,
            },
          },
        },
      },
    }],
  })
}

export function sanKeyOption(data, links) {
  if (!data.length) {
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
      },
      ],
    } 
  }
  return ({
    // color: colors,
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
    },
    series: [{
      type: 'sankey',
      top: 24,
      left: 48,
      right: 96,
      bottom: 24,
      focusNodeAdjacency: true,
      nodeGap: 12,
      layoutIterations: 84,
      layout: 'none',
      itemStyle: {
        normal: {
          borderWidth: 0,
          borderColor: '#fff',
          opacity: 1,
        },
      },
      lineStyle: {
        color: 'source',
        curveness: 0.5,
      },
      // data,
      data: data.map((item, index) => {
        item.itemStyle = {
          normal: {
            color: color[index % color.length],
          },
        }
        return item
      }),
      links,
    }],
  })
}
