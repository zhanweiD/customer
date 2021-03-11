/**
 * @description 列表store
 * @author  mahua
 */
import {
  observable, action, runInAction, toJS,
} from 'mobx'

/**
 * @description 过滤对象中value为undefined的值
 * @param {*} values @typedef object
 */
const filterUndefinedValues = values => {
  const filterKeys = Object.keys(values).filter(d => values[d] !== undefined && values[d] !== '')
  const filterObj = {}
  _.forEach(filterKeys, key => filterObj[key] = toJS(values[key]))
  return filterObj
}

const ListContentStore = apiFunc => class _Store {
  // 列表内容
  @observable list = []

  // 默认参数
  @observable initParams = {}
  // 加载标识
  @observable tableLoading = false

  // 搜索条件
  @observable searchParams = {}

  // 列表默认创建时间排序
  @observable tableSorter = {}
  // @observable tableSorter = {
  //   order: 'DESC', // 排序方式
  //   sort: 'ctime', // 排序字段
  // }

  // 列表分页信息
  @observable pagination = {
    pageSize: 10,
    currentPage: 1,
  }

  /**
   * 分页操作函数
   * @param {number} curPage   
   * @param {number} pageSize
   */
  @action.bound handlePageChange(curPage, pageSize) {
    this.pagination.pageSize = pageSize
    this.pagination.currentPage = curPage
    this.getList()
  }

  /**
   * 表格操作函数
   * @param {number} curPage   
   * @param {number} pageSize
   */
  @action.bound handleTableChange(pagination, filters, sorter) {
    const {order, columnKey} = sorter
    // console.log(pagination, filters, sorter)
    this.tableSorter = {
      order: order === 'descend' ? 'DESC' : 'ASC',
      sort: columnKey,
    }
    this.getList()
  }

  /**
   * 获取列表内容
   * @param {object} params
   */
  @action.bound async getList(params) {
    try {
      this.tableLoading = true
      const {pageSize = 10, currentPage = 1} = this.pagination
      const res = await apiFunc(filterUndefinedValues({
        ...this.initParams,
        ...this.tableSorter,
        ...this.searchParams,
        pageSize,
        currentPage: currentPage || 1,
        ...params,
      }))
      runInAction(() => {
        const {
          data = [],
        } = res
        this.tableLoading = false
        this.list.replace(data)
        this.pagination = {
          pageSize: res.pageSize || 10,
          totalCount: res.totalCount || res.count,
          currentPage: res.currentPage,
        }
      })
    } catch (e) {
      runInAction(() => {
        this.tableLoading = false
      })
      // errorTip(e.message)
    }
  }
}

export default ListContentStore
