/**
 * @description 渠道拓客分布
 */
import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Spin} from 'antd'

import pieOption from './chart-option'

@observer
export default class ChartPie extends Component {
  myChartPie = null

  constructor(props) {
    super(props)
    this.store = props.store
  }

  componentDidMount() {
    this.myChartPie = echarts.init(this.refs.chartsPie)
    this.store.getDrawSaveTrend = this.drawSaveTrend
    this.props.getDraw(this.drawSaveTrend)
    window.addEventListener('resize', () => this.resize())
  }

  @action resize() {
    this.myChartPie && this.myChartPie.resize()
  }

  @action.bound drawSaveTrend(data, tag) {
    this.myChartPie.clear()
    // if (!data) return null
    // const {pieChart} = data
    // const count = pieChart[0] ? pieChart[0].all : 0

    this.myChartPie.setOption(pieOption(data, tag))
  }

  render() {
    const {chartLoading} = this.store
    return (
      <div className="chartPie-ad" style={{width: '70%'}}>
        <Spin spinning={chartLoading}>
          <div ref="chartsPie" style={{height: '480px', width: '100%', display: 'inline-block'}} />
        </Spin>
      </div> 
    )
  }
}
