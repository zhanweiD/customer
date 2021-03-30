/**
 * @description 渠道拓客分布
 */
import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'

import {NoData} from '../component'

import radarOption from './option'

@observer
export default class ChartPie extends Component {
  myChartFun = null

  constructor(props) {
    super(props)
    this.store = props.store
  }

  componentDidMount() {
    this.myChartSanKey = echarts.init(this.refs.chartsSanKey)
    this.store.getChart(data => {
      this.drawSaveTrend(data)
    })
    window.addEventListener('resize', () => this.resize())
  }

  @action resize() {
    this.myChartSanKey && this.myChartSanKey.resize()
  }

  @action.bound drawSaveTrend(data) {
    data.indicator ? this.myChartSanKey.setOption(radarOption(data)) : null
  }

  render() {
    const {chartData, isCustomer} = this.store
    return (
      <div className="chart bgf ml16 mr16 p16 box-border">
        <span className="tag-herder">{isCustomer ? '综合满意度' : '提升象限'}</span>
        <div ref="chartsSanKey" style={{height: '300px', width: '100%', display: 'inline-block'}} />
        {
          chartData.indicator ? null : (
            <div className="no-Data" style={{height: '200px'}}>
              <NoData text="暂无数据" size="small" />
            </div>
          )
        }
      </div> 
    )
  }
}
