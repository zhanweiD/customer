/**
 * @description 运行日志
 */
import {Component} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {Button, Badge, Tooltip, Popconfirm} from 'antd'
import {
  ListContent, OmitTooltip,
} from '../../../component'
import {Time} from '../../../common/util'
import store from './store'
// import {errorTip} from '../../common/util'

@observer
export default class RunLog extends Component {
  columns = [{
    key: 'crowdId',
    title: '人群id',
    dataIndex: 'crowdId',
    className: 'tr-w64',
  }, {
    key: 'name',
    title: '客群名称',
    dataIndex: 'name',
    className: 'tr-w64',
  }, {
    key: 'appName',
    title: '应用名称',
    dataIndex: 'appName',
    className: 'tr-w64',
  }, {
    key: 'number',
    title: '圈选人数',
    dataIndex: 'number',
    className: 'tr-w64',
  }, {
    key: 'pushNumber',
    title: '累计推送次数',
    dataIndex: 'pushNumber',
    className: 'tr-w64',
  }, {
    key: 'cycle',
    title: '推送周期',
    className: 'tr-w50',
    dataIndex: 'cycle',
  }, {
    key: 'pushCycle',
    title: '推送周期时间',
    dataIndex: 'pushCycle',
    className: 'tr-w88',
  }, {
    key: 'status',
    title: '状态',
    className: 'tr-w50',
    dataIndex: 'status',
    render: v => {
      if (v === 1) {
        return (<Badge color="green" text="成功" />)
      } if (v === 2) {
        return (<Badge color="red" text="失败" />)
      } 
      return (<Badge color="blue" text="执行中" />)
    },
  }, {
    key: 'time',
    title: '推送时间',
    className: 'tr-w40',
    dataIndex: 'time',
    width: 150,
    render: text => <Time timestamp={text} />,
  }, {
    key: 'operation',
    title: '操作人',
    className: 'tr-w40',
    dataIndex: 'operation',
  }]
  render() {
    const {tableLoading} = store
    const listConfig = {
      key: 'id',
      rowKey: 'id',
      columns: this.columns,
      tableLoading,
      store,
      initParams: {},
    }
    return (
      <div className="group-push-list" style={{minHeight: 'calc(100vh - 203px)'}}>
        {/* 表格部分 */}
        <div className="list-content">
          <ListContent {...listConfig} />
        </div>
        {/* {this.store.drawerVisible ? <AddDrawer store={this.store} /> : null} */}
      </div>
    )
  }
}
