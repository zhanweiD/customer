/**
 * @description 转化对比
 */
import {useEffect, useRef, useState} from 'react'
import {Spin} from 'antd'

import {errorTip} from '../common/util'

import {cbarOption} from './chart-option'
import io from './io'
 
const ConversionChart = ({
  orgCodes, projectCode, timeStart, timeEnd,
}) => {
  const chartBar = useRef(null)
  const [barData, setBarData] = useState([])
  const [loading, setLoading] = useState(false)

  const drawSaveTrend = () => {
    const myChartBar = echarts.init(chartBar.current)

    const resize = () => {
      if (myChartBar) {
        myChartBar.resize()
      }
    }
    myChartBar.clear()
    myChartBar.setOption(cbarOption(barData))
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
      errorTip(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    drawSaveTrend()
  }, [barData])

  useEffect(() => {
    getContrast()
  }, [timeStart, orgCodes, projectCode])

  return (
    <div ref={chartBar} style={{height: '320px', width: '50%'}} />
    // <div className="p16 bgf mb16">
    //   <Spin spinning={loading}>
    //     <div ref={chartBar} style={{height: '500px', width: '50%', display: 'inline-block'}} />
    //   </Spin>
    // </div> 
  )
}
export default ConversionChart
