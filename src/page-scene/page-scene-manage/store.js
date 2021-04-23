import {
  observable, action, runInAction,
} from 'mobx'
import {successTip, errorTip, changeToOptions, userLog} from '../../common/util'
import io from './io'


class Store {
  @observable loading = false

  // 场景列表
  @observable list = []

  // 场景详情
  @observable info = {}

  // 弹窗标识 
  @observable modalVisible = false

  // 弹窗编辑／新增 判断标识
  @observable isEdit = false

  // 确认loading
  @observable confirmLoading = false

  // 场景详情
  @action async getDetail(params) {
    try {
      const res = await io.getDetail({
        ...params,
      })

      runInAction(() => {
        this.info = res

        // this.getStorageList({
        //   storageType: res.dataStorageType,
        // })
        this.getObjList()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }


  // 场景列表
  @action async getList() {
    this.loading = true
    try {
      const res = await io.getList({
      })

      runInAction(() => {
        this.loading = false
        this.list.replace(res)
      })
    } catch (e) {
      runInAction(() => {
        this.loading = false
      })
      errorTip(e.message)
    }
  }

  @observable storageTypeLoading = false
  @observable storageSelectLoading = false
  @observable storageType = [] // 数据源类型下拉
  @observable storageSelectList = [] // 数据源下拉
  @observable objList = [] // 对象下拉

  // 数据源类型下拉
  @action async getStorageType() {
    this.storageTypeLoading = true

    try {
      // const res = await io.getStorageType({
      // })
      // runInAction(() => {
      //   this.storageType = changeToOptions(res)('name', 'type')
      // })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.storageTypeLoading = false
      })
    }
  }

  // 数据源下拉
  @action async getStorageList(params) {
    this.storageSelectLoading = true
    try {
      // const res = await io.getStorageList({
      //   // id: this.projectId,
      //   ...params,
      // }) || []
      // runInAction(() => {
      //   this.storageSelectList = changeToOptions(res)('dataDbName', 'dataStorageId')
      // })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.storageSelectLoading = false
      })
    }
  }

  // 对象下拉
  @action async getObjList(params) {
    try {
      const res = await io.getObjList({
        ...params,
      })
      runInAction(() => {
        this.objList = changeToOptions(res)('objName', 'objId')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 场景新增
  @action async addScene(params, cb) {
    this.confirmLoading = true
    try {
      await io.addScene({
        ...params,
      })

      runInAction(() => {
        this.confirmLoading = false
        this.modalVisible = false
        this.getList()
        successTip('添加成功')
        userLog('场景管理/添加场景')
        if (cb)cb()
      })
    } catch (e) {
      errorTip(e.message)
      runInAction(() => {
        this.confirmLoading = false
        this.modalVisible = false
      })
    }
  }

  // 场景删除
  @action async delScene(id) {
    try {
      await io.delScene({
        occasionId: id,
      })

      runInAction(() => {
        this.getList()
        successTip('删除成功')
        userLog('场景管理/删除场景')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 场景编辑
  @action async editScene(params, cb) {
    this.confirmLoading = true
    try {
      await io.editScene({
        ...params,
      })

      runInAction(() => {
        this.getList()
        successTip('编辑成功')
        userLog('场景管理/编辑场景')
        if (cb)cb()
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.confirmLoading = false
        this.modalVisible = false
      })
    }
  }

  // 名称校验
  @action async checkName(params, cb) {
    try {
      const res = await io.checkName({
        ...params,
      })
      runInAction(() => {
        if (typeof res === 'boolean' && res) {
          cb()
        } else {
          cb('名称已存在')
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
