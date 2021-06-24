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
          item.size = 20
        } else if (value < calibration * 3) {
          item.color = color[2]
          item.size = 26
        } else if (value < calibration * 4) {
          item.color = color[3]
          item.size = 32
        } else {
          item.color = color[4]
          item.size = 38
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
      .append('g')
      .attr('transform', `translate(${layout.size()[0] / 2 || 0},${layout.size()[1] / 2 || 0})`)
      .selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .style('font-size', d => `${d.size}px`)
      .style('font-family', 'Impact')
      // .style('fill', (d, i) => fill(i))
      // .style('fill', d => d.color)
      .style('fill', (d, i) => `url(#SVG_ID${i % 4})`)
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
    <div className="object-cloud pt16 bgf">
      {/* <Spin spinning={loading}> */}
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
      <svg width="100" height="30" viewBoxs="0 0 100 30">
        <defs>
          <linearGradient id="SVG_ID0" gradientTransform="rotate(90)">
            <stop offset="0" stopColor="#86D4FF" />
            <stop offset="1" stopColor="#2592FF" />
          </linearGradient>
          <linearGradient id="SVG_ID1" gradientTransform="rotate(90)">
            <stop offset="0" stopColor="#FF81A5" />
            <stop offset="1" stopColor="#FD5071" />
          </linearGradient>
          <linearGradient id="SVG_ID2" gradientTransform="rotate(90)">
            <stop offset="0" stopColor="#A88EFF" />
            <stop offset="1" stopColor="#7F59FB" />
          </linearGradient>
          <linearGradient id="SVG_ID3" gradientTransform="rotate(90)">
            <stop offset="0" stopColor="#FFE800" />
            <stop offset="1" stopColor="#FFA44A" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
export default Cloud
