/* 对象管理-树部分 */
import {Component} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {Modal} from 'antd'
import {DtTree} from '@dtwave/uikit'
import {Loading} from '../../../component'
import {codeInProduct} from '../../../common/util'

// import {getIconNodeSrc} from '../util'

import Action from './tree-action'
import ModalCategory from './modal-category'

const {DtTreeBox, DtTreeNode} = DtTree
const {confirm} = Modal


@observer
export default class TagCateTree extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
    this.bigStore = props.bigStore
    this.store.objId = this.bigStore.objId
  }

  // 最初的列表形式的树数据
  rawData = undefined

  // 选择树的子节点key
  selectKey = null

  // 标签类目
  categoryMenus = (canEdit, canDelete) => {
    return codeInProduct('tag-manage:add-cate') ? [
      {key: 'add', value: '新建子类目', onClick: (type, data) => this.openModal(type, data)},
      {
        key: 'edit',
        value: '编辑',
        disabled: !canEdit,
        onClick: (type, data) => this.openModal(type, data),
      },
      {
        key: 'delete',
        value: '删除',
        disabled: !canDelete,
        onClick: (type, data) => this.deleteNode(type, data),
      },
    ] : [] 
  }

  // 标签类目 - 叶子类目
  leafCategoryMenus = (editStatus, deleteStatus) => {
    return codeInProduct('tag-manage:add-cate') ? [
      {
        key: 'edit', value: '编辑', disabled: !editStatus, onClick: (type, data) => this.openModal(type, data),
      },
      {
        key: 'delete', value: '删除', disabled: !deleteStatus, onClick: (type, data) => this.deleteNode(type, data),
      },
    ] : [] 
  }

  componentDidMount() {
    this.store.getTagCateTree()
  }

  // componentDidUpdate(prevProps) {
  //   if (prevProps.objId !== this.props.objId) {
  //     store.objId = this.props.objId
  //     this.store.objId = this.props.objId
  //     // store.getValueTrend(pieData => {
  //     //   this.drawSaveTrend(pieData)
  //     // })
  //     store.getTagCateTree()
  //   }
  // }

  @action.bound openModal(type, data) {
    this.store.categoryModal = {
      visible: true,
      title: '标签类目',
      editType: type,
      detail: data,
    }
  }

  /**
   * @description 删除节点
   */
  @action.bound deleteNode(key, data) {
    const t = this
    confirm({
      title: '确认删除标签类目？',
      // content,
      onOk: () => {
        this.store.delNode(data.id)
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  /**
   * @description 选择标签类目；展示类目详情
   */
  @action.bound onSelect(selectedKeys, record) {
    // 1. 选中节点为当前所选节点；不进行操作
    if (this.store.currentSelectKeys === selectedKeys[0]) return

    // 2. 选中展开当前节点
    [this.store.currentSelectKeys] = selectedKeys
    this.store.nowCateIds = record.node.props.keyPath

    // 3. 获取类目详情 (基本信息&标签列表)
    this.store.getList({objId: this.store.objId, cateId: this.store.currentSelectKeys})
  }


  // 递归遍历树节点
  processNodeData = data => {
    if (!data) return undefined

    return data.map(node => (
      <DtTreeNode
        key={node.id}
        itemKey={node.id}
        title={node.name}
        // title={`${node.name}{${node.tag}}`}
        selectable={node.isLeaf !== 1} // 叶子节点可选
        // showIcon={node.isLeaf !== 2}
        // showIcon
        // 对象类目只有一级
        // iconNodeSrc={e => getIconNodeSrc(e)}
        actionList={this.setActionList(node)}
        nodeData={node}
        style={{fontSize: '12px'}}
      >
        {
          this.processNodeData(node.children)
        }
      </DtTreeNode>
    ))
  }

  // 设置节点的菜单
  setActionList = node => {
    // 类目 && 无权限 权限code "asset_tag_tag_cat_add_edit_del"
    
    // 叶子类目
    if (node.isLeaf === 2) {
      return this.leafCategoryMenus(node.canEdit, node.canDelete)
    }
    // 标签类目 - 非叶子类目
    return this.categoryMenus(node.canEdit, node.canDelete)
  }

  render() {
    const {
      treeLoading, treeData, expandAll, currentSelectKeys,
    } = this.store

    const treeBoxConfig = {
      titleHeight: 34,
      title: <Action store={this.store} key={this.store.typeCode} />,
      defaultWidth: 176,
      style: {minWidth: '176px'},
    }

    const expandKey = Number(currentSelectKeys)

    const treeConfig = {
      key: 'id',
      type: 'tree',
      selectExpand: true,
      onSelect: this.onSelect,
      defaultExpandAll: expandAll,
      selectedKeys: expandKey ? [expandKey] : [-1], // 默认选中默认类目
      expandWithParentKeys: expandKey ? [expandKey] : [-1], // 默认选中默认类目
      defaultExpandedKeys: this.store.searchExpandedKeys.slice(),
      showDetail: true,
    }
    return (
      <div className="object-tree tree-border ml16 mb16">
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
        <ModalCategory store={this.store} editNodeSuccess={this.getCateDetail} />
      </div>
    )
  }
}
