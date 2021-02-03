import React, {Component} from 'react'
import {Timeline, DatePicker, Select, Menu, Spin} from 'antd'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'

import {OmitTooltip, NoData} from '../component'

const {Option} = Select
const {RangePicker} = DatePicker
const {SubMenu} = Menu

const optionTime = [
  {name: '近一周', value: 7},
  {name: '近一月', value: 30},
  {name: '近三月', value: 90},
  {name: '近半年', value: 182},
  {name: '近一年', value: 365},
]

@observer
export default class Contact extends Component {
  constructor(props) {
    super(props)
    this.store = props.store

    this.store.pastDate(7) // 永久历史时间
  }

  componentDidMount() {
    this.store.getUnitTable()
    this.store.getUnitEvent()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.ident !== this.props.ident) {
      this.store.pastDate(7)
      this.store.tableName = null
    }
  }

  @action selectTime = v => {
    if (v) {
      this.store.pastDate(v)
    } else {
      this.store.pastDate(7)
    }
    this.store.getUnitEvent()
  }

  @action selectTable = v => {
    this.store.tableName = v
    this.store.getUnitEvent()
  }

  @action setContact = v => {
    return (
      v.detailContent.map(item => (
        // <Menu onClick={this.handleClick} mode="inline">
        //   <SubMenu key="sub1" title={item.tableZhName}>
        //     <div style={{minHeight: '24px', lineHeight: '24px', fontSize: '12px'}}>
        //       <OmitTooltip text={item} maxWidth={200} />
        //     </div>
        //   </SubMenu>
        // </Menu>
        <div style={{minHeight: '24px', lineHeight: '24px', fontSize: '12px', marginRight: '8px'}}>
          {/* <OmitTooltip text={item} maxWidth={200} /> */}
          {item}
        </div>
      ))
    )
  }

  handleClick = e => {
    console.log('click ', e)
  }

  render() {
    const {unitEvents, unitTables, contactLoading, unitTableList} = this.store
    return (
      <div className="m16 time-list">
        <Spin spinning={contactLoading}>
          <div className="dfjs mb16">
            {/* <RangePicker 
            style={{width: '60%'}} 
          /> */}
            <Select defaultValue={7} allowClear style={{width: '40%'}} placeholder="请选择时间" onChange={this.selectTime}>
              {
                optionTime.map(item => <Option value={item.value}>{item.name}</Option>)
              }
            </Select>
            <Select allowClear style={{width: '40%'}} placeholder="业务场景" onChange={this.selectTable}>
              {
                unitTables.map(item => <Option value={item.tableName}>{item.tableZhName}</Option>)
              }
            </Select>
          </div>
          <Timeline mode="left" style={{marginLeft: '-58%'}}>
            {
              unitEvents.map(item => {
                return item.detailsList.map(items => {
                  if (items.detailContent) {
                    return (
                      <Timeline.Item label={items.monthDay} position="left">
                        <Menu onClick={this.handleClick} mode="inline">
                          <SubMenu key="sub1" title={items.tableZhName}>
                            {this.setContact(items)}
                          </SubMenu>
                        </Menu>
                      </Timeline.Item>
                    )
                  }
                  return (
                    <Timeline.Item color="green" style={{height: '24px', fontSize: '14px'}} label={items.monthDay} position="left" />
                  )
                })
              })
            }
          </Timeline>
          {
            unitEvents.length ? null : (<NoData style={{marginTop: '60%'}} text="暂无数据" size="small" />)
          }
        </Spin>
      </div>
    )
  }
}
