import {action, observable} from 'mobx'
import {errorTip, successTip, changeToOptions, userLog} from '../common/util'
import io from './io'

export default class Store {
  @observable drawerVis = false
  @observable isEdit = false

  @observable tableData = []
  @observable tableLoading = false

  @observable selectedRows = []

  @observable pagination = {
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
  }

  @observable formInitValue = {}
  
  @observable confirmLoading = false
  
  /**
   * 查询业态列表
   * @date 2021-04-12
   * @returns {any} void
   * currentPage
   * pageSize
   */
  @action async getList() {
    this.tableLoading = true
    try {
      const res = await io.listFormat({
        currentPage: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
      })

      this.pagination.currentPage = res.currentPage
      this.pagination.pageSize = res.pageSize
      this.pagination.totalCount = res.totalCount

      this.tableData = res.data
      this.tableData.forEach(item => {
        item.key = item.id
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.tableLoading = false
    }
  }

  /**
   * 添加业态
   * @date 2021-04-12
   * @param {Object} params {bizName: , bizCode: , descr: }
   * @returns {any} void
   */
  @action async addFormat(params) {
    this.confirmLoading = true
    try {
      const res = await io.addFormat(params)

      this.drawerVis = false
      this.getList()
      successTip('添加成功')
      userLog('系统管理/业务配置/添加业态')
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.confirmLoading = false
    }
  }

  /**
   * 编辑业态
   * @date 2021-04-12
   * @param {Object} params {id: , bizName: , bizCode: , descr: }
   * @returns {any} void
   */
  @action async editFormat(params) {
    this.confirmLoading = true
    try {
      const res = await io.editFormat({
        ...params,
        id: this.formInitValue.id,
      })

      this.drawerVis = false
      this.getList()
      successTip('编辑成功')
      userLog('系统管理/业务配置/编辑业态')
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.confirmLoading = false
    }
  }

  /**
   * 删除业态
   * @date 2021-04-12
   * @param {Array} params []
   * @returns {any} void
   */
  async deleteFormat(params) {
    try {
      const res = await io.deteleFormat({
        bizCodes: params,
      })

      this.getList()
      this.selectedRows = []
      successTip('删除成功')
      userLog('系统管理/业务配置/删除业态')
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * 检查业态名称重名
   * @date 2021-04-12
   * @param {Object} params {id: , bizName: }
   * @param {function} cb cb
   * @returns {any} void
   */
  async checkFormatName(params, cb = () => {}) {
    try {
      const res = await io.checkFormatName(params)

      cb(res)
    } catch (e) {
      errorTip(e.message)
    }
  }


  /**
   * 检查业态code重复
   * @date 2021-04-12
   * @param {any} params {id: ,bizCode: }
   * @param {function} cb cb
   * @returns {any} void
   */
  async checkFormatCode(params, cb = () => {}) {
    try {
      const res = await io.checkFormatCode(params)

      cb(res)
    } catch (e) {
      errorTip(e.message)
    }
  }
}
