import {observer} from 'mobx-react'
import {action, toJS} from 'mobx'
import React, {Component} from 'react'
import {Tooltip, Select, Input, Cascader} from 'antd'
import MultiCascader from 'antd-multi-cascader'
import {TagOutlined, UnorderedListOutlined} from '@ant-design/icons'

import Cloud from './cloud'
import TagList from './tag-list'

const {Search} = Input

@observer
export default class TagDepict extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }
  componentDidMount() {
    this.store.showDrawer()
    this.store.getBizType()
  }

  @action changeModel = () => {
    this.store.toAllTag = !this.store.toAllTag
    if (this.store.toAllTag) this.store.cloudData = []
    else this.store.tagList = []
  }

  // 选择业务类型
  // @action changeBizCode = v => {
  //   this.store.businessType = v
  //   this.store.getObjCloud((res, max) => {
  //     this.getDrawCloud(res, max)
  //   })
  // }

  @action changeBizCode = data => {
    this.store.searchKey = null
    const {bizList} = this.store
    const bizValue = []
    data.forEach(item => {
      const target = _.find(bizList, e => e.bizCode === item)
      const parentNode = _.find(bizList, e => e.bizCode === target.parentCode)

      if (!parentNode) {
        // 没找到，说明是第一级
        bizValue.push([target.bizCode])
      } else if (target.parentCode === parentNode.bizCode && parentNode.parentCode === '-1') {
        // 第二级
        bizValue.push([target.parentCode, target.bizCode])
      } else {
        bizValue.push([parentNode.parentCode, target.parentCode, target.bizCode])
      }
    })
    this.store.businessType = bizValue
    this.store.getObjCloud((res, max) => {
      this.getDrawCloud(res, max)
    })
  }

  // 搜索标签
  @action changeKey = v => {
    const {cloudData, toAllTag} = this.store
    this.store.searchKey = v
    const searchData = cloudData.filter(item => item.tag === v)
    if (!toAllTag) {
      this.getDrawCloud(searchData)
    }
  }

  render() {
    const {index, store} = this.props
    const {toAllTag, businessList, searchKey} = store
    return (
      <div className="tag-depict"> 
        <div className="search-condition dfjf">
          {
            toAllTag ? (
              <Tooltip title="切换云图模式">
                <span className="hand mr8" onClick={this.changeModel}><TagOutlined /></span>
              </Tooltip>
            ) : (
              <Tooltip title="切换列表模式">
                <span className="hand mr8" onClick={this.changeModel}><UnorderedListOutlined /></span>
              </Tooltip>
            )
          }
          {
            toAllTag ? null : (
              // <Cascader
              //   placeholder="请选择业务域"
              //   options={businessList}
              //   fieldNames={{label: 'bizName', value: 'bizCode'}}
              //   expandTrigger="hover"
              //   style={{margin: '0px 8px'}} 
              //   onChange={this.changeBizCode}
              // />
              <MultiCascader
                data={businessList}
                style={{width: 156}}
                placeholder="请选择业务域"
                onChange={this.changeBizCode}
                okText="确认"
                cancelText="取消"
              />
            )
          }
          <Search 
            placeholder="请输入标签名称" 
            allowClear 
            key={toAllTag}
            style={{width: 156, marginLeft: '8px'}} 
            onSearch={this.changeKey}
          />
        </div>
        {
          toAllTag ? <TagList store={store} /> : <Cloud getDrawCloud={fun => this.getDrawCloud = fun} index={index} store={store} />
        }
      </div>
    )
  }
}
