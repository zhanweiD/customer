import {observable, action, runInAction} from 'mobx'
import io from './io'
import {successTip, errorTip, failureTip, changeToOptions, userLog} from '../../../common/util'

class DrawerStore {
  constructor({
    objId,
  } = {}) {
    this.objId = objId
  }

  result = []
  source = []
  target = []

  objId
  tagIds = []
  configType

  @observable tableList = []

  @action async getTableList() {
    try {
      const res = await io.getTableList({
        id: this.objId,
      })

      runInAction(() => {
        this.tableList = changeToOptions(res)('dataTableName', 'dataTableName')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable schemeList = []

  @action async getSchemeList() {
    try {
      const res = await io.getSchemeList({
        objId: this.objId,
      })

      runInAction(() => {
        this.schemeList = changeToOptions(res)('name', 'name')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  async getResultData() {
    try {
      const params = {
        id: this.objId,
      }
      
      let res = []

      if (this.configType === 1) {
        res = await io.getDeriveResultData(params)
      } else {
        res = await io.getResultData(params)
      }

      this.result = res || []
    } catch (e) {
      errorTip(e.message)
    }
  }

  async getFieldData() {
    const params = {
      id: this.objId,
    }
    try {
      let res = []
      if (this.configType === 1) {
        res = await io.getDeriveFieldData(params)
      } else {
        res = await io.getFieldData(params)
      }
     
      this.target = res || []
    } catch (e) {
      errorTip(e.message)
    }
  }

  async getTagData() {
    try {
      const params = {
        id: this.objId,
        tagIds: this.tagIds,
        // tagIds: [],
      }

      let res = []

      if (this.configType === 1) {
        res = await io.getDeriveTagData(params)
      } else {
        res = await io.getTagData(params)
      }
      
      this.source = res || []
    } catch (e) {
      errorTip(e.message)
    }
  }

  async saveResult(reqList, cb) {
    try {
      const params = {
        reqList,
        objId: this.objId,
      }
      const res = await io.saveMappingResult(params)
      runInAction(() => {
        console.log(cb)
        if (res === true) {
          if (cb) cb()
          successTip('操作成功')
          userLog('标签管理/配置标签')
        } else {
          failureTip('操作失败')
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default DrawerStore
