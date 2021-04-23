import React, {Component} from 'react'

import {Drawer, Button, Spin} from 'antd'
import {action, toJS} from 'mobx'
import {inject, observer} from 'mobx-react'
import Tree from './drawer-tree'
import Chart from './drawer-chart'
import {NoData} from '../../component'

@inject('store')
@observer
export default class DrawerAnalysis extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  @action onClose = () => {
    this.store.aysVisible = false
    this.store.tagChartData = []
    this.store.checkList = []
  }

  render() {
    const {aysVisible, tagChartData, chartLoading} = this.store

    const drawerConfig = {
      title: '数据分析',
      visible: aysVisible,
      closable: true,
      width: 1120,
      maskClosable: false,
      destroyOnClose: true,
      onClose: this.onClose,
    }
  
    return (
      <Drawer
        {...drawerConfig}
      >
        <div className="tab-card FBH">
          <div className="p24 pl16 pr16" style={{border: '1px solid #f0f0f0', minHeight: 'calc(100vh - 148px)'}}>
            <Tree />
          </div>
          <div 
            className="FB1 ml16 p24 pl16 pr0" 
            style={{border: '1px solid #f0f0f0', minHeight: 'calc(100vh - 148px)'}}
          >
            <Spin spinning={chartLoading}>

              {
                tagChartData.length ? (
                  tagChartData.map(item => (
                    <div className="fl pr16 pb16" style={{width: '50%'}}>
                      <Chart data={item.data} title={item.tagName} />
                    </div>
                  ))
                ) : <div className="bgf mt16" style={{height: 'calc(100vh - 314px)'}}><NoData text="暂无数据，请选择标签" /></div>
              }
            </Spin>

          </div>
        </div>
        <div className="bottom-button">
          <Button type="primary" onClick={this.onClose}>关闭</Button>
        </div>
      </Drawer>
    )
  }
}
