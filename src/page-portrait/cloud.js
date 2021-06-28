/**
 * @description 对象云图
 */
import * as d3 from 'd3'
import cloud from 'd3-cloud'
import {Component} from 'react'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {Spin} from 'antd'
import manCloud from './icon/man-cloud.svg'
import womanCloud from './icon/woman-cloud.svg'

import {NoData} from '../component'

const colors = ['#2592FF', '#6C41FA', '#61BA46', '']

@observer
export default class Cloud extends Component {
  constructor(props) { 
    super(props)
    this.store = props.store
  }

  componentDidMount() {
    const {props} = this
    props.getDrawCloud(this.couldLayout)
    // 默认显示
    // this.store.getObjCloud(res => {
    //   this.couldLayout(res)
    // })
  }
  // componentUpdate() {
  //   const {toAllTag} = this.store
  //   this.store.getObjCloud((res, max) => {
  //     if (toAllTag) return
  //     this.couldLayout(res, max)
  //   })
  // }

  // 获取最大值
  getRanKMax(arr = [], countKeyName = 'count') {
    if (!arr.length) return 0
    // const count = _.map(arr, countKeyName)
    // const max = Math.max.apply(null, 2)
    const max = 2
    return max
  }

  @action.bound couldLayout(data = [], location, max = 4) {
    console.log(data)

    this.box = d3.select(`#${location}-box${this.props.index}`)
    if (!this.box) return
    this.box.style('transform', 'scale(1, 1)').style('transition', 'all .3s linear')
    this.box.selectAll('*').remove()

    const scaleSize = d3.scaleLinear().domain([0, max]).range([14, 28])
    // const scaleSize = data.length > 50 ? d3.scaleLinear().domain([0, max]).range([14, 20]) : d3.scaleLinear().domain([0, max]).range([14, 28]) 

    this.fill = d3.scaleOrdinal(d3.schemeCategory10)
    this.layout = cloud()
      .size([parseFloat(this.box.style('width')), parseFloat(this.box.style('height'))])
      // .size([parseFloat(this.box.style('width')), (location === 'header' || location === 'bottom') ? 160 : 500])
      .words(data.map(d => {
        const scaleFont = Math.round((Math.random() * (2 - 0.5) + 0.5) * 10) / 10
        return {text: `${d.tag}: ${d.val ? d.val : '-'}`, color: d.color, size: scaleSize(scaleFont)}
      }))
      .padding(0)
      .spiral('archimedean')
      .rotate(0)
      .font('Impact')
      .fontSize(d => d.size)
      .on('end', d => this.draw(d, location))

    this.layout.start()
    this.box.style('transform', 'scale(1, 1)') 
  }

  draw(data, location) {
    d3.select(`#${location}-box${this.props.index}`) 
      .append('svg')
      .attr('width', () => this.layout.size()[0])
      .attr('height', this.layout.size()[1])
      .append('g')
      .attr('width', () => this.layout.size()[0])
      .attr('height', this.layout.size()[1])
      .attr('transform', `translate(${this.layout.size()[0] / 2},${this.layout.size()[1] / 2})`)
      // .selectAll('rect')
      // .data(data)
      // .enter()
      // .append('rect')
      // // .style('font-size', d => d.size)
      // .style('fill', '#86D4FF')
      // .attr('width', 100)
      // .attr('height', 32)
      // .attr('transform', d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
      .selectAll('text')
      .data(data)
      .enter()
      .append('text')
      // .style('font-size', d => d.size)
      .style('font-size', '16px')
      .style('font-family', 'Impact')
      .style('fill', d => d.color)
      .attr('text-anchor', 'middle')
      .attr('transform', d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
      .text(d => d.text)
    // d3.select('g') 
    //   .append('image')
    //   .attr('xlink:href', manCloud)
    //   .attr('width', 240)
    //   .attr('height', 240)
    //   .attr('x', -112)
    //   .attr('y', -120)
  }

  render() {
    const {
      cloudData = [], loading, defaultInfo, toAllTag, cateTitle,
    } = this.store
    const {index} = this.props

    return (
      <div className="object-cloud">
        <Spin spinning={loading}>
          <div>
            {
              !cloudData.length
                ? (
                  <div className="no-Data" style={{height: '442px'}}>
                    <NoData text="请选择业务域查询" />
                  </div>
                )
                : null
            }
            <div>
              <div style={{height: 100}} id={`left-box${index}`} />
              <div className="FBH">
                <div className="w33" style={{height: 240}} id={`header-box${index}`} />
                <div className="w33"><img style={{width: 240}} src={defaultInfo.性别 === '男' ? manCloud : womanCloud} alt="" /></div>
                <div className="w33" style={{height: 240}} id={`bottom-box${index}`} />
              </div>
              <div style={{height: 100}} id={`right-box${index}`} />
            </div>
            {/* <div id={`box${index}`} /> */}
            <div className="d-flex FBJC mt16">
              {
                cateTitle.map(item => (
                  <div className="mr8" style={{color: item.color}}>
                    <span style={{backgroundColor: item.color}} className="legend-name-icon mr4" />
                    <span>{item.text}</span>
                  </div>
                ))
              }
            </div>
          </div>
        </Spin>
      </div>
    )
  }
}
