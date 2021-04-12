import React, {Component} from 'react'
import {Timeline, Button, Select, Menu, Spin} from 'antd'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {ShrinkOutlined, ArrowsAltOutlined, RetweetOutlined} from '@ant-design/icons'

import {NoData} from '../component'

const {Option} = Select
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

    // this.store.pastDate(365) // 永久历史时间
  }

  componentDidMount() {
    // this.store.getUnitTable()
    this.store.getUnitEvent()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.ident !== this.props.ident) {
      // this.store.pastDate(365)
      this.store.tableName = null
    }
  }

  // @action selectTime = v => {
  //   if (v) {
  //     this.store.pastDate(v)
  //   } else {
  //     this.store.pastDate(365)
  //   }
  //   this.store.getUnitEvent()
  // }

  @action selectTable = v => {
    this.store.tableName = v
    this.store.getUnitEvent()
  }

  @action setContact = v => {
    return (
      v.detailContent.map(item => (
        <div style={{minHeight: '24px', lineHeight: '24px', fontSize: '12px', marginRight: '8px'}}>
          {item}
        </div>
      ))
    )
  }

  // 全部展开menu
  @action openMenu = () => {
    this.store.openKeys = this.store.cateList
  }
  // 关闭menu
  @action closeMenu = () => {
    this.store.openKeys = []
  }
  // 点击展开
  @action clickMenu = v => {
    this.store.openKeys = v
  }

  render() {
    const {unitEvents, contactLoading, openKeys, getUnitEvent} = this.store
    return (
      <div className="m16 mt8 time-list">
        <div className="dfjc">
          <div className="mb16">业务触点</div>
          <div className="far mr16">
            <RetweetOutlined onClick={getUnitEvent} />
            <ArrowsAltOutlined style={{margin: '0px 8px'}} onClick={this.openMenu} />
            <ShrinkOutlined onClick={this.closeMenu} />
          </div>
        </div>
        
        <Spin spinning={contactLoading}>
          <Timeline mode="left" style={{marginLeft: '-58%'}}>
            {
              unitEvents.map(items => {
                return items.detailsList.map(item => {
                  // 存放menu key
                  if (item.monthDay) this.store.cateList.push(item.monthDay)
                  // 生成时间轴节点内容
                  if (item.detailContent) {
                    return (
                      <Timeline.Item label={item.monthDay} position="left">
                        <Menu 
                          openKeys={openKeys} 
                          onOpenChange={v => this.clickMenu(v)}
                          mode="inline"
                        >
                          <SubMenu key={item.monthDay} title={item.tableZhName}>
                            {this.setContact(item)}
                          </SubMenu>
                        </Menu>
                      </Timeline.Item>
                    )
                  }
                  return (
                    <Timeline.Item color="green" style={{height: '24px', fontSize: '14px'}} label={item.monthDay} position="left" />
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
