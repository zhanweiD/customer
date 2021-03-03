import React, {Component} from 'react'
import {toJS, action} from 'mobx'
import {observer} from 'mobx-react'
import {Tabs, Button, Spin, message} from 'antd'
import {LeftOutlined, RightOutlined} from '@ant-design/icons'

import {Loading, OmitTooltip, NoData} from '../component'
import Cloud from './cloud'
import Chart from './chart'
import Cloud1 from './cloud1'
import Contact from './contact'
import User from './user-information'

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
  @action selectPor = v => {
    this.store.ident = v
  }
  @action btnClick = v => {
    this.store.unitName = v.姓名
  }

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
      <div>
        <Spin spinning={tabLoading || changeLoading}>
          {
            isJump ? (
              // <Spin spinning={changeLoading}>
              <div className="d-flex user-info mb16">
                <div className="basis-info bgf box-border">
                  <div className="herder mb16">用户信息</div>
                  <User store={this.store} />
                </div>
                <div className="user-portrait">
                  <Cloud store={this.store} loading={loading} index={1} />
                  <div className="d-flex">
                    <Chart store={this.store} />
                    {/* <Cloud1 store={this.store} loading={loading} index={1} /> */}
                  </div>
                </div>
                <div className="business-contact bgf box-border">
                  <div className="herder">业务触点</div>
                  <Contact store={this.store} ident={ident} />
                </div>
              </div>
              // </Spin>
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
                            <div className="herder mb16">用户信息</div>
                            <User store={this.store} />
                          </div>
                          <div className="user-portrait">
                            <Cloud store={this.store} loading={loading} index={i} />
                            <div className="d-flex">
                              <Chart store={this.store} />
                              {/* <Cloud1 store={this.store} loading={loading} index={i} /> */}
                            </div>
                          </div>
                          <div className="business-contact bgf box-border">
                            <div className="herder">业务触点</div>
                            <Contact store={this.store} ident={ident} />
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
