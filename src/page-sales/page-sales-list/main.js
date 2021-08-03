import {Route, Switch, Redirect} from 'react-router-dom'
import Sales from './sales'
import CreatePlan from './create-plan'
import SalesDetail from './page-sales-detail'
import CreateSales from './page-create-sales'

const prePath = '/sales/list'

export default () => {
  return (
    <Switch>
      {/* 营销计划列表 */}
      <Route exact path={`${prePath}/:id?`} component={Sales} />
      {/* 营销计划详情 */}
      <Route exact path={`${prePath}/detail/:id`} component={SalesDetail} />
      {/* 营销计划创建/编辑 */}
      <Route exact path={`${prePath}/create/:planId`} component={CreateSales} />
      {/* 营销计划创建/编辑画布版 */}
      {/* <Route exact path={`${prePath}/create-old/:id?/:name?`} component={CreatePlan} /> */}
    </Switch>
  )
}
