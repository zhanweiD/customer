
const bgColor = '#fff'
const title = '客户总数'
const color = ['#1cd389', '#668eff', '#ffc751', '#ff6e73', '#8683e6', '#9692ff']
const fontColor = 'rgba(0,0,0,0.65)'
const titleColor = 'rgba(0,0,0,0.85)'

export function pieOption(data, total) {
  if (!data.length) {
    return {
      title: [{
        text: '成交转化情况',
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
    backgroundColor: bgColor,
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
    }, 
    // {
    //   text: '客户状态分布',
    //   top: 12,
    //   left: 16,
    //   textStyle: {
    //     fontSize: 14,
    //     color: titleColor,
    //     fontWeight: 400,
    //   },
    // },
    ],
    series: [{
      type: 'pie',
      radius: ['40%', '55%'],
      center: ['50%', '50%'],
      data,
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

export function funnelOption(data1, data2) {
  if (!data1.length) {
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
    title: {
      text: '成交转化情况',
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
      top: 32,
      left: '17%',
      data: data1 && data1.map(item => item.name),
    },
    series: [{
      top: 60,
      type: 'funnel',
      sort: (a, b) => data1[b],
      height: '400',
      gap: 0,
      minSize: 150,
      left: '10%',
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
      top: 60,
      type: 'funnel',
      sort: (a, b) => data1[b],
      height: '400',
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
            const ins = `{bb|${d.data.goal}}\n{aa|${d.name}}`
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
      data: data2,
    },
    ],
  })
}
