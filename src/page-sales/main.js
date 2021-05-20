import {Route, Switch, Redirect} from 'react-router-dom'
import Sales from './sales'
import CreatePlan from './create-plan'

const prePath = '/sales'

export default () => {
  return (
    <Switch>
      {/* 营销计划列表 */}
      <Route exact path={`${prePath}/list`} component={Sales} />
      {/* 营销计划创建/编辑 */}
      <Route exact path={`${prePath}/create`} component={CreatePlan} />
    </Switch>
  )
}
