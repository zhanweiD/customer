/**
 * @description 转化对比、趋势
 */
import {useEffect, useRef, useState} from 'react'

import {errorTip} from '../common/util'

import {sunOption, funnelOption} from './chart-option'
import Cloud from './cloud'
import io from './io'

const LegendItem = ({title, percent, counts, color}) => {
  return (
    <div className="categroy-legend-item FBH FBAC">
      <div className="legend-name">
        <span style={{background: color}} className="legend-name-icon mr8" />
        <span>{title}</span>
      </div>
      <div className="legend-bar">
        <div className="legend-bar-inner" style={{width: percent}} />
      </div>
      <span className="c45 ml8 mr8">{percent}</span>
      <span className="c45">|</span>
      <span className="ml8 c45">{counts}</span>
    </div>
  )
}

const data = [
  {
    title: '外渠',
    percent: '20%',
    counts: 20,
    color: '#1cd389',
  },
]
  
const CustomerChart = ({sunData}) => {
  const chartSun = useRef(null)
  const chartFunnel = useRef(null)
  const [funnelData, setFunnelData] = useState({})

  // 获取配置信息
  async function getFunnel() {
    const dateFormat = 'YYYY-MM-DD'
    const date = new Date()
    const nowDate = moment(+date.getTime()).format(dateFormat)
    const pastDate = moment(+date.getTime() - 1000 * 60 * 60 * 24 * 365).format(dateFormat)
    const reqData = { // 初始时间
      reportTimeStart: pastDate,
      reportTimeEnd: nowDate,
    } 
    try {
      const res = await io.getClinch(reqData)
      const {funnelChart = []} = res
      const data1 = []
      const data2 = []
      for (let i = 0; i < funnelChart.length; i++) {
        const obj1 = {
          value: funnelChart[i].count,
          num: funnelChart[i].count,
          name: funnelChart[i].name,
        }
  
        const obj2 = {
          value: funnelChart[i].count,
          goal: funnelChart[i].goal,
          name: funnelChart[i].rate,
          itemStyle: {
            opacity: 0,
          },
        }
        data1.push(obj1)
        data2.push(obj2)
      }
      setFunnelData({
        data1,
        data2,
      })
    } catch (error) {
      errorTip(error.message)
    }
  }
   
  const drawSaveTrend = () => {
    const myChartSun = echarts.init(chartSun.current)
    const myChartFunnel = echarts.init(chartFunnel.current)

    const resize = () => {
      myChartSun && myChartSun.resize()
      myChartFunnel && myChartFunnel.resize()
    }
 
    myChartSun.setOption(sunOption)
    myChartFunnel.setOption(funnelOption(funnelData.data1, funnelData.data2))
    window.addEventListener('resize', resize)
  }

  useEffect(() => {
    getFunnel()
  }, [])

  useEffect(() => {
    drawSaveTrend()
  }, [sunData, funnelData])
 
  return (
    <div>
      {/* <Spin spinning={chartLoading}> */}
      <div className="d-flex bgf p16 mb16">
        <div ref={chartSun} style={{height: '300px', width: '50%'}} />
        <div className="w50 FBV FBJC FBAC categroy-legend-box">
          {
            data.map(item => (
              <LegendItem 
                title={item.title} 
                percent={item.percent}
                counts={item.counts}
                color={item.color}
              />
            ))
          }
        </div>
      
      </div>
      <div className="bgf mb16" ref={chartFunnel} style={{height: '420px', width: '100%'}} />
      <div className="bgf" style={{height: '400px', width: '100%'}}>
        <div className="pt16 pl16 fs14 c85">客户心声</div>
        <Cloud />
      </div>
      {/* </Spin> */}
    </div> 
  )
}
export default CustomerChart
