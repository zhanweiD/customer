import {useEffect, useRef, useState} from 'react'
import {Divider, Button, Select} from 'antd'
import {inject} from 'mobx-react'
import {useObserver} from 'mobx-react-lite'
import {circleOneOption, circleTwoOption, lineOption, barOption, funnelOption} from './chart-options'
import AnalysisModal from './analysis-modal'
import TimeRange from '../../component/time-range'

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

const {Option} = Select

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
    store.getStatistics(() => {
      // 画两个饼图
      store.circleOneChart = echarts.init(circleOne.current)
      store.circleOneChart.setOption(circleOneOption(store.touchCount))

      window.addEventListener('resize', () => store.circleOneChart.resize())

      store.circleTwoChart = echarts.init(circleTwo.current)
      store.circleTwoChart.setOption(circleTwoOption(store.targetRate))

      window.addEventListener('resize', () => store.circleTwoChart.resize())
    })

    // 画折线图
    store.getTargetCount({
      chartBeginDate: moment().subtract(6, 'day').format('YYYY-MM-DD'),
      chartEndDate: moment().subtract(0, 'day').format('YYYY-MM-DD'),
    }, () => {
      store.lineChart = echarts.init(lineRef.current)
      store.lineChart.setOption(lineOption(store.lineChartData))

      window.addEventListener('resize', () => store.lineChart.resize())
    })

    // 分析配置的图
    store.getEventStatistics(() => {
      // 柱状图
      store.barChart = echarts.init(barRef.current)
      store.barChart.setOption(barOption(store.eventStatistics))

      window.addEventListener('resize', () => store.barChart.resize())

      // funnel
      store.funnelChart = echarts.init(funnelRef.current)
      store.funnelChart.setOption(funnelOption(store.eventStatistics))

      window.addEventListener('resize', () => store.funnelChart.resize())
    })
  }, [])

  const dateChange = e => {
    if (e === '7') {
      // 画折线图
      store.getTargetCount({
        chartBeginDate: moment().subtract(6, 'day').format('YYYY-MM-DD'),
        chartEndDate: moment().subtract(0, 'day').format('YYYY-MM-DD'),
      }, () => {
        store.lineChart.setOption(lineOption(store.lineChartData))
      })
    } else {
      // 画折线图
      store.getTargetCount({
        chartBeginDate: moment().subtract(29, 'day').format('YYYY-MM-DD'),
        chartEndDate: moment().subtract(0, 'day').format('YYYY-MM-DD'),
      }, () => {
        store.lineChart.setOption(lineOption(store.lineChartData))
      })
    }
  }

  return useObserver(() => (
    <div className="detail-chart oa">
      {
        store.lineChartData.length > 0 && (
          <div className="chart-filter">
            <Select 
              style={{width: '80px'}} 
              defaultValue="7"
              onChange={dateChange}
            >
              <Option value="7">近7天</Option>
              <Option value="30">近30天</Option>
            </Select>
          </div>
        )
      }
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
