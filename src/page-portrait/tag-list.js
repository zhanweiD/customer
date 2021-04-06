import React, {Component} from 'react'
import {observer} from 'mobx-react'
import {TagFilled} from '@ant-design/icons'

import CateTree from './cate-tree'

@observer
export default class TagList extends Component {
  render() {
    return (
      <div className="p16 pt0 bgf">
        <div className="d-flex">
          <div className="tag-list">
            <TagFilled rotate={270} style={{color: 'rgba(0,0,0,.65)', marginRight: '8px'}} />
            <span>基本信息</span>
          </div>
          <div className="tag-tree">
            <CateTree />
          </div>
        </div>
      </div>
    )
  }
}
