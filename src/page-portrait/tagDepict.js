import {observer} from 'mobx-react'
import {action, toJS} from 'mobx'
import React, {Component} from 'react'
import {Tooltip, Select, Input, Cascader} from 'antd'
import MultiCascader from 'antd-multi-cascader'

import TagList from './tag-list'
import WorldCloud from './world-cloud'

const {Search} = Input

@observer
export default class TagDepict extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }
  componentDidMount() {
    this.store.showDrawer()
    this.store.getBizType(data => this.getDrawCloud(data))
  }

  @action changeModel = () => {
    this.store.cateTitle = []
    this.store.toAllTag = !this.store.toAllTag
    if (this.store.toAllTag) this.store.cloudData = []
    else this.store.tagList = []
    if (!this.store.toAllTag) {
      this.store.getObjCloud((data, location) => {
        this.getDrawCloud(data, location)
      })
    }
  }

  @action changeBizCode = data => {
    this.store.searchKey = null
    
    this.store.businessType = data.map(item => [item])
    this.store.getObjCloud(res => {
      this.getDrawCloud(res)
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
        <div className="search-condition FBH FBJB">
          <div className="condition-radio">
            <span 
              onClick={this.changeModel}
              className={`radio-item hand ${toAllTag ? '' : 'radio-item-check'}`}
            >
              云图
            </span>
            <span 
              onClick={this.changeModel}
              className={`radio-item hand ${toAllTag ? 'radio-item-check' : ''}`}
            >
              列表
            </span>
          </div>
          <div>
            {
              toAllTag ? null : (
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
              style={{width: 200, marginLeft: '8px'}} 
              onSearch={this.changeKey}
            />
          </div>
        </div>
        {
          toAllTag ? <TagList store={store} /> : <WorldCloud getDrawCloud={fun => this.getDrawCloud = fun} index={index} store={store} />
        }
      </div>
    )
  }
}
