

/**
 * @description  群体分析
 */
import {Route, Switch} from 'react-router-dom'
import {codeInProduct} from '../common/util'
 
import Overview from './overview'
 
const prePath = '/overview'
 
export default () => {
  return (
    <Switch>
      {
        codeInProduct('portrait:view') && (
          <Route exact path={`${prePath}/customer`} component={Overview} />
        )
      }
    </Switch>
  )
}
