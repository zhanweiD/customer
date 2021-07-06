/**
 * @description 供需分析
 */
import {Component} from 'react'
import {Link} from 'react-router-dom'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {DatePicker, Select, Spin, Cascader, Button} from 'antd'
import dropdown from '../../icon/dropdown.svg'

import {authView, ListContent} from '../../component'
import {downloadResult} from '../../common/util'
import Chart from './chart'
import store from './store'
import './index.styl'

const {RangePicker} = DatePicker
const {Option} = Select
const dateFormat = 'YYYY-MM-DD'

@observer
class SupplyDemand extends Component {
  columns = [{
    key: 'cstName',
    title: '客户姓名',
    dataIndex: 'cstName',
    fixed: 'left',
    render: (text, record) => {
      if (record.ident && record.id) {
        return <Link target="_blank" to={`/customer/portrait/${record.ident}/${record.id}`}>{text}</Link>
      }
      return text
    },
  }, 
  {
    key: 'intentProjectName',
    title: '意向项目',
    dataIndex: 'intentProjectName',
  }, 
  {
    key: 'intentProjectFormats',
    title: '意向业态',
    dataIndex: 'intentProjectFormats',
  }]
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
      store.getFitList(this.getDraw, this.getDraw1)
      store.getList({...store.reqData, currentPage: 1})
      return
    }

    // 选择条件（一级二级三级）
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

    store.getList({...store.reqData, currentPage: 1})
    store.getFitList(this.getDraw, this.getDraw1)
  }

  filter = (inputValue, path) => {
    return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
  }

  render() {
    const {
      indicators, tableLoading, loading, unFitList, reqData, isScroll,
    } = store
    const listConfig = {
      key: 'id',
      rowKey: 'id',
      initParams: {...store.reqData, index: indicators},
      columns: this.columns,
      tableLoading,
      scroll: {x: 1120},
      buttons: [
        <div className="dfjs mt16 fs14 c85">
          <div className="mt6">
            供需不匹配客户
          </div>
          <div>
            <Select 
              allowClear
              placeholder="请选择指标"
              style={{width: 160, marginRight: '8px'}} 
              getPopupContainer={triggerNode => triggerNode.parentElement}
              suffixIcon={<img src={dropdown} alt="dropdown" />}
              onChange={v => {
                store.indicators = v
                store.getList({...store.reqData, index: v, currentPage: 1})
              }}
            >
              {
                unFitList.map(item => <Option key={item}>{item}</Option>)
              }
            </Select> 
            <Button onClick={() => downloadResult({index: store.indicators, ...store.reqData}, 'supply/export')} style={{marginRight: '24px'}} type="primary">导出</Button>
          </div>
        </div>,   
      ],
      initGetDataByParent: false, // 初始请求 在父层组件处理。列表组件componentWillMount内不再进行请求
      store, // 必填属性
    }
    return (
      <div 
        id="supDemId"
        className="oa"
        onScroll={() => {
          if (document.getElementById('supDemId').scrollTop === 0) {
            store.isScroll = false
          } else {
            store.isScroll = true
          }
        }}
      >
        <div className={`content-header-fixed FBH ${isScroll ? 'header-scroll' : ''}`}>
          <div className="mr8">供需分析</div>
          <div style={{width: 600}}>
            <Cascader
              placeholder="请选择区域"
              fieldNames={{label: 'name', value: 'name'}}
              expandTrigger="hover"
              changeOnSelect
              options={window.__keeper.projectTree}
              onChange={this.selectPro}
              style={{width: 160, marginRight: '8px'}}
              showSearch={this.filter}
              suffixIcon={<img src={dropdown} alt="dropdown" />}
            />
            <RangePicker
              defaultValue={[moment(reqData.reportTimeStart, dateFormat), moment(reqData.reportTimeEnd, dateFormat)]}
              onChange={value => {
                store.reqData = {
                  reportTimeStart: value ? value[0].format('YYYY-MM-DD') : '',
                  reportTimeEnd: value ? value[1].format('YYYY-MM-DD') : '',
                }
                store.getFitList(this.getDraw, this.getDraw1)
                store.getList({...store.reqData, currentPage: 1})
              }}
            />
          </div>
        </div> 
        <div className="ml16 mr16 mt72">
          {/* <Spin spinning={loading}> */}
          {/* <OverviewCardWrap cards={cards} /> */}
          <div className="bgf mb16 mt16 custom-border">
            <Chart
              getDraw={(cb1, cb2) => {
                this.getDraw = cb1
                this.getDraw1 = cb2
              }} 
              store={store}
            />
          </div>
          {/* </Spin> */}
          <div className="custom-border mb16">
            <ListContent {...listConfig} />
          </div>
        </div>
      </div>
    )
  }
}
export default authView(SupplyDemand)
