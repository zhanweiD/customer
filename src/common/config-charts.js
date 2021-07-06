
const nameTextStyleColor = 'rgba(22, 50, 78, .45)'
const areaColor = '#31C5E9'
const formatterFn = title => params => `日期: ${moment(+params[0].axisValue).format('YYYY-MM-DD')} <br/>${title}: ${params[0].value}`

// eslint-disable-next-line import/prefer-default-export
export function getLineChartOpt({
  data = [],
  title = '',
  titlePadding = [0, 0, 0, 30],
  formatter = formatterFn(title),
  grid = {
    x: 10,
    y: 30,
    x2: 10,
    y2: 0,
  },
}) {
  return {
    grid: {
      containLabel: true,
      x: grid.x,
      y: grid.y,
      x2: grid.x2,
      y2: grid.y2,
    },
    tooltip: {
      trigger: 'axis',
      formatter: formatter || formatterFn(title),
    },
    xAxis: {
      type: 'category',
      data: _.map(data, 'key'),
      axisLabel: {
        formatter: value => moment(+value).format('MM-DD'),
        textStyle: {
          color: nameTextStyleColor,
        },
      },
      axisLine: {
        lineStyle: {
          color: '#E9E9E9',
        },
      },
    },
    yAxis: [
      {
        type: 'value',
        min: 0,
        name: title,
        nameTextStyle: {
          padding: titlePadding,
          color: nameTextStyleColor,
        },
        minInterval: 1,
        // max: 250,
        // interval: 50,
        axisLabel: {
          formatter: '{value}',
          textStyle: {
            color: nameTextStyleColor,
          },
        },
        axisLine: {
          lineStyle: {
            color: '#E9E9E9',
          },
        },
      },

    ],
    series: [
      {
        name: title,
        type: 'line',
        data: _.map(data, 'value'),
        itemStyle: {
          normal: {
            color: areaColor,
            areaStyle: {type: 'default', opacity: 0.2}, // 面积图
          },
        },
      },
    ],
  }
}
