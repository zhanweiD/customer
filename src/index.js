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

import UploadTag from './page-tag-manage/upload-tag'
import Group from './page-group'
import System from './page-system'
import Login from './page-login'
import Analyze from './page-analyze'
import Portrait from './page-portrait'
import Sync from './page-tag-sync'
import Overview from './page-overview'
import TagMarket from './page-tag-market'
import TagManage from './page-tag-manage'
import WeappCode from './page-sales/page-channel-manage/weappCode'
import ToCustomer from './page-sales/page-channel-manage/toCustomer'
import Sales from './page-sales'

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
        {/* 上传标签 */}
        <Route path="/upload-tag" component={UploadTag} />

        {/* 公网使用 */}
        {/* 授权跳转 */}
        <Route path="/weappCode/:userAccount/:host/:authType" component={WeappCode} />
        {/* 授权成功返回慧营客跳转 */}
        <Route path="/toCustomer/:authCode?/:expiresIn?" component={ToCustomer} />

        <Frame>
          {/* 客户中心 */}
          <Route path="/home/overview" component={Overview} />
          {/* 标签集市 */}
          <Route path="/tag-market" component={TagMarket} />
          {/* 标签维护 */}
          <Route path="/tag-manage" component={TagManage} />
          {/* 标签同步 */}
          {/* <Route path="/tag-sync/manage" component={Sync} /> */}
          {/* 客群管理 */}
          <Route path="/group" component={Group} />
          {/* 客户画像 */}
          <Route path="/customer/portrait/:ident?/:id?/:isConsultant?" component={Portrait} />
          {/* 客群分析 */}
          <Route path="/analyze" component={Analyze} />
          {/* 系统管理 */}
          <Route path="/system" component={System} />
          {/* 自动化营销 */}
          <Route path="/sales" component={Sales} />
        </Frame>

      </Switch>
    </Router>
  )
}

ReactDOM.render(<Entry />, document.getElementById('root'))
