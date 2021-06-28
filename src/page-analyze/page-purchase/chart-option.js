
const bgColor = '#fff'
const title = '报备客户数'
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

export default function pieOption(data, name) {
  if (!data.length) {
    return ({
      title: {
        text: '暂无数据',
        top: '50%',
        left: '45%',
        textStyle: {
          fontSize: 32,
          color: titleColor,
          fontWeight: 400,
        },
      },
    }) 
  }
  return ({
    title: {
      text: name,
      top: 'center',
      left: 'center',
      textStyle: {
        fontSize: 32,
        color: titleColor,
        fontWeight: 400,
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    series: [{
      name,
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['50%', '50%'],
      roseType: 'radius',
      label: {
        show: true,
        normal: {
          position: 'outside',
          fontSize: 14,
        },
      },
      labelLine: {
        length: 1,
        length2: 20,
        smooth: true,
      },
      data: data.map((item, i) => {
        item.itemStyle = {color: colors[i % 5]}
        return item
      }),
    }],
  })
}
