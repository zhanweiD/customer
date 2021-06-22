/**
 * @description 满意度提升
 */
import {Component} from 'react'
import {Link} from 'react-router-dom'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {DatePicker, Select, Spin, Cascader, Button} from 'antd'

import {OverviewCardWrap, ListContent, AuthView} from '../../component'
import {downloadResult} from '../../common/util'
import Chart from './chart'
import store from './store'

const {RangePicker} = DatePicker
const dateFormat = 'YYYY-MM-DD'
const {Option} = Select

// 场景
const list1 = ['案场', '认筹', '认购', '签约', '验房', '交付', '活动', '维修', '投诉', '酒店']
// 业态
const list2 = ['高层', '小高层', '洋房', '别墅', '商铺', '公寓', '写字楼']
// 客户类型
const list3 = ['报备客户', '到访客户', '认筹客户', '认购客户', '签约客户', '准业主', '磨合期业主', '稳定期业主', '老业主', '无效客户']
// 评价类型
const list4 = ['非常满意', '满意', '一般', '不满意', '非常不满意']

@observer
class Satisfaction extends Component {
  constructor(props) {
    super(props)

    store.resetReqDate()
  }
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
    key: 'evaluateContent',
    title: '评价内容',
    dataIndex: 'evaluateContent',
    width: 360,
  }, {
    key: 'evaluateType',
    title: '业务场景',
    dataIndex: 'evaluateType',
  }, {
    key: 'satisfaction',
    title: '评价结果',
    dataIndex: 'satisfaction',
  }, {
    key: 'customerType',
    title: '客户类型',
    dataIndex: 'customerType',
  }]

  componentDidMount() {
    store.getEvaluationPeo()
    store.getEvaluationNum()
    store.getSatisfactionPer()
  }

  // 选择区域
  selectPro = (v, item) => {
    // 清除条件
    if (!v.length) {
      store.reqData = {
        projectArea: null,
        projectCity: null,
        projectName: null,
      }
      // store.getList({...store.reqData, ...store.reqData, currentPage: 1})
      store.getAllData(this.getDraw, this.getDraw1)
      store.getList({satisfaction: store.satisfaction, ...store.reqData, currentPage: 1})
      return
    }

    // 选择条件（一级二级三级）
    // 选择只有一级
    store.reqData.projectArea = item[0].name
    store.reqData.projectCity = null
    store.reqData.projectName = null

    // 两级
    if (item.length === 2) {
      store.reqData.projectArea = item[0].name
      if (item[1].parentId) {
        store.reqData.projectName = item[1].name
      } else {
        store.reqData.projectCity = item[1].name
      }
    } 

    // 三级
    if (item.length === 3) {
      store.reqData.projectCity = item[1].name
      store.reqData.projectName = item[2].name
    }

    store.getList({satisfaction: store.satisfaction, ...store.reqData, currentPage: 1})
    store.getAllData(this.getDraw, this.getDraw1)
  }

  @action resetData = () => {
    store.resetReqDate()
    store.getAllData(this.getDraw, this.getDraw1)
    store.getList({satisfaction: store.satisfaction, ...store.reqData, currentPage: 1})
  }

  filter = (inputValue, path) => {
    return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
  }

  render() {
    const {evaluationPeo, evaluationNum, satisfactionPer, tableLoading, loading, reqData, satisfaction} = store
    // 对象指标信息卡
    const cards = [
      {
        title: '累计评价客户数',
        values: [evaluationPeo || 0],
      }, {
        title: '评价次数',
        values: [evaluationNum || 0],
      }, {
        title: '客户满意度',
        values: [satisfactionPer || 0],
      }, 
    ]
    const listConfig = {
      key: 'id',
      rowKey: 'id',
      initParams: {...reqData, satisfaction},
      columns: this.columns,
      tableLoading,
      buttons: [
        <div className="dfjs mt16 fs14 c85">
          <div style={{lineHeight: '24px'}}>
            评价详情
          </div>
          <div>
            <Select 
              allowClear
              placeholder="评价结果"
              style={{width: 160, marginRight: '8px'}} 
              onChange={v => {
                store.satisfaction = v
                store.getList({satisfaction: v, ...store.reqData, currentPage: 1})
              }}
              getPopupContainer={triggerNode => triggerNode.parentElement}
            >
              {
                list4.map(item => <Option value={item}>{item}</Option>)
              }
            </Select> 
            <Button onClick={() => downloadResult({satisfaction: store.satisfaction, ...store.reqData}, 'satisfaction/export')} style={{marginRight: '24px'}} type="primary">导出</Button>
          </div>
        </div>,   
      ],
      initGetDataByParent: false, // 初始请求 在父层组件处理。列表组件componentWillMount内不再进行请求
      store, // 必填属性
    }
    
    return (
      <div className="oa">
        <div className="content-header">
          <span className="mr24">满意度提升</span>
          <Cascader
            placeholder="请选择区域"
            fieldNames={{label: 'name', value: 'name'}}
            expandTrigger="hover"
            changeOnSelect
            options={window.__keeper.projectTree}
            onChange={this.selectPro}
            style={{width: 108, marginRight: '8px'}}
            showSearch={this.filter}
          />
          <Select 
            allowClear
            style={{width: 100, marginRight: '8px'}} 
            placeholder="产品业态"
            onChange={v => {
              store.reqData.format = v
              store.getAllData(this.getDraw, this.getDraw1)
              store.getList({satisfaction: store.satisfaction, ...store.reqData, currentPage: 1})
              // store.getList({...store.reqChaData, ...store.reqData, ...store.reqData, currentPage: 1})
            }}
          >
            {
              list2.map(item => <Option value={item}>{item}</Option>)
            }
          </Select>
          <Select 
            allowClear
            style={{width: 100, marginRight: '8px'}} 
            placeholder="业务场景"
            onChange={v => {
              store.reqData.evaluateType = v
              store.getAllData(this.getDraw, this.getDraw1)
              store.getList({satisfaction: store.satisfaction, ...store.reqData, currentPage: 1})
              // store.getList({...store.reqChaData, ...store.reqData, ...store.reqData, currentPage: 1})
            }}
          >
            {
              list1.map(item => <Option value={item}>{item}</Option>)
            }
          </Select>
          <Select 
            allowClear
            style={{width: 100, marginRight: '8px'}} 
            placeholder="客户类型"
            onChange={v => {
              store.reqData.customerType = v
              store.getAllData(this.getDraw, this.getDraw1)
              store.getList({satisfaction: store.satisfaction, ...store.reqData, currentPage: 1})
              // store.getList({...store.reqChaData, ...store.reqData, ...store.reqData, currentPage: 1})
            }}
          >
            {
              list3.map((item, index) => <Option value={index}>{item}</Option>)
            }
          </Select>
          <RangePicker
            defaultValue={[moment(reqData.reportTimeStart, dateFormat), moment(reqData.reportTimeEnd, dateFormat)]}
            onChange={value => {
              store.reqData = {
                reportTimeStart: value ? value[0].format('YYYY-MM-DD') : '',
                reportTimeEnd: value ? value[1].format('YYYY-MM-DD') : '',
              }
              store.getAllData(this.getDraw, this.getDraw1)
              store.getList({satisfaction: store.satisfaction, ...store.reqData, currentPage: 1})
            }}
          />
          {/* <Button style={{marginLeft: '8px'}} type="primary" onClick={this.resetData}>重置</Button> */}
        </div> 
        <div className="ml16 mr16 mb16 mt72">
          <Spin spinning={loading}>
            <OverviewCardWrap cards={cards} />
            <div className="bgf mb16 p24 pt16">
              {/* {
                channelData.pieChart && channelData.pieChart.length ? null : <NoData style={{paddingTop: '200px', marginBottom: '-468px'}} {...noDataConfig} />
              } */}
              <Chart 
                getDraw={(cb1, cb2) => {
                  this.getDraw = cb1
                  this.getDraw1 = cb2
                }} 
                store={store} 
              />
            </div>
          </Spin>
          <ListContent {...listConfig} />
        </div>
      </div>
    )
  }
}
export default AuthView(Satisfaction)
