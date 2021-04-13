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
   * 查询业态列表
   * @date 2021-04-12
   * @returns {any} void
   * currentPage
   * pageSize
   */
  async getList() {
    try {
      const res = await io.listFormat({
        ...this.pageConfigFormat,
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * 添加业态
   * @date 2021-04-12
   * @param {Object} params {bizName: , bizCode: , descr: }
   * @returns {any} void
   */
  async addFormat(params) {
    try {
      const res = await io.addFormat(params)
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * 编辑业态
   * @date 2021-04-12
   * @param {Object} params {id: , bizName: , bizCode: , descr: }
   * @returns {any} void
   */
  async editFormat(params) {
    try {
      const res = await io.editFormat(params)
    } catch (e) {
      errorTip(e.message)
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
      const res = await io.deteleFormat(params)
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * 检查业态名称重名
   * @date 2021-04-12
   * @param {Object} params {id: , bizName: }
   * @returns {any} void
   */
  async checkFormatName(params) {
    try {
      const res = await io.checkFormatName(params)
    } catch (e) {
      errorTip(e.message)
    }
  }


  /**
   * 检查业态code重复
   * @date 2021-04-12
   * @param {any} params {id: ,bizCode: }
   * @returns {any} void
   */
  async checkFormatCode(params) {
    try {
      const res = await io.checkFormatCode(params)
    } catch (e) {
      errorTip(e.message)
    }
  }
}
