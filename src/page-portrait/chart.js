/**
 * @description 渠道拓客分布
 */
import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Spin} from 'antd'

import {NoData, LegendItem} from '../component'

import {pieOption, barOption} from './option'

const color = ['#1cd389', '#668eff', '#ff6e73', '#8683e6', '#06d3c4', '#42b1cc']


// const datal = [
//   {
//     title: '外渠',
//     percent: '20%',
//     counts: 20,
//     color: '#1cd389',
//   },
// ]

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

    this.store.getPieChart((pieData, total, barData) => {
      this.drawSaveTrend(pieData, total, barData)
    })
  }

  @action.bound drawSaveTrend(data, total, barData) {
    const resize = () => {
      if (this.myChartPie) {
        this.myChartPie.resize()
        this.myChartBar.resize()
      }
    }
    window.addEventListener('resize', resize)

    this.myChartPie.setOption(pieOption(data, total))
    this.myChartBar.setOption(barOption(barData))
  }

  render() {
    const {pieData, pieTotal, chartLoading} = this.store
    return (
      <div className="chart m16 mt8 p16 box-border">
        <Spin spinning={chartLoading}>
          <div className="d-flex">
            <div ref="chartPie" style={{height: '300px', width: '50%'}} />
            <div className="w50 fs12 FBV FBJC FBAC categroy-legend-box">
              {
                pieData.map((item, i) => (
                  <LegendItem 
                    title={item.name} 
                    percent={`${((item.value / pieTotal) * 100).toFixed(2)}%`}
                    counts={item.value}
                    color={color[i]}
                  />
                ))
              }
            </div>
          </div>
          <div ref="chartBar" style={{height: '180px', width: '100%'}} />
        </Spin>
      </div> 
    )
  }
}
