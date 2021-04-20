/**
 * @description 渠道拓客分布
 */
import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
 
import {pieOption, barOption} from './chart-option'

// 生成从minNum到maxNum的随机数
function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10)
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
    default:
      return 0
  }
}
 
 @observer
export default class ChartPie extends Component {
  myChartPie = null
 
  constructor(props) {
    super(props)
    this.store = props.store
    this.title = props.title
    this.dataList = props.data
  }
 
  componentDidMount() {
    this.myChartPie = echarts.init(this.refs.chartsPie)
    this.drawSaveTrend(this.dataList, this.title)
    // this.store.getGroup((data, type) => {
    //   this.drawSaveTrend(this.data, this.title)
    // })
    window.addEventListener('resize', () => this.resize())
  }
 
  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.data = this.props.data
      this.drawSaveTrend(this.props.data, this.title)
    }
  }
 
   @action resize() {
    this.myChartPie && this.myChartPie.resize()
  }
 
   @action drawSaveTrend(data, title) {
     //  this.myChartPie.setOption(pieOption(data, title))
     // 设置一个随机数
     const num = randomNum(1, 3)

     switch (num) {
       case 1:
         this.myChartPie.setOption(pieOption(data, title))
         break
       case 2:
         this.myChartPie.setOption(barOption(this.dataList, 'bar', title))
         break
       case 3:
         this.myChartPie.setOption(barOption(this.dataList, 'line', title))
         break
       default:
         this.myChartPie.setOption(pieOption(data, title))
         break
     }
 
     this.myChartPie.getZr().on('click', params => {
       if (!params.target) return null
 
       if (params.target.__title === '还原') {
         this.myChartPie.clear()
         this.myChartPie.setOption(pieOption(this.dataList, title))
       } else if (params.target.__title === '切换为柱状图') {
         this.myChartPie.clear()
         this.myChartPie.setOption(barOption(this.dataList, 'bar', title))
       } else if (params.target.__title === '切换为折线图') {
         this.myChartPie.clear()
         this.myChartPie.setOption(barOption(this.dataList, 'line', title))
       }
     })
   }
 
   render() {
     return (
       <div 
         ref="chartsPie" 
         className="chart bgf" 
         style={{height: '480px', width: '100%', display: 'inline-block', overflow: 'hidden', border: '1px solid #f0f0f0'}} 
       />
       // <div ref="chartsPie" className="chart" />
     )
   }
 }
