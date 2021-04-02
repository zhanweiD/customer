import React, {useEffect} from 'react'
import {Tabs} from 'antd'
import ManageDetail from './manage-detail'
import TabOne from './tab-one'
import TabTwo from './tab-two'
import TabThree from './tab-three'
import {TabRoute} from '../../component'

const {TabPane} = Tabs

const tabConfig = {
  tabs: [{name: '标签选择', value: 1}],
  changeUrl: false,
}

const Main = () => {
  return (
    <div className="group-detail-2">
      <ManageDetail />
      <div className="comp-tab">
        <Tabs defaultActiveKey="1">
          <TabPane tab="显著特征" key="1">
            <TabOne />
          </TabPane>
          <TabPane tab="特征分布" key="2">
            <TabTwo />
          </TabPane>
          <TabPane tab="客户列表" key="3">
            <TabThree />
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

export default Main
