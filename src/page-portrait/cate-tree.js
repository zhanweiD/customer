import React, {Component} from 'react'
import {Tree} from 'antd'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'

const {TreeNode} = Tree

@observer
export default class CateTree extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  onCheck = (checkedKeysValue, item) => {
    this.store.selectName = []
    item.checkedNodes.forEach(sitem => this.store.selectName.push(sitem.name))
  }

  renderTreeNodes = data => data.map(item => {
    if (item.children) {
      return (
        <TreeNode className="parents" title={item.name} key={item.aid} {...item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      )
    }
    const isUse = this.store.defPortraitList.find(sitem => sitem === item.aid)
    return <TreeNode disabled={!isUse} className="childrens" title={item.name} key={item.aid} {...item} />
  })

  render() {
    const {treeData} = this.store
    return (
      <Tree
        checkable
        onCheck={this.onCheck}
        selectable={false}
      >
        {this.renderTreeNodes(treeData)}
      </Tree>
    )
  }
}
