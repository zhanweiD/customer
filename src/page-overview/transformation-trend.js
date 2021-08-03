/**
 * @description 转化趋势
 */
import {useEffect, useRef, useState} from 'react'
import {Spin} from 'antd'
 
import {errorTip} from '../common/util'
import {lineOption} from './chart-option'
import io from './io'
  
const TransformationTrend = ({
  orgCodes, projectCode, timeStart, timeEnd,
}) => {
  const chartLine = useRef(null)
  const [lineData, setLineData] = useState([])
  const [loading, setLoading] = useState(false)
 
  const drawSaveTrend = () => {
    const myChartLine = echarts.init(chartLine.current)
 
    const resize = () => {
      if (myChartLine) {
        myChartLine.resize()
      }
    }
    myChartLine.clear()
    myChartLine.setOption(lineOption(lineData))
    window.addEventListener('resize', resize)
  }
 
  async function getTrend() {
    setLoading(true)
    try {
      const res = await io.getTrend({
        timeStart,
        timeEnd,
        orgCodes,
        projectCode,
      })
      setLineData(res)
    } catch (err) {
      errorTip(err.message)
    } finally {
      setLoading(false)
    }
  }
 
  useEffect(() => {
    drawSaveTrend()
  }, [lineData])
 
  useEffect(() => {
    getTrend()
  }, [timeStart, orgCodes, projectCode])
 
  return (
    <div className="p16 bgf mb16 customer-chart">
      <Spin spinning={loading}>
        <div ref={chartLine} style={{height: '300px', width: '100%'}} />
      </Spin>
    </div> 
  )
}
export default TransformationTrend
