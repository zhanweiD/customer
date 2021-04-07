import {
  observable, action, runInAction, 
} from 'mobx'
import {successTip, errorTip, userLog} from '../common/util'
import io from './io'

class Store {
  @observable objTreeData = [] // 对象树
  @observable selectedKey = 0 // 选中
  @observable isAdd = true // 添加、编辑
  @observable visible = false // 添加、编辑modal
  @observable objDetail = {} // 对象详情
  @observable objId = null // 对象id
  @observable nameKeyWord = null // 关键词
  @observable confirmLoading = false // loading
  @observable tabId = '1' // tag切换

  @observable loading = false
  @observable releaseLoading = false
  
  @action.bound async getTreeData(cb) {
    this.loading = true
    try {
      const res = await io.getTreeData({
        // ...window.defaultParams,
      })
      runInAction(() => {
        this.objTreeData = res
        if (!res.length) return
        this.selectedKey = this.selectedKey || res[0].id
        this.objId = this.selectedKey || res[0].id
        this.getObjDetail()
        if (cb) cb()
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.loading = false
    }
  }

  @action async getObjDetail() {
    this.objDetail = this.objTreeData.find(item => item.id === this.selectedKey)
  }

  /**
   * @description 添加对象
   */
  @action async addNode(data, cb) {
    this.confirmLoading = true
    try {
      await io.addObject({
        ...data,
        // ...window.defaultParams,
      })

      runInAction(() => {
        this.confirmLoading = false
        successTip('操作成功')
        // 刷新类目树
        this.getTreeData(cb)
        userLog('标签管理/新建对象')
      })
    } catch (e) {
      runInAction(() => {
        this.confirmLoading = false
      })
      errorTip(e.message)
    }
  }

  @action async editNode(data, cb) {
    this.confirmLoading = true
    try {
      await io.editObject({
        ...data,
        // ...window.defaultParams,
      })
      runInAction(() => {
        this.confirmLoading = false
        successTip('操作成功')
        userLog('标签管理/编辑对象')
        // 刷新类目树
        this.getTreeData()
        if (cb) cb()
      })
    } catch (e) {
      runInAction(() => {
        this.confirmLoading = false
      })
      errorTip(e.message)
    }
  }

  @action async delNode(deleteIds, cb) {
    this.confirmLoading = true
    try {
      const res = await io.deleteObject({
        deleteIds: [deleteIds],
      })
      if (res) {
        successTip('操作成功')
        if (cb) cb()
      } else {
        errorTip('操作失败')
      }
      userLog('标签管理/删除对象')
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.confirmLoading = false
    }
  }

  /**
   * @description 重名校验
   */
  @action async checkName(params, cb) {
    try {
      const res = await io.checkName({
        objTypeCode: 4,
        type: 1,
        ...params,
        // ...window.defaultParams,
      })
      runInAction(() => {
        if (res.success) {
          cb('名称已存在')
        } else {
          cb()
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
