/**
 * @description 客群管理
 */
import {useState, useEffect} from 'react'
import {Tabs} from 'antd'

import {codeInProduct} from '../../common/util'
import {authView} from '../../component'

import GroupList from './group-list'
import PushList from './push-list'
import './main.styl'

const {TabPane} = Tabs
const GroupManage = props => {
  const [current, setCurrent] = useState('0')
  const [groupId, setGroupId] = useState()
  useEffect(() => {
    const {params} = props.match
    if (params.id) {
      setCurrent('1')
      setGroupId(params.id)
    }
  }, [])
  return (
    <div className="oa FBV group-container">
      <div className="content-header">客群管理</div>
      <div className="FB1 p16">
        {/* <Tabs defaultActiveKey={codeInProduct('/group/manage') ? '0' : '1'} className="group-manage"> */}
        <Tabs activeKey={current} className="group-manage" onChange={v => setCurrent(v)}>
          {
            codeInProduct('/group/manage/:id?') && (
              <TabPane tab="客群列表" key="0">
                <GroupList />
              </TabPane>
            )
          }
          {
            codeInProduct('group-manage:push-view') && (
              <TabPane tab="推送列表" key="1">
                <PushList groupId={groupId} />
              </TabPane>
            )
          }
        </Tabs>
      </div>
    </div>
  )
}
export default authView(GroupManage)
// export default GroupManage
