import {observer} from 'mobx-react'
import {action} from 'mobx'
import React, {Component} from 'react'
import {Tooltip, Select, Input} from 'antd'
import {TagOutlined, UnorderedListOutlined} from '@ant-design/icons'

import Cloud from './cloud'
import TagList from './tag-list'

const {Search} = Input
const {Option} = Select

@observer
export default class TagDepict extends Component {
  constructor(props) {
    super(props)
    this.store = this.props.store
  }
  @action changeModel = () => {
    this.store.toAllTag = !this.store.toAllTag
  }
  render() {
    const {index, store} = this.props
    const {toAllTag} = store
    return (
      <div className="tag-depict"> 
        <div className="search-condition">
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
          <Select placeholder="请选择业务域" style={{width: 156, textAlign: 'left', marginRight: '8px'}}>
            <Option key="">111</Option>
          </Select>
          <Search placeholder="请输入标签名称" allowClear style={{width: 156}} />
        </div>
        {
          toAllTag ? <TagList store={store} /> : <Cloud index={index} store={store} />
        }
      </div>
    )
  }
}
