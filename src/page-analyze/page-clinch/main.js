/**
 * @description 成交分析
 */
import {Component} from 'react'
import {Link} from 'react-router-dom'
import {observer} from 'mobx-react'
import {action} from 'mobx'
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
class Clinch extends Component {
  columns = [{
    key: 'customerName',
    title: '客户姓名',
    dataIndex: 'customerName',
    render: (text, record) => {
      if (record.ident && record.id) {
        return <Link target="_blank" to={`/portrait/${record.ident}/${record.id}`}>{text}</Link>
      }
      return text
    },
  }, {
    key: 'projectName',
    title: '项目名称',
    dataIndex: 'projectName',
  }, {
    key: 'reportTime',
    title: '报备日期',
    dataIndex: 'reportTime',
  }, {
    key: 'visitTime',
    title: '到访日期',
    dataIndex: 'visitTime',
  }, 
  {
    key: 'solicitTime',
    title: '认筹日期',
    dataIndex: 'solicitTime',
  },
  {
    key: 'subscriptionTime',
    title: '认购日期',
    dataIndex: 'subscriptionTime',
  },
  ]

  // 选择区域
  selectPro = (v, item) => {
    if (!v.length) {
      store.reqProData = {
        projectArea: null,
        projectCity: null,
        projectName: null,
      }
      store.getList({...store.reqProData, ...store.reqData, currentPage: 1})
      store.getClinch(data => {
        this.getDraw(data)
      })
      return
    }

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
    store.getClinch(data => {
      this.getDraw(data)
    })
  }

  filter = (inputValue, path) => {
    return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
  }

  // disabledDate(current) {
  //   // console.log(current, store.reqData.reportTimeStart)
  //   if (current) {
  //     return current < moment(store.limitTime.startTime).startOf('year') || current > moment(store.limitTime.Time).endOf('year')
  //   }
  // }
  render() {
    const {
      clinchData, tableLoading, loading, reqData, reqProData, reqCliData, isScroll,
    } = store
    // 对象指标信息卡
    const cards = [
      {
        title: '累计成交金额',
        values: [clinchData.card ? clinchData.card.dealAmount : 0],
      }, {
        title: '成交业绩目标达成率',
        values: [clinchData.card ? clinchData.card.signingRate : 0],
      }, {
        title: '累计成交客户数',
        values: [clinchData.card ? clinchData.card.dealCustomer : 0],
      }, {
        title: '未成交客户数',
        values: [clinchData.card ? clinchData.card.unDealCustomer : 0],
      },
    ]
    const listConfig = {
      key: 'id',
      rowKey: 'id',
      initParams: {...reqData, ...reqProData, ...reqCliData},
      columns: this.columns,
      scroll: {x: 1120},
      tableLoading,
      buttons: [
        <div className="dfjs mt16 fs14 c85">
          <div className="mt6">
            未转化客户
          </div>
          <div>
            <Select 
              defaultValue=""
              style={{width: 160, marginRight: '8px'}} 
              suffixIcon={<img src={dropdown} alt="dropdown" />}
              onChange={v => {
                store.reqCliData.customerType = v
                store.getList({...reqData, ...reqProData, ...reqCliData, currentPage: 1})
              }}
            >
              <Option style={{fontSize: '12px'}} key="">全部</Option>
              <Option style={{fontSize: '12px'}} key={0}>报备客户</Option>
              <Option style={{fontSize: '12px'}} key={1}>到访客户</Option>
              <Option style={{fontSize: '12px'}} key={2}>认筹客户</Option>
              <Option style={{fontSize: '12px'}} key={3}>认购客户</Option>
            </Select> 
            <Button onClick={() => downloadResult({...reqData, ...reqProData, ...reqCliData}, 'deal/export')} style={{marginRight: '24px'}} type="primary">导出</Button>
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
        id="chinchId"
        className="oa"
        onScroll={() => {
          if (document.getElementById('chinchId').scrollTop === 0) {
            store.isScroll = false
          } else {
            store.isScroll = true
          }
        }}
      >
        <div className={`content-header-fixed FBH FBJB ${isScroll ? 'header-scroll' : ''}`}>
          <div className="mr24">成交分析</div>
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
              // disabledDate={this.disabledDate}
              allowClear={false}
              onChange={value => {
              // store.limitTime = {
              //   startTime: value ? value[0] : '',
              //   endTime: value ? value[1] : '',
              // }
                store.reqData = {
                  reportTimeStart: value ? value[0].format('YYYY-MM-DD') : '',
                  reportTimeEnd: value ? value[1].format('YYYY-MM-DD') : '',
                }
                // store.endTime = value ? value[1].format('YYYY-MM-DD') : ''
                store.getList({...store.reqProData, ...store.reqData, currentPage: 1})
                store.getClinch(data => {
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
                clinchData.pieChart && clinchData.pieChart.length ? null : <NoData style={{paddingTop: '128px', marginBottom: '-376px'}} {...noDataConfig} />
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
export default authView(Clinch)
