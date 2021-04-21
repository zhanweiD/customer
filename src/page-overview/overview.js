import {useEffect, useState} from 'react'
import {Select, Cascader, Spin} from 'antd'

import {OverviewCardWrap} from '../component'
import ConversionChart from './conversion-chart'
import DistributionChart from './distribution-chart'
import CustomerChart from './customer-chart'
import io from './io'
import {errorTip} from '../common/util'


const {Option} = Select

const optionTime = [
  {name: '近一周', value: 7},
  {name: '近一月', value: 30},
  {name: '近一季', value: 90},
  {name: '近一年', value: 365},
]
const dateFormat = 'YYYY-MM-DD'
const date = new Date()
function pastDate(v) {
  return moment(+date.getTime() - 1000 * 60 * 60 * 24 * v).format(dateFormat)
}
function listToTree(data) {
  const newData = _.cloneDeep(data)

  newData.forEach(item => {
    const children = newData.filter(sitem => sitem.parentCode === item.orgCode)
    if (children.length && !item.children) item.children = children
  })
  return newData.filter(item => item.parentCode === '-1')
}

const Overview = () => {
  const [org, setOrg] = useState(null) // 区域
  const [projectCode, setProjectCode] = useState(null) // 项目code
  const [orgList, setOrgList] = useState([]) // 组织架构
  const [card, setCard] = useState({}) // 指标卡
  const [orgLoading, setOrgLoading] = useState(false)
  const [timeStart, setTimeStart] = useState(pastDate(7))
  const [timeEnd, setTimeEnd] = useState(moment(+date.getTime()).format(dateFormat))

  // 组织架构
  async function getOrg() {
    try {
      const res = await io.getOrg()
      setOrgList(listToTree(res))
      setOrg(listToTree(res)[0].orgCode)
    } catch (err) {
      errorTip(err)
    }
  }

  // 指标卡
  async function getCard() {
    setOrgLoading(true)
    try {
      const res = await io.getCard({
        timeEnd,
        timeStart,
        orgCodes: org,
        projectCode,
      })
      setCard(res)
    } catch (err) {
      errorTip(err)
    } finally {
      setOrgLoading(false)
    }
  }

  // 对象指标信息卡
  const cards = [
    {
      title: '累计签约金额',
      tooltipText: '累计签约金额',
      values: [card.signAmount || 0, `同比${card.signTotalAmountRise || 0}`],
      valueTexts: [`累计认购金额： ${card.subscriptionAmount || 0}`],
      fontStyle: {active: {size: 26, viceSize: 12, color: '#fff'}, color: '#fff'},
    }, {
      title: '累计签约套数',
      tooltipText: '累计签约套数',
      values: [card.signHouseCount || 0],
      valueTexts: [`去化率 ${card.removalRate || 0}`],
      fontStyle: {active: {size: 26, viceSize: 12, color: '#fff'}, color: '#fff'},
    }, {
      title: '客户总数',
      tooltipText: '客户总数',
      values: [card.allCustCount || 0],
      valueTexts: [`新增客户数 ${card.newCustCount || 0}`],
      fontStyle: {active: {size: 26, viceSize: 12, color: '#fff'}, color: '#fff'},
    }, {
      title: '来访客户人数',
      tooltipText: '来访客户人数',
      values: [card.visitCustCount || 0],
      valueTexts: [`来访率 ${card.visitCustRate || 0}`],
      fontStyle: {active: {size: 26, viceSize: 12, color: '#fff'}, color: '#fff'},
    },
  ]

  const changeOrg = (v, item) => {
    let newOrg = null

    if (item[item.length - 1].level) {
      setProjectCode(null)
      v.forEach(sitem => {
        if (newOrg) newOrg = `${newOrg},${sitem}`
        else newOrg = sitem
      })
    } else {
      setProjectCode(v[v.length - 1])
      for (let i = 0; i < v.length - 1; i++) {
        if (newOrg) newOrg = `${newOrg},${v[i]}`
        else newOrg = v[i]
      }
    }
    // for (let i = 0; i < v.length - 1; i++) {
    //   if (newOrg) newOrg = `${newOrg},${v[i]}`
    //   else newOrg = v[i]
    // }
    console.log(newOrg)
    setOrg(newOrg)
  }

  const changeTime = v => {
    setTimeStart(pastDate(v))
  }

  useEffect(() => {
    getCard()
  }, [org, projectCode, timeStart])

  useEffect(() => {
    getOrg()
  }, [])

  return (
    <div className="overview oa">
      <div className="content-header">
        <span>客户中心</span>
        {
          org ? (
            <Cascader
              defaultValue={[org]}
              changeOnSelect
              allowClear={false}
              options={orgList}
              fieldNames={{label: 'orgName', value: 'orgCode'}}
              expandTrigger="hover"
              style={{margin: '0px 8px'}} 
              onChange={changeOrg}
            />
          ) : null
        }
        <Select 
          style={{width: 128}} 
          onChange={changeTime}
          defaultValue={7}
        >
          {optionTime.map(item => <Option value={item.value}>{item.name}</Option>)}
        </Select>
      </div>
      <Spin spinning={orgLoading}>
        <div className="bgf m16 mt72">
          <div className="overview-header">总览</div>
          <div className="p16">
            <OverviewCardWrap cards={cards} />
          </div>
        </div>
        {
          org ? (
            <div className="d-flex m16">
              {/* <div className="m16"> */}
              <div className="mr16" style={{width: '70%'}}>
                {/* <div className="mr16 mb16" style={{width: '100%'}}> */}
                <ConversionChart 
                  orgCodes={org} 
                  timeStart={timeStart}
                  timeEnd={timeEnd}
                  projectCode={projectCode}
                />
                <DistributionChart 
                  orgCodes={org} 
                  timeStart={timeStart}
                  timeEnd={timeEnd}
                  projectCode={projectCode}
                />
              </div>
              <div style={{width: '30%'}}>
                {/* <div style={{width: '100%'}}> */}
                <CustomerChart 
                  orgCodes={org} 
                  timeStart={timeStart}
                  timeEnd={timeEnd}
                  projectCode={projectCode}
                />
              </div>
            </div>
          ) : null
        }
      </Spin>
    </div>
  )
}
export default Overview
