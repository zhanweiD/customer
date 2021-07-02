/**
 * @description 渠道分析
 */
import {Component} from 'react'
import {Link} from 'react-router-dom'
import {observer} from 'mobx-react'
import {DatePicker, Select, Spin, Cascader, Button} from 'antd'
import dropdown from '../../icon/dropdown.svg'

import {OverviewCardWrap, ListContent, NoData, authView} from '../../component'
import {downloadResult} from '../../common/util'
import Chart from './chart'
import store from './store'
import './index.styl'

const {RangePicker} = DatePicker
const dateFormat = 'YYYY-MM-DD'
const {Option} = Select

@observer
class Channel extends Component {
  componentDidMount() {
    store.getAllChannel()
  }

  columns = [{
    key: 'customerName',
    title: '客户姓名',
    dataIndex: 'customerName',
    render: (text, record) => {
      if (record.ident && record.id) {
        return <Link target="_blank" to={`/customer/portrait/${record.ident}/${record.id}`}>{text}</Link>
      }
      return text
    },
  }, {
    key: 'projectName',
    title: '项目名称',
    dataIndex: 'projectName',
  }, {
    key: 'channelType',
    title: '渠道',
    dataIndex: 'channelType',
  }, {
    key: 'channelName',
    title: '二级渠道',
    dataIndex: 'channelName',
  }, {
    key: 'reportTime',
    title: '报备日期',
    dataIndex: 'reportTime',
  }, {
    key: 'visitTime',
    title: '到访日期',
    dataIndex: 'visitTime',
  }, {
    key: 'solicitTime',
    title: '认筹日期',
    dataIndex: 'solicitTime',
  },
  {
    key: 'subscriptionTime',
    title: '认购日期',
    dataIndex: 'subscriptionTime',
  }, {
    key: 'customerType',
    title: '客户类型',
    dataIndex: 'customerType',
  }]

  filter = (inputValue, path) => {
    return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
  }

  // 选择渠道
  selectChannel = (v, item) => {
    if (!v.length) {
      store.reqChaData.channelId = null
      store.reqChaData.channelType = null
    }
    if (item.length === 1 && item[0].parentId === '-1') {
      store.reqChaData.channelType = item[0].channelName
    } else {
      store.reqChaData.channelType = null
      store.reqChaData.channelId = v[v.length - 1]
    }
    store.getList({...store.reqChaData, ...store.reqData, ...store.reqProData, currentPage: 1})
  }

  // 选择区域
  selectPro = (v, item) => {
    // 清除条件
    if (!v.length) {
      store.reqProData = {
        projectArea: null,
        projectCity: null,
        projectName: null,
      }
      store.getList({...store.reqProData, ...store.reqData, currentPage: 1})
      store.getChannel(data => {
        this.getDraw(data)
      })
      return
    }

    // 选择条件（一级二级三级）
    store.reqProData.projectArea = item[0].name
    store.reqProData.projectCity = null
    store.reqProData.projectName = null

    if (item.length === 2) {
      store.reqProData.projectArea = item[0].name
      if (item[1].parentId) {
        store.reqProData.projectName = item[1].name
      } else {
        store.reqProData.projectCity = item[1].name
      }
    } 

    if (item.length === 3) {
      store.reqProData.projectCity = item[1].name
      store.reqProData.projectName = item[2].name
    }

    store.getList({...store.reqProData, ...store.reqData, currentPage: 1})
    store.getChannel(data => {
      this.getDraw(data)
    })
  }

  render() {
    const {
      channelData, tableLoading, loading, reqData, treeDate, reqProData, reqChaData, isScroll,
    } = store
    // 对象指标信息卡
    const cards = [
      {
        title: '累计报备客户',
        values: [channelData.card ? channelData.card.report : 0],
      }, {
        title: '累计到访客户',
        values: [channelData.card ? channelData.card.visit : 0],
      }, {
        title: '累计成交客户',
        values: [channelData.card ? channelData.card.signing : 0],
      }, 
    ]
    const listConfig = {
      key: 'id',
      rowKey: 'id',
      initParams: {...reqChaData, ...reqData, ...reqProData},
      scroll: {x: 1120},
      columns: this.columns,
      tableLoading,
      buttons: [
        <div className="dfjs mt16 fs14 c85">
          <div className="mt6">
            未转化客户
          </div>
          <div>
            <Cascader
              placeholder="请选择渠道"
              fieldNames={{label: 'channelName', value: 'channelId', children: 'children'}}
              changeOnSelect
              expandTrigger="hover"
              options={treeDate}
              onChange={this.selectChannel}
              showSearch={this.filter}
              style={{marginRight: '8px'}}
              getPopupContainer={triggerNode => triggerNode.parentElement}
              suffixIcon={<img src={dropdown} alt="dropdown" />}
            />
            <Select 
              defaultValue=""
              style={{width: 160, marginRight: '8px'}} 
              onChange={v => {
                store.reqChaData.customerType = v
                store.getList({...store.reqChaData, ...store.reqData, ...store.reqProData, currentPage: 1})
              }}
              getPopupContainer={triggerNode => triggerNode.parentElement}
              suffixIcon={<img src={dropdown} alt="dropdown" />}
            >
              <Option style={{fontSize: '12px'}} key="">全部</Option>
              <Option style={{fontSize: '12px'}} key={0}>报备客户</Option>
              <Option style={{fontSize: '12px'}} key={1}>到访客户</Option>
              <Option style={{fontSize: '12px'}} key={2}>认筹客户</Option>
              <Option style={{fontSize: '12px'}} key={3}>认购客户</Option>
            </Select> 
            <Button 
              onClick={() => downloadResult({...store.reqChaData, ...store.reqData, ...store.reqProData}, 'expand/export')} 
              style={{marginRight: '24px'}} 
              type="primary"
            >
              导出
            </Button>
          </div>
        </div>,   
      ],
      initGetDataByParent: false, // 初始请求 在父层组件处理。列表组件componentWillMount内不再进行请求
      store, // 必填属性
    }
    const noDataConfig = {
      text: '暂无数据',
    }
    return (
      <div 
        id="channelId"
        className="oa"
        onScroll={() => {
          if (document.getElementById('channelId').scrollTop === 0) {
            store.isScroll = false
          } else {
            store.isScroll = true
          }
        }}
      >
        <div className={`content-header-fixed FBH FBJB ${isScroll ? 'header-scroll' : ''}`}>
          <div className="mr24">渠道拓客</div>
          <div style={{width: 624}}>
            <Cascader
              placeholder="请选择区域"
              fieldNames={{label: 'name', value: 'name'}}
              expandTrigger="hover"
              changeOnSelect
              showSearch={this.filter}
              options={window.__keeper.projectTree}
              onChange={this.selectPro}
              style={{marginRight: '8px'}}
              suffixIcon={<img src={dropdown} alt="dropdown" />}
            />
            <RangePicker
              defaultValue={[moment(reqData.reportTimeStart, dateFormat), moment(reqData.reportTimeEnd, dateFormat)]}
              // format={dateFormat}
              allowClear={false}
              onChange={value => {
                store.reqData = {
                  reportTimeStart: value ? value[0].format('YYYY-MM-DD') : '',
                  reportTimeEnd: value ? value[1].format('YYYY-MM-DD') : '',
                }
                store.getList({...store.reqProData, ...store.reqData, currentPage: 1})
                store.getChannel(data => {
                  this.getDraw(data)
                })
              }}
            />
          </div>
        </div> 
        <div className="ml16 mr16 mt72">
          <Spin spinning={loading}>
            <OverviewCardWrap cards={cards} />
            <div className="bgf mb16 custom-border">
              {
                channelData.pieChart && channelData.pieChart.length ? null : <NoData style={{paddingTop: '200px', marginBottom: '-468px'}} {...noDataConfig} />
              }
              <Chart getDraw={draw => this.getDraw = draw} store={store} />
            </div>
          </Spin>
          <div className="custom-border mb16">
            <ListContent {...listConfig} />
          </div>
        </div>
      </div>
    )
  }
}
export default authView(Channel)
