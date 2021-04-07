/**
 * @description 树组件 - 搜索框
 */
import {Component} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {Button, ConfigProvider} from 'antd'
import {Authority} from '../component'
import AddObject from './tree-drawer-object'

@observer
export default class Action extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  // 新建
  @action.bound addTree() {
    this.store.detail = {}
    this.store.isAdd = true
    this.store.visible = true
  }

  render() {
    return (
      <ConfigProvider size="small">
        <div className="object-tree-action pt16">
          <Authority
            authCode="tag-manage:add-object"
          >
            <Button style={{width: '107px'}} type="primary" onClick={this.addTree}>
              新建对象
            </Button>
          </Authority>
          <AddObject store={this.store} />
        </div>
      </ConfigProvider>
    )
  }
}
