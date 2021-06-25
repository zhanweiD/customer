import React, {Component} from 'react'
import {Timeline, Button, Select, Menu, Spin} from 'antd'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {ShrinkOutlined, ArrowsAltOutlined, RetweetOutlined} from '@ant-design/icons'
import dropDownIcon from './icon/drop-down-icon.svg'
import openIcon from './icon/open-icon.svg'
import packupIcon from './icon/packup-icon.svg'

import {NoData} from '../component'

const {SubMenu} = Menu


@observer
export default class Contact extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  componentDidMount() {
    this.store.getUnitEvent()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.ident !== this.props.ident) {
      this.store.tableName = null
    }
  }

  @action selectTable = v => {
    this.store.tableName = v
    this.store.getUnitEvent()
  }

  @action setContact = v => {
    return (
      v.detailContent.map(item => (
        <div style={{minHeight: '24px', lineHeight: '24px', fontSize: '14px', marginRight: '8px'}}>
          {item}
        </div>
      ))
    )
  }

  // 全部展开menu
  @action openMenu = () => {
    this.store.isOpen = true
    this.store.openKeys = this.store.cateList
  }
  // 关闭menu
  @action closeMenu = () => {
    this.store.isOpen = false
    this.store.openKeys = []
  }
  // 点击展开
  @action clickMenu = v => {
    this.store.openKeys = v
  }

  render() {
    const {unitEvents, contactLoading, openKeys, getUnitEvent, isOpen} = this.store
    return (
      <div className="m16 mb0 time-list">
        <div className="dfjc">
          <div className="mb16">业务触点</div>
          <div className="far hand">
            {
              isOpen ? (
                <span onClick={this.closeMenu}>
                  <img src={packupIcon} alt="" />
                </span>
              ) : (
                <span onClick={this.openMenu}>
                  <img src={openIcon} alt="" />
                </span>
              )
            }
            {/* <RetweetOutlined onClick={getUnitEvent} />
            <ArrowsAltOutlined style={{margin: '0px 8px'}} onClick={this.openMenu} />
            <ShrinkOutlined onClick={this.closeMenu} /> */}
          </div>
        </div>
        
        <Spin spinning={contactLoading}>
          <Timeline mode="left" style={{marginLeft: '-20%'}}>
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
                          expandIcon={<img src={dropDownIcon} alt="" />}
                          // overflowedIndicator={<img style={{transform: 'rotate(180deg)'}} src={dropDownIcon} alt="" />}
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
            unitEvents.length ? null : (<NoData style={{marginTop: '60%'}} text="暂无数据" />)
          }
        </Spin>
      </div>
    )
  }
}
