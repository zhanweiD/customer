import {
  observable, action, runInAction,
} from 'mobx'
import {successTip, errorTip, userLog} from '../../common/util'
import io from './io'

class Store {
  @observable objList = []
  @observable isLoading = true

  @observable objDetail = {} // 对象详情
  @observable isAdd = true // 添加、编辑
  @observable visible = false
  @observable objId = null // 对象id

  @observable confirmLoading = false

  // 获取对象
  @action.bound async getTreeData(cb) {
    try {
      const res = await io.getTreeData({
        // ...window.defaultParams,
      })
      runInAction(() => {
        this.objList = res || []
        if (res.length) {
          const target = res[0] || {}
          if (cb) cb()
          window.location.href = `${window.__keeper.pathHrefPrefix}/tag-manage/uphold/${target.id}`
        }
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.isLoading = false
    }
  }

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

  @action async getObjectDetail(id, cb = () => {}) {
    try {
      const res = await io.getObjectDetail({
        id,
      })

      cb(res)
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default Store
