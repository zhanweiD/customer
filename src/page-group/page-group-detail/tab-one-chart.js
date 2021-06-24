/* eslint-disable no-unused-expressions */
import React, {useRef, useEffect} from 'react'
import {inject} from 'mobx-react'
import {useObserver} from 'mobx-react-lite'
import {Spin} from 'antd'
import NoData from '../../component/no-data'


export default inject('store')(({store}) => {
  const chartRef = useRef(null)
  // let chartInstance = null

  const renderChart = () => {
    const renderedInstance = echarts.getInstanceByDom(chartRef.current)
    if (renderedInstance) {
      store.chartInstance = renderedInstance
    } else {
      store.chartInstance = echarts.init(chartRef.current)
    }

    store.chartInstance.setOption(store.option)
  }

  const prepareChart = () => {
    const renderedInstance = echarts.getInstanceByDom(chartRef.current)
    if (renderedInstance) {
      store.chartInstance = renderedInstance
    } else {
      store.chartInstance = echarts.init(chartRef.current)
    }
  }

  const resize = () => {
    store.chartInstance && store.chartInstance.resize()
  }

  useEffect(() => {
    prepareChart()
    store.getTopList(store.id)

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  return useObserver(() => (
    <div>
      <Spin spinning={store.chartSpinning}>
        <div className="FBH FBAC FBJC" style={{height: '500px'}}>
          <NoData 
             
            style={{
              visibility: store.chartVis ? 'hidden' : 'visible',
              position: 'absolute',
            }} 
          />
          <div 
            ref={chartRef} 
            style={{
              width: '100%', 
              height: '500px', 
              visibility: store.chartVis ? 'visible' : 'hidden',
            }} 
          />
        </div>
      </Spin>
    </div>
  ))
})
