/**
 * @description 转化率
 */
import {useEffect, useRef, useState} from 'react'
import {Spin} from 'antd'

import {errorTip} from '../common/util'

import {funnelOption} from './chart-option'
import io from './io'

const CustomerChart = ({
  orgCodes, projectCode, timeStart, timeEnd,
}) => {
  const chartFunnel = useRef(null)
  const [funnelData, setFunnelData] = useState({})
  const [loading, setLoading] = useState(false)

  async function getFunnel() {
    setLoading(true)
    try {
      const res = await io.getFunnel({
        timeStart,
        timeEnd,
        orgCodes,
        projectCode,
      })
      setFunnelData(res)
    } catch (error) {
      errorTip(error.message)
    } finally {
      setLoading(false)
    }
  }

  const drawSaveTrend = () => {
    const myChartFunnel = echarts.init(chartFunnel.current)

    const resize = () => {
      myChartFunnel && myChartFunnel.resize()
    }
    myChartFunnel.clear()
    myChartFunnel.setOption(funnelOption(funnelData))
    window.addEventListener('resize', resize)
  }

  useEffect(() => {
    getFunnel()
  }, [timeStart, orgCodes, projectCode])

  useEffect(() => {
    drawSaveTrend()
  }, [funnelData])
 
  return (
    <div ref={chartFunnel} style={{height: '320px', width: '50%'}} />
    // <div>
    //   <Spin spinning={loading}>
    //     <div className="bgf mb16" ref={chartFunnel} style={{height: '500px', width: '50%'}} />
    //   </Spin>
    // </div> 
  )
}
export default CustomerChart
