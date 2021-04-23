/**
 * @description  系统配置
 */
import {Route, Switch} from 'react-router-dom'
import {codeInProduct} from '../common/util'

import TagManage from './page-tag-manage' 
import TagObject from './page-tag-object'

const prePath = '/bazaar'
 
export default () => {
  return (
    <Switch>
      {
        codeInProduct('system:system-log:view') && (
          <Route exact path={`${prePath}/tag-manage`} component={TagObject} />
        // <Route path="/business/config" component={Business} />
        )
      }
      <Route exact path={`${prePath}/tag-manage/:id`} component={TagManage} />

    </Switch>
  )
}
