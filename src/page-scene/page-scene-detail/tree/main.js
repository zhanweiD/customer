import {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {observer, inject} from 'mobx-react'
import {
  toJS, action, runInAction,
} from 'mobx'
import {Modal, Spin} from 'antd'
import {DtTree} from '@dtwave/uikit'

import {codeInProduct} from '../../../common/util'

import treeUnfold from '../../../icon/tree-unfold.svg'
import treeFold from '../../../icon/tree-fold.svg'
import tag from '../../../icon/new-tag.svg'

import Action from './action'
import ModalCategoryEdit from './modal-category-edit'
import ModalCategoryDetail from './modal-category-detail'
import ModalObjectEdit from './modal-object-edit'
import SelectTag from './drawer-select-tag'
import ModalTagMove from './modal-tag-move'

const {DtTreeNode} = DtTree
const {DtTreeBox} = DtTree
const {confirm} = Modal

@inject('bigStore')
@inject('sceneDetail')
@observer
class TagCategory extends Component {
  constructor(props) {
    super(props)
    this.bigStore = props.bigStore
    this.store = this.bigStore.categoryStore
    this.sceneDetailStore = props.sceneDetail
  }

  componentDidUpdate(prevProps) {
    if (prevProps.getTagList !== this.props.getTagList) {
      this.store.getTagList = this.props.getTagList
    }
  }

  @action.bound onselect(selectedKeys, info) {
    const {tagChange} = this.props
    const {id} = this.bigStore
    // 1. 展开节点
    info.node.onExpand()

    if (id === selectedKeys[0]) return
    // 选择标签id

    this.bigStore.tagId = selectedKeys[0]
    tagChange(selectedKeys[0])
  }

/**
 * 节点类型 type 0 标签 1 类目 2 对象
 */
@action getMenuList = item => {
  // const {history} = this.props
  const addCateKey = {
    key: 'cate',
    value: '添加类目',
    onClick: (key, nodeData) => {
      runInAction(() => {
        this.store.currentTreeItemKey = nodeData.id
        this.store.eStatus.editCategory = false
        this.store.modalVisible.editCategory = true

        this.currSelectCategory = nodeData.id

        // 对象-添加类目; 不请求类目详情
        if (nodeData.type === 2) {
          this.store.cateDetail = {
            fullName: '--',
            id: nodeData.id,
            type: 2, // 0 标签 1 类目 2 对象
          }
        } else {
          // 类目-添加类目; 请求类目详情
          this.store.getCategoryDetail()
        }
      })
    },
  }

  const selectTag = {
    key: 'select',
    value: '选择标签',
    onClick: (key, nodeData) => {
      runInAction(() => {
        this.store.currentTreeItemKey = nodeData.id
        this.store.getSelectTag()
        this.store.modalVisible.selectTag = true
        this.currSelectCategory = nodeData.id
      })
    },
  }

  const editKey = {
    key: 'eidt',
    value: '编辑',
    onClick: (key, nodeData) => {
      runInAction(() => {
        this.store.currentTreeItemKey = nodeData.id

        if (nodeData.type === 1) {
          // 类目
          this.store.eStatus.editCategory = true
          this.store.getCategoryDetail()
          this.store.modalVisible.editCategory = true
          this.currSelectCategory = nodeData.id
        }
      })
    },
  }
  const deleteKey = {
    key: 'delete',
    // 类目为“删除”；其他为“移除”
    value: item.type === 1 ? '删除' : '移除',
    onClick: (key, nodeData) => {
      runInAction(() => {
        this.store.currentTreeItemKey = nodeData.id
        // 删除项为标签 0
        if (!nodeData.type) this.currSelectCategory = nodeData.parentId

        // 删除项为类目；且非一级类目 1
        if (nodeData.type === 1) this.currSelectCategory = nodeData.parentId

        // 节点类型 type 0 标签 1 类目 2 对象
        /* eslint-disable no-nested-ternary */
        const tipStr = nodeData.type === 2 
          ? '所属该场景的全部对象、标签都会被移除，类目会被删除' : (
            nodeData.type === 1 
              ? '所属该类目的子类目会被删除，标签也会被移除' : '该标签会被移除'
          )
        
        confirm({
          title: '确认删除？',
          content: tipStr,
          onOk: () => this.store.deleteNode(nodeData.type, () => {
            // 删除项为标签
            if (!nodeData.type) this.store.currentTreeItemKey = nodeData.parentId

            // 删除项为类目；且非一级类目 1
            if (nodeData.type === 1) this.store.currentTreeItemKey = nodeData.parentId

            // 为了场景的标签数 大费周折
            this.sceneDetailStore.getDetail()
            this.props.tagDel(nodeData.id)
          }),
        })
      })
    },
  }
  const readKey = {
    key: 'read',
    value: '查看详情',
    onClick: (key, nodeData) => {
      runInAction(() => {
        this.store.currentTreeItemKey = nodeData.id
        this.store.getCategoryDetail()
        this.store.modalVisible.readCategory = true
      })
    },
  }

  const actionList = []

  // 添加类目
  if (item.canAddCate) actionList.push(addCateKey)

  // 选择标签
  if (item.canAddTag && codeInProduct('scene:select-tag')) {
    actionList.push(selectTag)
  }

  // 节点类型: type(0 标签 1 类目 2 对象)
  // “类目”节点有【查看详情】
  if (item.type === 1) {
    actionList.push(readKey)
  }

  // 编辑
  if (item.canEdit) {
    actionList.push(editKey)
  }

  // 删除
  if (item.canDelete && codeInProduct('scene:select-tag')) {
    actionList.push(deleteKey)
  }
  
  return actionList
}

getSelectedKeys = () => {
  if (this.bigStore.tagId) return [this.bigStore.tagId]

  if (this.currSelectCategory && this.store.currentTreeItemKey === this.currSelectCategory) {
    return [this.store.currentTreeItemKey]
  }

  return []
}

render() {
  const treeData = toJS(this.store.treeData)
  const getIconNodeSrc = e => (e ? treeUnfold : treeFold)
  const loop = tree => {
    const arr = []
    tree.forEach(item => {
      if (item.children && item.children.length) {
        const dtTreeNodeProps = {
          nodeData: item,
          itemKey: item.id,
          title: (() => {
            if (item.parentId !== 0) return <span>{item.name}</span>
            return (
              <div className="FBH">
                <div className="text-hidden">{item.name}</div>
                <div className="pl4">{`(${item.tagCount || 0})`}</div>
              </div>
            )
          })(),
          actionList: this.getMenuList(item),
          selectable: false,
        }

        if (item.type === 2) { // 对象
          dtTreeNodeProps.showIcon = false
        } else {
          dtTreeNodeProps.showIcon = true
          dtTreeNodeProps.iconNodeSrc = e => getIconNodeSrc(e)
        }
        arr.push(<DtTreeNode {...dtTreeNodeProps}>{loop(item.children)}</DtTreeNode>)
      } else {
        const dtTreeNodeProps = {
          nodeData: item,
          itemKey: item.id,
          title: item.name,
          selectable: item.type === 0,
          actionList: this.getMenuList(item),
        }

        if (item.type === 0) { // 标签
          dtTreeNodeProps.showIcon = true
          dtTreeNodeProps.iconNodeSrc = tag
        } else if (item.type === 1) {
          dtTreeNodeProps.showIcon = true
          dtTreeNodeProps.iconNodeSrc = e => getIconNodeSrc(e)
        } else if (item.type === 2) { // 对象
          dtTreeNodeProps.showIcon = false
        }
        arr.push(<DtTreeNode {...dtTreeNodeProps} />)
      }
    })

    return arr
  }

  const treeBoxProps = {
    defaultWidth: 200,
    style: {minWidth: '200px'},
    titleHeight: 34,
    title: <Action />,
    onDragStart: (e, w) => console.log('onDragStart..', e, w),
    onDraging: (e, w) => console.log('onDraging...', e, w),
    onDragEnd: (e, w) => console.log('onDragEnd...', e, w),
  }

  const treeProps = {
    selectExpand: true,
    defaultExpandAll: this.store.expandAll,
    selectedKeys: this.getSelectedKeys(),
    expandWithParentKeys: this.getSelectedKeys(),
    // expandWithParentKeys: this.bigStore.tagId ? [this.bigStore.tagId] : [],
    type: 'tree',
    onSelect: this.onselect,
    // actionList,
    showIcon: true,
    defaultExpandedKeys: this.store.searchExpandedKeys.slice(),
    showDetail: true,
  }

  return (
    <div className="category-tree">
      <DtTreeBox {...treeBoxProps}>
        {(() => {
          if (this.store.treeLoading) {
            return <div style={{textAlign: 'center', margin: '100px 0'}}><Spin /></div>
          }
          if (!this.store.treeLoading && treeData.length) {
            return (
              <DtTree {...treeProps}>
                {loop(treeData)}
              </DtTree>
            )
          }
        })()}
      </DtTreeBox>
      <ModalCategoryEdit />
      <ModalObjectEdit />
      <SelectTag />
      <ModalTagMove />
      <ModalCategoryDetail />
    </div>
  )
}
}

export default withRouter(TagCategory)
