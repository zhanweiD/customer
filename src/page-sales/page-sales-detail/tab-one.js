import {useEffect, useRef, useState} from 'react'
import {Divider, Button} from 'antd'
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

const CircleOne = () => {
  const circleOne = useRef(null)

  useEffect(() => {
    const circleOneChart = echarts.init(circleOne.current)
    circleOneChart.setOption(circleOneOption)

    window.addEventListener('resize', () => circleOneChart.resize())
  }, [])

  return (
    <div className="h400" ref={circleOne} />
  )
}

const CircleTwo = () => {
  const circleTwo = useRef(null)

  useEffect(() => {
    const circleTwoChart = echarts.init(circleTwo.current)
    circleTwoChart.setOption(circleTwoOption)

    window.addEventListener('resize', () => circleTwoChart.resize())
  }, [])

  return (
    <div className="h400" ref={circleTwo} />
  )
}

const LineChart = () => {
  const lineRef = useRef(null)

  useEffect(() => {
    const lineChart = echarts.init(lineRef.current)
    lineChart.setOption(lineOption)

    window.addEventListener('resize', () => lineChart.resize())
  }, [])

  return (
    <div className="h400" ref={lineRef} />
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


export default () => {
  useEffect(() => {
    console.log('tab one mount')
  }, [])

  return (
    <div className="detail-chart oa">
      <div className="FBH">
        <div className="FB1">
          <CircleOne />
        </div>
        <div className="FB1">
          <CircleTwo />
        </div>
        <div style={{flex: 2}}>
          <LineChart />
        </div>
      </div>
      <Divider />
      <SalesDetail />
      <div className="FBH">
        <div className="FB1">
          <BarChart />
        </div>
        <div className="FB1">
          <FunnelChart />
        </div>
      </div>
    </div>
  )
}
