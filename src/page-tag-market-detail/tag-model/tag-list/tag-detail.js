import {Component} from 'react'
import {Modal, Button, Spin, Drawer} from 'antd'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import _ from 'lodash'
import {moneyNumFormat} from '../../../common/util'

import ModalDetail from '../../../component/modal-detail'

const bgColor = '#fff'
const color = ['#1cd389', '#668eff', '#ff6e73', '#8683e6', '#06d3c4']
const fontColor = 'rgba(0,0,0,0.65)'
const iconColor = 'rgba(0,0,0,0.45)'
const titleColor = 'rgba(0,0,0,0.85)'

const pieOption = (data, titleData) => {
  return ({
    backgroundColor: bgColor,
    color,
    tooltip: {
      trigger: 'item',
    },
    title: [{
      text: `{name|覆盖个体数}\n{val|${moneyNumFormat(titleData)}}`,
      top: 'center',
      left: 'center',
      triggerEvent: true,
      textStyle: {
        rich: {
          name: {
            fontSize: 14,
            fontWeight: 'normal',
            color: fontColor,
            padding: [10, 0],
          },
          val: {
            fontSize: 32,
            fontWeight: 'bold',
            color: titleColor,
          },
        },
      },
    },
    ],
    series: [{
      type: 'pie',
      radius: ['40%', '55%'],
      center: ['50%', '50%'],
      data: data.map(item => ({name: item.name, value: item.value})),
      hoverAnimation: false,
      itemStyle: {
        normal: {
          borderColor: bgColor,
          borderWidth: 2,
        },
      },

      label: {
        normal: {
          formatter: params => {
            return (
              `{name|${params.name}}{value|${params.value}}`
            )
          },
          rich: {
            name: {
              fontSize: 12,
              padding: [0, 4, 0, 4],
              color: fontColor,
            },
            percent: {
              fontSize: 12,
              padding: [0, 4, 0, 4],
              color: fontColor,
            },
            value: {
              fontSize: 12,
              color: fontColor,
            },
          },
        },
      },
    }],
  })
}

const barOption = (data, titleData) => {
  return ({
    title: {
      text: `{name|覆盖个体数}：{val|${moneyNumFormat(titleData)}}`,
      left: 10,
      textStyle: {
        rich: {
          name: {
            fontSize: 14,
            fontWeight: 'normal',
            color: fontColor,
            padding: [10, 0],
          },
          val: {
            fontSize: 20,
            fontWeight: 'bold',
            color: titleColor,
          },
        },
      },
    },
    color,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      x: 60,
      bottom: 90,
    },
    dataZoom: [{
      type: 'inside',
    }, {
      type: 'slider',
    }],
    xAxis: {
      data: _.map(data, 'name'),
      silent: false,
      splitLine: {
        show: false,
      },
      splitArea: {
        show: false,
      },
    },
    yAxis: {
      splitArea: {
        show: false,
      },
    },
    series: [{
      type: 'bar',
      data: _.map(data, 'value'),
      // Set `large` for large data amount
      large: true,
    }],
  })
}

@observer
export default class TagDetailModal extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  @action handleCancel = () => {
    this.store.detailVisible = false
    this.store.drawerTagInfo = {}
  }

  componentDidMount() {
    // if (this.refs.chartsPie) {
    //   this.myChartPie = echarts.init(this.refs.chartsPie)

    //   this.myChartPie.setOption(option)

    //   window.addEventListener('resize', () => this.resize())
    // }
  }

  componentDidUpdate(prevProps) {
    if (this.refs.chartsPie && this.store.valueRadios.length > 0) {
      this.myChartPie = echarts.init(this.refs.chartsPie)

      if (this.store.valueRadios.length > 20) {
        this.myChartPie.setOption(barOption(this.store.valueRadios, this.store.nonNullCnt))
      } else {
        this.myChartPie.setOption(pieOption(this.store.valueRadios, this.store.nonNullCnt))
      }

      window.addEventListener('resize', () => this.resize())
    }
  }

  @action resize() {
    this.myChartPie && this.myChartPie.resize()
  }

  render() {
    const {
      detailVisible, drawerTagInfo, tagCateList, valueRadios,
    } = this.store
    const ownCate = tagCateList.find(item => item.id === drawerTagInfo.parentId)
    if (!ownCate) return null

    const content = [{
      name: '标签名称',
      value: drawerTagInfo.name,
    }, {
      name: '标签描述',
      value: drawerTagInfo.descr,
    }, {
      name: '业务类型',
      value: drawerTagInfo.bizText,
    }, {
      name: '所属类目',
      value: ownCate.name,
    }, {
      name: '标签类型',
      value: drawerTagInfo.valueTypeName,
    }]

    const proContent = [{
      name: '责任人',
      value: drawerTagInfo.creator,
    }, {
      name: '创建时间',
      value: moment(+drawerTagInfo.createTime).format('YYYY-MM-DD'),
    }, 
    // {
    //   name: '数据更新时间',
    //   value: drawerTagInfo.createTime,
    // }, {
    //   name: '数据更新周期',
    //   value: drawerTagInfo.valueType,
    // }, 
    {
      name: '数据源',
      value: drawerTagInfo.dataSource,
    }]

    const drawerConfig = {
      title: '标签详情',
      visible: detailVisible,
      width: 525,
      destroyOnClose: true,
      onClose: this.handleCancel,
      // footer: [<Button type="primary" onClick={this.handleCancel}>关闭</Button>],
    }

    return (
      <Drawer {...drawerConfig}>
        <div className="mb16 c85">基础信息</div>
        {/* <ModalDetail data={content} labelWidth={64} />
        <div className="mb16 c85">生产信息</div>
        <ModalDetail data={proContent} labelWidth={64} /> */}
        <ModalDetail data={content} labelWidth={64} />
        <div className="FBH">
          <div
            style={{
              width: '64px',
              fontSize: '12px',
              color: 'rgba(0,0,0,0.45)',
            }}
          >
            取值分布：
          </div>
          {
            valueRadios.length > 0 ? (
              <div
                className="FB1"
                ref="chartsPie"
                style={{
                  height: '400px',
                }}
              />
            ) : (
              <div style={{color: 'rgba(0,0,0,0.65)', lineHeight: '16px', marginLeft: '5px'}}>
                -
              </div>
            )
          }
          
        </div>
        <div style={{marginLeft: '100px'}}>
          {
            valueRadios.map((item, index) => {
              return (
                <div className="FBH FBAC">
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: valueRadios.length > 20 ? color[0] : color[(index % color.length)],
                      marginRight: '8px',
                    }}
                  />
                  <div className="mr8" style={{minWidth: '80px', color: fontColor}}>
                    {
                      item.name
                    }
                  </div>
                  <div className="mr8" style={{width: '60px', color: fontColor}}>
                    {
                      `${item.percent}%`
                    }
                  </div>
                  <div className="mr8" style={{color: fontColor}}>
                    {
                      moneyNumFormat(item.value)
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
      </Drawer>
    )
  }
}
