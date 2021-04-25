/**
 * @description  群体分析
 */
import {Route, Switch, Redirect} from 'react-router-dom'

import Channel from './page-channel'
import Clinch from './page-clinch'
import Consultant from './page-consultant'
import Group from './page-group'
import SupplyDemand from './page-supply-demand'
import Satisfaction from './page-satisfaction'
import Purchase from './page-purchase'

const prePath = '/analyze'

export default () => {
  return (
    <Switch>
      <Route exact path={`${prePath}/channel`} component={Channel} />
      <Route exact path={`${prePath}/clinch`} component={Clinch} />
      <Route exact path={`${prePath}/consultant`} component={Consultant} />
      <Route exact path={`${prePath}/supply-demand`} component={SupplyDemand} />
      <Route exact path={`${prePath}/group`} component={Group} />
      <Route exact path={`${prePath}/satisfaction`} component={Satisfaction} />
      <Route exact path={`${prePath}/purchase`} component={Purchase} />
      {/* <Redirect strict to={`${prePath}/role-manage`} /> */}
    </Switch>
  )
}
