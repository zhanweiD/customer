/**
 * @description 值域分布趋势
 */
import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'

import {pieOption, funnelOption} from './chart-option'

@observer
export default class ChartPie extends Component {
  myChartPie = null
  myChartFun = null

  constructor(props) {
    super(props)
    this.store = props.store
  }

  componentDidMount() {
    this.myChartPie = echarts.init(this.refs.chartsPie)
    this.myChartFun = echarts.init(this.refs.chartsFunnel)
    this.store.getClinch(data => {
      this.drawSaveTrend(data)
    })
    this.props.getDraw(this.drawSaveTrend)
    window.addEventListener('resize', () => this.resize())
  }

  // componentDidUpdate(prevProps) {
  //   if (prevProps !== this.props) {
  //     this.store.getClinch(data => {
  //       this.drawSaveTrend(data)
  //     })
  //   }
  // }

  @action resize() {
    this.myChartPie && this.myChartPie.resize()
    this.myChartFun && this.myChartFun.resize()
  }

  @action.bound drawSaveTrend(data) {
    this.myChartPie.clear()
    this.myChartFun.clear()
    const {funnelChart = [], pieChart = []} = data
    // if (!pieChart) return null
    let total = 0
    total = pieChart.reduce((a, b) => {
      return a + b.value * 1
    }, 0)
    const data1 = []
    const data2 = []
    for (let i = 0; i < funnelChart.length; i++) {
      const obj1 = {
        value: funnelChart[i].count,
        num: funnelChart[i].count,
        name: funnelChart[i].name,
      }

      const obj2 = {
        value: funnelChart[i].count,
        goal: funnelChart[i].goal,
        name: `年度目标达成：${funnelChart[i].rate}`,
        itemStyle: {
          opacity: 0,
        },
      }
      data1.push(obj1)
      data2.push(obj2)
    }
    this.myChartPie.setOption(pieOption(pieChart, total))
    this.myChartFun.setOption(funnelOption(data1, data2))
  }

  render() {
    return (
      <div className="chartPie-ad">
        <div ref="chartsPie" style={{height: '480px', width: '45%', display: 'inline-block'}} />
        <div ref="chartsFunnel" style={{height: '480px', width: '55%', display: 'inline-block'}} />
      </div> 
    )
  }
}
