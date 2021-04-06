/**
 * @description 标签模型 - 标签维护
 */
import {Component, Fragment} from 'react'
import {action, toJS} from 'mobx'
import {observer, Provider} from 'mobx-react'
import {Popconfirm, Button, Table, Menu, Input, Select, Dropdown, Modal} from 'antd'

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

@observer
class TagList extends Component {
  constructor(props) {
    super(props)
    store.objStore = props.bigStore
    store.objId = +props.bigStore.objId

    // store.getTagCateSelectList()
  }

  columns = [{
    key: 'name',
    title: '标签名称',
    dataIndex: 'name',
    fixed: 'left',
    render: (text, record) => <a href onClick={() => this.showDetail(record)}>{text}</a>,
  }, {
    key: 'valueTypeName',
    title: '数据类型',
    dataIndex: 'valueTypeName',
  }, {
    key: 'isEnum',
    title: '是否枚举',
    dataIndex: 'isEnum',
    render: t => (t ? '是' : '否'),
  }, {
    key: 'status',
    title: '状态',
    dataIndex: 'status',
    render: v => tagStatusBadgeMap(+v),
  }, {
    key: 'mtime',
    title: '更新日期',
    dataIndex: 'mtime',
    render: t => moment(+t).format('YYYY-MM-DD'),
  }, 
  {
    key: 'action',
    title: '操作',
    width: 200,
    fixed: 'right',
    render: (text, record) => (
      <div className="FBH FBAC">
        {/* 标签状态: 待配置 未使用  操作: 绑定/编辑/删除 */}
        {record.status === 0 && (
          <Fragment>
            <Authority
              authCode="tag-manage:release-tag"
            >
              <span className="disabled mr16">发布</span>
            </Authority>
            <Authority
              authCode="tag-manage:add-tag"
            >
              <a href confirmLoading={store.confirmLoading} onClick={() => store.openTagConfig('one', record)} className="mr16">配置</a>
            </Authority>
            <Authority
              authCode="tag-manage:add-tag"
            >
              <a href confirmLoading={store.confirmLoading} onClick={() => store.openDrawer('edit', record)} className="mr16">编辑</a>
            </Authority>
            {/* <a href onClick={() => store.openModal(record)} className="mr16">移动</a> */}
            <Authority
              authCode="tag-manage:add-tag"
            >
              <Popconfirm 
                placement="topRight" 
                title="标签被删除后不可恢复，确定删除？" 
                okText="确定"
                cancelText="取消"
                confirmLoading={store.confirmLoading}
                onConfirm={() => this.remove(record)}
              >
                <a href>删除</a>
              </Popconfirm>
            </Authority>
          </Fragment>
        )}

        {/* 标签状态: 待发布 未使用  操作: 发布/绑定/编辑/删除 */}
        {record.status === 1 && (
          <Fragment>
            <Authority
              authCode="tag-manage:release-tag"
            >
              <Popconfirm
                placement="topRight"
                title="确认发布？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => store.updateTagStatus({
                  status: 2,
                  tagIdList: [record.id],
                }, treeStore.getList)}
              >
                <a className="mr16" href>发布</a>
              </Popconfirm>
            </Authority>
            <Authority
              authCode="tag-manage:add-tag"
            >
              <a href onClick={() => store.openTagConfig('one', record)} className="mr16">配置</a>
            </Authority>
            <Authority
              authCode="tag-manage:add-tag"
            >
              <span className="disabled mr16">编辑</span>
            </Authority>
            <Authority
              authCode="tag-manage:add-tag"
            >
              <Popconfirm 
                placement="topRight" 
                title="标签被删除后不可恢复，确定删除？" 
                okText="确定"
                cancelText="取消"
                onConfirm={() => this.remove(record)}
              >
                <a href>删除</a>
              </Popconfirm>
            </Authority>
          </Fragment>
        )}

        {/* 标签状态: 已发布 未使用 下架  操作: 取消发布/上架申请 */}
        {/* {record.status === 2 && record.isUsed === 0 && record.publish === 0 && ( */}
        {record.status === 2 && (
          <Fragment>
            <Authority
              authCode="tag-manage:release-tag"
            >
              <Popconfirm
                placement="topRight"
                title="确认取消发布？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => store.updateTagStatus({
                  status: 1,
                  tagIdList: [record.id],
                }, treeStore.getList)}
              >
                <a href>下线</a>
              </Popconfirm>
            </Authority>
            <Authority
              authCode="tag-manage:add-tag"
            >
              <span className="disabled ml16">配置</span>
            </Authority>
            <Authority
              authCode="tag-manage:add-tag"
            >
              <span className="disabled ml16">编辑</span>
            </Authority>
            <Authority
              authCode="tag-manage:add-tag"
            >
              <span className="disabled ml16">删除</span>
            </Authority>
          </Fragment>
        )}

        {/* 标签状态: 已发布 已使用 */}
        {record.status === 2
          && record.isUsed === 1
          && (
            <Fragment>
              <Authority
                authCode="tag-manage:release-tag"
              >
                <span className="disabled">下线</span>
              </Authority>
              <Authority
                authCode="tag-manage:add-tag"
              >
                <span className="disabled ml16">配置</span>
              </Authority>
              <Authority
                authCode="tag-manage:add-tag"
              >
                <span className="disabled ml16">编辑</span>
              </Authority>
              <Authority
                authCode="tag-manage:add-tag"
              >
                <span className="disabled ml16">删除</span>
              </Authority>
            </Fragment>
            
          )} 
      </div>
    ),
  }]

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
    store.getTagDetail({id: data.id})
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
      rowSelection: rowSelection || null,
      columns: this.columns,
      initParams: {objId, cateId: treeStore.currentSelectKeys},
      scroll: {x: 960},
      tableLoading: treeStore.tableLoading,
      buttons: [
        <div className="dfjs">
          <div>
            <Authority
              authCode="tag-manage:add-tag"
            >
              <Button type="primary" className="mr8" onClick={() => store.openDrawer('add')}>新建标签</Button>
            </Authority>
            <Authority
              authCode="tag-manage:release-tag"
            >
              <Button 
                className="fs12 mr8" 
                disabled={!publishRowKeys.length} 
                onClick={() => store.batchPublish(treeStore.getList)}
              >
                批量发布
              </Button>
            </Authority>
            <Authority
              authCode="tag-manage:add-tag"
            >
              <Button className="fs12 mr8" disabled={!publishRowKeys.length} onClick={() => store.openModal()}>批量移动</Button>
            </Authority>
            {/* <Popconfirm
              placement="topRight"
              title="确认取消发布？"
              okText="确定"
              cancelText="取消"
              disabled={!publishRowKeys.length}
              onConfirm={() => store.updateTagStatus({
                status: 1,
                tagIdList: store.publishRowKeys,
              }, treeStore.getList)}
            >
              <Button className="mr8" disabled={!publishRowKeys.length}>批量下线</Button>
            </Popconfirm>
            <Popconfirm 
              placement="topRight" 
              title="标签被删除后不可恢复，确定删除？" 
              okText="确定"
              cancelText="取消"
              disabled={!publishRowKeys.length}
              onConfirm={() => this.remove(store.publishRowKeys)}
            >
              <Button size="small" className="mr8" disabled={!publishRowKeys.length}>批量删除</Button>
            </Popconfirm> */}
            <Dropdown overlay={() => this.menu(publishRowKeys)} placement="bottomCenter">
              <Button>更多操作</Button>
            </Dropdown>
          </div>
          <div>
            <Select 
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
            </Select>
            <Input 
              style={{width: 128, marginRight: '24px'}} 
              placeholder="请输入标签名称" 
              onChange={v => {
                treeStore.keyword = v.target.value
                treeStore.getList({currentPage: 1})
              }}
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
          <div className="d-flex h-100 tag-model">
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
