import React from 'react'
import {Divider, Dropdown, Menu, Modal} from 'antd'
import {MoreOutlined} from '@ant-design/icons'

export default ({data, ondelete}) => {
  const menu = (
    <Menu>
      <Menu.Item
        onClick={(e) => {
          e.domEvent.stopPropagation()
        }}
      >
        编辑
      </Menu.Item>
      <Menu.Item 
        disabled={data.tag !== 0} 
        onClick={(e) => {
          ondelete(data)
          e.domEvent.stopPropagation()
        }}
      >
        删除
      </Menu.Item>
    </Menu>
  )

  const gotoManage = () => {
    window.open(`#/tag/manage/${data.id}`, '_blank')
  }

  return (
    <div 
      className="object-card-box" 
      onClick={gotoManage}
    >
      <div className="object-card FBV">
        <div className="object-up">
          <div className="FBH FBJB">
            <div className="fs16">
              {data.name}
            </div>
            <Dropdown overlay={menu}>
              <MoreOutlined className="hand" />
            </Dropdown>
          </div>
          {
            data.descr ? <div className="black65">{data.descr}</div> : <div className="black25">-</div>
          }
        </div>
        <Divider style={{margin: '0'}} />
        <div className="object-down FBH">
          <div className="FBV FB1 fac">
            <div>
              {data.tag}
            </div>
            <div className="black65">
              总标签数
            </div>
          </div>
          <Divider type="vertical" style={{height: '40px'}} />
          <div className="FBV FB1 fac">
            <div>
              还不确定字段
            </div>
            <div className="black65">
              一级类目数
            </div>
          </div>
          <Divider type="vertical" style={{height: '40px'}} />
          <div className="FBV FB1 fac">
            <div>
              {data.tagTable}
            </div>
            <div className="black65">
              数据表数
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
