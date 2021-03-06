/**
 * @description 客群管理
 */
import React, {Component, Fragment} from 'react'
import {Link} from 'react-router-dom'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Popconfirm, Badge, Menu, Button, Dropdown} from 'antd'
import {DownOutlined} from '@ant-design/icons'

import {codeInProduct, Time} from '../../../common/util'
import {
  ListContent, Authority,
} from '../../../component'

import search from './search'
// import ModalGroup from './modal'
// import IdCreate from './id-create'
import store from './store'

@observer
export default class GroupList extends Component {
  constructor(props) {
    super(props)
    store.projectId = 1

    store.searchParams = {}
    store.getEntityList()
    store.getUserList()
  }

  formRef = React.createRef()

  menu = record => {
    return (
      <Menu>
        <Menu.Item>
          <a className="fs14" href>复制</a>
        </Menu.Item>
        <Menu.Item>
          <Authority
            authCode="group-manage:export-group"
          >
            <Link target="_blank" to={`/group/manage/unit/${record.id}/${record.lastTime}`}>
              <a className="fs14 c85" href>个体列表</a>
            </Link>
          </Authority>
        </Menu.Item>
      </Menu>
    )
  }
  columns = [
    {
      key: 'name',
      title: '客群名称',
      dataIndex: 'name',
      width: 200,
      render: (text, record) => (codeInProduct('/group/manage/detail/:id/:objId') ? (
        <Link target="_blank" to={`/group/manage/detail/${record.id}/${record.objId}`}>
          {text}
        </Link>
      ) : text),
    }, {
      key: 'lastCount',
      title: '覆盖人数',
      width: 100,
      dataIndex: 'lastCount',
    }, 
    {
      key: 'status',
      title: '客群状态',
      dataIndex: 'status',
      width: 100,
      render: v => {
        if (v === 1) {
          return (<Badge color="green" text="正常" />)
        } if (v === 2) {
          return (<Badge color="red" text="失败" />)
        }
        return (<Badge color="blue" text="计算中" />)
      },
    }, 
    {
      key: 'lastTime',
      title: '创建时间',
      dataIndex: 'lastTime',
      width: 200,
      render: text => <Time timestamp={text} />,
    }, 
    {
      key: 'cuserName',
      title: '创建人',
      dataIndex: 'cuserName',
      width: 140,
    },
    {
      key: 'updateTime',
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 200,
      render: text => <Time timestamp={text} />,
    }, 
    {
      key: 'action',
      title: '操作',
      width: 180,
      fixed: 'right',
      dataIndex: 'action',
      render: (text, record) => (
        <div className="FBH FBAC">
          <Authority
            authCode="/group/manage/create/group/:groupId?/:isCopy?"
          >
            <a className="mr16" disabled={record.status === 2} href onClick={() => this.goGroupEdit(record, 0)}>编辑</a>
            <a className="mr16" href disabled={record.status === 2} onClick={() => this.goGroupEdit(record, 1)}>复制</a>
            <Popconfirm
              placement="topRight"
              title="你确定要删除该客群吗？"
              disabled={record.status === 2}
              onConfirm={() => store.removeGroup(record.id)}
            >
              <a disabled={record.status === 2} href className="mr16">删除</a>
            </Popconfirm>
          </Authority>
        </div>
      ),
    },
  ]

  @action openModal = () => {
    window.location.href = `${window.__keeper.pathHrefPrefix}/group/manage/create/group`
    store.isAdd = true
    // store.visible = true
  }

  @action pushDrawer = () => {
    store.pushDrawerVis = true
  }

  // 客群执行
  goPerform = record => {
    const {mode, type, id} = record
    if (type === 1 && mode === 1) {
      store.performGroup(id)
    }
  }

  // 跳转到客群编辑
  goGroupEdit = (record, isCopy) => {
    store.isAdd = false
    const {id} = record

    window.location.href = `${window.__keeper.pathHrefPrefix}/group/manage/create/group/${id}/${isCopy}`
  }

  // 列表请求前搜索参数处理
  // values 搜索内容
  beforeSearch = values => {
    if (values.time) {
      values.startTime = values.time[0].format('YYYY-MM-DD')
      values.endTime = values.time[1].format('YYYY-MM-DD')
      delete values.time
    }
    return values
  }

  @action.bound onTableCheck(selectedRowKeys, selectedRows) {
    // 表格 - 已选项
    // store.rowKeys = selectedRows
    store.selectedRows = selectedRowKeys
  }

  render() {
    const {selectedRows, removeGroupList} = store
    const rowSelection = {
      selectedRowKeys: selectedRows.slice(),
      onChange: this.onTableCheck,
    }
    const listConfig = {
      columns: this.columns,
      searchParams: search(store),
      beforeSearch: this.beforeSearch,
      scroll: {x: 960},
      buttons: [
        <Authority
          authCode="/group/manage/create/group/:groupId?/:isCopy?"
        >
          <Button className="mr8" type="primary" onClick={() => this.openModal()}>新建客群</Button>
        </Authority>,
        <Authority
          authCode="/group/manage/create/group/:groupId?/:isCopy?"
        >
          <Popconfirm
            placement="topRight"
            title="你确定要删除客群吗？"
            disabled={selectedRows.length === 0}
            onConfirm={removeGroupList}
          >
            <Button disabled={selectedRows.length === 0}>批量删除</Button>
          </Popconfirm>
        </Authority>,
      ],
      rowKey: 'id',
      rowSelection,
      // initGetDataByParent: true, // 初始请求 在父层组件处理。列表组件componentWillMount内不再进行请求
      store, // 必填属性
    }

    return (
      <div className="custom-border h-100 oa">
        <ListContent {...listConfig} />
      </div>
    )
  }
}
