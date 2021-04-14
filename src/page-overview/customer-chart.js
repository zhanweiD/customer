/**
 * @description 渠道分布，转化率，云图
 */
import {useEffect, useRef, useState} from 'react'
import {Spin} from 'antd'

import {errorTip} from '../common/util'
import {LegendItem, NoData} from '../component'

import {sunOption, funnelOption} from './chart-option'
import Cloud from './cloud'
import io from './io'

const color = ['#1cd389', '#668eff', '#ffc751', '#ff6e73', '#8683e6', '#9692ff']

const CustomerChart = ({
  orgCodes, projectCode, timeStart, timeEnd,
}) => {
  const chartSun = useRef(null)
  const chartFunnel = useRef(null)
  const [funnelData, setFunnelData] = useState({})
  const [sunData, setSunData] = useState([]) // 渠道分布
  const [count, setCount] = useState(0) // 渠道总数
  const [loading, setLoading] = useState(false)

  // 渠道分布
  async function getSunburst() {
    setLoading(true)
    try {
      const res = await io.getSunburst({
        timeStart,
        timeEnd,
        orgCodes,
        projectCode,
      })
      setSunData(res)
      setCount(res.reduce((total, item) => total + item.value, 0))
    } catch (error) {
      errorTip(error)
    } finally {
      setLoading(false)
    }
  }

  async function getFunnel() {
    try {
      const res = await io.getFunnel({
        timeStart,
        timeEnd,
        orgCodes,
        projectCode,
      })
      setFunnelData(res)
    } catch (error) {
      errorTip(error)
    }
  }

  const drawSaveTrend = () => {
    const myChartSun = echarts.init(chartSun.current)
    const myChartFunnel = echarts.init(chartFunnel.current)

    const resize = () => {
      myChartSun && myChartSun.resize()
      myChartFunnel && myChartFunnel.resize()
    }
    myChartSun.clear()
    myChartFunnel.clear()
    myChartSun.setOption(sunOption(sunData))
    myChartFunnel.setOption(funnelOption(funnelData))
    window.addEventListener('resize', resize)
  }

  useEffect(() => {
    getFunnel()
    getSunburst()
  }, [timeStart, orgCodes, projectCode])

  useEffect(() => {
    drawSaveTrend()
  }, [sunData, funnelData])
 
  return (
    <div>
      <Spin spinning={loading}>
        <div className="bgf p16 mb16">
          <div className="fs14 c85">
            客户渠道分布
          </div>
          <div style={{height: '300px'}}>
            {
              !sunData.length
                ? (
                  <div className="no-Data d-flex" style={{height: '300px', width: '100%'}}>
                    <NoData text="暂无数据" size="small" />
                  </div>
                )
                : null
            }
            <div className="d-flex">
              <div ref={chartSun} style={{height: '300px', width: '50%'}} />
              <div className="w50 FBV FBJC FBAC categroy-legend-box">
                {
                  sunData.map((item, i) => (
                    <LegendItem 
                      title={item.name} 
                      percent={`${((item.value / count) * 100).toFixed(2)}%`}
                      counts={item.value}
                      color={color[i]}
                    />
                  ))
                }
              </div>
            </div>
          </div>
        </div>

        <div className="bgf mb16" ref={chartFunnel} style={{height: '420px', width: '100%'}} />
        <div className="bgf" style={{height: '400px', width: '100%'}}>
          <div className="pt16 pl16 fs14 c85">
            客户心声
          </div>
          <Cloud
            orgCodes={orgCodes} 
            timeStart={timeStart}
            timeEnd={timeEnd}
            projectCode={projectCode}
          />
        </div>
      </Spin>
    </div> 
  )
}
export default CustomerChart
