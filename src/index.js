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
import System from './page-system'
import Login from './page-login'
import Analyze from './page-analyze'
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
          {/* 客户中心 */}
          <Route path="/overview" component={Overview} />
          {/* 标签集市 */}
          <Route path="/tag-market" component={TagMarket} />
          {/* 标签维护 */}
          <Route path="/tag-manage" component={TagObject} />
          {/* 标签同步 */}
          <Route path="/tag-sync" component={Sync} />
          {/* 客群管理 */}
          <Route path="/group" component={Group} />
          {/* 客户画像 */}
          <Route path="/portrait/:ident?/:id?/:isConsultant?" component={Portrait} />
          {/* 客群分析 */}
          <Route path="/analyze" component={Analyze} />
          {/* 系统管理 */}
          <Route path="/system" component={System} />
        </Frame>

      </Switch>
    </Router>
  )
}

ReactDOM.render(<Entry />, document.getElementById('root'))
