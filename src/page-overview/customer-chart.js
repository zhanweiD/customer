/**
 * @description 转化率
 */
import {useEffect, useRef, useState} from 'react'
import {Spin} from 'antd'

import {errorTip} from '../common/util'

import {funnelOption, cbarOption} from './chart-option'
import io from './io'

const CustomerChart = ({
  orgCodes, projectCode, timeStart, timeEnd,
}) => {
  const chartBar = useRef(null)
  const [barData, setBarData] = useState([])
  const chartFunnel = useRef(null)
  const [funnelData, setFunnelData] = useState({})
  const [loading, setLoading] = useState(false)
  const [selectIndex, setSelectIndex] = useState(0)

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
      errorTip(error.message)
    }
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

  const drawSaveTrend = () => {
    const myChartFunnel = echarts.init(chartFunnel.current)
    const myChartBar = echarts.init(chartBar.current)

    const resize = () => {
      myChartFunnel && myChartFunnel.resize()
    }
    myChartFunnel.clear()
    myChartFunnel.setOption(funnelOption(funnelData, selectIndex))
    const {type = []} = barData
    myChartBar.clear()
    myChartBar.setOption(cbarOption(barData, type[0] || '留电'))

    myChartFunnel.on('click', v => {
      myChartBar.clear()
      myChartBar.setOption(cbarOption(barData, v.name))
      setSelectIndex(v.dataIndex)
      // myChartFunnel.clear()
      // myChartFunnel.setOption(funnelOption(funnelData, v.dataIndex))
    })
    
    window.addEventListener('resize', resize)
  }

  useEffect(() => {
    getFunnel()
    getContrast()
  }, [timeStart, orgCodes, projectCode])

  useEffect(() => {
    drawSaveTrend()
  }, [funnelData, barData])
 
  return (
    <div>
      <Spin spinning={loading}>
        <div ref={chartFunnel} style={{height: '320px', width: '50%', display: 'inline-block'}} />
        <div ref={chartBar} style={{height: '320px', width: '50%', display: 'inline-block'}} />
      </Spin>
    </div>
    // <div>
    //   <Spin spinning={loading}>
    //     <div className="bgf mb16" ref={chartFunnel} style={{height: '500px', width: '50%'}} />
    //   </Spin>
    // </div> 
    // <div>
    //   <Spin spinning={loading}>
    //     <div className="bgf p16 mb16">
    //       <div className="fs14 c85">
    //         客户渠道分布
    //       </div>
    //       <div style={{height: '483px'}}>
    //         {
    //           !sunData.length
    //             ? (
    //               <div className="no-Data d-flex" style={{height: '600px', width: '100%'}}>
    //                 <NoData text="暂无数据" />
    //               </div>
    //             )
    //             : null
    //         }
    //         {/* <div className="d-flex"> */}
    //         <div ref={chartSun} style={{height: '340px', width: '100%'}} />
    //         <div style={{height: '150px', marginLeft: '20%'}} className="FBV FBJC categroy-legend-box">
    //           {
    //             sunData.map((item, i) => (
    //               <LegendItem 
    //                 title={item.name} 
    //                 percent={`${((item.value / count) * 100).toFixed(2)}%`}
    //                 counts={item.value}
    //                 color={color[i]}
    //               />
    //             ))
    //           }
    //         </div>
    //         {/* </div> */}
    //       </div>
    //     </div>

  //     <div className="bgf mb16" ref={chartFunnel} style={{height: '350px', width: '100%'}} />
  //     <div className="bgf" style={{height: '350px', width: '100%'}}>
  //       <div className="pt16 pl16 fs14 c85">
  //         客户心声
  //       </div>
  //       <Cloud
  //         orgCodes={orgCodes} 
  //         timeStart={timeStart}
  //         timeEnd={timeEnd}
  //         projectCode={projectCode}
  //       />
  //     </div>
  //   </Spin>
  // </div> 
  )
}
export default CustomerChart
