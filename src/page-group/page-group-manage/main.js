/**
 * @description 客群管理
 */
import {Fragment} from 'react'
import {Tabs} from 'antd'

import {codeInProduct} from '../../common/util'
import {authView} from '../../component'

import GroupList from './group-list'
import PushList from './push-list'
import './main.styl'

const {TabPane} = Tabs
const GroupManage = () => {
  return (
    <div className="oa FBV">
      <div className="content-header">客群管理</div>
      <div className="custom-border m16 FB1">
        <Tabs defaultActiveKey={codeInProduct('/group/manage') ? '0' : '1'} className="group-manage">
          {
            codeInProduct('/group/manage') && (
              <TabPane tab="客群列表" key="0">
                <GroupList />
              </TabPane>
            )
          }
          {
            codeInProduct('group-manage:push-view') && (
              <TabPane tab="推送列表" key="1">
                <PushList />
              </TabPane>
            )
          }
        </Tabs>
      </div>
    </div>
  )
}
export default authView(GroupManage)
