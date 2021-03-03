const color = ['#1cd389', '#668eff', '#ff6e73', '#8683e6', '#06d3c4', '#42b1cc']
const fontColor = 'rgba(0,0,0,0.65)'

export default function radarOption(radarChart) {
  return ({
    color,
    tooltip: {},
    radar: {
      radius: '70%',
      // radius: '50%',
      nameGap: 4, // 图中工艺等字距离图的距离
      // splitNumber: 3, //指示器轴的分割段数
      name: {
        textStyle: {
          color: fontColor,
          fontSize: 12,
        },
      },
      indicator: radarChart.indicator && radarChart.indicator.map(item => {
        return {
          name: item,
          max: 100,
        }
      }),
      axisLine: { // 指向外圈文本的分隔线样式
        lineStyle: {
          // color: '#1c368f',
        },
      },
      splitLine: {
        lineStyle: {
        },
      },
      splitArea: {
        areaStyle: {
          // color: '#141845',
        },
      },
    },
    grid: {
      top: '8%',
      left: '4%',
      right: '4%',
      bottom: '4%',
      containLabel: true,
    },
    series: [{
      name: ' ',
      type: 'radar',
      data: radarChart.data && radarChart.data.map((item, index) => {
        item.areaStyle = {
          color: color[index],
        }
        return item
      }),
    }],
  })
}
