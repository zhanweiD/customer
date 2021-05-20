/**
 * @description 渠道拓客分布
 */
import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'

import {pieOption, sanKeyOption} from './chart-option'

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
    if (!data) return null
    const {pieChart = [], sanKeyChart = []} = data
    const sanKeyNode = sanKeyChart.nodes || []
    // const sanKeyData = sanKeyNode.map(item => {
    //   return {name: item.name}
    // })
    const count = pieChart[0] ? pieChart[0].all : 0

    this.myChartPie.on('click', v => {
      if (v.componentType === 'title') {
        this.myChartPie.setOption(pieOption(data.pieChart, count))
      } else {
        if (!v.data.child) return null
        const {child} = v.data
        const all = child[0] ? child[0].all : 0
        this.myChartPie.setOption(pieOption(child, all))
      }
    })
    this.myChartPie.setOption(pieOption(pieChart, count))
    // this.myChartSanKey.setOption(sanKeyOption(sanKeyData, sanKeyChart.links))
    this.myChartSanKey.setOption(sanKeyOption(sanKeyNode, sanKeyChart.links))
  }

  render() {
    // const noDataConfig = {
    //   text: '暂无数据',
    // }
    return (
      <div className="chartPie-ad">
        {/* <div className="content-header">渠道拓客分布（可下转二级渠道）</div> */}
        {/* <NoData {...noDataConfig} /> */}
        <div ref="chartsPie" style={{height: '960px', width: '40%', display: 'inline-block'}} />
        <div ref="chartsSanKey" style={{height: '960px', width: '60%', left: '24px', display: 'inline-block'}} />
      </div> 
    )
  }
}
