import {useState} from 'react'
import {Button, Tabs} from 'antd'
import {AppstoreOutlined, TeamOutlined, ClockCircleOutlined, AimOutlined} from '@ant-design/icons'
import TabOne from './tab-one'
import TabTwo from './tab-two'

const {TabPane} = Tabs


export default () => {
  return (    
    <div className="sales-detail FBV">
      <div className="sales-detail-header box-border">
        <div className="fs18">
          JHMC001
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
            <div className="ml4">日期。。。</div>
          </div>
          <div className="FBH FBAC black85">
            <AimOutlined />
            <div className="ml4">目标。。。</div>
          </div>
        </div>
      </div>
      <div className="sales-detail-analyze FB1 box-border m16">
        <Tabs>
          <TabPane tab="数据详情" key="1">
            <TabOne />
          </TabPane>
          <TabPane tab="计划详情" key="2">
            <TabTwo />
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}
