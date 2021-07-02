/**
 * @description  标签集市
 */
import {Route, Switch} from 'react-router-dom'

import TagMarket from './page-tag-market' 
import TagMarketDetail from './page-tag-market-detail'
 
export default () => {
  return (
    <Switch>
      <Route exact path="/tag-market/manage" component={TagMarket} />
      <Route exact path="/tag-market/manage/:id" component={TagMarketDetail} />
    </Switch>
  )
}
