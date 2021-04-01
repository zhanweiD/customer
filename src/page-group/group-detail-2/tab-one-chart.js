/* eslint-disable no-unused-expressions */
import React, {useRef, useEffect} from 'react'


const option = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: [{
    data: [120, 200, 150, 80, 70, 110, 130],
    type: 'bar',
  }],
}

export default () => {
  const chartRef = useRef(null)
  let chartInstance = null

  const renderChart = () => {
    const renderedInstance = echarts.getInstanceByDom(chartRef.current)
    if (renderedInstance) {
      chartInstance = renderedInstance
    } else {
      chartInstance = echarts.init(chartRef.current)
    }
    
    chartInstance.setOption(option)
  }

  const resize = () => {
    chartInstance && chartInstance.resize()
  }

  useEffect(() => {
    renderChart()

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div ref={chartRef} style={{height: '500px'}} />
  )
}
