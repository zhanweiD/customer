import React, {Component} from 'react'
import {observer} from 'mobx-react'
import {DatePicker, Select} from 'antd'

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

    // this.store.getBizType()
  }
  render() {
    return (
      <div style={{height: 'calc(100vh - 392px)'}}>
        <div className="dfjf mt16 mr16">
          <RangePicker />
          <Select onChange={v => console.log(v)} style={{margin: '0px 8px'}} placeholder="触点类型">
            <Option value={0}>线上触点</Option>
            <Option value={1}>线下触点</Option>
          </Select>
          <Select placeholder="业务类型">
            <Option value="2">11</Option>
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
