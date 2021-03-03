import {Component, Fragment} from 'react'
import {action, toJS} from 'mobx'
import {observer, inject} from 'mobx-react'
import {Spin, Input, Select} from 'antd'

import {NoData} from '../component'

import store from './store'
import SearchResult from './search-result'

const {Option} = Select
const {Search} = Input
@observer
export default class Portrait extends Component {
  constructor(props) {
    super(props)

    const {match} = props
    store.ident = match.params.ident
    store.portraitId = +match.params.id
    store.isCustomer = !match.params.isConsultant
    store.isJump = store.ident

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

    // 演示环境默认展示一个
    store.getUnitList()
  }
 
  render() {
    const {
      porLoading,
      portraits, 
      placeholder, 
      defaultPortrait,
      unitList,
      isJump,
    } = store

    const NoDataConfig = {text: '暂无数据,请进行搜索'}
    return (
      <div className="portrait-wrap">
        <div className="content-header">客户画像</div>
        <div className="search m16">
          {
            defaultPortrait ? (
              <div className="search_content">
                <Select 
                  onChange={(v, item) => this.onChange(v, item)} 
                  style={{width: '8%', height: '24px'}}
                  defaultValue={defaultPortrait}
                >
                  {
                    portraits.map((item, i) => {
                      return <Option index={i} key={item.id} value={item.id} name={item.name} placeholder={item.placeholder}>{item.name}</Option>
                    })
                  }
                </Select>
                <Search 
                  placeholder={placeholder} 
                  onSearch={this.onSearch} 
                  style={{width: '15%', height: '24px', borderLeft: 'none'}} 
                />
              </div>
            ) : (
              !isJump && <Spin spinning={porLoading} />
            )
          }

          <SearchResult store={store} />
        </div>
        {
          isJump ? null : (
            !unitList.length && <div className="mt16 box-border noData-box"><NoData style={{height: 'calc(100% - 32px)'}} {...NoDataConfig} /></div>
          )
        }
      </div>
    )
  }
}
