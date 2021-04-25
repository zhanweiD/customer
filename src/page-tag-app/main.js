/**
 * @description  标签应用
 */
import {Route, Switch, Redirect} from 'react-router-dom'
import {codeInProduct} from '../common/util'

import TagApp from './tag-app'
import VisualDetail from './visual-detail'
import VisuallConfig from './visual-config'
import './main.styl'

const prePath = '/tag'

export default () => {
  return (
    <Switch>
      <Route exact path={`${prePath}/app`} component={TagApp} />
      <Route exact path={`${prePath}/app/detail/:id`} component={VisualDetail} />
      <Route exact path={`${prePath}/app-add/:objId/:id?`} component={VisuallConfig} />
    </Switch>
  )
}
