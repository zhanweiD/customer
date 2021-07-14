import React, {Component} from 'react'
import {observer} from 'mobx-react'
import {TagFilled} from '@ant-design/icons'

import CateTree from './cate-tree'

@observer
export default class TagList extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }
  componentDidMount() {
    this.store.getTagTree()
    this.store.getTagList()
  }
  render() {
    const {tagList, selectName, searchKey} = this.store
    return (
      <div className="p16 pt0 bgf">
        <div className="portrait-tag-list">
          {
            tagList.map(item => {
              const isShow = selectName.find(sitem => sitem === item.cat)
              if (!isShow) {
                return <div className="tag-list" />
              }
              return (
                <div className="tag-list">
                  <div className="mb12">
                    {/* <TagFilled rotate={270} style={{color: 'rgba(0,0,0,.65)', marginRight: '8px'}} /> */}
                    <span style={{color: '#16324E'}}>{item.cat}</span>
                  </div>
                  {
                    item.list.map(sitem => {
                      if (searchKey) {
                        if (sitem.tag === searchKey) {
                          return <span className="mr8 mb8 fs14 c85 info-tag">{`${sitem.tag}: ${sitem.val}`}</span>
                        } 
                        return <span />
                      }
                      return <span className="mr8 mb8 fs14 c85 info-tag">{`${sitem.tag}: ${sitem.val}`}</span>
                    })
                  }
                </div>
              )
            })
          }
          <div className="tag-tree">
            <CateTree store={this.store} />
          </div>
        </div>
      </div>
    )
  }
}
