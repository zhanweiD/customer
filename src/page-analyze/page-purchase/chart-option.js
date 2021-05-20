
const bgColor = '#fff'
const title = '报备客户数'
const color = ['#1cd389', '#668eff', '#ff6e73', '#8683e6', '#06d3c4']
const fontColor = 'rgba(0,0,0,0.65)'
const titleColor = 'rgba(0,0,0,0.85)'

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
          fontSize: 12,
        },
      },
      labelLine: {
        length: 1,
        length2: 20,
        smooth: true,
      },
      data: data.map((item, i) => {
        item.itemStyle = {color: color[i % 5]}
        return item
      })
    }],
  })
}
