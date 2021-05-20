/**
 * @description 渠道拓客分布
 */
import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Spin} from 'antd'

import {barOption, lineOption} from './chart-option'

@observer
export default class ChartPie extends Component {
  myChartBar = null
  myChartLine = null

  constructor(props) {
    super(props)
    this.store = props.store
  }

  componentDidMount() {
    this.store.getSupply()
    // this.store.getSupplyXY()
    this.myChartLine = echarts.init(this.refs.chartsLine)
    this.myChartBar = echarts.init(this.refs.chartsBar)

    this.store.getFitList(data => {
      this.drawSaveTrend(data)
    }, data1 => {
      this.drawSaveTrend1(data1)
    })

    this.props.getDraw(this.drawSaveTrend, this.drawSaveTrend1)
    window.addEventListener('resize', () => this.resize())
  }

  @action resize() {
    this.myChartBar && this.myChartBar.resize()
    this.myChartLine && this.myChartLine.resize()
  }

  @action.bound drawSaveTrend(data) {
    this.myChartBar.clear()
    this.myChartBar.on('click', v => {
      if (v.name !== '地域') {
        this.store.getSupplyXY(v.name, data => {
          this.drawSaveTrend1(data)
        })
      }
    })

    this.myChartBar.setOption(barOption(data))
  }

  @action.bound drawSaveTrend1(data) {
    this.myChartLine.clear()
    this.myChartLine.setOption(lineOption(data))
  }

  render() {
    const {lineLoading, loading} = this.store
    return (
      <div className="chartPie-ad">
        <div style={{height: '480px', width: '50%', display: 'inline-block'}} >
          <Spin spinning={loading}>
            <div ref="chartsBar" style={{height: '480px'}} />
          </Spin>
        </div>
        <div style={{height: '480px', width: '50%', display: 'inline-block'}} >
          <Spin spinning={lineLoading}>
            <div ref="chartsLine" style={{height: '480px'}} />
          </Spin>
        </div>
      </div> 
    )
  }
}
