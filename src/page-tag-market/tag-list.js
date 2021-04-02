import React from 'react'

import TagCard from './tag-card'
import TagTable from './tag-table'

const cards = [
  {
    id: 1,
    tooltipText: 'kaka',
    title: '总标签数',
    nums: 1264,
    subTitle: '近7日新增标签 162个',
  }, {
    id: 2,
    tooltipText: 'kaka',
    title: '一级标签类目数',
    nums: 18,
    subTitle: '二级标签类目数 85个',
  }, {
    id: 3,
    tooltipText: 'kaka',
    title: '覆盖业态数',
    nums: 8,
    subTitle: '覆盖场景数 56个',
  },
]

export default () => {
  return (
    <div className="tag-list">
      <div className="FBH">
        {
          cards.map((item, index) => (
            <div
              className="FB1"
              style={{marginRight: index !== 2 ? '16px' : '0'}}
            >
              <TagCard {...item} />
            </div>
          ))
        }
      </div>
      <div className="mt16">
        <TagTable />
      </div>
    </div>
  )
}
