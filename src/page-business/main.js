import {Tabs} from 'antd'
import {Provider} from 'mobx-react'

import Scene from './scene'
import Domain from './domain'
import Format from './format'

import SceneStore from './scene-store'
import DomainStore from './domain-store'
import FormatStore from './format-store'

const sceneStore = new SceneStore()
const domainStore = new DomainStore()
const formatStore = new FormatStore()
const {TabPane} = Tabs

export default () => {
  const tabsChange = key => {
    if (key === '1') {
      sceneStore.getDomainFormatList()
    }

    if (key === '2') {
      domainStore.getFormatList()
    }
  }

  return (
    <div className="business-config">
      <div className="content-header">业务配置</div>
      <Tabs 
        defaultActiveKey="1" 
        style={{backgroundColor: '#fff', margin: '16px'}}
        onChange={key => tabsChange(key)}
      >
        <TabPane tab="场景管理" key="1">
          <Provider store={sceneStore}>
            <Scene />
          </Provider>
        </TabPane>
        <TabPane tab="业务域管理" key="2">
          <Provider store={domainStore}>
            <Domain />
          </Provider>
        </TabPane>
        <TabPane tab="业态管理" key="3">
          <Provider store={formatStore}>
            <Format />
          </Provider>
        </TabPane>
      </Tabs>
    </div>
  )
}
