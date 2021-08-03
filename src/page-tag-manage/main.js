/**
 * @description  系统配置
 */
import {Route, Switch} from 'react-router-dom'

import TagManageDetail from './page-tag-manage' 
import TagManage from './page-tag-object'

export default () => {
  return (
    <Switch>
      <Route exact path="/tag-manage/uphold" component={TagManage} />
      {/* <Route exact path="/tag-manage/uphold" component={TagManageDetail} /> */}
      <Route exact path="/tag-manage/uphold/:id" component={TagManageDetail} />
    </Switch>
  )
}
