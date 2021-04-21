import {action, observable} from 'mobx'
import _ from 'lodash'
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

  @observable formatList = []

  /**
   * 查询业务域
   * @date 2021-04-12
   * @returns {any} void
   * currentPage
   * pageSize
   */
  @action async getList() {
    this.tableLoading = true
    try {
      const res = await io.listDomain({
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
   * 添加业务域
   * @date 2021-04-12
   * @param {Object} params {bizName: , parentCode: , bizCode: , descr: }
   * @returns {any} void
   */
  @action async addDomain(params) {
    this.confirmLoading = true
    try {
      const res = await io.addDomain(params)

      this.drawerVis = false
      this.getList()
      successTip('添加成功')
      userLog('系统管理/业务配置/添加业务域')
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.confirmLoading = false
    }
  }

  /**
   * 编辑业务域
   * @date 2021-04-12
   * @param {Object} params {id: , bizName: , parentCode: ,bizCode: , descr: }
   * @returns {any} void
   */
  @action async editDomain(params) {
    this.confirmLoading = true
    try {
      const res = await io.editDomain({
        ...params,
        id: this.formInitValue.id,
      })

      this.drawerVis = false
      this.getList()
      successTip('编辑成功')
      userLog('系统管理/业务配置/编辑业务域')
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.confirmLoading = false
    }
  }

  /**
   * 删除业务域
   * @date 2021-04-12
   * @param {Array} params []
   * @returns {any} void
   */
  async deleteDomain(params) {
    try {
      const res = await io.deleteDomain({
        bizCodes: params,
      })

      this.getList()
      this.selectedRows = []
      successTip('删除成功')
      userLog('系统管理/业务配置/删除业务域')
    } catch (e) {
      errorTip(e.message)
    }
  }


  /**
   * 获取业态下拉
   * @date 2021-04-12
   * @returns {any} void
   */
  async getFormatList() {
    try {
      const res = await io.getFormatList()

      this.formatList = []
      if (Object.keys(res).length > 0) {
        // 有数据
        _.each(res, (v, k) => {
          this.formatList.push({
            code: k,
            name: v,
          })
        })
      } else {
        this.formatList = []
      }
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * 检查业务域名称重名
   * @date 2021-04-12
   * @param {Object} params {id: , bizName: }
   * @param {function} cb cb
   * @returns {any} void
   */
  async checkDomainName(params, cb) {
    try {
      const res = await io.checkFormatName(params)

      cb(res)
    } catch (e) {
      errorTip(e.message)
    }
  }


  /**
   * 检查业务域code重复
   * @date 2021-04-12
   * @param {any} params {id: ,bizCode: }
   * @param {function} cb cb
   * @returns {any} void
   */
  async checkDomainCode(params, cb) {
    try {
      const res = await io.checkFormatCode(params)

      cb(res)
    } catch (e) {
      errorTip(e.message)
    }
  }
}
