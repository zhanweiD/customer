/**
 * @description 渠道拓客分布
 */
import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Spin} from 'antd'

import {NoData, LegendItem} from '../component'

import {pieOption, barOption} from './option'

const colors = ['#61BA46 ', '#2592FF', '#355FF9', '#6C41FA', '#FD5071'] 

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

  @action.bound drawSaveTrend(pieData, total, barData) {
    const resize = () => {
      if (this.myChartPie) {
        this.myChartPie.resize()
        this.myChartBar.resize()
      }
    }
    window.addEventListener('resize', resize)
    this.myChartPie.clear()
    this.myChartBar.clear()
    this.myChartPie.setOption(pieOption(pieData, total))
    this.myChartBar.setOption(barOption(barData))
  }

  render() {
    const {pieData, pieTotal, chartLoading, barData} = this.store
    return (
      <div className="contact-chart m16 mb0">
        <Spin spinning={chartLoading}>
          {/* <div className="d-flex" style={{display: pieData.length ? 'flex' : 'none'}}> */}
          <div className="d-flex type-distribution p16">
            <div ref="chartPie" style={{height: '300px', width: '50%'}} />
            <div className="w50 fs14 FBV FBJC FBAC categroy-legend-box">
              {
                pieData.map((item, i) => (
                  <LegendItem 
                    title={item.name} 
                    percent={`${((item.value / pieTotal) * 100).toFixed(2)}%`}
                    counts={item.value}
                    color={colors[i]}
                  />
                ))
              }
            </div>
          </div>
          {
            pieData.length ? null : (
              <NoData style={{marginTop: '-46%'}} text="暂无数据" />
            )
          }
          
          <div className="mt16 type-distribution p16">
            <div 
              ref="chartBar" 
              style={{height: '180px', width: '100%'}} 
            />
            {
              barData.length ? null : (
                <NoData style={{marginTop: '-20%'}} text="暂无数据" />
              )
            }
          </div>
        </Spin>
      </div> 
    )
  }
}
