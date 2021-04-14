/**
 * @description 转化对比、趋势
 */
import {useEffect, useRef, useState} from 'react'
import {Spin} from 'antd'

import {errorTip} from '../common/util'

import {cbarOption, lineOption} from './chart-option'
import io from './io'
 
const ConversionChart = ({
  orgCodes, projectCode, timeStart, timeEnd,
}) => {
  const chartBar = useRef(null)
  const chartLine = useRef(null)
  const [barData, setBarData] = useState([])
  const [lineData, setLineData] = useState([])
  const [loading, setLoading] = useState(false)

  const drawSaveTrend = () => {
    const myChartBar = echarts.init(chartBar.current)
    const myChartLine = echarts.init(chartLine.current)

    const resize = () => {
      if (myChartBar && myChartLine) {
        myChartBar.resize()
        myChartLine.resize()
      }
    }
    myChartBar.clear()
    myChartLine.clear()
    myChartBar.setOption(cbarOption(barData))
    myChartLine.setOption(lineOption(lineData))
    window.addEventListener('resize', resize)
  }

  async function getContrast() {
    setLoading(true)
    try {
      const res = await io.getContrast({
        timeStart,
        timeEnd,
        orgCodes,
        projectCode,
      })
      setBarData(res)
    } catch (err) {
      errorTip(err)
    } finally {
      setLoading(false)
    }
  }

  async function getTrend() {
    try {
      const res = await io.getTrend({
        timeStart,
        timeEnd,
        orgCodes,
        projectCode,
      })
      setLineData(res)
    } catch (err) {
      errorTip(err)
    }
  }

  useEffect(() => {
    drawSaveTrend()
  }, [barData, lineData])

  useEffect(() => {
    getContrast()
    getTrend()
  }, [timeStart, orgCodes, projectCode])

  return (
    <div className="p16 bgf mb16">
      <Spin spinning={loading}>
        <div ref={chartBar} style={{height: '500px', width: '50%', display: 'inline-block'}} />
        <div ref={chartLine} style={{height: '500px', width: '50%', display: 'inline-block'}} />
      </Spin>
    </div> 
  )
}
export default ConversionChart
