/**
 * @description 转化对比、趋势
 */
import {useEffect, useRef, useState} from 'react'

import {cbarOption, lineOption} from './chart-option'
 
const ConversionChart = ({area}) => {
  const chartBar = useRef(null)
  const chartLine = useRef(null)
  const [barData, setBarData] = useState([])
  const [lineData, setLineData] = useState([])

  const drawSaveTrend = () => {
    const myChartBar = echarts.init(chartBar.current)
    const myChartLine = echarts.init(chartLine.current)

    const resize = () => {
      myChartBar && myChartBar.resize()
      myChartLine && myChartLine.resize()
    }
    myChartBar.clear()
    myChartLine.clear()
    myChartBar.setOption(cbarOption(area))
    myChartLine.setOption(lineOption(area))
    window.addEventListener('resize', resize)
  }

  useEffect(() => {
    drawSaveTrend()
  }, [barData, lineData])

  useEffect(() => {
    drawSaveTrend()
  }, [area])

  return (
    <div className="p16 bgf mb16">
      {/* <Spin spinning={chartLoading}> */}
      <div ref={chartBar} style={{height: '480px', width: '50%', display: 'inline-block'}} />
      <div ref={chartLine} style={{height: '480px', width: '50%', display: 'inline-block'}} />
      {/* </Spin> */}
    </div> 
  )
}
export default ConversionChart
