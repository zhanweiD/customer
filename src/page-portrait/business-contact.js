import React, {Component} from 'react'
import {observer} from 'mobx-react'
import {DatePicker, Select} from 'antd'

import Chart from './chart'
import Contact from './contact'

const {RangePicker} = DatePicker
const {Option} = Select

@observer
export default class BusinessContact extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }
  render() {
    return (
      <div style={{height: 'calc(100vh - 392px)'}}>
        <div className="dfjf mt16 mr16">
          <RangePicker />
          <Select style={{margin: '0px 8px'}} placeholder="触点类型">
            <Option value="1">11</Option>
          </Select>
          <Select placeholder="业务类型">
            <Option value="2">11</Option>
          </Select>
        </div>
        <div className="d-flex mb16">
          <Chart store={this.store} />
          <Contact store={this.store} />
        </div>
      </div>
    )
  }
}
