import {
  observable, action, runInAction,
} from 'mobx'
import {successTip, errorTip} from '../../common/util'
import io from './io'


class SceneTagsStore {
  // 场景id
  @observable sceneId = undefined
  @observable projectId = undefined

  @observable tagInfo = {
    data: [],
    pagination: false,
    loading: false,
  }

  @observable objList = []

  @observable params = {
    pageSize: 10,
    currentPage: 1,
  }

  // 对象下拉
  @action async getObjList() {
    try {
      // const res = await io.getObjList({
      //   occasionId: this.sceneId,
      //   projectId: this.projectId
      // })
      // runInAction(() => {
      //   this.objList.replace(res)
      // })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 标签列表
  @action.bound async getList(tagName) {
    this.tagInfo.loading = true
    try {
      const res = await io.getList({
        occasionId: this.sceneId,
        ...this.params,
        ...tagName,
        // projectId: this.projectId,
      })
      runInAction(() => {
        this.tagInfo.data.replace(res.data)

        this.tagInfo.pagination = {
          pageSize: res.pages,
          total: res.totalCount,
          current: res.currentPage,
        }
        this.tagInfo.loading = false
      })
    } catch (e) {
      errorTip(e.message)
      runInAction(() => {
        this.tagInfo.loading = false
      })
    }
  }
}

export default new SceneTagsStore()
