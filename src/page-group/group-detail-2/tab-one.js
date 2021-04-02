// 显著特征
import React from 'react'
import TabOneList from './tab-one-list'
import TabOneChart from './tab-one-chart'


export default () => {
  return (
    <div className="tab-card FBH">
      <div className="FBV FB1 mr16">
        <div>显著特征</div>
        <div>
          <TabOneList />
        </div>
      </div>
      <div className="FBV FB1">
        <div>特征分布</div>
        <div>
          <TabOneChart />
        </div>
      </div>
    </div>
  )
}
