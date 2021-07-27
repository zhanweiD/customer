import {Route, Switch, Redirect} from 'react-router-dom'

import GroupManage from './page-group-manage'
import GroupDetail from './page-group-detail'
import RuleCreate from './page-rule-create'
import RuleDetail from './page-rule-detail'

const prePath = '/group'

export default () => {
  return (
    <Switch>
      {/* 客群管理 */}
      <Route exact path={`${prePath}/manage/:id?`} component={GroupManage} />
      {/* 客群创建/编辑/复制 */}
      <Route exact path={`${prePath}/manage/create/group/:groupId?/:isCopy?`} component={RuleCreate} />
      {/* 客群详情 */}
      <Route exact path={`${prePath}/manage/detail/:id/:objId`} component={GroupDetail} /> 
      {/* 查看规则详情 */}
      {/* <Route exact path={`${prePath}/manage/rule/:groupId/:objId`} component={RuleDetail} />  */}
      {/* 个体列表 */}
      {/* <Route exact path={`${prePath}/manage/unit/:id/:queryDate`} component={UnitList} /> */}
    </Switch>
  )
}
