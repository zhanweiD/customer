import {useEffect, useState} from 'react'
import {Select, Cascader, Spin} from 'antd'

import OverviewCardWrap from './overview-card'
import {authView} from '../component'
import ConversionChart from './conversion-chart'
import DistributionChart from './distribution-chart'
import CustomerChart from './customer-chart'
import TransformationTrend from './transformation-trend'
import ChannelDistribution from './channel-distribution'
import Cloud from './cloud'
import io from './io'
import {errorTip} from '../common/util'
import addCustomer from '../icon/add-customer.svg'
import customer from '../icon/customer.svg'
import setOf from '../icon/set-of.svg'
import amount from '../icon/amount.svg'

import dropdown from '../icon/dropdown.svg'


const {Option} = Select

const optionTime = [
  // {name: '近一周', value: 7},
  // {name: '近一月', value: 30},
  // {name: '近一季', value: 90},
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
  const [orglength, setOrglength] = useState(1)
  const [projectCode, setProjectCode] = useState(null) // 项目code
  const [orgList, setOrgList] = useState([]) // 组织架构
  const [card, setCard] = useState({}) // 指标卡
  const [orgLoading, setOrgLoading] = useState(false)
  const [isScroll, setIsScroll] = useState(false)
  const [timeStart, setTimeStart] = useState(pastDate(365))
  const [timeEnd, setTimeEnd] = useState(moment(+date.getTime()).format(dateFormat))

  // 组织架构
  async function getOrg() {
    try {
      const res = await io.getOrg()
      setOrgList(listToTree(res))
      setOrg(listToTree(res)[0].orgCode)
    } catch (err) {
      errorTip(err.message)
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
      errorTip(err.messsage)
    } finally {
      setOrgLoading(false)
    }
  }

  // 对象指标信息卡
  const cards = () => {
    if (!card.signAmount) return []
    const signAmount = card.signAmount.match(/\d+\.\d+/g)
    const signAmountUnit = card.signAmount.split(signAmount)
    const subscriptionAmount = card.subscriptionAmount.match(/\d+\.\d+/g)
    const subscriptionAmountUnit = card.subscriptionAmount.split(subscriptionAmount)

    const signHouseCount = parseInt(card.signHouseCount, 10)
    const signHouseCountUnit = card.signHouseCount.split(signHouseCount)

    const allCustCount = parseInt(card.allCustCount, 10)
    const allCustCountUnit = card.allCustCount.split(allCustCount)
    const newCustCount = parseInt(card.newCustCount, 10)
    const newCustCountUnit = card.newCustCount.split(newCustCount)

    const visitCustCount = parseInt(card.visitCustCount, 10)
    const visitCustCountUnit = card.visitCustCount.split(visitCustCount)
    return [
      {
        title: `累计签约金额 (${signAmountUnit[1]})`,
        tooltipText: '累计签约金额',
        values: [signAmount || 0, `同比${card.signTotalAmountRise || 0}`],
        valueTexts: [`累计认购金额 (${subscriptionAmountUnit[1] || '万元'})`, subscriptionAmount || 0],
        fontStyle: {active: {size: 26, viceSize: 12, color: '#16324e'}, color: 'rgba(22, 50, 78, 0.85)'},
        icon: <img src={amount} alt="累计签约金额" />,
      }, {
        title: `累计签约套数 (${signHouseCountUnit[1]})`,
        tooltipText: '累计签约套数',
        values: [signHouseCount || 0],
        valueTexts: ['去化率', card.removalRate || 0],
        fontStyle: {active: {size: 26, viceSize: 12, color: '#16324e'}, color: 'rgba(22, 50, 78, 0.85)'},
        icon: <img src={setOf} alt="累计签约套数" />,
      }, {
        title: `客户总数 (${allCustCountUnit[1]})`,
        tooltipText: '客户总数',
        values: [allCustCount || 0],
        valueTexts: [`新增客户数 (${newCustCountUnit[1]})`, newCustCount || 0],
        fontStyle: {active: {size: 26, viceSize: 12, color: '#16324e'}, color: 'rgba(22, 50, 78, 0.85)'},
        icon: <img src={addCustomer} alt="客户总数" />,
      }, {
        title: `来访客户人数 (${visitCustCountUnit[1]})`,
        tooltipText: '来访客户人数',
        values: [visitCustCount || 0],
        valueTexts: ['来访率', card.visitCustRate || 0],
        fontStyle: {active: {size: 26, viceSize: 12, color: '#16324e'}, color: 'rgba(22, 50, 78, 0.85)'},
        icon: <img src={customer} alt="来访客户人数" />,
      },
    ]
  }

  const changeOrg = (v, item) => {
    setOrglength(v.length)
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
    <div 
      id="overview" 
      className="overview oa" 
      onScroll={() => {
        if (document.getElementById('overview').scrollTop === 0) {
          setIsScroll(false)
        } else {
          setIsScroll(true)
        }
      }}
    >
      <div className={`content-header-fixed FBH ${isScroll ? 'header-scroll' : ''}`}>
        <span>客户总览</span>
        <div style={{width: '60%'}}>
          {
            org ? (
              <Cascader
                defaultValue={[org]}
                changeOnSelect
                allowClear={false}
                options={orgList}
                fieldNames={{label: 'orgName', value: 'orgCode'}}
                expandTrigger="hover"
                style={{margin: '0px 8px', width: orglength > 2 ? 320 : 180}} // min-width因position失效
                onChange={changeOrg}
                suffixIcon={<img className="imgSize" src={dropdown} alt="dropdown" />}
              />
            ) : null
          }
          <Select 
            style={{width: 128}} 
            onChange={changeTime}
            defaultValue={365}
            suffixIcon={<img src={dropdown} alt="dropdown" />}
          >
            {optionTime.map(item => <Option value={item.value}>{item.name}</Option>)}
          </Select>
        </div>
      </div>
      <Spin spinning={orgLoading}>
        <div className="p16 pb0 mt48">
          <OverviewCardWrap cards={cards()} />
        </div>
        {
          org ? (
            <div className="m16">
              <div className="mb16 customer-chart-box">
                <div className="period-header">客户转化率</div>
                <div className="bgf customer-chart">
                  <CustomerChart 
                    orgCodes={org} 
                    timeStart={timeStart}
                    timeEnd={timeEnd}
                    projectCode={projectCode}
                  />
                  {/* <ConversionChart 
                    orgCodes={org} 
                    timeStart={timeStart}
                    timeEnd={timeEnd}
                    projectCode={projectCode}
                  /> */}
                </div>
              </div>

              <div className="customer-chart-box">
                <div className="period-header">转化趋势</div>
                <TransformationTrend 
                  orgCodes={org} 
                  timeStart={timeStart}
                  timeEnd={timeEnd}
                  projectCode={projectCode}
                />
              </div>
              
              <div className="FBH">
                <div style={{width: '50%'}} className="mr16 customer-chart-box">
                  <div className="period-header">客户分布</div>
                  <DistributionChart 
                    orgCodes={org} 
                    timeStart={timeStart}
                    timeEnd={timeEnd}
                    projectCode={projectCode}
                  />
                </div>
                <div style={{width: '50%'}}>
                  <div className="customer-chart-box">
                    <div className="period-header">
                      客户渠道分布
                    </div>
                    <ChannelDistribution 
                      orgCodes={org} 
                      timeStart={timeStart}
                      timeEnd={timeEnd}
                      projectCode={projectCode}
                    />
                  </div>
                  <div className="bgf customer-chart-box" style={{height: '350px', width: '100%'}}>
                    <div className="period-header">
                      客户心声
                    </div>
                    <div className="customer-chart">
                      <Cloud
                        orgCodes={org} 
                        timeStart={timeStart}
                        timeEnd={timeEnd}
                        projectCode={projectCode}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null
        }
      </Spin>
    </div>
  )
}
export default authView(Overview)
