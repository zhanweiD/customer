/**
 * @description  群体分析
 */
import {Route, Switch, Redirect} from 'react-router-dom'
import {codeInProduct} from '../common/util'

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
      {
        codeInProduct('analyze:channel:view') && (
          <Route exact path={`${prePath}/channel`} component={Channel} />
        )
      }
      {
        codeInProduct('analyze:chinch:view') && (
          <Route exact path={`${prePath}/clinch`} component={Clinch} />
        )
      }
      {
        codeInProduct('analyze:consultant:view') && (
          <Route exact path={`${prePath}/consultant`} component={Consultant} />
        )
      }
      {
        codeInProduct('analyze:supply-demand:view') && (
          <Route exact path={`${prePath}/supply-demand`} component={SupplyDemand} />
        )
      }
      {
        codeInProduct('analyze:group-portrait:view') && (
          <Route exact path={`${prePath}/group`} component={Group} />
        )
      }
      {
        codeInProduct('analyze:satisfaction:view') && (
          <Route exact path={`${prePath}/satisfaction`} component={Satisfaction} />
        )
      }
      {
        codeInProduct('analyze:purchase:view') && (
          <Route exact path={`${prePath}/purchase`} component={Purchase} />
        )
      }
      {/* <Redirect strict to={`${prePath}/role-manage`} /> */}
    </Switch>
  )
}
