/**
 * @description 通用列表组件
 * @author mahua
 */
import {Component} from 'react'
import PropTypes from 'prop-types'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Table, Pagination} from 'antd'
import SearchContent from './search'

import './list.styl'


@observer
export default class ListContent extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  static SearchContent = SearchContent

  static propTypes = {
    columns: PropTypes.instanceOf(Array), 
    initParams: PropTypes.instanceOf(Object), // 默认参数
    // 搜索相关
    buttons: PropTypes.instanceOf(Array), // 表前按钮
    searchParams: PropTypes.instanceOf(Array), // 搜索项内容配置
    onSearch: PropTypes.func,
    beforeSearch: PropTypes.func, // 列表请求前 参数处理
    // 分页相关
    paginationConfig: PropTypes.instanceOf(Object), // 分页属性配置
    hasPaging: PropTypes.bool,
    store: PropTypes.instanceOf(Object).isRequired,
  }

  static defaultProps = {
    columns: [],
    initParams: {},
    buttons: [],
    onSearch: null,
    searchParams: null,
    beforeSearch: null,
    paginationConfig: {},
    hasPaging: true,
  }

  componentWillMount() {
    // 初始请求 在父层组件处理。列表组件componentWillMount内不再进行请求
    const {initGetDataByParent, initParams} = this.props
    /*
     *initParams: 列表配置参数值
     */
    this.store.initParams = initParams
    if (initGetDataByParent) return 
    this.store.getList()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.initParams !== this.props.initParams) {
      this.store.initParams = this.props.initParams
    }
  }

  componentWillUnmount() {
    // this.store.list.clear()
    // this.store.initParams = {}
    this.store.list = []
    this.store.searchParams = {}
  }

  handleSearch = (value = {}) => {
    this.remoteSearch(value)
  }

  handleReset = (value = {}) => {
    this.remoteSearch(value)
  }

  @action remoteSearch = (value = {}) => {
    const {
      onSearch, beforeSearch, paginationConfig, 
    } = this.props
    let newVal = value

    // 列表请求前 参数处理
    if (beforeSearch) {
      newVal = beforeSearch(value)
    }

    if (onSearch) {
      onSearch() 
    } else {
      this.store.searchParams = newVal
      this.store.getList({
        pageSize: paginationConfig.pageSize || 10, // 默认pageSize 10
        currentPage: 1, // 搜索重置列表
        // ...newVal,
      })
    }
  }

  getSearchBox() {
    const {searchParams} = this.props
    
    if ((!searchParams || searchParams.length === 0)) {
      // 如果没有，则返回
      return null
    }

    return (
      <div>
        <SearchContent
          onReset={this.handleReset}
          onSearch={this.handleSearch}
          params={searchParams}
        />
      </div>
    )
  }

  renderBtn() {
    const {buttons} = this.props

    if ((!buttons || buttons.length === 0)) {
      // 如果没有，则返回
      return null
    }
    
    return <div className="button-box">{buttons.map(item => item)}</div>
  }
  render() {
    const {
      searchParams, paginationConfig, hasPaging, ...rest
    } = this.props
    const {
      tableLoading, list = [], pagination, handlePageChange, handleTableChange,
    } = this.store

    return (
      <div className="comp-list-content">  
        {
          this.getSearchBox(searchParams)
        }
        {
          this.renderBtn()
        }
        <div className="ant-table-custom-wrapper">
          <Table
            // @see {@link antd/table}
            pagination={false}
            loading={tableLoading}
            dataSource={toJS(list)}
            rowClassName={(rowData, index) => `ant-table-row-${index % 2}`}
            onChange={handleTableChange}
            {...rest}
            className="table"
          />
        
        
          {
            hasPaging && list.length ? (
              <div>
                <div className="pagination">
                  <Pagination 
                  // @see {@link antd/Pagination}
                  // showQuickJumper, 
                  // showSizeChanger
                    showSizeChanger
                    {...paginationConfig}
                    pageSize={pagination.pageSize}
                    current={pagination.currentPage}
                    total={pagination.totalCount}
                    onChange={handlePageChange}
                    // onChange={() => console.log(111)}
                    showTotal={() => `合计${pagination.totalCount}条记录`}
                  />
                </div>
                <div style={{clear: 'both'}} /> 
              </div>
            ) : null
          }
        </div>
      </div>
    )
  }
}
