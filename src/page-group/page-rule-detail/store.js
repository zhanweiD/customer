import {
  action, runInAction, observable, toJS,
} from 'mobx'
import {errorTip, changeToOptions} from '../../common/util'
import io from './io'

class Store {
  projectId
  type

  @observable groupId
  // 第一步 设置基础信息
  @observable entityList = []
  @observable objId

  // 第二步 设置群体圈选规则
  @observable configTagList = [] // 对象对应已同步的标签列表
  @observable drawerConfigTagList = [] // 对象对应已同步的标签列表
  @observable relList = [] // 对象对应的关系列表
  @observable otherEntity = [] // 另一个实体对象
  @observable logicExper = {}
  @observable posList
  @observable wherePosMap = {}
  @observable whereMap = {}

  // 编辑
  @observable detail = {}
  @observable detailLoading = true

  // 群体详情信息
  @action async getDetail(id, cb) {
    this.detailLoading = true
    try {
      const res = await io.getDetail({
        projectId: this.projectId,
        id,
      })

      runInAction(() => {
        if(res) {
          this.posList = JSON.parse(res)

          this.wherePosMap = this.posList.wherePosMap // 回显
          this.whereMap = this.posList.whereMap // 添加
  
          this.detail = res
  
          if (cb) cb()
        }
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.detailLoading = false
      })
    }
  }

  // 获取对象对应已同步的标签列表
  @action async getConfigTagList(params, cb) {
    try {
      const res = await io.getConfigTagList({
        objId: this.objId, // 实体ID
        projectId: this.projectId,
        ...params,
      })

      runInAction(() => {
        this.configTagList = res
        cb()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 获取配置筛选条件对象对应已同步的标签列表
  @action async getDrawerConfigTagList(params, cb) {
    try {
      const res = await io.getConfigTagList({
        objId: this.objId, // 实体ID
        projectId: this.projectId,
        ...params,
      })

      runInAction(() => {
        this.drawerConfigTagList = res
        cb()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 获取对象对应的关系列表
  @action async getRelList() {
    try {
      const res = await io.getRelList({
        objId: this.objId, // 实体ID
        projectId: this.projectId,
      })

      runInAction(() => {
        this.relList = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 获取另一个实体对象
  @action async getOtherEntity(params) {
    try {
      const res = await io.getOtherEntity({
        projectId: this.projectId,
        objId: this.objId, // 实体ID
        ...params,
      })

      runInAction(() => {
        this.otherEntity = res.objId ? [res] : []
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action.bound destroy() {
    if (this.groupId) {
      this.detail = {}
    }
    
    this.entityList.clear()
    this.configTagList.clear()
    this.otherEntity.clear()

    this.logicExper = {}
    this.posList = {}
    this.whereMap = {}
    this.wherePosMap = {}
    this.detailLoading = false
  }
}

export default new Store()
