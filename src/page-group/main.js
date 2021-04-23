import {Route, Switch, Redirect} from 'react-router-dom'

import GroupManage from './page-group-manage'
import GroupDetail from './page-group-detail'
import UnitList from './page-unit-list'
import RuleCreate from './page-rule-create'
import RuleDetail from './page-rule-detail'

import {codeInProduct} from '../common/util'

const prePath = '/group'

export default () => {
  return (
    <Switch>
      {/* 群体管理 */}
      {
        codeInProduct('group-manage:view') && (
          <Route exact path={`${prePath}/manage`} component={GroupManage} />
        )
      }

      {/* 实时/离线 群体创建/编辑 */}
      <Route exact path={`${prePath}/manage/create/:groupId?/:isCopy?`} component={RuleCreate} />

      {/* 群体详情 */}
      <Route exact path={`${prePath}/manage/:id/:objId`} component={GroupDetail} /> 

      {/* 查看规则详情 */}
      <Route exact path={`${prePath}/manage/rule/:groupId/:objId`} component={RuleDetail} /> 

      {/* 个体列表 */}
      <Route exact path={`${prePath}/manage/unit/:id/:queryDate`} component={UnitList} />
    </Switch>
  )
}
