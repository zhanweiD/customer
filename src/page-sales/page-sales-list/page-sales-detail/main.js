import {useEffect, useState} from 'react'
import {Button, Tabs} from 'antd'
import {Provider, inject} from 'mobx-react'
import Detail from './detail'
import TabOne from './tab-one'
import TabTwo from './tab-two'
import Store from './store'
import {authView} from '../../../component'

const {TabPane} = Tabs

const detailStore = new Store()

const SalesDetail = props => {
  detailStore.id = props.match.params.id

  useEffect(() => {
    detailStore.getGroupList(() => {
      detailStore.getDetail()
    })
  }, [])

  return (    
    <Provider store={detailStore}>
      <div className="sales-detail FBV">
        <Detail />
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
    </Provider>
  )
}
export default authView(SalesDetail)
// export default SalesDetail
