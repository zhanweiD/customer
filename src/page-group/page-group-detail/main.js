import React, {useEffect} from 'react'
import {Tabs, Spin} from 'antd'
import {Provider, inject} from 'mobx-react'

import {authView} from '../../component'
import ManageDetail from './manage-detail'
import TabOne from './tab-one'
import TabTwo from './tab-two'
import TabThree from './tab-three'
import Store from './store'

const groupStore = new Store()

const {TabPane} = Tabs

const Main = ({match}) => {
  groupStore.id = match.params.id
  groupStore.objId = match.params.objId

  return (
    <Provider store={groupStore}>
      <div className="group-detail-2">
        <ManageDetail id={match.params.id} />
        <div className="m16">
          <Tabs defaultActiveKey="1">
            <TabPane tab="显著特征" key="1">
              <TabOne />
            </TabPane>
            <TabPane tab="特征分布" key="2">
              <TabTwo id={match.params.id} objId={match.params.objId} />
            </TabPane>
            <TabPane tab="客户列表" key="3">
              <TabThree />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </Provider>
  )
}

export default authView(Main)
