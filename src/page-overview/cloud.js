/* eslint-disable guard-for-in */
/**
 * @description 对象云图
 */
import {useEffect, useState} from 'react'
import * as d3 from 'd3'
import cloud from 'd3-cloud'
import {Spin} from 'antd'

import {NoData} from '../component'
import {errorTip} from '../common/util'
import io from './io'

const color = ['#2592FF', '#FFA44A', '#A88EFF', '#FF81A5', '#fc7634']
const linearColor = [
  'linear-gradient(bottom ,#86D4FF, #2592FF)',
  'linear-gradient(bottom ,#FD5071, #FF81A5)',
  'linear-gradient(bottom ,#7F59FB, #A88EFF)',
  'linear-gradient(bottom ,#FFE800, #FFA44A)',
]

const Cloud = ({
  orgCodes, projectCode, timeStart, timeEnd,
}) => {
  let layout = null
  let fill = null
  const [cloudData, setCloudData] = useState([])

  async function getCloud() {
    try {
      const res = await io.getCloud({
        timeStart,
        timeEnd,
        orgCodes,
        projectCode,
      })
      let newList = []
      let countList = []
      let count = 0
      // eslint-disable-next-line no-restricted-syntax
      for (const item in res) {
        count += res[item]
        countList.push(res[item])
        newList.push({text: item, count: res[item]})
      }

      countList = countList.sort((a, b) => a - b)
      const calibration = countList[countList.length - 1] / count / 4

      newList = newList.map((item, i) => {
        const value = item.count / count
        if (value < calibration) {
          item.color = color[0]
          item.size = 14
        } else if (value < calibration * 2) {
          item.color = color[1]
          item.size = 18
        } else if (value < calibration * 3) {
          item.color = color[2]
          item.size = 22
        } else if (value < calibration * 4) {
          item.color = color[3]
          item.size = 26
        } else {
          item.color = color[4]
          item.size = 30
        }
        return item
      })
      setCloudData(newList)
    } catch (e) {
      errorTip(e.message)
    } 
  }

  function draw(data) {
    d3.select('#box') 
      .append('svg')
      .attr('width', layout.size()[0] || 0)
      .attr('height', layout.size()[1] || 0)
      // .append('defs')
      // .append('linearGradient')
      // .attr('id', 'SVG_ID1')
      // .attr('gradientUnits', 'userSpaceOnUse')
      // .attr('x1', '0')
      // .attr('y1', '10')
      // .attr('x2', '0')
      // .attr('y2', '50')
      
      .append('g')
      .attr('transform', `translate(${layout.size()[0] / 2 || 0},${layout.size()[1] / 2 || 0})`)
      .selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .style('font-size', d => `${d.size}px`)
      .style('font-family', 'Impact')
      // .style('fill', (d, i) => fill(i))
      .style('fill', d => d.color)
      // .style('fill', "url('#SVG_ID1')")
      .attr('text-anchor', 'middle')
      .attr('transform', d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
      .text(d => d.text)
  }

  function couldLayout(data = [], max) {
    const box = d3.select('#box')
    if (!box) return
    box.style('transform', 'scale(0.3, 0.3)').style('transition', 'all .3s linear')
    box.selectAll('*').remove()

    // const scaleSize = data.length > 20 ? d3.scaleLinear().domain([0, max]).range([12, 16]) : d3.scaleLinear().domain([0, max]).range([12, 20]) 

    fill = d3.scaleOrdinal(d3.schemeCategory10)
    layout = cloud()
      .size([parseFloat(box.style('width')), 300])
      .words(data.map((d, index) => {
        const scaleFont = Math.round((Math.random() * (2 - 0.5) + 0.5) * 10) / 10
        return {text: d.text, size: d.size, color: d.color}
        // return {text: d.text, size: d.size, backgroundImage: linearColor[index % 4]}
      }))
      .padding([16, 2, 4, 2])
      .spiral('archimedean')
      .rotate(0)
      .font('Impact')
      .fontSize(d => d.size)
      .on('end', d => draw(d))

    layout.start()
    box.style('transform', 'scale(1, 1)') 
  }

  useEffect(() => {
    getCloud()
  }, [timeStart, orgCodes, projectCode])
  useEffect(() => {
    couldLayout(cloudData, 2)
  }, [cloudData])

  return (
    <div className="object-cloud">
      {/* <Spin spinning={loading}> */}
      {/* <svg viewBoxs="0 0 500 300" className="svgBox">
        <defs>
          <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="0" y1="10" x2="0" y2="50">
            <stop offset="0" style={{stopColor: 'yellow'}} />
            <stop offset="0.5" style={{stopColor: '#fd8403'}} />
            <stop offset="1" style={{stopColor: 'red'}} />
          </linearGradient>
        </defs>
        <text textAnchor="middle" className="gradient-text-three" x="110px" y="30%">花信年华</text>
      </svg> */}
      <div>
        {
          !cloudData.length
            ? (
              <div className="no-Data" style={{height: '300px'}}>
                <NoData text="暂无数据" size="small" />
              </div>
            )
            : null
        }
        <div id="box" style={{display: cloudData.length ? 'block' : 'none'}} />
      </div>
      {/* </Spin> */}
    </div>
  )
}
export default Cloud
