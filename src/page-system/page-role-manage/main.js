/**
 * @description 角色管理
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {Button, Input, Popconfirm} from 'antd'
import {
  OmitTooltip,
  ListContent,
  Authority,
  authView,
} from '../../component'
import {debounce} from '../../common/util'

import store from './store'
import AddDrawer from './add-drawer'

@observer
class GroupConfig extends Component {
  columns = [{
    key: 'name',
    title: '角色名称',
    dataIndex: 'name',
    render: (text, record) => <a href onClick={() => this.openDrawer(2, record)}>{text}</a>,
  }, {
    key: 'description',
    title: '描述',
    dataIndex: 'description',
    render: t => (t ? <OmitTooltip maxWidth={200} text={t} /> : '-'),
  }, {
    key: 'createTime',
    title: '创建日期',
    dataIndex: 'createTime',
    render: t => moment(+t).format('YYYY-MM-DD'),
  }, {
    key: 'action',
    title: '操作',
    width: 200,
    render: (text, record) => (
      <div className="FBH FBAC">
        <Authority
          authCode="system:role-manage:add"
        >
          <a href onClick={() => this.openDrawer(1, record)} className="mr16">编辑</a>
        </Authority>
        <Authority
          authCode="system:role-manage:add"
        >
          <a href onClick={() => this.openDrawer(3, record)} className="mr16">复制</a>
        </Authority>
        <Authority
          authCode="system:role-manage:add"
        >
          <Popconfirm title="你确定要删除该角色吗？" okText="确定" cancelText="取消" onConfirm={() => this.delRole(record)}>
            <a href disabled={record.isUsed} className="mr16">删除</a>
          </Popconfirm>
        </Authority>
      </div>
    ),
  }]

  @action delRole = params => {
    let ids = []
    if (params.id) {
      ids.push(params.id)
    } else {
      ids = params
    }
    store.delRole(ids)
  }

  @action openDrawer = (v, record) => {
    // 0新增 1编辑 2详情 3复制
    store.roleStatus = v
    if (v === 3) {
      store.roleId = null
      store.getPerm(() => store.getInfoRole(record.id))
    } else if (v !== 0) {
      store.roleId = record.id
      store.getPerm(() => store.getInfoRole(record.id))
    } else {
      store.roleId = null
      store.infoRole = {}
      store.menuCheckedKeys = []
      store.dataCheckedKeys = []
      store.getPerm(() => store.drawerVisible = true)
    }
  }

  @action searchRole = v => {
    const params = {searchKey: v.target.value}
    debounce(() => store.getList(params))
  }

  @action.bound onTableCheck(selectedRowKeys) {
    // 表格 - 已选项key数组
    store.publishRowKeys = selectedRowKeys
  }

  render() {
    const {publishRowKeys, objId, tableLoading} = store
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
      tableLoading,
      scroll: {x: 960},
      buttons: [
        <div className="dfjs">
          <div>
            <Authority
              authCode="system:role-manage:add"
            >
              <Button type="primary" className="mr8" onClick={() => this.openDrawer(0)}>新增角色</Button>
            </Authority>
            <Authority
              authCode="system:role-manage:add"
            >
              <Popconfirm title="你确定要删除该角色吗？" disabled={!publishRowKeys.length} okText="确定" cancelText="取消" onConfirm={() => this.delRole(publishRowKeys)}>
                <Button disabled={!publishRowKeys.length} className="mr8">{`批量删除(${publishRowKeys.length})`}</Button>
              </Popconfirm>
            </Authority>
          </div>
          <div>
            <Input 
              style={{width: 160, marginRight: '8px'}} 
              placeholder="请输入角色名称" 
              // onChange={v => store.getList({searchKey: v.target.value})}
              onChange={this.searchRole}
            /> 
          </div>
        </div>,     
      ],
      store, // 必填属性
    }

    return (
      <div className="oa FBV">
        <div className="content-header">角色管理</div> 
        <div className="user-manage FB1 custom-border m12 pt12">
          <ListContent {...listConfig} />
        </div>
        {store.drawerVisible ? <AddDrawer store={store} /> : null}
        {/* <AddDrawer store={store} /> */}
      </div>
    )
  }
}

export default authView(GroupConfig)
