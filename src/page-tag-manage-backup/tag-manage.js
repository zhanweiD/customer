/**
 * @description 对象管理
 */
import {Component} from 'react'
import {action} from 'mobx'
import {observer, Provider} from 'mobx-react'
import {ConfigProvider} from 'antd'
import {NoData} from '../component'
import Tree from './tree'
import ObjectDetail from './detail'

import store from './store'

@observer
export default class ObjectModel extends Component {
  constructor(props) {
    super(props)
    store.selectedKey = null
    store.getTreeData()
  }
  // @action changeTab = code => {
  //   store.typeCode = code
  //   store.objId = undefined
  //   store.tabId = '0'
  // }
  @action addObject = () => {
    store.addObjectUpdateKey = Math.random()
  }

  render() {
    const {
      objId, 
      updateDetailKey,
    } = store
    const noDataConfig = {
      text: '没有任何对象，请在当前页面新建对象！',
    }

    return (
      <ConfigProvider componentSize="small">
        <Provider store={store}>
          <div className="page-object-modal">
            <div className="content-header">标签管理</div>
            <div className="object-modal-content">
              <Tree store={store} />
              {
                objId ? (
                  <ObjectDetail 
                    updateDetailKey={updateDetailKey} 
                    objId={objId} 
                    store={store}
                  />
                ) : (
                  <div className="m16 bgf w100">
                    <NoData
                      {...noDataConfig}
                    />
                  </div>
                )
              }
            </div>
          </div>
        </Provider>
      </ConfigProvider>
    )
  }
}
