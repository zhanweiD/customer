/**
 * @description 客户列表
 */
import {Component} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {Badge, Tooltip, Popconfirm} from 'antd'
import {
  ListContent, OmitTooltip,
} from '../../component'
import {Time} from '../../common/util'
// import {errorTip} from '../../common/util'

@observer
export default class PushList extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  columns = [{
    key: 'customerId',
    title: '客户id',
    dataIndex: 'customerId',
  }, {
    key: 'name',
    title: '姓名',
    dataIndex: 'name',
    className: 'tr-w64',
  }, {
    key: 'sex',
    title: '性别',
    dataIndex: 'sex',
    className: 'tr-w64',
  }, {
    key: 'age',
    title: '年龄',
    dataIndex: 'age',
    className: 'tr-w64',
  }, {
    key: 'professional',
    title: '职业',
    dataIndex: 'professional',
    className: 'tr-w88',
  }, {
    key: 'marriage',
    title: '婚姻',
    className: 'tr-w50',
    dataIndex: 'marriage',
  }, {
    key: 'education',
    title: '学历',
    dataIndex: 'education',
    className: 'tr-w88',
  }, {
    key: 'nativePlace',
    title: '籍贯',
    className: 'tr-w64',
    dataIndex: 'nativePlace',
  }, {
    key: 'dealValue',
    title: '成交价值',
    className: 'tr-w40',
    dataIndex: 'dealValue',
  }]
  @action onDelete= record => { console.log(record) }
  @action openDrawer = v => {
    if (v === 0) {
    //   store.disable(e)
    } else if (v === 1) {
      // this.store.drawerVisible = true
    } else if (v === 2) {
      // console.log('删除', record)
    } else if (v === 3) {
      // this.store.drawerVisible = true
    } else {
      // this.store.addstatus = true
    }
  }
  render() {
    const {tableLoading} = this.store
    const listConfig = {
      key: 'id',
      rowKey: 'id',
      columns: this.columns,
      tableLoading,
      store: this.store,
      initParams: {},
    }
    return (
      <div className="group-customer-list" style={{minHeight: 'calc(100vh - 198px)'}}>
        <div className="action" style={{display: 'flex', justifyContent: 'flex-end', padding: '0 24px 8px 24px', marginTop: '-8px'}}>
          <a href style={{margin: '0 16px', fontSize: '12px'}} onClick={() => this.openDrawer(1)}>配置</a>
          <a href style={{margin: '0 16px', fontSize: '12px'}} onClick={() => this.openDrawer(2)}>分析</a>
          <a href style={{margin: '0 16px', fontSize: '12px'}} onClick={() => this.openDrawer(3)}>导出</a>
          <a href style={{margin: '0 16px', fontSize: '12px'}} onClick={() => this.openDrawer(4)}>推送</a>
        </div>
        <div className="list-content">
          <ListContent {...listConfig} />
        </div>
        {/* {this.store.drawerVisible ? <AddDrawer store={this.store} /> : null} */}
      </div>
    )
  }
}
