/**
 * @description 地图
 */
import {useState, useEffect, useRef} from 'react'
import {Spin} from 'antd'

import {dbarOption, mapOption} from './chart-option'
import china from '../../public/map'
import io from './io'
import {errorTip} from '../common/util'

const DistributionChart = ({
  orgCodes, projectCode, timeStart, timeEnd,
}) => {
  const chartBar = useRef(null)
  const chartMap = useRef(null)
  const [barData, setBarData] = useState([])
  const [mapData, setMapData] = useState([])
  const [mapType, setMapType] = useState('china')
  const [loading, setLoading] = useState(false)
   
  const drawSaveTrend = () => {
    echarts.registerMap(mapType, china[mapType])

    const myChartMap = echarts.init(chartMap.current)
    const myChartBar = echarts.init(chartBar.current)
 
    const resize = () => {
      myChartMap && myChartMap.resize()
      myChartBar && myChartBar.resize()
    }

    myChartMap.clear()
    myChartBar.clear()
    myChartMap.setOption(mapOption(mapType, mapData))
    myChartBar.setOption(dbarOption(barData))
    window.addEventListener('resize', resize)
    // myChartMap.on('click', param => {
    //   myChartMap.clear()
    //   if (param.name) {
    //     echarts.registerMap(param.name, china[param.name])
    //     myChartMap.setOption(mapOption(param.name, mapData))
    //   } else {
    //     echarts.registerMap('china', china.china)
    //     myChartMap.setOption(mapOption('china', mapData))
    //   }
    // })
  }

  async function getMap() {
    setLoading(true)
    try {
      const res = await io.getMap({
        timeStart,
        timeEnd,
        orgCodes,
        projectCode,
      })
      const {provinces = [], cities = [], values = []} = res

      // 大于一个省显示全国，否则显示单个省
      if (provinces.length > 1) {
        setMapType('china')
        setMapData(provinces)
      } else {
        setMapType((provinces[0] ? provinces[0].name : 'china'))
        setMapData(cities)
      }

      // const newValues = values.sort((a, b) => a.count - b.count)
      const newValues = values.reverse()

      setBarData(newValues)
    } catch (err) {
      errorTip(err)
    } finally {
      setLoading(false)
    }
  }
 
  useEffect(() => {
    drawSaveTrend()
  }, [mapData, barData])

  useEffect(() => {
    getMap()
  }, [orgCodes, timeStart, projectCode])
 
  return (
    <div className="p16 bgf">
      <Spin spinning={loading}>
        <div ref={chartMap} style={{height: '678px', width: '62%', display: 'inline-block'}} />
        <div ref={chartBar} style={{height: '480px', width: '38%', display: 'inline-block'}} />
      </Spin>
    </div> 
  )
}
export default DistributionChart
