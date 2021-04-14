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

  @observable formatList = [] // 业态列表
  @observable domainList = [] // 业务域列表
  @observable domainOption = [] // 业务域下拉列表
  @observable domainFormatOption = []

  /**
   * 查询场景列表
   * @date 2021-04-12
   * @returns {any} void
   * currentPage
   * pageSize
   */
  @action async getList() {
    this.tableLoading = true
    try {
      const res = await io.listScene({
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
   * 添加场景
   * @date 2021-04-12
   * @param {Object} params {bizName: , parentCode: , bizCode: , descr: }
   * @returns {any} void
   */
  async addScene(params) {
    const {grandpaCode, ...p} = params

    try {
      const res = await io.addScene(p)

      this.drawerVis = false
      this.getList()
      successTip('添加成功')
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * 编辑场景
   * @date 2021-04-12
   * @param {Object} params {id: , bizName: , parentCode: ,bizCode: , descr: }
   * @returns {any} void
   */
  async editScene(params) {
    try {
      const res = await io.editScene({
        ...params,
        id: this.formInitValue.id,
      })

      this.drawerVis = false
      this.getList()
      successTip('编辑成功')
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * 删除场景
   * @date 2021-04-12
   * @param {Array} params []
   * @returns {any} void
   */
  async deleteScene(params) {
    try {
      const res = await io.deteleScene({
        bizCodes: params,
      })

      this.getList()
      this.selectedRows = []
      successTip('删除成功')
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * 获取业态域下拉
   * @date 2021-04-12
   * @returns {any} void
   */
  async getDomainList() {
    try {
      const res = await io.getDomainList()
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * 获取业态和业态域下拉
   * @date 2021-04-12
   * @returns {any} void
   */
  async getDomainFormatList() {
    try {
      const res = await io.getDomainFormatList()

      // 业态列表
      this.formatList = _.filter(res, item => item.parentCode === '-1')
      
      // 业务域列表
      this.domainList = _.filter(res, item => item.parentCode !== '-1')

      const formatOption = _.filter(res, item => item.parentCode === '-1')

      formatOption.forEach(item => {
        item.label = item.bizName
        item.value = item.bizCode

        const children = _.filter(res, e => e.parentCode === item.bizCode)
        children.forEach(e => {
          e.label = e.bizName
          e.value = e.bizCode
        })

        item.children = children
      })

      this.domainFormatOption = _.filter(formatOption, item => item.children.length !== 0)
    } catch (e) {
      errorTip(e.message)
    }
  }
}
