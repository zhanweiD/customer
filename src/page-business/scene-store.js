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
   * 查询场景列表
   * @date 2021-04-12
   * @returns {any} void
   * currentPage
   * pageSize
   */
  async getList() {
    try {
      const res = await io.listScene({
        ...this.pageConfigFormat,
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * 添加场景
   * @date 2021-04-12
   * @param {Object} params {bizName: , parentCode: , bizCode: , descr: }
   * @returns {any} void
   */
  async addScene(params) {
    try {
      const res = await io.addScene(params)
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
      const res = await io.editScene(params)
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
    } catch (e) {
      errorTip(e.message)
    }
  }
}
