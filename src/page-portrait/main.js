import {Component, Fragment} from 'react'
import {action, toJS} from 'mobx'
import {observer, inject} from 'mobx-react'
import {Spin, Input, Select} from 'antd'

import {NoData, authView} from '../component'

import store from './store'
import SearchResult from './search-result'
import SearchList from './search-list'

const {Search} = Input

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
    store.searchKey = v
    store.isFirst = true
    store.isLast = false
    store.currentPage = 1
    store.getUnitList()
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
      followList,
      followLoading,
      scanList,
      portraitId,
      isJump,
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
        <div className="content-header">客户画像</div>
        {
          portraitId ? (
            <div className="search m16 mr0 mt72">
              {
                isJump ? null : (
                  <Fragment>
                    <div className="search_content mr16">
                      <Search 
                        size="large"
                        placeholder={placeholder} 
                        onSearch={this.onSearch} 
                        style={{width: '25%', borderLeft: 'none'}} 
                      />
                    </div>
                    {
                      !unitList.length ? (
                        <Spin spinning={followLoading}>
                          <div className="d-flex">
                            {/* <SearchList data={data} title="相关客户推荐" color="#339999" /> */}
                            <SearchList data={followList} title="已关注客户" color="#00cccc" id={portraitId} />
                            <SearchList data={scanList} title="最近浏览客户" color="#6699cc" id={portraitId} />
                            {/* <SearchList data={data} title="待跟进客户" color="#cc6699" /> */}
                          </div>
                        </Spin>

                      ) : null
                    }
                  </Fragment>
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
