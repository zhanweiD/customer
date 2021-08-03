import React, {useEffect} from 'react'
import {inject} from 'mobx-react'
import {useObserver} from 'mobx-react-lite'
import {Spin} from 'antd'
import Tree from './tab-two-tree'
import Chart from './tab-two-chart'
import {NoData} from '../../component'

export default inject('store')(
  ({objId, id, store}) => {
    useEffect(() => {
      store.getUsableTag(id)
    }, [])

    return useObserver(() => (
      <div className="tab-card FBH custom-border">
        <div 
          style={{
            border: '1px solid #f0f0f0', 
            width: '200px', 
            overflowX: 'auto',
            height: 'calc(100vh - 228px)',
          }}
        >
          <Tree />
        </div>
        <div className="FB1">
          <Spin spinning={store.tabTwoChartSpining}>
            {
              store.tabTwoChartDatas.length ? (
                store.tabTwoChartDatas.map(item => (
                  <div className="fl pl16 pb12" style={{width: '50%'}}>
                    <Chart data={item.data} title={item.tagName} />
                  </div>
                ))
              ) : <div className="bgf mt16" style={{width: '100%', height: 'calc(100vh - 314px)'}}><NoData text="暂无数据，请选择标签" /></div>
            }
          </Spin>
        </div>
      </div>
    ))
  }
)
