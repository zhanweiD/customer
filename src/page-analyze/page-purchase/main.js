/**
 * @description 复购模型
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {Link} from 'react-router-dom'
import {action, toJS} from 'mobx'
import {DatePicker, Select, Spin, Cascader, Button} from 'antd'
import dropdown from '../../icon/dropdown.svg'

import {OverviewCardWrap, ListContent, authView} from '../../component'
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
class Purchase extends Component {
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
        return <Link target="_blank" to={`/portrait/${record.ident}/${record.id}`}>{text}</Link>
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
  }]

  filter = (inputValue, path) => {
    return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
  }

  selectPro = (v, item) => {
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
    const {
      cardData, tabLoading, loading, merit, tgiMerit, formatList, defaultNames, isScroll,
    } = store
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
        <div className="dfjs mt16 fs14 c85 pt16">
          <div className="mt6">
            潜在复购客户推荐
          </div>
          <div>
            <Select 
              allowClear
              style={{width: 160, marginRight: '8px'}} 
              placeholder="请选择纬度"
              value={store.merit}
              onChange={v => {
                store.merit = v
                store.getList({...store.reqData, tag: v, currentPage: 1})
              }}
              getPopupContainer={triggerNode => triggerNode.parentElement}
              suffixIcon={<img src={dropdown} alt="dropdown" />}
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
      <div 
        id="purchaseId"
        className="oa"
        onScroll={() => {
          if (document.getElementById('purchaseId').scrollTop === 0) {
            store.isScroll = false
          } else {
            store.isScroll = true
          }
        }}
      >
        <div className={`content-header-fixed FBH FBJB ${isScroll ? 'header-scroll' : ''}`}>
          <div className="mr24">复购挖掘</div>
          <div style={{width: 504}}>
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
              suffixIcon={<img src={dropdown} alt="dropdown" />}
            />
            <Select 
              allowClear
              style={{width: 160}} 
              placeholder="产品业态"
              onChange={this.selectFormat}
              suffixIcon={<img src={dropdown} alt="dropdown" />}
            >
              {
                formatList.map(item => <Option key={item}>{item}</Option>)
              }
            </Select> 
          </div>
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
export default authView(Purchase)
