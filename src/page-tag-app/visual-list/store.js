import {
  action, runInAction, observable,
} from 'mobx'
import {successTip, failureTip, errorTip, changeToOptions, userLog} from '../../common/util'
import {ListContentStore} from '../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getList) {
  objStore
  objId

  @observable objList = [] // 下拉对象数据

  // 下拉对象列表
  @action async getObjList() {
    try {
      const res = await io.getObjList({
      })
      runInAction(() => {
        this.objList = changeToOptions(res)('name', 'objId')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 删除
  @action async delList(id) {
    try {
      await io.delList({
        deleteIds: [id],
      })
      runInAction(() => {
        successTip('删除成功')
        this.getList({currentPage: 1, objId: this.objId})
        userLog('标签应用/删除组合标签方案')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 克隆
  @action async clone(id) {
    try {
      const res = await io.cloneVisual({
        id,
      })
      runInAction(() => {
        if (res) {
          successTip('克隆成功')
          this.getList({objId: this.objId})
        } else {
          failureTip('克隆失败')
        }
        this.getList({objId: this.objId})
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 执行
  @action async runVisual(id) {
    try {
      const res = await io.runVisual({
        id,
      })
      runInAction(() => {
        if (res) {
          successTip('执行成功')
          this.getList({objId: this.objId})
          userLog('标签应用/执行组合标签方案')
        } else {
          failureTip('执行失败')
        }
        this.getList({objId: this.objId})
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable submitLog = ''
  @observable visibleLog = false
  @observable submitLogLoading = false
  // 获取提交日志
  @action async getLog(id) {
    this.submitLogLoading = true
    
    try {
      const res = await io.getLog({
        id,
      })
      runInAction(() => {
        this.submitLog = res
        userLog('标签应用/提交日志')
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.submitLogLoading = false
      })
    }
  }
}

export default new Store()
