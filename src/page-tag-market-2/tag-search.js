import React from 'react'
import {Select, Input} from 'antd'

const {Search} = Input

export default () => {
  return (
    <div className="tag-search FBH FBJB p16">
      <div className="FBH">
        <Select style={{width: '120px'}} placeholder="业务类型" />
        {/* <Select style={{marginLeft: '8px'}} placeholder="请选择业务域" /> */}
      </div>
      <div>
        <Search placeholder="标签名称" />
      </div>
    </div>
  )
}
