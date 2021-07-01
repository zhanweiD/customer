import React, {Component} from 'react'
import {action} from 'mobx'
import {observer, Provider} from 'mobx-react'
import {Spin, Skeleton, Modal} from 'antd'

import {authView} from '../../component'
import ObjectCard from './tag-object-card'
import Store from './store'
import DrawerObject from './tree-drawer-object'

const {confirm} = Modal

@observer
class TagObject extends Component {
  constructor(props) {
    super(props)
    this.store = new Store()
    this.store.getTreeData()
  }

  @action.bound deleteObject(data) {
    confirm({
      title: '删除对象',
      content: '对象被删除后不可恢复，确定删除？',
      cancelText: '取消',
      okText: '确认',
      confirmLoading: this.store.confirmLoading,
      onOk: () => {
        this.store.delNode(data.id, () => {
          this.store.getTreeData()
        })
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  render() {
    return (
      <Provider store={this.store}>
        <div className="tag-object oa">
          <div className="content-header">
            标签管理
          </div>
          {
            this.store.isLoading 
              ? <Skeleton active />
              : (
                <div className="object-box mt16 pl16">
                  <div className="object-card-box">
                    <div
                      className="object-card FBH FBAC FBJC"
                      style={{cursor: 'pointer'}}
                      onClick={() => {
                        this.store.objDetail = {}
                        this.store.isAdd = true
                        this.store.visible = true
                      }}
                    >
                      <div className="c85" style={{fontSize: '20px'}}>+ 新增对象</div>
                    </div>
                  </div>
                  {
                    this.store.objList.map(item => {
                      return <ObjectCard data={item} ondelete={this.deleteObject} />
                    })
                  }
                </div>
              )
          }
          <DrawerObject />
        </div>
      </Provider>
    )
  }
}
export default authView(TagObject)
