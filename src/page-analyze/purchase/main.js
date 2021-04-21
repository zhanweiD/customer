/**
 * @description 复购模型
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {Link} from 'react-router-dom'
import {action, toJS} from 'mobx'
import {DatePicker, Select, Spin, Cascader, Button} from 'antd'

import {OverviewCardWrap, ListContent, NoData} from '../../component'
import {downloadResult} from '../../common/util'
import Chart from './chart'
import store from './store'
import List from './list'
import './main.styl'

const {Option} = Select

// 业态
function listToPro(data) {
  const nameList = []
  const list = []
  if (data[0]) {
    nameList.push(data[0].name)
    list.push(data[0])
    if (data[0].children) {
      nameList.push(data[0].children[0].name)
      list.push(data[0].children[0])
      if (data[0].children[0].children) {
        nameList.push(data[0].children[0].children.name)
        list.push(data[0].children[0].children[0])
      }
    }
  }
  return [nameList, list]
}

@observer
export default class Purchase extends Component {
  // constructor(props) {
  //   super(props)
  //   store.defaultProject = listToPro(window.__keeper.projectTree)
  // }
  componentDidMount() {
    store.getCard()
    store.getTgiList()
    store.getTgiMerit()
    store.getFormat()
  }

  columns = [{
    key: 'customerName',
    title: '客户姓名',
    dataIndex: 'customerName',
    fixed: 'left',
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
  }, 
  {
    key: 'customerAgeGroup',
    title: '年龄段',
    dataIndex: 'customerAgeGroup',
  }, 
  {
    key: 'roomNums',
    title: '房间数',
    dataIndex: 'roomNums',
  }, 
  {
    key: 'roomAreaRange',
    title: '房间面积',
    dataIndex: 'roomAreaRange',
  }, 
  {
    key: 'roomPerPriceRange',
    title: '房间单价',
    dataIndex: 'roomPerPriceRange',
  }, 
  {
    key: 'roomTotalPriceRange',
    title: '房间总价',
    dataIndex: 'roomTotalPriceRange',
  }, 
  // {
  //   key: 'customerSourceRegion',
  //   title: '地区来源',
  //   dataIndex: 'customerSourceRegion',
  // }, 
  // {
  //   key: 'customerIndustry',
  //   title: '行业',
  //   dataIndex: 'customerIndustry',
  // }, 
  // {
  //   key: 'customerProfessional',
  //   title: '职业',
  //   dataIndex: 'customerProfessional',
  // }, 
  // {
  //   key: 'customerHouseFactor',
  //   title: '购房关注因子',
  //   dataIndex: 'customerHouseFactor',
  // }, 
  // {
  //   key: 'customerLiveCity',
  //   title: '居住城市',
  //   dataIndex: 'customerLiveCity',
  // }, 
  // {
  //   key: 'customerLiveProvinces',
  //   title: '居住省份',
  //   dataIndex: 'customerLiveProvinces',
  // }, 
  // {
  //   key: 'customerWorkCity',
  //   title: '工作城市',
  //   dataIndex: 'customerWorkCity',
  // }, 
  // {
  //   key: 'customerWorkProvinces',
  //   title: '工作省份',
  //   dataIndex: 'customerWorkProvinces',
  // }, 
  // {
  //   key: 'roomPeripheralSupport',
  //   title: '周边配套',
  //   dataIndex: 'roomPeripheralSupport',
  // }, 
  // {
  //   key: 'customerChildNums',
  //   title: '子女人数',
  //   dataIndex: 'customerChildNums',
  // }, 
  // {
  //   key: 'customerChildAgeGroup',
  //   title: '子女年龄段',
  //   dataIndex: 'customerChildAgeGroup',
  // }, 
  // {
  //   key: 'customerFamilyStructure',
  //   title: '家庭结构',
  //   dataIndex: 'customerFamilyStructure',
  // }, 
  // {
  //   key: 'customerMarriageStatus',
  //   title: '婚姻状态',
  //   dataIndex: 'customerMarriageStatus',
  // }, 
  // {
  //   key: 'customerHouseholdIncome',
  //   title: '家庭年收入',
  //   dataIndex: 'customerHouseholdIncome',
  // }
  ]

  filter = (inputValue, path) => {
    return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
  }

  selectPro = (v, item) => {
    // if (store.reqData.format) {
    //   store.defaultNames = v
    // } else {
    //   store.defaultNames = []
    // }
    store.defaultNames = v
    if (!v.length) {
      store.reqData = {
        projectArea: null,
        projectCity: null,
        projectName: null,
      }
      store.getCard()
      store.getList({...store.reqData, ...store.reqData, currentPage: 1})
      store.getTgiList()
      return
    }
    store.reqData.projectArea = item[0].name
    store.reqData.projectCity = null
    store.reqData.projectName = null

    if (item.length === 2) {
      store.reqData.projectArea = item[0].name
      if (item[1].parentId) {
        store.reqData.projectName = item[1].name
      } else {
        store.reqData.projectCity = item[1].name
      }
    } 

    if (item.length === 3) {
      store.reqData.projectCity = item[1].name
      store.reqData.projectName = item[2].name
    }

    store.getCard()
    store.getList({...store.reqData, currentPage: 1})
    store.getTgiList()
  }

  selectFormat = v => {
    const {projectArea, projectCity, projectName} = store.reqData
    if (!projectArea && !projectCity && !projectName) {
      store.defaultProject = listToPro(window.__keeper.projectTree)
      const {defaultProject} = store
      this.selectPro(defaultProject[0], defaultProject[1])
    }
    store.reqData.format = v
    store.getCard()
    store.getTgiList()
    store.getList({...store.reqData, format: v, currentPage: 1})
  }

  render() {
    const {cardData, tabLoading, loading, merit, tgiMerit, formatList, defaultNames} = store
    // 对象指标信息卡
    const cards = [
      {
        title: '复购客户数',
        values: [cardData[0]],
      }, {
        title: '复购率',
        values: [cardData[1]],
      }, {
        title: '复购房产套数',
        values: [cardData[2]],
      }, 
    ]
    const listConfig = {
      key: 'id',
      rowKey: 'id',
      scroll: {x: 1000},
      initParams: {...store.reqData, tag: merit},
      columns: this.columns,
      tabLoading,
      buttons: [
        <div className="dfjs mt16 fs14 c85">
          <div style={{lineHeight: '24px'}}>
            潜在复购客户推荐
          </div>
          <div>
            <Select 
              size="small"
              allowClear
              style={{width: 160, marginRight: '8px'}} 
              placeholder="请选择纬度"
              value={store.merit}
              onChange={v => {
                store.merit = v
                store.getList({...store.reqData, tag: v, currentPage: 1})
              }}
            >
              {
                tgiMerit.map(item => <Option key={item}>{item}</Option>)
              }
            </Select> 
            <Button onClick={() => downloadResult({...store.reqData, tag: store.merit}, 'repurchase/export')} style={{marginRight: '24px'}} type="primary">导出</Button>
          </div>
        </div>,   
      ],
      initGetDataByParent: true, // 初始请求 在父层组件处理。列表组件componentWillMount内不再进行请求
      store, // 必填属性
    }
    
    return (
      <div className="oa">
        <div className="content-header">
          <span className="mr24">复购挖掘</span>
          <Cascader
            placeholder="请选择区域"
            value={defaultNames}
            fieldNames={{label: 'name', value: 'name'}}
            expandTrigger="hover"
            changeOnSelect
            options={window.__keeper.projectTree}
            onChange={this.selectPro}
            style={{width: 160, marginRight: '8px'}}
            showSearch={this.filter}
          />
          <Select 
            size="small"
            allowClear
            style={{width: 160}} 
            placeholder="产品业态"
            onChange={this.selectFormat}
          >
            {
              formatList.map(item => <Option key={item}>{item}</Option>)
            }
          </Select> 
        </div> 
        <div className="ml16 mr16 mt72">
          <Spin spinning={loading}>
            <OverviewCardWrap cards={cards} />
            <div className="bgf mb16 pt16">
              <div className="ml24 fs14 c85">复购人群特征分布</div>
              <div className="p24 pt8 dfjs">
                <List store={store} />
                <Chart getDraw={draw => this.getDraw = draw} store={store} />
              </div>
            </div>
          </Spin>
          {/* {
            tgiMerit[0] ? <ListContent {...listConfig} /> : null
          } */}
          <ListContent {...listConfig} />
        </div>
      </div>
    )
  }
}
