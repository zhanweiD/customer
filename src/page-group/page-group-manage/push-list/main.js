/**
 * @description 推出列表
 */
import {Component} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {Button, Badge, Tooltip, Popconfirm} from 'antd'
import {
  ListContent, Authority,
} from '../../../component'
import search from './search'
import PushDrawer from './push-drawer'
import store from './store'
import './main.styl'

@observer
export default class PushList extends Component {
  componentDidMount() {
    store.getGroupList()
    store.getStorages()
  }
  columns = [{
    key: 'name',
    title: '应用名称',
    dataIndex: 'name',
  }, 
  {
    key: 'groupName',
    title: '客群名称',
    dataIndex: 'groupName',
  }, {
    key: 'tableName',
    title: '数据表',
    dataIndex: 'tableName',
  }, {
    key: 'startEnd',
    title: '推送周期',
    dataIndex: 'startEnd',
  }, {
    key: 'status',
    title: '状态',
    dataIndex: 'status',
    render: v => {
      if (v === 1) {
        return (<Badge color="green" text="成功" />)
      } 
      if (v === 2) {
        return (<Badge color="red" text="失败" />)
      } 
      if (v === 3) {
        return (<Badge color="blue" text="执行中" />)
      }
    },
  }, {
    key: 'lastRunTime',
    title: '最后推送时间',
    dataIndex: 'lastRunTime',
    // render: text => <Time timestamp={text} />,
  }, {
    key: 'action',
    title: '操作',
    render: (text, record) => (
      <div className="FBH FBAC">
        {record.status === 3 ? (
          <Authority
            authCode="group-manage:add-push"
          >
            <Tooltip title="进行中，不可操作" arrowPointAtCenter placement="top">
              <a href className="mr8" disabled>编辑</a>
            </Tooltip>
          </Authority>
        ) : (
          <Authority
            authCode="group-manage:add-push"
          >
            <a href onClick={e => this.openDrawer(record)} className="mr8">编辑</a>
          </Authority>
        )}
        {record.status === 3 ? (
          <Authority
            authCode="group-manage:add-push"
          >
            <Tooltip title="进行中，不可操作" arrowPointAtCenter placement="top">
              <a href className="mr8" disabled>删除</a>
            </Tooltip>
          </Authority>
        ) : (
          <Authority
            authCode="group-manage:add-push"
          >
            <Popconfirm
              title="你确定删除该推送吗"
              onConfirm={() => store.delPush(record.id)}
              // onCancel={() => {}}
              placement="topRight"
              okText="确认"
              cancelText="取消"
            >
              <a href className="mr8">删除</a>
            </Popconfirm>
          </Authority>
        )}
      </div>
    ),
  },
  ]

  @action openDrawer = data => {
    if (data) {
      store.pushId = data.id
      store.detailPush()
      store.isEdit = true
    } else {
      store.isEdit = false
    }
    store.drawerVisible = true
  }
  // checkbox 多选
  // @action.bound onTableCheck(selectedRowKeys) {
  //   // 表格 - 已选项key数组
  //   store.publishRowKeys = selectedRowKeys
  // }
  
  render() {
    const {publishRowKeys, tableLoading} = store

    // const rowSelection = {
    //   selectedRowKeys: publishRowKeys.slice(),
    //   onChange: this.onTableCheck,
    // }
    const listConfig = {
      key: 'id',
      rowKey: 'id',
      columns: this.columns,
      tableLoading,
      store,
      searchParams: search(store),
      scroll: {x: 960},
      buttons: [
        <Authority
          authCode="group-manage:add-push"
        >
          <Button type="primary" className="mr8" onClick={() => this.openDrawer()}>新建推送</Button>
        </Authority>,
      ],
    }
    return (
      <div className="group-push-list" style={{minHeight: 'calc(100vh - 198px)'}}>
        <div className="list-content">
          <ListContent {...listConfig} />
        </div>
        <PushDrawer store={store} />
      </div>
    )
  }
}
