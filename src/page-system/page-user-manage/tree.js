/* 用户管理-树部分 */
import {Component} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {DtTree} from '@dtwave/uikit'
import {Loading} from '../../component'

import Action from './tree-action'

const {DtTreeBox, DtTreeNode} = DtTree

@observer
export default class TagCateTree extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  // 递归遍历树节点
  processNodeData = data => {
    if (!data) return undefined

    return data.map(node => (
      <DtTreeNode
        key={node.orgId}
        itemKey={node.orgId}
        title={node.orgName}
        // selectable={node.isLeaf}
        // showIcon
        // 对象类目只有一级
        // iconNodeSrc={node.type === 0 ? tagIcon : null}
        nodeData={node}
      >
        {
          this.processNodeData(node.children)
        }
      </DtTreeNode>
    ))
  }

  @action onSelect = (selectedKey, e) => {
    this.store.selectedKeys = selectedKey
    if (this.store.selectedKeys === selectedKey) return null

    // 2. 选中展开当前节点
    // [this.store.selectedKey] = selectedKey
    this.store.getList()
  }

  render() {
    const {
      treeLoading, treeData, expandAll, selectedKeys,
    } = this.store

    const treeBoxConfig = {
      titleHeight: 34,
      title: <Action store={this.store} />,
      defaultWidth: '100%',
      style: {minWidth: '250px'},
    }

    const treeConfig = {
      type: 'tree',
      selectExpand: true,
      onSelect: this.onSelect,
      defaultExpandAll: expandAll,
      selectedKeys, // 默认选中默认类目
      expandWithParentKeys: selectedKeys, // 默认选中默认类目
      // defaultExpandedKeys: this.store.searchExpandedKeys.slice(),
      showDetail: true,
    }
    return (
      <div className="object-tree tree-border">
        <DtTreeBox {...treeBoxConfig}>
          {treeLoading
            ? <Loading mode="block" height={100} />
            : (
              <DtTree {...treeConfig}>
                {
                  this.processNodeData(treeData)
                }
              </DtTree>
            )
          }
        </DtTreeBox>
      </div>
    )
  }
}
