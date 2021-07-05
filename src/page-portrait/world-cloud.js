import React, {Component} from 'react'
import {observer} from 'mobx-react'
import {Spin} from 'antd'

import {cloudOption} from './option'
import womanCloud from './icon/woman-cloud.svg'
import manCloud from './icon/man-cloud.svg'
import bgImage from './icon/bgImage.png'

const maskImage = new Image()

@observer
export default class WorldCloud extends Component {
  cloudChart = null

  constructor(props) {
    super(props)
    this.store = props.store
  }
  componentDidMount() {
    const {props} = this
    this.cloudChart = echarts.init(document.getElementById('world-cloud'))
    maskImage.src = bgImage

    props.getDrawCloud(this.drawChart)
  }

  drawChart = data => {
    this.cloudChart.setOption(cloudOption(data, maskImage))
    window.onresize = () => {
      this.cloudChart.resize()
    }
  }

  render() {
    const {
      cateTitle, defaultInfo, loading,
    } = this.store
    return (
      <div>
        <div className="dfjf mr16 ">
          {
            cateTitle.map(item => (
              <div className="mr8" style={{color: item.color}}>
                {console.log(item.color)}
                <span style={{backgroundColor: item.color}} className="legend-name-icon mr4" />
                <span>{item.text}</span>
              </div>
            ))
          }
        </div>
        <div className="world-cloud">
          <Spin spinning={loading}>
            <div style={{position: 'relative', width: 1120}}>
              <div className="world-image">
                <img width={240} height={240} src={defaultInfo.性别 === '男' ? manCloud : womanCloud} alt="" />
              </div>
              <div className="FBH FBJC">
                <div style={{height: 600, width: 1120}} id="world-cloud" />
              </div>
            </div>
          </Spin>
        </div>
      </div>
    )
  }
}
