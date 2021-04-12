/**
 * @description 渠道拓客分布
 */
import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'

import {NoData, LegendItem} from '../component'

import {pieOption, barOption} from './option'

const datal = [
  {
    title: '外渠',
    percent: '20%',
    counts: 20,
    color: '#1cd389',
  },
]

@observer
export default class ChartPie extends Component {
  myChartPie = null
  myChartBar = null

  constructor(props) {
    super(props)
    this.store = props.store
  }

  componentDidMount() {
    this.myChartPie = echarts.init(this.refs.chartPie)
    this.myChartBar = echarts.init(this.refs.chartBar)

    // 将drawSaveTrend传递给父组件
    const {props} = this
    props.getDraw(this.drawSaveTrend)

    this.store.getChart(data => {
      this.drawSaveTrend(data)
    })
  }

  @action.bound drawSaveTrend(data) {
    const resize = () => {
      if (this.myChartPie) {
        this.myChartPie.resize()
        this.myChartBar.resize()
      }
    }
    window.addEventListener('resize', resize)

    this.myChartPie.setOption(pieOption(data, 10))
    this.myChartBar.setOption(barOption(data))
  }

  render() {
    return (
      <div className="chart m16 mt8 p16 box-border">
        <div className="d-flex">
          <div ref="chartPie" style={{height: '300px', width: '60%'}} />
          <div className="w40 fs12 FBV FBJC FBAC categroy-legend-box">
            {
              datal.map(item => (
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
        <div ref="chartBar" style={{height: '180px', width: '100%'}} />
      </div> 
    )
  }
}
