import React, {Component} from 'react'
import {observer} from 'mobx-react'
import {action} from 'mobx'

import {DatePicker, Select, Cascader} from 'antd'

import Chart from './chart'
import Contact from './contact'

const {RangePicker} = DatePicker
const {Option} = Select

@observer
export default class BusinessContact extends Component {
  drawSaveTrend = null
  constructor(props) {
    super(props)
    this.store = props.store

    this.store.getBizType()
  }

  // 选择日期
  @action changePicker = v => {
    if (v) {
      this.store.businessParams.starmTime = v[0].format('YYYY-MM-DD')
      this.store.businessParams.endTime = v[1].format('YYYY-MM-DD')
    } else {
      this.store.businessParams.starmTime = null
      this.store.businessParams.endTime = null
    }
    
    this.store.getPieChart((pieData, total, barData) => {
      this.drawSaveTrend(pieData, total, barData)
    })
    this.store.getUnitEvent()
  }

  // 选择触点类型
  @action changeEventType = v => {
    this.store.businessParams.eventType = v

    this.store.getPieChart((pieData, total, barData) => {
      this.drawSaveTrend(pieData, total, barData)
    })
    this.store.getUnitEvent()
  }

  // 选择业务类型
  @action changeBizCode = v => {
    this.store.businessParams.bizCode = v

    this.store.getPieChart((pieData, total, barData) => {
      this.drawSaveTrend(pieData, total, barData)
    })
    this.store.getUnitEvent()
  }

  render() {
    const {businessList} = this.store
    return (
      <div style={{height: 'calc(100vh - 392px)'}}>
        <div className="dfjf mt16 mr16">
          <RangePicker onChange={this.changePicker} />
          <Cascader
            placeholder="业务类型"
            options={businessList}
            fieldNames={{label: 'bizName', value: 'bizCode'}}
            expandTrigger="hover"
            style={{margin: '0px 8px'}} 
            onChange={this.changeBizCode}
          />
          <Select onChange={this.changeEventType} placeholder="触点类型">
            <Option value={0}>线上触点</Option>
            <Option value={1}>线下触点</Option>
          </Select>
        </div>
        <div className="d-flex mb16">
          <Chart store={this.store} getDraw={drawSaveTrend => this.drawSaveTrend = drawSaveTrend} />
          <Contact store={this.store} />
        </div>
      </div>
    )
  }
}
