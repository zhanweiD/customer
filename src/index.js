import React from 'react'
import ReactDOM from 'react-dom'
import {
  HashRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'
import * as dict from './common/dict'
import './common/util.styl'
import Frame from './frame'

import Group from './page-group'
import Scene from './page-scene'
import System from './page-system'
import Login from './page-login'
import Analyze from './page-analyze'
// import TagApp from './page-tag-app'
import Portrait from './page-portrait'
import Sync from './page-tag-sync'
import Overview from './page-overview'
import TagMarket from './page-tag-market'
import TagObject from './page-tag-bazaar'

const njkData = {
  dict,
}

window.njkData = njkData

function Entry() {
  return (
    <Router>
      <Switch>
        {/* 登录 */}
        <Route path="/login" component={Login} />
        <Frame>
          {/* 系统管理 */}
          <Route path="/system" component={System} />
          {/* 标签同步 */}
          <Route path="/tag" component={Sync} />
          {/* 群体分析 */}
          <Route path="/analyze" component={Analyze} />
          {/* 标签应用 */}
          {/* <Route path="/tag" component={TagApp} /> */}
          {/* 场景管理 */}
          {/* <Route path="/scene" component={Scene} /> */}
          {/* 客户画像 */}
          <Route path="/customer" component={Portrait} />
          {/* 客户中心 */}
          <Route path="/overview" component={Overview} />
          {/* 群体管理 */}
          <Route path="/group" component={Group} />
          {/* 标签集市 */}
          <Route path="/market" component={TagMarket} />
          {/* 标签维护 */}
          <Route path="/bazaar" component={TagObject} />
          {/* <Redirect to="/tag" /> */}
        </Frame>

      </Switch>
    </Router>
  )
}

ReactDOM.render(<Entry />, document.getElementById('root'))
