/**
 * @description 渠道拓客分布
 */
import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Spin} from 'antd'
import {pieOption, barOption} from './option'
import quyu from './icon/quyu.png'


@observer
export default class ChartPie extends Component {
  myCloudBar = null

  componentDidMount() {
    this.kpiEcharts = echarts.init(this.refs.cloudBar)
    // this.kpiEcharts.on('click', (params) => {
    //     this.props.onCkick(params.data)
    // });
    window.addEventListener('resize', function () {
      this.kpiEcharts.resize()
    })
    this.kpiEcharts.setOption(this.initChartOption())
  }


  initChartOption() {
    const maskImage = new Image()// 可以根据图片形状生成有形状的词云图
    maskImage.src = quyu
    return {
      // tooltip: {
      //   trigger: 'item',
      //   axisPointer: {
      //     type: 'none',
      //   },
      //   position: 'top',
      //   formatter({name, value}) {
      //     return `${name}:${value.toFixed(2)}`
      //   },
      // },
      series: [{
        name: '搜索指数',
        left: 'center',
        top: 'center',
        width: '100%',
        height: '100%',
        type: 'wordCloud',
        size: ['9%', '99%'],
        sizeRange: [20, 100],
        // textRotation: [0, 45, 90, -45],
        // rotationRange: [-45, 90],
        // shape: 'circle',
        // gridSize: 10,
            
        shape: 'pentagon',
        // maskImage,
        textPadding: 0,
        autoSize: {
          enable: true,
          minSize: 6,
        },
        textStyle: {
          normal: {
            color() {
              return `rgb(${[
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
              ].join(',')})`
            },
          },
          emphasis: {
            shadowBlur: 10,
            shadowColor: '#FF6A00',
          },
        },
        data: [
          {
            name: 'Authentication',
            value: 1000,
          },
          {
            name: 'Streaming of segmented content',
            value: 6181,
          },
          {
            name: 'Amy Schumer',
            value: 4386,
          },
          {
            name: 'Jurassic World',
            value: 4055,
          },
          {
            name: 'Charter Communications',
            value: 2467,
          },
          {
            name: 'Chick Fil A',
            value: 2244,
          },
          {
            name: 'Planet Fitness',
            value: 1898,
          },
          {
            name: 'Pitch Perfect',
            value: 1484,
          },
          {
            name: 'Express',
            value: 1112,
          },
          {
            name: 'Home',
            value: 965,
          },
          {
            name: 'Johnny Depp',
            value: 847,
          },
          {
            name: 'Lena Dunham',
            value: 582,
          },
          {
            name: 'Lewis Hamilton',
            value: 555,
          },
          {
            name: 'KXAN',
            value: 550,
          },
          {
            name: 'Mary Ellen Mark',
            value: 462,
          },
          {
            name: 'Farrah Abraham',
            value: 366,
          },
          {
            name: 'Rita Ora',
            value: 360,
          },
          {
            name: 'Serena Williams',
            value: 282,
          },
          {
            name: 'NCAA baseball tournament',
            value: 273,
          },
          {
            name: 'Point Break',
            value: 265,
          },
        ],
      }],
    }
    // this.kpiEcharts.setOption(option, true);
  }

  render() {
    return (
      <div className="contact-chart m16 mb0">
        <div 
          ref="cloudBar" 
          style={{height: '600px', width: '100%'}} 
        />
      </div> 
    )
  }
}
