import {Component, Fragment} from 'react'
import {action, toJS} from 'mobx'
import {observer, inject} from 'mobx-react'
import {Spin, Input, Select} from 'antd'
import {SearchOutlined} from '@ant-design/icons'
import {debounce} from '@util'

import {NoData, authView} from '../component'

import store from './store'
import SearchResult from './search-result'
import SearchList from './search-list'
import bgBanner from './icon/bg-banner.png'
import searchGroup from './icon/search-icon.svg'

const {Option} = Select

@observer
class Portrait extends Component {
  constructor(props) {
    super(props)

    const {match} = props
    store.ident = match.params.ident
    store.portraitId = +match.params.id
    store.isCustomer = !match.params.isConsultant
    store.isJump = !!store.ident

    store.portraits = []
    store.unitList = []
  }

  componentDidMount() {
    if (store.isJump) return
    store.getPortrait()
  }

  onSearch = v => {
    debounce(() => store.getUnitList(v), 500)
  }

  @action onChange = (v, item) => {
    store.unitList = []
    store.placeholder = item.placeholder
    store.portraitId = v
    store.isCustomer = !item.index
  }
 
  render() {
    const {
      placeholder, 
      unitList,
      unitKeys,
      followList,
      followLoading,
      scanList,
      portraitId,
      selectLoading,
      ident,
    } = store
    const noDataText = (
      <span>
        暂未配置画像，请去
        <a target="_blank" href="/customer/index.html#/system/portrait">系统管理-画像配置</a>
        页面配置画像
      </span>
    )

    return (
      <div className="portrait-wrap oa">
        {
          portraitId ? (
            <div className="search m16 mr0 mt2">
              {
                ident ? null : (
                  <div>
                    <div 
                      className="search_content mr16"
                      style={{backgroundImage: `url(${bgBanner})`}}
                    >
                      <div className="w50">
                        <div className="content-header">
                          <img className="mb4 mr8" src={searchGroup} alt="" /> 
                          <span>客户画像</span>
                        </div>
                        
                        <Select
                          mode="multiple"
                          size="large" 
                          filterOption={false}
                          notFoundContent={selectLoading ? <Spin size="small" /> : null}
                          onSearch={this.onSearch}
                          onChange={v => store.ident = v[0]}
                          placeholder={placeholder} 
                          style={{width: '100%', borderRadius: 24}} 
                        >
                          {
                            unitList.map(item => <Option value={item.ident}>{item.姓名}</Option>)
                          }
                        </Select>
                      </div>
                    </div>
                   
                    <Spin spinning={followLoading}>
                      <div className="d-flex">
                        <SearchList data={followList} title="已关注客户" id={portraitId} />
                        <SearchList data={scanList} title="最近浏览客户" id={portraitId} />
                      </div>
                    </Spin>
                  </div>
                )
              }
              <SearchResult store={store} />
            </div>
          ) : (
            <NoData text={noDataText} />
          )
        }
      </div>
    )
  }
}
export default authView(Portrait)
