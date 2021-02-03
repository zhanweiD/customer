/**
 * @description  群体分析
 */
import {Route, Switch} from 'react-router-dom'
import {codeInProduct} from '../common/util'

import Portrait from './portrait'

const prePath = '/customer'

export default () => {
  return (
    <Switch>
      {
        codeInProduct('portrait:view') && (
          <Route exact path={`${prePath}/portrait/:ident?/:id?/:isConsultant?`} component={Portrait} />
        )
      }
    </Switch>
  )
}
