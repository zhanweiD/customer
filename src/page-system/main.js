/**
 * @description  系统配置
 */
import {Route, Switch} from 'react-router-dom'
import {codeInProduct} from '../common/util'

import UserManage from './user-manage'
import RoleManage from './role-manage'
import Portrait from './user-portrait'
import SystemLog from './system-log'
import Business from '../page-business'

const prePath = '/system'

export default () => {
  return (
    <Switch>
      {
        codeInProduct('system:user-manage:view') && (
          <Route exact path={`${prePath}/user-manage`} component={UserManage} />
        )
      }
      {
        codeInProduct('system:role-manage:view') && (
          <Route exact path={`${prePath}/role-manage`} component={RoleManage} />
        )
      }
      {
        codeInProduct('system:portrait:view') && (
          <Route exact path={`${prePath}/portrait`} component={Portrait} />
        )
      }
      {
        codeInProduct('system:system-log:view') && (
          <Route exact path={`${prePath}/system-log`} component={SystemLog} />
        )
      }
      {
        codeInProduct('system:system-log:view') && (
          <Route exact path={`${prePath}/business`} component={Business} />
          // <Route path="/business/config" component={Business} />
        )
      }
      {/* <Redirect strict to={`${prePath}/role-manage`} /> */}
    </Switch>
  )
}
