/**
 * @description  系统配置
 */
import {Route, Switch} from 'react-router-dom'

import ChannelManage from './page-channel-manage'
import EventManage from './page-event-manage'
import materialManage from './page-material-manage'
import SalesList from './page-sales-list'
import CreatePlan from './page-sales-list/create-plan'
import SalesDetail from './page-sales-list/page-sales-detail'
import CreateSales from './page-sales-list/page-create-sales'

const prePath = '/sales'

export default () => {
  return (
    <Switch>
      {/* 渠道管理 */}
      <Route exact path={`${prePath}/channel-manage`} component={ChannelManage} />
      {/* 事件管理 */}
      <Route exact path={`${prePath}/event-manage`} component={EventManage} />
      {/* 素材管理 */}
      <Route exact path={`${prePath}/material-manage`} component={materialManage} />
      {/* 营销计划列表 */}
      <Route exact path={`${prePath}/list/:id?`} component={SalesList} />
      {/* 营销计划详情 */}
      <Route exact path={`${prePath}/list/detail/:id`} component={SalesDetail} />
      {/* 营销计划创建/编辑 */}
      <Route exact path={`${prePath}/list/create/:planId`} component={CreateSales} />
      {/* 营销计划创建/编辑画布版 */}
      {/* <Route exact path={`${prePath}/list/create-old/:id?/:name?`} component={CreatePlan} /> */}
    </Switch>
  )
}
