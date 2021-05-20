/**
 * @description 渠道拓客分布
 */
import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'

import {barOption, radarOption} from './chart-option'

@observer
export default class ChartPie extends Component {
  myChartPie = null
  myChartFun = null

  constructor(props) {
    super(props)
    this.store = props.store
  }

  componentDidMount() {
    this.myChartSanKey = echarts.init(this.refs.chartsSanKey)
    this.myChartPie = echarts.init(this.refs.chartsPie)

    this.store.getChannel(data => {
      this.drawSaveTrend(data)
    })
    this.props.getDraw(this.drawSaveTrend)
    window.addEventListener('resize', () => this.resize())
  }

  @action resize() {
    this.myChartPie && this.myChartPie.resize()
    this.myChartSanKey && this.myChartSanKey.resize()
  }

  @action.bound drawSaveTrend(data) {
    this.myChartPie.clear()
    this.myChartSanKey.clear()

    if (data.radarChart.indicator || data.columnChart.x) {
      this.myChartPie.setOption(barOption(data.columnChart))
      this.myChartSanKey.setOption(radarOption(data.radarChart))
    }
  }

  render() {
    return (
      <div className="chartPie-ad">
        {/* <div className="content-header">渠道拓客分布（可下转二级渠道）</div> */}
        <div ref="chartsPie" style={{height: '480px', width: '50%', display: 'inline-block'}} />
        <div ref="chartsSanKey" style={{height: '480px', width: '50%', display: 'inline-block'}} />
      </div> 
    )
  }
}
