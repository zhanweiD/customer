/**
 * @description 用户管理
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {action, toJS} from 'mobx'
import {Button, Input, Modal} from 'antd'
import {changeToOptions, debounce} from '../../common/util'
import {
  OmitTooltip,
  ListContent,
  ModalForm,
  Authority,
  AuthView,
} from '../../component'

import store from './store'
import Tree from './tree'
import UserDetail from './user-detail'
import DataDrawer from './data-drawer'

@observer
class UserManage extends Component {
  constructor(props) {
    super(props)
    store.getTreeList()
    store.getRoleList()
  }

  columns = [{
    key: 'userName',
    title: '姓名',
    dataIndex: 'userName',
    render: (text, record) => <a onClick={() => this.showDetail(record)}>{text}</a>,
  }, {
    key: 'userAccount',
    title: '用户名',
    dataIndex: 'userAccount',
  }, {
    key: 'roles',
    title: '角色',
    dataIndex: 'roles',
    render: t => {
      const names = t.map(item => item.name)
      return <OmitTooltip maxWidth={300} text={names.join(',')} />
    },
  }, {
    key: 'userPhone',
    title: '手机号',
    dataIndex: 'userPhone',
  }, {
    key: 'userEmail',
    title: '邮箱',
    dataIndex: 'userEmail',
    render: t => (t || '-'),
  }, {
    key: 'hireTime',
    title: '添加时间',
    dataIndex: 'hireTime',
    // render: t => t ? moment(+t).format('YYYY-MM-DD') || '-',
  }, {
    key: 'action',
    title: '操作',
    render: (text, record) => (
      <div className="FBH FBAC">
        <Authority
          authCode="system:user-manage:authorization-func"
        >
          <a href onClick={() => this.openModal(record)} className="mr16">功能授权</a>
        </Authority>
        <Authority
          authCode="system:user-manage:authorization-data"
        >
          <a href onClick={() => this.openDrawer(record)}>数据授权</a>
        </Authority>
      </div>
    ),
  }]

  @action showDetail = record => {
    store.nowRecord = record
    store.detailVisible = true
  }

  selectContent = () => {
    const {roles = undefined} = store.nowRecord
    return [{
      label: '角色',
      key: 'roles',
      initialValue: roles ? roles.map(item => item.id) : undefined,
      component: 'select',
      mode: 'multiple',
      rules: [
        '@requiredSelect',
      ],
      control: {
        options: changeToOptions(store.roleList)('name', 'id'),
      },
    }]
  }

  @action.bound onTableCheck(selectedRowKeys) {
    // 表格 - 已选项key数组
    store.publishRowKeys = selectedRowKeys
  }

  @action openModal = record => {
    if (record) {
      store.nowRecord = record
      store.userIdList = [record.id]
    } else {
      store.nowRecord = {}
      store.userIdList = store.publishRowKeys
    }
    store.visible = true
  }

  @action openDrawer = record => {
    store.userAcc = record.userAccount
    store.drawerVisible = true
    store.dataDetail()
  }

  @action closeModal = () => {
    store.visible = false
  }
  @action searchUser = v => {
    const searchKey = v.target.value
    debounce(() => store.getList(searchKey))
  }

  @action submit = () => {
    this.form.validateFields((err, value) => {
      if (!err) {
        const userRoles = store.userIdList.map(item => {
          return {id: item, roleIds: value.roles}
        })
        store.updateRole(
          userRoles, 
          () => {
            this.closeModal()
            store.getList()
          }
        )
      }
    })
  }

  render() {
    const {visible, confirmLoading, searchKeys, tableLoading, publishRowKeys, drawerVisible} = store
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
      initParams: {orgId: searchKeys},
      tableLoading,
      scroll: {x: 960},
      buttons: [
        <div className="dfjs">
          <div>
            <Authority
              authCode="system:user-manage:authorization-func"
            >
              <Button type="primary" disabled={!publishRowKeys.length} className="mr8" onClick={() => this.openModal()}>批量功能授权</Button>
            </Authority>
          </div>
          <div>
            <Input 
              size="small"
              style={{width: 160, marginRight: '24px'}} 
              placeholder="请输入用户名称" 
              onChange={this.searchUser}
              // onChange={v => store.getList(v.target.value)}
            /> 
          </div>
        </div>,   
      ],
      initGetDataByParent: true, // 初始请求 在父层组件处理。列表组件componentWillMount内不再进行请求
      store, // 必填属性
    }
    const modalConfig = {
      width: 525,
      title: '用户授权',
      visible,
      confirmLoading,
      destroyOnClose: true,
      maskClosable: false,
      onCancel: () => this.closeModal(),
      onOk: this.submit,
      okText: '确定',
      cancelText: '取消',
    }

    const formConfig = {
      selectContent: this.selectContent(),
      wrappedComponentRef: form => { this.form = form ? form.props.form : form },
    }

    return (
      <div className="system-user oa">
        <div className="content-header">用户管理</div> 
        <div className="d-flex user-manage">
          <Tree store={store} />
          <ListContent {...listConfig} />
        </div>
        <Modal {...modalConfig}>
          <ModalForm {...formConfig} />
        </Modal>
        <UserDetail store={store} /> 
        <DataDrawer store={store} />
      </div>
    )
  }
}

export default AuthView(UserManage)
