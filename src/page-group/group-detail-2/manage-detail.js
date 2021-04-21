import React, {useEffect} from 'react'
import {Button, Spin} from 'antd'
import {EditOutlined, CopyOutlined, ReloadOutlined} from '@ant-design/icons'
import {inject} from 'mobx-react'
import {useObserver} from 'mobx-react-lite'
import {moneyNumFormat} from '@util'


export default inject('store')(({store, id}) => {
  const genRate = num => {
    if (num === 0) {
      return '0%'
    }

    return `${(num).toFixed(2)}%`
  }

  useEffect(() => {
    store.getConfigTagList(() => {
      store.getGroupDetail(id)
    })
  }, [])

  return useObserver(() => (
    <Spin spinning={store.detailLoading}>
      <div className="manage-detail-header">
        <div className="FBH FBJB FBAC">
          <div className="FBV">
            <div>
              <span className="detail-head">
                客群名称：
                {store.groupDetail.name}
              </span>
              {/* <EditOutlined className="header-icon ml16" />
            <CopyOutlined className="header-icon ml16" />
            <ReloadOutlined className="header-icon ml16" /> */}
            </div>
            <div>
              <span className="black45">
                客群描述：
              </span>
              <span className="black65">
                {store.groupDetail.descr}
              </span>
            </div>
            <div>
              <span className="black45">
                圈选规则：
              </span>
              <span className="black65">
                {store.groupDetail.logicExper}
              </span>
            </div>
          </div>
          <div className="FBH">
            <div className="FBV">
              <div className="black45">
                覆盖客户数
              </div>
              <div className="a-href-color fs16">
                {moneyNumFormat(store.groupDetail.nums)}
              </div>
            </div>
            <div className="FBV ml24">
              <div className="black45">
                客户覆盖率
              </div>
              <div className="a-href-color fs16">
                {genRate(store.groupDetail.coveringRate)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  ))
})
