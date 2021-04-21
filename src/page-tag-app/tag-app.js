/**
 * @description 标签应用
 */
import {Component} from 'react'
import {action} from 'mobx'
import {observer, Provider} from 'mobx-react'
import {ConfigProvider} from 'antd'
import Tree from './tree'
import CateDetail from './detail'

import store from './store'

@observer
export default class ObjectModel extends Component {
  render() {
    return (
      <Provider objStore={store}>
        <div className="page-object-modal oa">
          <div className="content-header">标签应用</div>
          <div className="object-modal-content mt72">
            <Tree store={store} />
            <CateDetail 
              cateId={store.selectedKey} 
              store={store}
            />
          </div>
        </div>
      </Provider>
    )
  }
}
