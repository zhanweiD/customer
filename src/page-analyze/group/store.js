import {
  action, observable, runInAction, toJS,
} from 'mobx'
import {errorTip, changeToOptions} from '../../common/util'
import io from './io'

class Store {
  @observable loading = true 
  @observable tagLoading = true 

  @observable checkList = [] // 选中的标签
  @observable tagList = [] // 标签列表
  @observable groupId = null // 客群id
  @observable groupList = [] // 客群列表
  @observable tagData = [] // 标签分析数据

  // 群体下拉
  @action async getGroup() {
    this.loading = true
    try {
      const res = await io.getGroup()
      runInAction(() => {
        this.groupList = res || []
        this.groupId = res[0] ? res[0].groupId : null
        this.getTagList()
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.loading = false
    }
  }

  // 标签分析
  @action.bound async getTagData() {
    this.tagData = []
    this.loading = true
    try {
      const res = await io.getTagData({
        groupId: this.groupId,
        tagIds: this.checkList,
      })
      runInAction(() => {
        this.tagData = res || []
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.loading = false
    }
  }

  // 枚举标签列表
  @action async getTagList() {
    this.tagLoading = true
    if (!this.groupId) return
    try {
      const res = await io.getTagList({
        groupId: this.groupId,
      })
      runInAction(() => {
        this.tagList = res.map(item => {
          item.label = item.tagName
          item.value = item.tagId
          return item
        })
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.tagLoading = false
    }
  }
}

export default new Store()
