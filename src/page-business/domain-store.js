import {action, observable} from 'mobx'
import {errorTip, changeToOptions, userLog} from '../common/util'
import io from './io'

export default class Store {
  @observable drawerVis = false

  @observable pageConfigFormat = {
    currentPage: 1,
    pageSize: 10,
  }

  @observable formInitValue = {}

  /**
   * 查询业务域
   * @date 2021-04-12
   * @returns {any} void
   * currentPage
   * pageSize
   */
  async getList() {
    try {
      const res = await io.listDomain({
        ...this.pageConfigFormat,
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * 添加业务域
   * @date 2021-04-12
   * @param {Object} params {bizName: , parentCode: , bizCode: , descr: }
   * @returns {any} void
   */
  async addDomain(params) {
    try {
      const res = await io.addDomain(params)
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * 编辑业务域
   * @date 2021-04-12
   * @param {Object} params {id: , bizName: , parentCode: ,bizCode: , descr: }
   * @returns {any} void
   */
  async editDomain(params) {
    try {
      const res = await io.editDomain(params)
    } catch (e) {
      errorTip(e.message)
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
      const res = await io.deteleDomain({
        bizCodes: params,
      })
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
    } catch (e) {
      errorTip(e.message)
    }
  }
}
