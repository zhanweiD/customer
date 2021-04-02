import React, {useState, useRef, useEffect} from 'react'
import {Table, Drawer} from 'antd'
import InfoRow from './info-row'
import {pieOption} from './chart-option'


const dataSource = [
  {
    name: '名字',
    descr: 'jkknjkdns',
  },
]

const tagDatas = [
  {
    label: '标签名称',
    value: '意向等级',
  }, {
    label: '标签描述',
    value: '客户购房意向强烈程度，分为4个等级：高意向等级、中等意向等级、一般意向等级、无购房意向',
  }, {
    label: '业务类型',
    value: '地产/营销/到访',
  }, {
    label: '所属类目',
    value: '需求意向/置业需求',
  }, {
    label: '标签类型',
    value: '文本',
  },
]

const pieChart = [
  {
    value: 555,
    name: '报备客户',
  },
  {
    value: 3352,
    name: '到访客户',
  },
  {
    value: 198,
    name: '认筹客户',
  },
  {
    value: 53,
    name: '认购客户',
  },
  {
    value: 10,
    name: '签约客户',
  },
]

export default () => {
  const [drawerVis, setDrawerVis] = useState(false)
  const chartRef = useRef(null)
  let chartInstance = null

  const showTagDetail = () => {
    setDrawerVis(true)
  }

  const columns = [
    {
      dataIndex: 'name',
      title: '标签名称',
      render: (text, record) => <a onClick={showTagDetail}>{text}</a>,
    }, {
      dataIndex: 'descr',
      title: '描述',
    },
  ]

  const renderChart = () => {
    const renderedInstance = echarts.getInstanceByDom(chartRef.current)
    if (renderedInstance) {
      chartInstance = renderedInstance
    } else {
      chartInstance = echarts.init(chartRef.current)
    }

    console.log(pieOption(pieChart, 8888))

    chartInstance.setOption(pieOption(pieChart, 8888))
  }

  useEffect(() => {
    if (chartRef.current && drawerVis) {
      renderChart()
    }
  }, [chartRef, drawerVis])

  return (
    <div>
      <Table 
        columns={columns}
        dataSource={dataSource}
      />
      <Drawer 
        width={560}
        title="标签详情"
        visible={drawerVis}
        onClose={() => setDrawerVis(false)}
      >
        <InfoRow datas={tagDatas} />
        <div className="FBH">
          <div className="black45 nowrap">
            取值分布：
          </div>
          <div ref={chartRef} style={{width: '100%', height: '300px'}} />
        </div>
      </Drawer>
    </div>
  )
}
