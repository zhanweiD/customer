/**
 * @description 树组件 - 搜索框
 */
import {Component} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {Dropdown, Menu} from 'antd'
import {NoBorderInput} from '../../component'
import {
  IconRefresh, IconTreeAdd,
} from '../../icon-comp'

@observer
export default class Action extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  // 查询树节点
  @action.bound searchTree(data) {
    this.store.treeSearchKey = data
    // this.store.getObjTree()
  }

  // 添加
  @action.bound addTree() {
    this.store.visibleTag = true

    this.store.getDerivativeTagList()
  }

  dropdownDom() {
    const menu = (
      <Menu>
        <Menu.Item disabled={this.store.tagTreeData.length === 10}>
          <div 
            onClick={this.addTree} 
            style={{margin: '-5px -12px', padding: '5px 12px', fontSize: '12px'}}
          >
            新建组合标签
          </div>
        </Menu.Item>
      </Menu>
    )
    return (
      <Dropdown overlay={menu}>
        <IconTreeAdd size="14" className="mr8 hand" />
      </Dropdown>
    )
  }

  render() {
    return (
      <div>
        {/* <h3 className="ml8 pt8">衍生标签</h3> */}
        <div className="object-tree-action">
          <NoBorderInput 
            placeholder="请输入标签名称搜索" 
            onChange={this.searchTree}
            onPressEnter={this.searchTree}
          />

          <div className="FBH pr6 pl6" style={{maxWidth: 70}}>
            <IconRefresh size="14" className="mr8" onClick={this.refreshTree} />
            {
              this.dropdownDom()
            }

          </div>
        </div>
      </div>
     
    )
  }
}
