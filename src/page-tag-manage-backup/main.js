/**
 * @description  标签管理
 */
import {Route, Switch, Redirect} from 'react-router-dom'
import {codeInProduct} from '../common/util'

import ObjectModel from './tag-manage'

const prePath = '/tag'

export default () => {
  return (
    <Switch>
      {
        codeInProduct('tag-manage:view') && (
          <div>
            <Route exact path={`${prePath}/manage`} component={ObjectModel} />
            {/* <Redirect strict to={`${prePath}/manage`} /> */}
          </div>
        )
      }
    </Switch>
  )
}
