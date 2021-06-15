import {useEffect, useRef, useState} from 'react'
import {Divider, Button} from 'antd'
import {inject} from 'mobx-react'
import {useObserver} from 'mobx-react-lite'
import {circleOneOption, circleTwoOption, lineOption, barOption, funnelOption} from './chart-options'
import AnalysisModal from './analysis-modal'

const barMockData = [{
  value: 2000,
  label: '计划触达',
}, {
  value: 1200,
  label: '进入活动',
}, {
  value: 500,
  label: '报名成功',
},
{
  value: 100,
  label: '购房成交',
}]

const SalesDetail = () => {
  const [visible, setVisible] = useState(false)
  const changeVisible = v => {
    setVisible(v)
  }
  return (
    <div>
      <Button type="primary" onClick={() => changeVisible(true)}>分析配置</Button>
      <AnalysisModal visible={visible} setVisible={changeVisible} />
    </div>
  )
}

const BarChart = () => {
  const barRef = useRef(null)

  useEffect(() => {
    const barChart = echarts.init(barRef.current)
    barChart.setOption(barOption(barMockData))

    window.addEventListener('resize', () => barChart.resize())
  }, [])

  return (
    <div className="h400" ref={barRef} />
  )
}

const FunnelChart = () => {
  const funnelRef = useRef(null)

  useEffect(() => {
    const funnelChart = echarts.init(funnelRef.current)

    const funnelMockData = barMockData
    if (funnelMockData.length) {
      funnelMockData.forEach(item => {
        item.per = `${(item.value / funnelMockData[0].value * 100).toFixed(2)}%`
      })
    }

    funnelChart.setOption(funnelOption(funnelMockData))

    window.addEventListener('resize', () => funnelChart.resize())
  }, [])

  return (
    <div className="h400" ref={funnelRef} />
  )
}


export default inject('store')(({store}) => {
  const circleOne = useRef(null)
  const circleTwo = useRef(null)
  const lineRef = useRef(null)
  const barRef = useRef(null)
  const funnelRef = useRef(null)

  useEffect(() => {
    store.getStatistics(8436565125512, () => {
      // 画两个饼图
      const circleOneChart = echarts.init(circleOne.current)
      circleOneChart.setOption(circleOneOption(store.touchCount))

      window.addEventListener('resize', () => circleOneChart.resize())

      const circleTwoChart = echarts.init(circleTwo.current)
      circleTwoChart.setOption(circleTwoOption(store.targetRate))

      window.addEventListener('resize', () => circleTwoChart.resize())
    })

    // 画折线图
    store.getTargetCount({
      id: 8380506835856,
      chartBeginDate: '2021-06-15',
      chartEndDate: '2021-06-17',
    }, () => {
      const lineChart = echarts.init(lineRef.current)
      lineChart.setOption(lineOption(store.lineChartData))

      window.addEventListener('resize', () => lineChart.resize())
    })

    // 分析配置的图
    store.getEventStatistics(8436565125512, () => {
      // 柱状图
      const barChart = echarts.init(barRef.current)
      barChart.setOption(barOption(store.eventStatistics))

      window.addEventListener('resize', () => barChart.resize())

      // funnel
      const funnelChart = echarts.init(funnelRef.current)
      funnelChart.setOption(funnelOption(store.eventStatistics))

      window.addEventListener('resize', () => funnelChart.resize())
    })
  }, [])


  return useObserver(() => (
    <div className="detail-chart oa">
      <div className="FBH">
        <div className="FB1">
          <div className="h400" ref={circleOne} />
        </div>
        <div className="FB1">
          <div className="h400" ref={circleTwo} />
        </div>
        <div style={{flex: 2}}>
          <div className="h400" ref={lineRef} />
        </div>
      </div>
      <Divider />
      <SalesDetail />
      <div className="FBH">
        <div className="FB1">
          <div className="h400" ref={barRef} />
        </div>
        <div className="FB1">
          <div className="h400" ref={funnelRef} />
        </div>
      </div>
    </div>
  ))
})
