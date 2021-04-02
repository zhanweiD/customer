/**
 * @description 转化对比、趋势
 */
import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Spin} from 'antd'
 
import {cbarOption, lineOption} from './chart-option'
 
@observer
export default class ConversionChart extends Component {
  myChartBar = null
  myChartLine = null

  constructor(props) {
    super(props)
    this.store = props.store
  }

  componentDidMount() {
    this.myChartBar = echarts.init(this.refs.chartBar)
    this.myChartLine = echarts.init(this.refs.chartLine)

    this.drawSaveTrend([])
    window.addEventListener('resize', () => this.resize())
  }

  @action resize() {
    this.myChartBar && this.myChartBar.resize()
    this.myChartLine && this.myChartLine.resize()
  }

  @action.bound drawSaveTrend(data) {
    // this.myChartBar.clear()
    // this.myChartLine.clear()
    this.myChartBar.setOption(cbarOption)
    this.myChartLine.setOption(lineOption)
  }

  render() {
  //  const {chartLoading} = this.store
    return (
      <div className="p16 bgf mb16">
        {/* <Spin spinning={chartLoading}> */}
        <div ref="chartBar" style={{height: '480px', width: '50%', display: 'inline-block'}} />
        <div ref="chartLine" style={{height: '480px', width: '50%', display: 'inline-block'}} />
        {/* </Spin> */}
      </div> 
    )
  }
}
