import React, {useEffect} from 'react'
import {Button} from 'antd'
import {EditOutlined, CopyOutlined, ReloadOutlined} from '@ant-design/icons'
import {inject} from 'mobx-react'
import {useObserver} from 'mobx-react-lite'


export default inject('store')(({store, id}) => {
  const {groupDetail: {name, descr, logicExper, nums, coveringRate}} = store

  const genRate = num => {
    if (num === 0) {
      return '0%'
    }

    return `${(num * 100).toFixed(2)}%`
  }

  useEffect(() => {
    console.log(store)
    store.getGroupDetail(id)
  }, [])

  return useObserver(() => (
    <div className="manage-detail-header">
      <div className="FBH FBJB FBAC">
        <div className="FBV">
          <div>
            <span className="detail-head">
              客群名称：
              {name}
            </span>
            <EditOutlined className="header-icon ml16" />
            <CopyOutlined className="header-icon ml16" />
            <ReloadOutlined className="header-icon ml16" />
          </div>
          <div>
            <span className="black45">
              客群描述：
            </span>
            <span className="black65">
              {descr}
            </span>
          </div>
          <div>
            <span className="black45">
              圈选规则：
            </span>
            <span className="black65">
              {logicExper}
            </span>
          </div>
        </div>
        <div className="FBH">
          <div className="FBV">
            <div className="black45">
              覆盖客户数
            </div>
            <div className="black65">
              {nums}
            </div>
          </div>
          <div className="FBV ml24">
            <div className="black45">
              客户覆盖率
            </div>
            <div className="black65">
              {genRate(coveringRate)}
            </div>
          </div>
        </div>
      </div>
    </div>
  ))
})
