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
 
const color = ['#61BA46', '#2592FF', '#355FF9', '#6C41FA', '#FD5071', '#0099cc']
 
const ChannelDistribution = ({
  orgCodes, projectCode, timeStart, timeEnd,
}) => {
  const chartSun = useRef(null)
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
      errorTip(error.message)
    } finally {
      setLoading(false)
    }
  }
 
  const drawSaveTrend = () => {
    const myChartSun = echarts.init(chartSun.current)
 
    const resize = () => {
      myChartSun && myChartSun.resize()
    }
    myChartSun.clear()
    myChartSun.setOption(sunOption(sunData))
    window.addEventListener('resize', resize)
  }
 
  useEffect(() => {
    getSunburst()
  }, [timeStart, orgCodes, projectCode])
 
  useEffect(() => {
    drawSaveTrend()
  }, [sunData])
  
  return (
    <div className="customer-chart mb16">
      <Spin spinning={loading}>
        <div className="bgf p16">
          <div style={{height: '340px'}}>
            {
              !sunData.length
                ? (
                  <div className="no-Data d-flex" style={{height: '340px', width: '100%'}}>
                    <NoData text="暂无数据" size="small" />
                  </div>
                )
                : null
            }
            <div ref={chartSun} style={{height: '340px', width: '60%', display: 'inline-block'}} />
            <div 
              style={{width: '40%', display: 'inline-block', top: -95}} 
              className="FBV FBJC pr categroy-legend-box"
            >
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
      </Spin>
    </div> 
  )
}
export default ChannelDistribution
