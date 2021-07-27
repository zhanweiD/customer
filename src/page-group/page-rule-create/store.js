import {
  action, runInAction, observable, toJS,
} from 'mobx'
import {errorTip, changeToOptions, userLog, listToTree} from '../../common/util'
import io from './io'

class Store {
  projectId
  type

  @observable groupId

  @observable current = 0 // 步骤条
  // @observable createId = 0 // 如何创建客群 1 规则离线 2 规则实时 3 id集合
  @observable recordObj = {} // 当前编辑客群
  @observable oneForm = {} // 第一步表单
  @observable threeForm = {} // 第三步表单
  @observable submitLoading = false
  @observable aysVisible = false // 数据分析
  @observable editLoading = false // 编辑加载

  // 第一步 设置基础信息
  @observable entityList = []
  @observable objId
  @observable isCopy = false

  // 第二步 设置客群圈选规则
  @observable configTagList = [] // 对象对应已同步的标签列表
  @observable drawerConfigTagList = [] // 对象对应已同步的标签列表
  @observable relList = [] // 对象对应的关系列表
  @observable otherEntity = [] // 另一个实体对象
  @observable logicExper = {}
  @observable posList // 
  @observable wherePosMap = {}
  @observable whereMap = {} // 设置筛选条件
  
  @observable treeData = [] // 数据分析类目树
  @observable useTagList = [] // 可用标签
  @observable applyId = null // 数据分析使用
  @observable chartLoading = false // 数据分析使用

  // 第三步
  @observable outputTags = []

  @observable saveInfo = {}

  // 编辑
  @observable detail = {}
  @observable detailLoading = false

  // 获取实体列表
  @action async getEntityList(cb) {
    try {
      const res = await io.getEntityList({
      })
      this.objId = res.filter(item => item.name === '客户对象')[0].objId
      // runInAction(() => {
      //   this.entityList = changeToOptions(toJS(res || []))('name', 'objId')
      // })
      if (cb) cb()
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 添加客群
  @action async addGroup(params) {
    this.submitLoading = true
    
    try {
      const logicExper = {
        ...toJS(this.logicExper),
        posList: JSON.stringify(toJS(this.posList)),
      }

      const res = await io.addGroup({
        mode: 1,
        type: +this.type,
        logicExper: JSON.stringify(logicExper),
        objId: this.objId,
        ...toJS(this.oneForm),
        // ...params,
      })

      runInAction(() => {
        userLog('客群管理/新建客群')
        // cb(res)
        this.saveInfo = res
        this.current += 1
        window.location.href = `${window.__keeper.pathHrefPrefix || '/'}/group/manage/detail/${res.id}/${this.objId}`
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.submitLoading = false
      })
    }
  }

  // 编辑客群详情信息
  @action async getDetail(id) {
    this.editLoading = true
    try {
      const res = await io.getDetail({
        id, 
      })

      runInAction(() => {
        this.objId = res.objId
        this.detail = res
        this.getOutputTags(this.objId)

        if (res.logicExper) {
          this.logicExper = JSON.parse(res.logicExper)
          this.posList = JSON.parse(this.logicExper.posList)
  
          this.wherePosMap = this.posList.wherePosMap // 回显
          this.whereMap = this.posList.whereMap // 添加
  
          this.getConfigTagList()
          this.getRelList()
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 编辑客群
  @action async editGroup(params) {
    this.submitLoading = true
    try {
      const logicExper = {
        ...toJS(this.logicExper),
        posList: JSON.stringify(toJS(this.posList)),
      }

      const res = await io.editGroup({
        id: +this.groupId,
        mode: 1,
        type: +this.type,
        objId: this.objId,
        logicExper: JSON.stringify(logicExper),
        ...toJS(this.oneForm),
        // ...params,
      })

      runInAction(() => {
        if (this.isCopy) userLog('客群管理/复制客群')
        else userLog('客群管理/编辑客群')
        // cb(res)/group/manage/${record.id}/${record.objId}
        this.saveInfo = res
        this.current += 1
        window.location.href = `${window.__keeper.pathHrefPrefix || '/'}/group/manage/detail/${res.id}/${this.objId}`
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.submitLoading = false
      })
    }
  }

  // 重命名校验
  @action async checkName(params, callbak) {
    try {
      const res = await io.checkName({
        ...params,
      })
      if (res.isExist) {
        callbak('客群名称已存在')
      } else {
        callbak()
      }
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 重命名标识校验
  @action async checkLog(params, callbak) {
    try {
      const res = await io.checkLog({
        ...params,
      })
      if (res.isExit) {
        callbak('客群标识已存在')
      } else {
        callbak()
      }
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 获取对象对应已同步的标签列表
  @action.bound async getConfigTagList() {
    try {
      const res = await io.getConfigTagList({
        objId: this.objId, // 实体ID
      })

      runInAction(() => {
        this.configTagList = res
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.editLoading = false
    }
  }

  // 获取配置筛选条件对象对应已同步的标签列表
  @action async getDrawerConfigTagList(params, cb) {
    try {
      const res = await io.getConfigTagList({
        objId: this.objId, // 实体ID
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
      // const res = await io.getRelList({
      //   objId: this.objId, // 实体ID
      // })

      runInAction(() => {
        this.relList = this.configTagList
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 获取另一个实体对象
  @action async getOtherEntity(params) {
    try {
      const res = await io.getOtherEntity({
        objId: this.objId,
        ...params,
      }) || {}

      runInAction(() => {
        this.otherEntity = res.objId ? [res] : []
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 获取输出标签
  @action async getOutputTags(objId) {
    try {
      const res = await io.getOutputTags({
        objId, // 实体ID
      })

      runInAction(() => {
        this.outputTags = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 初始化数据
  @action.bound destroy() {
    if (this.groupId) {
      this.detail = {}
    }

    this.current = 0
    this.oneForm = {}
    this.threeForm = {}
    this.submitLoading = false

    this.entityList.clear()
    this.configTagList.clear()
    this.otherEntity.clear()

    this.logicExper = {}
    this.posList = {}
    this.whereMap = {}
    this.wherePosMap = {}
  }

  @observable tagLoading = true 

  @observable checkList = [] // 选中的标签
  @observable aysTagList = [] // 标签列表
  @observable tagChartData = [] // 标签分析数据

  // 标签分析
  @action.bound async getTagData() {
    this.tagChartData = []
    this.chartLoading = true
    try {
      const res = await io.getTagData({
        tagIds: this.checkList,
        applyId: this.applyId,
      })
      runInAction(() => {
        this.tagChartData = res || []
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.chartLoading = false
    }
  }

  // 类目标签树
  @action.bound async getTagTree() {
    try {
      const res = await io.getTagTree({
        // objId: 9063199376998720,
        objId: this.objId,
      })

      res.forEach(item => {
        item.title = item.name
        item.key = item.id
      })

      this.treeData = listToTree(res || [])
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 可分析标签
  @action.bound async getUseTag() {
    const logicExper = {
      ...toJS(this.logicExper),
      posList: JSON.stringify(toJS(this.posList)),
    }
    try {
      const res = await io.getUseTag({
        objId: this.objId,
        logicExper: JSON.stringify(logicExper),
      })
      this.useTagList = res.tagIds || []
      this.applyId = res.applyId
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
