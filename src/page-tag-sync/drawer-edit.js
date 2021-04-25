/**
 * @description 编辑同步计划
 */
import {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {action, observable} from 'mobx'
import {Drawer, Button} from 'antd'
import List from './drawer-edit-list'
import Tree from './drawer-edit-tree'

import store from './store-drawer-edit'

@inject('bigStore')
@observer
export default class DrawerEditSync extends Component {
  constructor(props) {
    super(props)
    this.bigStore = props.bigStore
    store.projectId = props.projectId
  }
  
  @observable listRemoveItem
  @observable listRemoveAll // 全部清空列表数据

  componentWillReceiveProps(next) {
    const {visible} = this.props

    if (visible !== next.visible && next.visible) {
      const {selectItem} = this.bigStore
      const params = {
        objId: selectItem.objId,
        storageId: selectItem.objId, 
        schemeId: selectItem.id,
      }
      store.objId = selectItem.objId
      store.storageId = selectItem.storageId
      store.schemeId = selectItem.id

      store.getTagTree(params)
    }
  }

  @action.bound rightToTable(tagData) {
    const nextKeys = tagData.map(d => d.id)
    const keys = store.tableData.map(d => d.id)

    if (!_.isEqual(nextKeys, keys)) {
      const addArr = []

      nextKeys.forEach((d, i) => {
        if (!keys.includes(d)) {
          addArr.push(tagData[i])
        }
      })  
      store.tableData = store.tableData.concat(addArr)  
    } 
  }

  @action.bound removeList(item) {
    store.tableData = store.tableData.filter(d => +d.id !== +item.id)
    this.listRemoveItem = item
  }

  @action.bound removeListAll(d) {
    const {majorTagList} = this.store
    this.listRemoveAll = d
    store.tableData.replace(majorTagList)
  }

  @action.bound handleSubmit() {
    const {selectItem} = this.bigStore
    const {tableData} = store
    const t = this

    const mainTagMappingKeys = tableData.filter(d => d.isMajor).map(s => ({
      tagId: s.aid,
      columnName: s.columnName || s.enName, 
      columnType: s.columnType,
    }))

    const source = tableData.filter(d => !d.isMajor).map(s => ({
      tagId: s.aid,
      columnName: s.columnName || s.enName, 
      columnType: s.columnType,
    }))
    const params = {
      id: selectItem.id,
      mainTagMappingKeys,
      source,
    }
    store.editSync(params, () => {
      t.bigStore.visibleEdit = false
      t.bigStore.getList({currentPage: 1})
    })
  }

  @action.bound closeDrawer() {
    store.destroy()
    this.bigStore.visibleEdit = false
  }

  render() {
    const {visible} = this.props
    const {confirmLoading} = store

    const drawerConfig = {
      title: '编辑同步计划',
      visible,
      closable: true,
      width: 1120,
      maskClosable: false,
      destroyOnClose: true,
      onClose: this.closeDrawer,
      className: 'add-sync',
    }

    const treeConfig = {
      listRemoveAll: this.listRemoveAll,
      listRemoveItem: this.listRemoveItem,
      rightToTable: this.rightToTable,
      store,
    }

    const listConfig = {
      removeAll: this.removeListAll,
      remove: this.removeList,
      store,
    }

    return (
      <Drawer
        {...drawerConfig}
      >
        <div className="edit-sync">
          <Tree {...treeConfig} />
          <List {...listConfig} />
        </div>
        <div className="bottom-button">
          <Button style={{marginRight: 8}} onClick={() => this.closeDrawer()}>关闭</Button>
          <Button
            type="primary"
            style={{marginRight: 8}}
            onClick={this.handleSubmit}
            loading={confirmLoading}
          >
            确定
          </Button>
        </div>
      </Drawer>
    )
  }
}
