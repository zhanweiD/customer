import React from 'react'
import Tree from './tab-two-tree'
import Chart from './tab-two-chart'
import {NoData} from '../../component'

const chartDemoDatas = [
  {
    tagName: '教育程度',
    data: [
      {
        name: '本科',
        val: 2830,
      },
    ],
  },
  {
    tagName: '子女年龄段',
    data: [
      {
        name: '10-20岁',
        val: 1366,
      },
      {
        name: '0',
        val: 371,
      },
      {
        name: '15-25岁',
        val: 1093,
      },
    ],
  },
  {
    tagName: '军人',
    data: [
      {
        name: '否',
        val: 2830,
      },
    ],
  },
]

export default () => {
  return (
    <div className="tab-card FBH">
      <div style={{border: '1px solid #f0f0f0'}}>
        <Tree />
      </div>
      <div className="FB1">
        {
          chartDemoDatas.length ? (
            chartDemoDatas.map(item => (
              <div className="fl pl16" style={{width: '50%'}}>
                <Chart data={item.data} title={item.tagName} />
              </div>
            ))
          ) : <div className="bgf mt16" style={{height: 'calc(100vh - 314px)'}}><NoData text="暂无数据，请选择标签" /></div>
        }
      </div>
    </div>
  )
}
