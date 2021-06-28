import React, {Component} from 'react'
import {observer} from 'mobx-react'
import {Tabs, Button, Spin, message} from 'antd'

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

  render() {
    const {ident, selectLoading} = this.store
    return (
      <div className="mr16 mt16">
        <Spin spinning={selectLoading}>
          {
            ident ? (
              <div className="d-flex user-info mb16">
                <div className="basis-info bgf box-border">
                  <User store={this.store} />
                </div>
                <div className="user-portrait ml16 bgf">
                  <Tabs defaultActiveKey="1">
                    <TabPane
                      tab={(
                        <span>
                          标签描摹
                        </span>
                      )}
                      key="1"
                    >
                      <TagDepict store={this.store} />
                    </TabPane>
                    <TabPane 
                      tab={(
                        <span>
                          业务触点
                        </span>
                      )} 
                      key="2"
                    >
                      <BusinessContact store={this.store} />
                    </TabPane>
                  </Tabs>
                </div>
              </div>
            ) : null
          }
        </Spin>
      </div>
    )
  }
}
