/**
 * @description  系统配置
 */
import {Route, Switch} from 'react-router-dom'

import UserManage from './page-user-manage'
import RoleManage from './page-role-manage'
import Portrait from './page-portrait-config'
import SystemLog from './page-system-log'
import Business from './page-business-config'

const prePath = '/system'

export default () => {
  return (
    <Switch>
      <Route exact path={`${prePath}/user-manage`} component={UserManage} />
      <Route exact path={`${prePath}/role-manage`} component={RoleManage} />
      <Route exact path={`${prePath}/portrait`} component={Portrait} />
      <Route exact path={`${prePath}/system-log`} component={SystemLog} />
      <Route exact path={`${prePath}/business`} component={Business} />
      {/* <Redirect strict to={`${prePath}/role-manage`} /> */}
    </Switch>
  )
}
