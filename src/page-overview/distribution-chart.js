/**
 * @description 转化对比、趋势
 */
import {useState, useEffect, useRef} from 'react'
 
import {dbarOption, mapOption} from './chart-option'
import china from '../../public/map'
  
const DistributionChart = ({mapType}) => {
  const chartBar = useRef(null)
  const chartMap = useRef(null)
  const [barData, setBarData] = useState([])
  const [mapData, setMapData] = useState([])
   
  const drawSaveTrend = () => {
    echarts.registerMap(mapType, china[mapType])

    const myChartMap = echarts.init(chartMap.current)
    const myChartBar = echarts.init(chartBar.current)
 
    const resize = () => {
      myChartMap && myChartMap.resize()
      myChartBar && myChartBar.resize()
    }
    myChartMap.setOption(mapOption(mapType))
    myChartBar.setOption(dbarOption())
    window.addEventListener('resize', resize)
  }
 
  useEffect(() => {
    drawSaveTrend()
  }, [mapData, barData])

  useEffect(() => {
    // 发请求
    drawSaveTrend()
  }, [mapType])
 
  return (
    <div className="p16 bgf">
      {/* <Spin spinning={chartLoading}> */}
      <div ref={chartMap} style={{height: '614px', width: '62%', display: 'inline-block'}} />
      <div ref={chartBar} style={{height: '480px', width: '38%', display: 'inline-block'}} />
      {/* </Spin> */}
    </div> 
  )
}
export default DistributionChart
