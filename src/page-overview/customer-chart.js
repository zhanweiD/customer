/**
 * @description 客户分布
 */
import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Spin} from 'antd'
 
import {sunOption} from './chart-option'

const data = [
  {
    title: '外渠',
    percent: '20%',
    counts: 20,
    color: '#1cd389',
    legendWidth: null,
  },
]

const LegendItem = ({title, percent, counts, color, legendWidth}) => {
  return (
    <div className="categroy-legend-item FBH FBAC">
      <div style={{width: legendWidth}} className="legend-name">
        <span style={{background: color}} className="legend-name-icon mr8" />
        <span>{title}</span>
      </div>
      <div className="legend-bar">
        <div className="legend-bar-inner" style={{width: percent}} />
      </div>
      <span className="c45 ml8 mr8">{percent}</span>
      <span className="c45">|</span>
      <span className="ml8 c45">{counts}</span>
    </div>
  )
}
 
export default class CustomerChart extends Component {
  myChartBar = null

  constructor(props) {
    super(props)
    this.store = props.store
  }

  componentDidMount() {
    this.myChartSun = echarts.init(this.refs.chartSun)

    this.drawSaveTrend([])
    window.addEventListener('resize', () => this.resize())
  }

  @action resize() {
    this.myChartSun && this.myChartSun.resize()
  }

  @action.bound drawSaveTrend(data) {
    this.myChartSun.setOption(sunOption)
  }

  render() {
  //  const {chartLoading} = this.store
    return (
      <div className="p16 bgf">
        {/* <Spin spinning={chartLoading}> */}
        <div className="d-flex">
          <div ref="chartSun" style={{height: '300px', width: '50%'}} />
          <div className="w50 FBV FBJC FBAC categroy-legend-box">
            {
              data.map(item => (
                <LegendItem 
                  title={item.title} 
                  percent={item.percent}
                  counts={item.counts}
                  color={item.color}
                  legendWidth={item.legendWidth}
                />
              ))
            }
          </div>
          
        </div>
        {/* </Spin> */}
      </div> 
    )
  }
}
