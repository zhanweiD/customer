/**
 * @description 群体管理
 */
import {Fragment} from 'react'
import {Tabs} from 'antd'

import {codeInProduct} from '../../common/util'

import GroupList from './group-list'
import PushList from './push-list'
import './main.styl'

const {TabPane} = Tabs
const GroupManage = () => {
  return (
    <div className="oa">
      <div className="content-header">群体管理</div>
      <Tabs defaultActiveKey={codeInProduct('group-manage:view') ? '0' : '1'} className="group-manage">
        {
          codeInProduct('group-manage:view') && (
            <TabPane tab="群体列表" key="0">
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
  )
}
export default GroupManage
