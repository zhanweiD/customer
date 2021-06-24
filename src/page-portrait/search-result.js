import React, {Component} from 'react'
import {toJS, action} from 'mobx'
import {observer} from 'mobx-react'
import {Tabs, Button, Spin, message} from 'antd'
import {LeftOutlined, RightOutlined} from '@ant-design/icons'

import {Loading, OmitTooltip, NoData} from '../component'
import Cloud from './cloud'
import TagDepict from './tagDepict'
import User from './user-information'
import BusinessContact from './business-contact'

const {TabPane} = Tabs

@observer
export default class SearchResult extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  // 卡片信息处理
  setCard = item => {
    const cards = []
    // eslint-disable-next-line no-restricted-syntax
    for (const key in item) {
      if (key !== 'ident') {
        cards.push(`${key}: ${item[key]}`)
      }
    }
    return (
      <div 
        style={{height: '56px', paddingTop: '12px', width: '108px', textAlign: 'left'}}
        onClick={() => this.btnClick(item)}
      >
        <OmitTooltip text={cards[1]} maxWidth={108} />
        <OmitTooltip text={cards[0]} maxWidth={108} />
      </div>
    )
  }
  // 切换个体
  @action selectPor = v => {
    this.store.ident = v
    this.store.toAllTag = true // 标签模式切换为列表
  }
  @action btnClick = v => {
    this.store.unitName = v.姓名
  }

  // 上一页
  @action prevPage = () => {
    this.store.isLast = false
    if (this.store.currentPage === 2) {
      this.store.isFirst = true
    }
    if (this.store.currentPage - 1) {
      this.store.currentPage -= 1
      this.store.getUnitList()
    } 
    // this.store.currentPage = this.store.currentPage - 1 ? this.store.currentPage - 1 : 1
  }

  @action nextPage = () => {
    this.store.currentPage += 1
    this.store.isFirst = false
    this.store.getUnitList()
  }

  // 上下页切换处理
  setOperationsSlot = () => {
    const {isFirst, isLast} = this.store
    if (isLast && isFirst) {
      return ({
        left: <LeftOutlined style={{fontSize: '32px', color: 'rgba(0, 0, 0, 0.25)', marginLeft: '16px', cursor: 'not-allowed'}} />,
        right: <RightOutlined style={{fontSize: '32px', color: 'rgba(0, 0, 0, 0.25)', marginRight: '16px', cursor: 'not-allowed'}} />,
      })
    }
    if (isFirst) {
      return ({
        left: <LeftOutlined style={{fontSize: '32px', color: 'rgba(0, 0, 0, 0.25)', marginLeft: '16px', cursor: 'not-allowed'}} />,
        right: <RightOutlined style={{fontSize: '32px', marginRight: '16px', color: '#fff'}} onClick={this.nextPage} />,
      })
    }
    if (isLast) {
      return ({
        left: <LeftOutlined style={{fontSize: '32px', marginLeft: '16px', color: '#fff'}} onClick={this.prevPage} />,
        right: <RightOutlined style={{fontSize: '32px', marginRight: '16px', color: 'rgba(0, 0, 0, 0.25)', cursor: 'not-allowed'}} />,
      })
    }
    return ({
      left: <LeftOutlined style={{fontSize: '32px', marginLeft: '16px', color: '#fff'}} onClick={this.prevPage} />,
      right: <RightOutlined style={{fontSize: '32px', marginRight: '16px', color: '#fff'}} onClick={this.nextPage} />,
    })
  }

  render() {
    const {tabLoading, unitList, ident, loading, changeLoading, isJump} = this.store
    return (
      <div className="mr16 mt16">
        <Spin spinning={tabLoading || changeLoading}>
          {
            isJump ? (
              // <Spin spinning={changeLoading}>
              <div className="d-flex user-info mb16">
                <div className="basis-info bgf box-border">
                  <User store={this.store} />
                </div>
                <div className="user-portrait ml16 bgf">
                  <Tabs defaultActiveKey="1">
                    <TabPane tab="标签描摹" key="1">
                      <TagDepict store={this.store} />
                    </TabPane>
                    <TabPane tab="业务触点" key="2">
                      <BusinessContact store={this.store} />
                    </TabPane>
                  </Tabs>
                </div>
              </div>
            ) : null
          }
          {
            unitList.length ? (
              <Tabs 
                defaultValue={ident} 
                activeKey={ident}
                tabPosition="top" 
                type="card"
                tabBarGutter={16}
                onChange={this.selectPor} 
                tabBarExtraContent={unitList.length ? this.setOperationsSlot() : []}
              >
                {unitList.map((item, i) => (
                  <TabPane tab={this.setCard(item)} key={item.ident}>
                    {
                      ident === item.ident && (
                        // <Spin spinning={changeLoading}>
                        <div className="d-flex user-info mb16">
                          <div className="basis-info bgf box-border">
                            <User store={this.store} />
                          </div>
                          <div className="user-portrait ml16 bgf">
                            <Tabs defaultActiveKey="1">
                              <TabPane tab="标签描摹" key="1">
                                <TagDepict store={this.store} index={i} />
                              </TabPane>
                              <TabPane tab="业务触点" key="2">
                                <BusinessContact store={this.store} />
                              </TabPane>
                            </Tabs>
                          </div>
                        </div>
                        // </Spin>
                      )
                    }
                  </TabPane>
                ))}
              </Tabs>
            ) : null
          }
        </Spin>
      </div>
    )
  }
}
