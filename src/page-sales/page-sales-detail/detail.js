import {useEffect, useState} from 'react'
import {inject} from 'mobx-react'
import {useObserver} from 'mobx-react-lite'
import {AppstoreOutlined, TeamOutlined, ClockCircleOutlined, AimOutlined} from '@ant-design/icons'

export default inject('store')(({store}) => {
  return useObserver(() => (
    <div className="sales-detail-header box-border">
      <div className="fs18">
        {store.planName}
      </div>
      <div className="mt8 FBH">
        <div className="FBH FBAC mr16 black85">
          <AppstoreOutlined />
          <div className="ml4">默认分组</div>
        </div>
        <div className="FBH FBAC mr16 black85">
          <TeamOutlined />
          <div className="ml4">高净值人群</div>
        </div>
        <div className="FBH FBAC mr16 black85">
          <ClockCircleOutlined />
          <div className="ml4">{store.planTime}</div>
        </div>
        <div className="FBH FBAC black85">
          <AimOutlined />
          <div className="ml4">目标。。。</div>
        </div>
      </div>
    </div>
  ))
})
