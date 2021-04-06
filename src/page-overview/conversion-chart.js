/**
 * @description 转化对比、趋势
 */
import {useEffect, useRef} from 'react'

import {cbarOption, lineOption} from './chart-option'
 
const ConversionChart = ({barData, lineData}) => {
  const chartBar = useRef(null)
  const chartLine = useRef(null)

  const drawSaveTrend = () => {
    const myChartBar = echarts.init(chartBar.current)
    const myChartLine = echarts.init(chartLine.current)

    const resize = () => {
      myChartBar && myChartBar.resize()
      myChartLine && myChartLine.resize()
    }
    
    myChartBar.setOption(cbarOption())
    myChartLine.setOption(lineOption())
    window.addEventListener('resize', resize)
  }

  useEffect(() => {
    drawSaveTrend()
  }, [barData, lineData])

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
