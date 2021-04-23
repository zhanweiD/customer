import {
  observable, action, runInAction,
} from 'mobx'
import {successTip, errorTip, failureTip, changeToOptions, userLog} from '../../common/util'
import io from './io'


class SceneDetailStore {
  currentKey = '1'
  @observable projectId // 项目id
  // 场景id
  @observable sceneId = undefined

  @observable loading = false

  // 场景基本信息
  @observable info = {}

  // 场景详情编辑弹窗标识
  @observable modalVisible = false

  // 确认按钮loading
  @observable confirmLoading = false

  // 对象下拉
  @action async getObjList(params) {
    try {
      const res = await io.getObjList({
        ...params,
      })
      runInAction(() => {
        this.objList = changeToOptions(res)('objName', 'objId')
        // userLog('场景管理/选择对象')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 场景详情
  @action async getDetail() {
    this.loading = true
    try {
      const res = await io.getDetail({
        occasionId: this.sceneId,
        projectId: this.projectId,
      })

      runInAction(() => {
        this.info = res
        this.loading = false
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 场景编辑
  @action async editScene(params) {
    this.confirmLoading = true

    try {
      await io.editScene({
        ...params,
        projectId: this.projectId,
      })

      runInAction(() => {
        this.modalVisible = false
        this.confirmLoading = false
        successTip('编辑成功')
        this.getDetail()
        userLog('场景管理/编辑场景')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 名称校验
  @action async checkName(params, cb) {
    try {
      const res = await io.checkName({
        ...params,
        projectId: this.projectId,
      })

      runInAction(() => {
        if (cb) cb(res)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable functionCodes = []

  /**
   * @description 权限code
   */
  // @action async getAuthCode() {
  //   try {
  //     const res = await io.getAuthCode({
  //       projectId: this.projectId,
  //     })
  //     runInAction(() => {
  //       this.functionCodes = res
  //     })
  //   } catch (e) {
  //     errorTip(e.message)
  //   }
  // }
}

export default new SceneDetailStore()
