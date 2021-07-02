/**
 * @description  系统配置
 */
import {Route, Switch} from 'react-router-dom'

import ChannelManage from './page-channel-manage'
import EventManage from './page-event-manage'

const prePath = '/sales'

export default () => {
  return (
    <Switch>
      <Route exact path={`${prePath}/channel-manage`} component={ChannelManage} />
      <Route exact path={`${prePath}/event-manage`} component={EventManage} />
    </Switch>
  )
}
