/**
 * @description 顾问分析
 */
import {Component} from 'react'
import {Link} from 'react-router-dom'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {Spin, Cascader, Button} from 'antd'

import {OverviewCardWrap, ListContent, NoData} from '../../component'
import {downloadResult} from '../../common/util'
import Chart from './chart'
import store from './store'

@observer
export default class Consultant extends Component {
  constructor(props) {
    super(props)
    store.getProject()
  }
  columns = [{
    key: 'userName',
    title: '顾问姓名',
    dataIndex: 'userName',
    render: (text, record) => {
      if (record.ident && record.id) {
        return <Link target="_blank" to={`/customer/portrait/${record.ident}/${record.id}`}>{text}</Link>
      }
      return text
    },
  }, {
    key: 'seniorityTime',
    title: '工龄',
    dataIndex: 'seniorityTime',
  }, {
    key: 'workingTime',
    title: '司龄',
    dataIndex: 'workingTime',
  }, {
    key: 'dealCustomerCount',
    title: '成交客户数',
    dataIndex: 'dealCustomerCount',
  }, {
    key: 'projectName',
    title: '项目名称',
    dataIndex: 'projectName',
  }]

  // 选择区域
  selectPro = (v, item) => {
    if (!v.length) {
      store.reqProData = {
        projectArea: null,
        projectCity: null,
        projectName: null,
      }
      store.getList({...store.reqProData, currentPage: 1})
      store.getChannel(data => {
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
    store.getList({...store.reqProData, currentPage: 1})
    store.getChannel(data => {
      this.getDraw(data)
    })
  }

  filter = (inputValue, path) => {
    return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
  }

  render() {
    const {consultantData, tableLoading, loading, reqProData, projectList} = store
    // 对象指标信息卡
    const cards = [
      {
        title: '置业顾问总数',
        values: [consultantData.card ? consultantData.card.total : 0],
      }, {
        title: '销冠人数',
        values: [consultantData.card ? consultantData.card.champion : 0],
      }, {
        title: 'AB率均值',
        values: [consultantData.card ? consultantData.card.abrate : 0],
      }, 
    ]
    const listConfig = {
      key: 'userName',
      rowKey: 'userName',
      initParams: reqProData,
      columns: this.columns,
      tableLoading,
      buttons: [
        <div className="dfjs mt16 fs14 c85">
          <div>置业顾问名单</div>
          <div>
            <Button onClick={() => downloadResult(reqProData, 'salesman/export')} style={{marginRight: '24px'}} type="primary">导出</Button>
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
      <div className="consultant">
        <div className="content-header">
          <span className="mr24">顾问分析</span>
          <Cascader
            placeholder="请选择区域"
            fieldNames={{label: 'name', value: 'name'}}
            expandTrigger="hover"
            changeOnSelect
            showSearch={this.filter}
            options={projectList}
            // options={window.__keeper.projectTree}
            onChange={this.selectPro}
            style={{marginRight: '8px'}}
          />
        </div> 
        <div className="ml16 mr16">
          <Spin spinning={loading}>
            <OverviewCardWrap cards={cards} />
            <div className="bgf mb16">
              {
                consultantData.columnChart && consultantData.columnChart.x ? null : <NoData style={{paddingTop: '128px', marginBottom: '-376px'}} {...noDataConfig} />
              }
              <Chart getDraw={draw => this.getDraw = draw} store={store} />
            </div>
          </Spin>
          <ListContent {...listConfig} />
        </div>
      </div>
    )
  }
}
