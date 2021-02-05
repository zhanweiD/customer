import {
  action, runInAction, observable, toJS,
} from 'mobx'
import {errorTip} from '../../common/util'
import {ListContentStore} from '../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getList) {
  visualId
  @observable infoLoading = false
  @observable detail = {}

  @observable configInfo = {} // 配置信息
  @observable configInfoLoading = false
  @observable drawerVisible = false

  @observable drawerTagVisible = false
  @observable tagDetailLoading = false

  @action async getDetail() {
    this.infoLoading = true

    try {
      const res = await io.getDetail({
        id: this.visualId,
      })

      runInAction(() => {
        this.detail = res
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.infoLoading = false
      })
    }
  }

  @action async getConfigInfo() {
    this.configInfoLoading = true
    try {
      const res = await io.getConfigInfo({
        id: this.visualId,
      })

      runInAction(() => {
        this.configInfo = res
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.configInfoLoading = false
      })
    }
  }

  @observable ruleInfo = {}
  @observable ruleInfoLoading = false
  @observable posInfoList = []

  @action async getRuleInfo() {
    this.ruleInfoLoading = true

    try {
      const res = await io.getRuleInfo({
        id: this.visualId,
      })
      runInAction(() => {
        this.ruleInfo = res

        // this.posInfoList = res.posInfoList && res.posInfoList.filter(d => d.type !== 3)
        this.posInfoList = res.posInfoList
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.ruleInfoLoading = false
      })
    }
  }

  // * ****************** 标签详情 start*********************//
  @observable configTagList = []

  // 获取选择标签下拉框
  @action async getSelectTag() {
    try {
      const res = await io.getSelectTag({
        id: this.visualId,
      })
      runInAction(() => {
        this.configTagList = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }


  @observable detailLoading = false
  @observable tagTreeData = []
  @observable currentTag = undefined
  @observable currentTagData = {}
  @observable ruleList = []
  @observable canEditCondition = false

  relVisualExtRspList = {}

  @action async getTagDetail() {
    this.detailLoading = true

    try {
      const res = await io.getTagDetail({
        id: this.visualId,
      })
      runInAction(() => {
        const len = res.basTagRspList.length

        if (len) {
          for (let i = 0; i < len; i += 1) {
            const currentTag = res.basTagRspList[i]
  
            this.tagTreeData.push(currentTag)
  
            this.relVisualExtRspList[currentTag.id] = res.relVisualExtRspList[i] 
          }
        }
       
        this.selectTag(res.basTagRspList[0])
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.detailLoading = false
      })
    }
  }

  @action.bound selectTag(data) {
    const tagId = data.tagId || data.id
    const currentTagData = toJS(this.relVisualExtRspList[tagId]) || {}
    const whenThenList = (currentTagData.visualWhenThenElse && currentTagData.visualWhenThenElse.whenThenList) || []

    const ruleList = []
    if (whenThenList.length) {
      for (let i = 0; i < whenThenList.length; i += 1) {
        const current = whenThenList[i]

        // const posInfoList = current.when.posInfoList.filter(s => s.type !== 3)
        const {posInfoList} = current.when
      
        const when = {
          ...current.when,
          posInfoList,
        }
        const obj = {
          id: `rule${i}`,
          when,
          then: current.then,
        }
        ruleList.push(obj)
      }
    } 

    this.ruleList.replace(ruleList)

    if (currentTagData) {
      this.currentTagData = currentTagData
    } else {
      this.currentTagData = {}
    }

    this.currentTag = data.id
  }
}

export default new Store()
