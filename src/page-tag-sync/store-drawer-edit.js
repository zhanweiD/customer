import {
  action, runInAction, observable,
} from 'mobx'
import {errorTip, listToTree, userLog} from '../common/util'
import io from './io'

class Store {
  projectId
  objId
  schemeId
  storageId
  
  // 标签树
  @observable treeData = []
  @observable originTreeData = []
  @observable treeLoading = false
  // 标签列表
  @observable tableData = []
  @observable majorTagList = []

  @observable searchKey = undefined
  @observable checkedKeys = []
  @observable checkedTagData = []
  @observable disabledKeys = []

  @action.bound destroy() {
    this.treeData.clear()
    this.tableData.clear()
    this.majorTagList.clear()
    this.disabledKeys.clear()
    this.checkedTagData.clear()
    this.checkedKeys.clear()
    this.confirmLoading = false
  }

  @action async getTagTree(params) {
    this.treeLoading = true
    try {
      const res = await io.getTagTree({
        projectId: this.projectId,
        objId: this.objId,
        storageId: this.storageId,
        schemeId: this.schemeId,
        ...params,
      })

      runInAction(() => {
        this.originTreeData = res
        this.treeData = listToTree(res)
        if (res.length) {
          const majorTag = res.filter(d => d.isMajor || d.isUsed)
          this.majorTagList.replace(majorTag)
          this.tableData = res.filter(d => d.isUsed).map(d => ({
            ...d,
            columnName: d.enName,
          }))
        }
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.treeLoading = false
      })
    }
  }

  @observable confirmLoading = false
  // 新增同步计划
  @action async editSync(params, cb) {
    this.confirmLoading = true

    try {
      await io.editSync({
        projectId: this.projectId,
        ...params,
      })
      runInAction(() => {
        if (cb) {
          cb()
        }
        userLog('标签同步/编辑同步计划')
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.confirmLoading = false
      })
    }
  }
}

export default new Store()
