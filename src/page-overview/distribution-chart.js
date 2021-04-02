/**
 * @description 客户分布
 */
import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Spin} from 'antd'
 
import chinaJson from '../../public/map/china.json'
import {dbarOption, mapOption} from './chart-option'
 
@observer
export default class DistributionChart extends Component {
  myChartBar = null
  myChartMap = null

  constructor(props) {
    super(props)
    this.store = props.store
  }

  componentDidMount() {
    this.myChartBar = echarts.init(this.refs.chartBar)
    this.myChartMap = echarts.init(this.refs.chartMap)

    echarts.registerMap('china', chinaJson)
    this.drawSaveTrend([])
    window.addEventListener('resize', () => this.resize())
  }

  @action resize() {
    this.myChartBar && this.myChartBar.resize()
    this.myChartMap && this.myChartMap.resize()
  }

  @action.bound drawSaveTrend(data) {
    this.myChartBar.setOption(dbarOption)
    this.myChartMap.setOption(mapOption)
  }

  render() {
  //  const {chartLoading} = this.store
    return (
      <div className="p16 bgf">
        {/* <Spin spinning={chartLoading}> */}
        <div ref="chartMap" style={{height: '600px', width: '60%', display: 'inline-block'}} />
        <div ref="chartBar" style={{height: '480px', width: '40%', display: 'inline-block'}} />
        {/* </Spin> */}
      </div> 
    )
  }
}
