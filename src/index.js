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
import Manage from './page-tag-manage'
import Analyze from './page-analyze'
import TagApp from './page-tag-app'
import Portrait from './page-portrait'
import Sync from './page-tag-sync'

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
          {/* 标签管理 */}
          <Route path="/tag" component={Manage} />
          {/* 标签同步 */}
          <Route path="/tag" component={Sync} />
          {/* 群体分析 */}
          <Route path="/analyze" component={Analyze} />
          {/* 标签应用 */}
          <Route path="/tag" component={TagApp} />
          {/* 场景管理 */}
          <Route path="/scene" component={Scene} />
          {/* 人物画像 */}
          <Route path="/customer" component={Portrait} />

          {/* 群体管理 */}
          <Route path="/group" component={Group} />

          {/* <Redirect to="/tag" /> */}
        </Frame>

      </Switch>
    </Router>
  )
}

ReactDOM.render(<Entry />, document.getElementById('root'))
