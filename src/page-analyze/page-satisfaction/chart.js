/**
 * @description 渠道拓客分布
 */
import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'

import {NoData} from '../../component'
import {pieOption, scatterOption} from './chart-option'

@observer
export default class ChartPie extends Component {
  myChartPie = null
  chartsScatter = null

  constructor(props) {
    super(props)
    this.store = props.store
  }

  componentDidMount() {
    this.chartsScatter = echarts.init(this.refs.chartsScatter)
    this.myChartPie = echarts.init(this.refs.chartsPie)

    this.store.getChartData(data => {
      this.drawSaveTrend(data)
    })

    this.store.getScatterData(data => {
      this.drawSaveTrend1(data)
    })

    this.props.getDraw(this.drawSaveTrend, this.drawSaveTrend1)
    window.addEventListener('resize', () => this.resize())
  }

  @action resize() {
    this.myChartPie && this.myChartPie.resize()
    this.chartsScatter && this.chartsScatter.resize()
  }

  // 饼图
  @action.bound drawSaveTrend(data) {
    this.myChartPie.clear()
    if (!data) return null
    let total = 0
    total = data.reduce((a, b) => {
      return a + b.value * 1
    }, 0)
    this.myChartPie.setOption(pieOption(data, total))
  }

  // 散点图
  @action.bound drawSaveTrend1(data) {
    this.chartsScatter.clear()
    if (!data) return null
    this.chartsScatter.setOption(scatterOption(data))
  }

  render() {
    // const noDataConfig = {
    //   text: '暂无数据',
    // }
    return (
      <div className="chartPie-ad">
        <div style={{width: 'calc(50% - 8px)'}} className="chart-border mb16 d-ilbl mr16">
          <div className="period-header">评价结果分布</div>
          <div className="period-content">
            <div ref="chartsPie" style={{height: '486px', width: '100%'}} />
          </div>
        </div>
        <div style={{width: 'calc(50% - 8px)'}} className="chart-border mb16 d-ilbl">
          <div className="period-header">客户心声</div>
          <div className="period-content">
            <div ref="chartsScatter" style={{height: '480px', width: '100%', display: 'inline-block'}} />
          </div>
        </div>
      </div> 
    )
  }
}
