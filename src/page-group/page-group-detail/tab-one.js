// 显著特征
import React from 'react'
import {inject} from 'mobx-react'
import {useObserver} from 'mobx-react-lite'
import TabOneList from './tab-one-list'
import TabOneChart from './tab-one-chart'


export default inject('store')(
  ({store}) => {
    return useObserver(() => (
      <div
        className="tab-card FBH custom-border"
        style={{
          minHeight: 'calc(100vh - 204px)',
          // overflowY: 'auto',
        }}
      >
        <div className="FBV FB1 mr16">
          <div>显著特征</div>
          <div>
            <TabOneList />
          </div>
        </div>
        <div className="FBV FB1">
          <div>{`特征分布${store.tabOneTitle}`}</div>
          <div>
            <TabOneChart />
          </div>
        </div>
      </div>
    ))
  }
)
