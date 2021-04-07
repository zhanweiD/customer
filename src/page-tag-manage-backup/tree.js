/**
 * @description 标签体系-标签树
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {DtTree} from '@dtwave/uikit'
import {action, toJS} from 'mobx'
import {ConfigProvider, Modal, Dropdown, Menu, Button} from 'antd'
import {Loading} from '../component'
import {codeInProduct} from '../common/util'
import Action from './tree-action'
import AddObject from './tree-drawer-object'

const {DtTreeNode, DtTreeBox} = DtTree
const {confirm} = Modal
@observer
export default class Tree extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  /**
   * @description 打开 (类目/对象) 新增编辑弹窗
   */
  @action.bound openModal(key, data) {
    this.store.visible = true
    this.store.isAdd = false
    this.store.editType = key
    this.store.detail = data
  }

  @action.bound deleteNode(key, data) {
    const t = this

    confirm({
      title: '删除对象',
      content: '对象被删除后不可恢复，确定删除？',
      cancelText: '取消',
      okText: '确认',
      confirmLoading: this.store.confirmLoading,
      onOk: () => {
        this.store.delNode(data.id, () => {
          // 1. 删除节点为当前选中节点
          if (this.store.selectedKey === data.id) {
            this.store.selectedKey = undefined
            // 2. 刷新类目树
            this.store.getTreeData()
          } else {
            // 删除节点非当前选中节点
            // 1. 刷新类目树
            this.store.getTreeData()
          }
        })
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }


  categoryMenus = node => { 
    return codeInProduct('tag-manage:add-object') ? [
    // {key: 'add', value: '新建对象', onClick: (key, data) => this.openModal(key, data, 'category')},
    // {
    //   key: 'edit', 
    //   value: '编辑',
    //   onClick: (key, data) => this.openModal(key, data),
    // },
      {
        key: 'delete',
        value: '删除',
        disabled: node.tag,
        onClick: (key, data) => this.deleteNode(key, data),
      },
    ] : [] 
  }
  proMenu = data => (
    <Menu>
      <Menu.Item onClick={() => this.deleteNode(data)} key="1">删除</Menu.Item>
    </Menu>
  )

  // 递归遍历树节点
  processNodeData = data => {
    if (!data) return null
    return data.map(node => (
      <DtTreeNode
        key={node.id}
        itemKey={node.id}
        title={node.name}
        // title={`${node.name}(${node.tag})`}
        // 对象类目只有一级
        actionList={this.categoryMenus(node)}
        nodeData={node}
      />
      // <div style={{width: '76px', padding: '16px 16px 0px'}}>
      //   <Dropdown.Button onClick={() => this.onselect(node)} overlay={() => this.proMenu(node)}>
      //     <span style={{width: '51px'}}>{node.name}</span>
      //   </Dropdown.Button>
      // </div>
    ))
  }

  // 新建
  @action.bound addTree() {
    this.store.detail = {}
    this.store.isAdd = true
    this.store.visible = true
  }

  // @action onselect = data => {
  //   console.log(toJS(data))
  //   this.store.selectedKey = data.id
  //   this.store.objId = data.id
  //   console.log(this.store.objId)
  //   this.store.getObjDetail()
  // }
  @action onselect = (selectedKey, e) => {
    this.store.selectedKey = selectedKey[0]
    this.store.objId = selectedKey[0]
    this.store.getObjDetail()
  }

  render() {
    const {
      expandAll,
      treeLoading,
      objTreeData,
      selectedKey,
    } = this.store

    const treeBoxConfig = {
      titleHeight: 40,
      title: <Action store={this.store} />,
      defaultWidth: 140,
      style: {width: '140px'},
    }

    const treeConfig = {
      type: 'tree',
      selectExpand: true,
      onSelect: this.onselect,
      defaultExpandAll: expandAll,
      selectedKeys: selectedKey ? [selectedKey] : [],
      expandWithParentKeys: selectedKey ? [selectedKey] : [],
      showDetail: true,
      rightClickMenuAble: true,
    }
    return (
      <ConfigProvider size="small">
        {/* <div style={{width: '140px', margin: '16px 0px 12px 16px', backgroundColor: '#fff'}}> 
          <Button style={{margin: '16px 16px 0px', width: '108px'}} type="primary" onClick={this.addTree}>
            新建
          </Button>
          {
            this.processNodeData(objTreeData)
          }
          </div>
        <AddObject store={this.store} /> */}
        <div className="objtree mt16">
          <DtTreeBox {...treeBoxConfig}>
            {treeLoading
              ? <Loading mode="block" height={100} />
              : (
                <DtTree {...treeConfig}>
                  {
                    this.processNodeData(objTreeData)
                  }
                </DtTree>
              )
            }
          </DtTreeBox>
        </div>
      </ConfigProvider>
    )
  }
}
