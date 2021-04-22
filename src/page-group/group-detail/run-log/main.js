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
  constructor(props) {
    super(props)
    this.store = props.store
  }

  columns = [{
    key: 'crowdId',
    title: '人群id',
    dataIndex: 'crowdId',
    className: 'tr-w64',
  }, {
    key: 'number',
    title: '圈选人数',
    dataIndex: 'number',
    className: 'tr-w64',
  }, {
    key: 'way',
    title: '执行方式',
    dataIndex: 'way',
    className: 'tr-w64',
  }, {
    key: 'touch',
    title: '是否触达',
    dataIndex: 'touch',
    className: 'tr-w88',
  }, {
    key: 'rules',
    title: '运行规则',
    dataIndex: 'rules',
    className: 'tr-w64',
    width: 140,
    render: t => {
      t = t.map((item, index) => {
        return index > 0 ? `、${item}` : item
      })
      return t ? <OmitTooltip maxWidth={400} text={t} /> : '-'
    },
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
    title: '运行时间',
    dataIndex: 'time',
    className: 'tr-w88',
    render: text => <Time timestamp={text} />,
  }, {
    key: 'operation',
    title: '操作人',
    className: 'tr-w64',
    dataIndex: 'operation',
  }, {
    key: 'action',
    title: '操作',
    className: 'tr-w40',
    width: 150,
    render: (text, record) => (
      <div className="FBH FBAC">
        <a href onClick={e => this.openDrawer(0, record, e)} className="mr8">导出</a>
        <a href onClick={e => this.openDrawer(1, record, e)} className="mr8">推送</a>
      </div>
    ),
  }]
  @action onDelete= record => { console.log(record) }
  @action openDrawer = (v, record, e) => {
    //  1编辑 0禁用 2删除
    if (v === 0) {
      console.log('导出', record)
    } else if (v === 1) {
      console.log('推送', record)
    } 
  }
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
      <div className="group-push-list" style={{minHeight: 'calc(100vh - 198px)'}}>
        {/* 表格部分 */}
        <div className="list-content">
          <ListContent {...listConfig} />
        </div>
        {/* {this.store.drawerVisible ? <AddDrawer store={this.store} /> : null} */}
      </div>
    )
  }
}
