/**
 * @description 标签模型 - 标签维护
 */
import {Component, Fragment} from 'react'
import {action, toJS, observable} from 'mobx'
import {observer, Provider} from 'mobx-react'
import {Popconfirm, Button, Table, Menu, Input, Select, Dropdown, Modal, Drawer, Cascader} from 'antd'

import {
  ListContent, OmitTooltip, Authority,
} from '../../../component'
import {
  tagStatusBadgeMap,
} from '../util'

import ModalTagMove from './modal-tag-move'
import DrawerCreate from './drawer-create'
import DrawerTagConfig from '../tag-config'
import TagCateTree from './tree'
import TagDetailModal from './tag-detail'
import store from './store'
import treeStore from './store-tree'

const {Option} = Select
const {Search} = Input

@observer
class TagList extends Component {
  constructor(props) {
    super(props)
    store.objStore = props.bigStore
    store.objId = +props.bigStore.objId

    // store.getTagCateSelectList()
    store.getBizList()
  }

  columns = [{
    key: 'name',
    title: '标签名称',
    dataIndex: 'name',
    render: (text, record) => <a href onClick={() => this.showDetail(record)}>{text}</a>,
  }, {
    dataIndex: 'bizText',
    title: '业务类型',
  }, {
    dataIndex: 'nonNullCnt',
    title: '覆盖个体数',
  }, {
    dataIndex: 'nonNullRadio',
    title: '个体覆盖率',
  },
  // {
  //   key: 'isEnum',
  //   title: '是否枚举',
  //   dataIndex: 'isEnum',
  //   render: t => (t ? '是' : '否'),
  // }, {
  //   key: 'status',
  //   title: '状态',
  //   dataIndex: 'status',
  //   render: v => tagStatusBadgeMap(+v),
  // }, 
  // {
  //   key: 'mtime',
  //   title: '更新日期',
  //   dataIndex: 'mtime',
  //   render: t => moment(+t).format('YYYY-MM-DD'),
  // }, 
  {
    title: '更新日期',
    dataIndex: 'createDate',
  },
  ]

  @action.bound remove(data) {
    if (data.id) {
      data = [data.id]
    } else {
      store.publishRowKeys = []
    }
    store.deleteTag({
      deleteIds: data,
    }, treeStore.getTagCateTree)
  }

  @action.bound showDetail(data) {
    store.detailVisible = true
    store.getTagCateSelectList()
    store.getTagDetail({tagId: data.id}, data)
  }

  @action.bound cancelTagConfig(data) {
    store.cancelTagConfig({
      tagId: data.id,
      configType: data.configType,
    })
  }

  componentWillMount() {
    if (store.objId) {
      // store.getAuthCode()
      this.initData()
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.objId !== this.props.objId) {
      store.objId = +this.props.objId
      treeStore.objId = +this.props.objId
      treeStore.currentSelectKeys = null

      treeStore.getTagCateTree()
      store.getTagCateSelectList()
    }
  }

  // 初始化数据，一般情况不需要，此项目存在项目空间中项目的切换，全局性更新，较为特殊
  @action initData() {
    store.list && store.list.clear()
    store.pagination = {
      pageSize: 10,
      currentPage: 1,
    }
  }

  @action.bound onTableCheck(selectedRowKeys) {
    // 表格 - 已选项key数组
    store.publishRowKeys = selectedRowKeys
  }


  // 是否有进行搜索操作
  isSearch = () => {
    const {
      searchParams,
    } = store

    if (
      JSON.stringify(searchParams) === '{}'
    ) {
      return false
    }
    return true
  }

  @action.bound changeTable = pagination => {
    this.store.tagList.currentPage = pagination.current

    this.store.getTagList({
      keyword: this.store.keyword,
      currentPage: pagination.current,
      pageSize: this.store.tagList.pageSize,
      cateId: this.store.currentSelectKeys,
    })
  }

  menu = keys => (
    <Menu style={{textAlign: 'center'}}>
      <Menu.Item disabled={!keys.length}>
        <Authority
          authCode="tag-manage:release-tag"
        >
          <a 
            className="fs12" 
            disabled={!keys.length} 
            onClick={() => store.updateTagStatus({
              status: 1,
              tagIdList: store.publishRowKeys,
            }, treeStore.getList)}
          >
            批量下线
          </a>
        </Authority>
      </Menu.Item>
      <Menu.Item disabled={!keys.length}>
        <Authority
          authCode="tag-manage:add-tag"
        >
          <a className="fs12" disabled={!keys.length} onClick={() => this.remove(store.publishRowKeys)}>批量删除</a>
        </Authority>
      </Menu.Item>
    </Menu>
  )

  render() {
    const {
      objId,
      drawerTagConfigInfo,
      drawerTagConfigVisible,
      closeTagConfig,
      updateTagConfig,
      drawerTagConfigType,
      publishRowKeys,
      bizList,
    } = store

    const rowSelection = {
      selectedRowKeys: publishRowKeys.slice(),
      onChange: this.onTableCheck,
      getCheckboxProps: record => ({
        // disabled: record.status !== 1, // 权限审批中的，不可进行申请、批量申请，且显示审批中
      }),
    }

    const listConfig = {
      key: 'id',
      rowKey: 'id',
      columns: this.columns,
      initParams: {objId, cateId: treeStore.currentSelectKeys},
      tableLoading: treeStore.tableLoading,
      buttons: [
        <div className="FBH FBJB">
          <div>
            <Cascader 
              options={bizList} 
              style={{width: 150}} 
              placeholder="业务类型" 
              expandTrigger="hover"
              changeOnSelect
              onChange={e => {
                if (e.length !== 0) {
                  treeStore.searchParams.biz = e[e.length - 1]
                  treeStore.biz = e[e.length - 1]
                } else {
                  treeStore.searchParams.biz = undefined
                  treeStore.biz = undefined
                }
                treeStore.getList({
                  currentPage: 1,
                  biz: treeStore.biz,
                })
              }}
            />
          </div>
          <div>
            {/* <Select 
              style={{width: 128, marginRight: '8px'}} 
              placeholder="请选择标签状态"
              defaultValue=""
              onChange={v => {
                treeStore.status = v
                treeStore.getList({currentPage: 1})
              }}
            >
              <Option style={{fontSize: '12px'}} value="">全部</Option>
              <Option style={{fontSize: '12px'}} value={0}>待配置</Option>
              <Option style={{fontSize: '12px'}} value={1}>待发布</Option>
              <Option style={{fontSize: '12px'}} value={2}>已发布</Option>
            </Select> */}
            <Search
              style={{width: 150, marginRight: '24px'}} 
              placeholder="请输入标签名称" 
              onChange={v => {
                treeStore.searchParams.searchKey = v.target.value
                treeStore.searchKey = v.target.value
                treeStore.getList({
                  currentPage: 1,
                  searchKey: v.target.value,
                })
              }}
              allowClear
              // onChange={v => debounce(() => treeStore.getList({keyword: v.target.value}))}
            /> 
          </div>
        </div>,
      ],
      initGetDataByParent: true, // 初始请求 在父层组件处理。列表组件componentWillMount内不再进行请求
      store: treeStore, // 必填属性
    }

    return (
      <Provider bigStore={store}>
        <div className="h-100">
          <div className="d-flex h-100 tag-model pt16" style={{minHeight: 'calc(100vh - 303px)'}}>
            <TagCateTree bigStore={store} store={treeStore} />
            <ListContent {...listConfig} />
          </div>
          <TagDetailModal store={store} />
          <ModalTagMove store={store} treeStore={treeStore} />
          <DrawerCreate store={store} treeStore={treeStore} />
          <DrawerTagConfig
            objId={store.objId}
            treeStore={treeStore}
            visible={drawerTagConfigVisible}
            info={drawerTagConfigInfo}
            onClose={closeTagConfig}
            onUpdate={updateTagConfig}
            type={drawerTagConfigType}
          />
        </div>
      </Provider>
    )
  }
}

export default TagList
