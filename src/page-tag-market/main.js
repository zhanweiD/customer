/**
 * @description  标签集市
 */
import {Route, Switch} from 'react-router-dom'
import {codeInProduct} from '../common/util'

import TagMarket from './page-tag-market' 
import TagMarketDetail from './page-tag-market-detail'
 
const prePath = '/market'
  
export default () => {
  return (
    <Switch>
      <Route exact path={`${prePath}/tag-market`} component={TagMarket} />
      <Route exact path={`${prePath}/tag-market/:id`} component={TagMarketDetail} />
    </Switch>
  )
}
