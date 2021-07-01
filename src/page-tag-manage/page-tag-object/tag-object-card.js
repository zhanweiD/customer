import React from 'react'
import {Divider, Dropdown, Menu, Modal} from 'antd'
import {inject} from 'mobx-react'
import {useObserver} from 'mobx-react-lite'
import {MoreOutlined} from '@ant-design/icons'
import {codeInProduct} from '@util'

export default inject('store')(
  ({store, data, ondelete}) => {
    const menu = (
      <Menu>
        <Menu.Item
          onClick={e => {
            e.domEvent.stopPropagation()
            store.getObjectDetail(data.id, res => {
              store.objDetail = res
              store.isAdd = false
              store.visible = true
            })
          }}
        >
          编辑
        </Menu.Item>
        <Menu.Item
          disabled={data.tag > 0}
          onClick={e => {
            ondelete(data)
            e.domEvent.stopPropagation()
          }}
        >
          删除
        </Menu.Item>
      </Menu>
    )

    const gotoManage = () => {
      if (codeInProduct('/tag-manage/:id')) {
        window.open(`#/tag-manage/${data.id}`, '_blank')
      }
    }

    return useObserver(() => (
      <div
        className="object-card-box"
        onClick={gotoManage}
      >
        <div className="object-card FBV">
          <div className="object-up">
            <div className="FBH FBJB FBAC">
              <div className="fs16">
                {data.name}
              </div>
              <Dropdown overlay={codeInProduct('tag-manage:add-object') ? menu : null}>
                <MoreOutlined className="hand" />
              </Dropdown>
            </div>
            {
              data.descr ? <div className="c85">{data.descr}</div> : <div className="c25">-</div>
            }
          </div>
          <Divider style={{margin: '0'}} />
          <div className="object-down FBH">
            <div className="FBV FB1 fac">
              <div className="a-href-color fs16">
                {data.tag}
              </div>
              <div className="c85">
                总标签数
              </div>
            </div>
            <Divider type="vertical" style={{height: '40px'}} />
            <div className="FBV FB1 fac">
              <div className="a-href-color fs16">
                {data.tagCatalog}
              </div>
              <div className="c85">
                一级类目数
              </div>
            </div>
            <Divider type="vertical" style={{height: '40px'}} />
            <div className="FBV FB1 fac">
              <div className="a-href-color fs16">
                {data.tagTable}
              </div>
              <div className="c85">
                数据表数
              </div>
            </div>
          </div>
        </div>
      </div>
    ))
  }
)
