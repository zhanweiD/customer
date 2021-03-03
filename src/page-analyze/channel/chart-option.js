
const bgColor = '#fff'
const title = '客户总数'
const color = ['#1cd389', '#668eff', '#ff6e73', '#8683e6', '#06d3c4']
const fontColor = 'rgba(0,0,0,0.65)'
const titleColor = 'rgba(0,0,0,0.85)'

export function pieOption(data, total) {
  if (!data.length) {
    return ({
      title: [{
        text: '渠道拓客分布（可下转二级渠道）',
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
    }) 
  }
  return ({
    backgroundColor: bgColor,
    color,
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
    {
      text: '渠道拓客分布（可下转二级渠道）',
      top: 16,
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
      radius: ['35%', '48%'],
      center: ['50%', '50%'],
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

export function sanKeyOption(data, links) {
  if (!data.length) {
    return {
      title: [{
        text: '渠道拓客转化',
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
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
    },
    title: [{
      text: '渠道拓客转化',
      top: 16,
      left: 16,
      textStyle: {
        fontSize: 14,
        color: titleColor,
        fontWeight: 400,
      },
    },
    ],
    series: [{
      type: 'sankey',
      top: 48,
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
