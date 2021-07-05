import {useEffect, useState} from 'react'
import {inject} from 'mobx-react'
import {useObserver} from 'mobx-react-lite'
import {Tag} from 'antd'
import {AppstoreOutlined, TeamOutlined, ClockCircleOutlined, AimOutlined} from '@ant-design/icons'

export default inject('store')(({store}) => {
  const renderStatus = () => {
    if (store.planStatus) {
      let status = ''
      let color = ''
      switch (store.planStatus) {
        case 0:
          status = '未生效'
          color = 'default'
          break
        case 1:
          status = '已生效'
          color = 'green'
          break
        case 2:
          status = '暂停'
          color = 'orange'
          break
        default:
          status = '已结束'
          color = 'blue'
          break
      }
      return <Tag style={{}} color={color}>{status}</Tag>
    }
    return null
  }

  return useObserver(() => (
    <div className="sales-detail-header">
      <div className="fs18 FBH FBAC">
        <div className="mr8">{store.planName}</div>
        {renderStatus()}
      </div>
      <div className="mt8 FBH FBJB">
        <div className="FBH FBAC mr16 c85">
          <AppstoreOutlined />
          <div className="ml4">默认分组</div>
        </div>
        <div className="FBH FBAC mr16 c85">
          <TeamOutlined />
          <div className="ml4">{store.planGroup}</div>
        </div>
        <div className="FBH FBAC mr16 c85">
          <ClockCircleOutlined />
          <div className="ml4">{store.planTime}</div>
        </div>
        <div className="FBH FBAC c85">
          <AimOutlined />
          <div className="ml4">{store.planTarget}</div>
        </div>
      </div>
    </div>
  ))
})
