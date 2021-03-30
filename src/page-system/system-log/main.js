/**
 * @description 系统日志
 */
import {Component} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {DatePicker, Input} from 'antd'
import {SearchOutlined} from '@ant-design/icons'
import {
  ListContent,
} from '../../component'
// import search from './search'
import {Time, debounce} from '../../common/util'
import store from './store'
import './main.styl'

const {RangePicker} = DatePicker

// import {errorTip} from '../../common/util'

@observer
export default class PushList extends Component {
  columns = [{
    key: 'userName',
    title: '昵称',
    dataIndex: 'userName',
  }, {
    key: 'userAccount',
    title: '账号',
    dataIndex: 'userAccount',
  }, {
    key: 'permsName',
    title: '操作页面',
    ellipsis: true,
    dataIndex: 'permsName',
  }, {
    key: 'ctime',
    title: '操作时间',
    dataIndex: 'ctime',
    // defaultSortOrder: 'descend',
    // sorter: (a, b) => a.ctime - b.ctime,
    render: text => <Time timestamp={text} />,
  }]
  // checkbox 多选
  @action.bound onTableCheck(selectedRowKeys) {
    // 表格 - 已选项key数组
    store.publishRowKeys = selectedRowKeys
  }
  render() {
    const {tableLoading} = store
    const listConfig = {
      key: 'id',
      rowKey: 'id',
      // rowSelection: rowSelection || null,
      columns: this.columns,
      tableLoading,
      store,
      initParams: {...store.reqData},
      searchParams: {},
      buttons: [
        <div>
          <Input 
            placeholder="请输入用户名或者账号"
            style={{width: 180, marginRight: '8px'}}
            suffix={<SearchOutlined />}
            allowClear
            onChange={e => {
              store.reqData = {
                ...store.reqData,
                keyWord: e.target.value,
              }
              // 防抖处理
              debounce(() => store.getList({...store.reqData, keyWord: store.reqData.keyWord}), 200)
            }}
          />
          <RangePicker
            size="small"
            onChange={value => {
              store.reqData = {
                ...store.reqData,
                startTime: value ? value[0].format('YYYY-MM-DD') : '',
                endTime: value ? value[1].format('YYYY-MM-DD') : '',
              }
              store.getList({...store.reqData, startTime: store.reqData.startTime, endTime: store.reqData.endTime})
            }}
          />
        </div>,
      ],
    }
    return (
      <div className="system-log" style={{minHeight: 'calc(100vh - 203px)'}}>
        <div className="content-header">系统日志</div> 
        <div className="user-manage">
          <ListContent {...listConfig} />
        </div>
      </div>
    )
  }
}
