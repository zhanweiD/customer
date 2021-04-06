import {useEffect, useState} from 'react'
import {Select} from 'antd'

import {OverviewCardWrap} from '../component'
import ConversionChart from './conversion-chart'
import DistributionChart from './distribution-chart'
import CustomerChart from './customer-chart'


const {Option} = Select
// 对象指标信息卡
const cards = [
  {
    title: '累计签约金额',
    tooltipText: '累计签约金额',
    values: [`${0}亿元`, '同比下降0%'],
    valueTexts: [`累计认购金额： ${0}`],
  }, {
    title: '累计签约套数',
    tooltipText: '累计签约套数',
    values: [`${0}套`],
    valueTexts: [`去化率 ${'0.00%'}`],
  }, {
    title: '客户总数',
    tooltipText: '客户总数',
    values: [`${0}万人`],
    valueTexts: [`新增客户数 ${0}`],
  }, {
    title: '来访客户组数',
    tooltipText: '来访客户组数',
    values: [`${0}组`],
    valueTexts: [`来访率 ${0}`],
  },
]

const Overview = () => {
  return (
    <div className="overview">
      <div className="content-header">
        <span>客户中心</span>
        <Select style={{width: 128, marginLeft: '8px', marginRight: '8px'}} defaultValue="1">
          <Option value="1">全集团</Option>
          <Option value="2">浙江</Option>
        </Select>
        <Select style={{width: 128}} defaultValue="1">
          <Option value="1">最近一周</Option>
        </Select>
      </div>
      <div className="bgf m16 overview-count">
        <div className="content-header">总览</div>
        <div className="p16"><OverviewCardWrap cards={cards} /></div>
      </div>
      <div className="d-flex m16">
        <div className="mr16" style={{width: '70%'}}>
          <ConversionChart />
          <DistributionChart />
        </div>
        <div style={{width: '30%'}}>
          <CustomerChart />
        </div>
      </div>
    </div>
  )
}
export default Overview
