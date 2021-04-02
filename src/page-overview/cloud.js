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

const Cloud = () => {
  let layout = null
  let fill = null
  const [cloudData, setCloudData] = useState([])

  async function getObjCloud() {
    // this.loading = true
    try {
      const res = await io.getObjCloud({
        id: 34323626329648,
        ident: 'vTuyFx6Ddf6ut8K2JDtDJj7X8dmRyJoYXTK9pKJdLaVKvX6gaitvKuBPnsuA',
      })
      const list = res || []
      list.forEach(item => {
        if (item.list) {
          setCloudData([...cloudData, ...item.list])
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  function draw(data) {
    d3.select('#box') 
      .append('svg')
      .attr('width', layout.size()[0])
      .attr('height', layout.size()[1])
      
      .append('g')
      .attr('transform', `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`)
      .selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .style('font-size', d => `${d.size}px`)
      .style('font-family', 'Impact')
      .style('fill', (d, i) => fill(i))
      .attr('text-anchor', 'middle')
      .attr('transform', d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
      .text(d => d.text)
  }

  function couldLayout(data = [], max) {
    const box = d3.select('#box')
    if (!box) return
    box.style('transform', 'scale(0.3, 0.3)').style('transition', 'all .3s linear')
    box.selectAll('*').remove()

    const scaleSize = data.length > 20 ? d3.scaleLinear().domain([0, max]).range([12, 16]) : d3.scaleLinear().domain([0, max]).range([12, 20]) 

    fill = d3.scaleOrdinal(d3.schemeCategory10)
    layout = cloud()
      .size([parseFloat(box.style('width')), 360])
      .words(data.map(d => {
        const scaleFont = Math.round((Math.random() * (2 - 0.5) + 0.5) * 10) / 10
        return {text: `${d.tag}: ${d.val ? d.val : '-'}`, size: scaleSize(scaleFont)}
      }))
      .padding(2)
      .spiral('archimedean')
      .rotate(0)
      .font('Impact')
      .fontSize(d => d.size)
      .on('end', d => draw(d))

    layout.start()
    box.style('transform', 'scale(1, 1)') 
  }

  useEffect(() => {
    getObjCloud()
  }, [])
  useEffect(() => {
    couldLayout(cloudData, 2)
  }, [cloudData])

  return (
    <div className="object-cloud">
      {/* <Spin spinning={loading}> */}
      <div>
        {/* {
            !cloudData.length
              ? (
                <div className="no-Data" style={{height: '442px'}}>
                  <NoData text="暂无数据" size="small" />
                </div>
              )
              : null
          } */}
        <div id="box" />
      </div>
      {/* </Spin> */}
    </div>
  )
}
export default Cloud
