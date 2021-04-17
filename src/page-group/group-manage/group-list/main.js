/**
 * @description 群体管理
 */
import React, {Component, Fragment} from 'react'
import {Link} from 'react-router-dom'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Popconfirm, Badge, Menu, Button, Dropdown} from 'antd'
import {DownOutlined} from '@ant-design/icons'

import {Time} from '../../../common/util'
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
  }

  formRef = React.createRef()

  menu = record => {
    const {status, mode, type} = record
    // let isClick = false
    // if (status === 1) {
    //   isClick = false
    // } else if (status === 2) {
    //   if (mode === 2 || type === 2) {
    //     isClick = false
    //   } else {
    //     isClick = true
    //   }
    // } else {
    //   isClick = true
    // }
    return (
      <Menu>
        <Menu.Item>
          <a className="fs12" href>复制</a>
        </Menu.Item>
        <Menu.Item>
          <Authority
            authCode="group-manage:export-group"
          >
            <Link target="_blank" to={`/group/manage/unit/${record.id}/${record.lastTime}`}>
              <a className="fs12 c85" href>个体列表</a>
            </Link>
          </Authority>
        </Menu.Item>
      </Menu>
    )
  }
  columns = [
    {
      key: 'name',
      title: '群体名称',
      dataIndex: 'name',
      render: (text, record) => (
        <Link target="_blank" to={`/group/manage/${record.id}/${record.objId}`}>
          {text}
        </Link>
      ),
    }, {
      key: 'lastCount',
      title: '覆盖人数',
      dataIndex: 'lastCount',
    }, 
    {
      key: 'status',
      title: '群体状态',
      dataIndex: 'status',
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
      width: 170,
      render: text => <Time timestamp={text} />,
    }, 
    {
      key: 'cuserName',
      title: '创建人',
      dataIndex: 'cuserName',
    },
    {
      key: 'updateTime',
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 170,
      render: text => <Time timestamp={text} />,
    }, 
    {
      key: 'action',
      title: '操作',
      width: 250,
      dataIndex: 'action',
      render: (text, record) => (
        <div className="FBH FBAC">
          <Authority
            authCode="group-manage:add-group"
          >
            <a className="mr16" disabled={record.status === 2} onClick={() => this.goPerform(record)} href>运行</a>
          </Authority>
          <Authority
            authCode="group-manage:add-group"
          >
            <a className="mr16" disabled={record.status === 2} href onClick={() => this.goGroupEdit(record, 0)}>编辑</a>
          </Authority>

          <Authority
            authCode="group-manage:add-group"
          >
            <a className="mr16" href disabled={record.status === 2} onClick={() => this.goGroupEdit(record, 1)}>复制</a>
          </Authority>
               
          <Authority
            authCode="group-manage:add-group"
          >
            <Popconfirm
              placement="topRight"
              title="你确定要删除该群体吗？"
              disabled={record.status === 2}
              onConfirm={() => store.removeGroup(record.id)}
            >
              <a disabled={record.status === 2} href className="mr16">删除</a>
            </Popconfirm>
          </Authority>

          <Authority
            authCode="group-manage:export-group"
          >
            <Link target="_blank" to={`/group/manage/unit/${record.id}/${record.lastTime}`}>
              <a href>个体列表</a>
            </Link>
          </Authority>
          
          {/* <Dropdown overlay={() => this.menu(record)}>
            <a href>
              更多
              <DownOutlined />
            </a>
          </Dropdown> */}
        </div>
      ),
    },
  ]

  @action openModal = () => {
    window.location.href = `${window.__keeper.pathHrefPrefix}/group/manage/create`
    store.isAdd = true
    // store.visible = true
  }

  @action pushDrawer = () => {
    store.pushDrawerVis = true
  }

  // 群体执行
  goPerform = record => {
    const {mode, type, id} = record
    if (type === 1 && mode === 1) {
      store.performGroup(id)
    }
  }

  // 跳转到群体编辑
  goGroupEdit = (record, isCopy) => {
    store.isAdd = false
    const {id} = record

    window.location.href = `${window.__keeper.pathHrefPrefix}/group/manage/create/${id}/${isCopy}`
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
      buttons: [
        <Authority
          authCode="group-manage:add-group"
        >
          <Button className="mr8" type="primary" onClick={() => this.openModal()}>新建群体</Button>
        </Authority>,
        <Authority
          authCode="group-manage:add-group"
        >
          <Popconfirm
            placement="topRight"
            title="你确定要删除群体吗？"
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
      <div style={{minHeight: 'calc(100vh - 203px)'}}>
        <ListContent {...listConfig} />
      </div>
    )
  }
}
