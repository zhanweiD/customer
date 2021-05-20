/**
 * @description  标签集市
 */
import {Route, Switch} from 'react-router-dom'

import TagMarket from './page-tag-market' 
import TagMarketDetail from './page-tag-market-detail'
 
export default () => {
  return (
    <Switch>
      <Route exact path="/tag-market" component={TagMarket} />
      <Route exact path="/tag-market/:id" component={TagMarketDetail} />
    </Switch>
  )
}
