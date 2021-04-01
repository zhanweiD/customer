import React from 'react'
import {EditOutlined, CopyOutlined, ReloadOutlined} from '@ant-design/icons'


export default () => {
  return (
    <div className="manage-detail-header">
      <div className="FBH FBJB FBAC">
        <div className="FBV">
          <div>
            <span className="detail-head">客群名称</span>
            <EditOutlined className="header-icon ml16" />
            <CopyOutlined className="header-icon ml16" />
            <ReloadOutlined className="header-icon ml16" />
          </div>
          <div>
            <span className="black45">
              客群描述：
            </span>
            <span className="black65">
              卡卡卡卡卡
            </span>
          </div>
          <div>
            <span className="black45">
              圈选规则：
            </span>
            <span className="black65">
              卡卡卡卡卡
            </span>
          </div>
        </div>
        <div className="FBH">
          <div className="FBV">
            <div className="black45">
              覆盖客户数
            </div>
            <div className="black65">
              1234
            </div>
          </div>
          <div className="FBV ml24">
            <div className="black45">
              客户覆盖率
            </div>
            <div className="black65">
              57%
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
