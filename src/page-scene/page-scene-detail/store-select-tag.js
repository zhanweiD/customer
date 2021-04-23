import {
  observable, action, runInAction, toJS,
} from 'mobx'
import {errorTip} from '../../common/util'
import io from './io'


class SelectTagStore {
  constructor(props) {
    this.props = props
  }

  // 项目id
  @observable projectId = undefined

  // 场景id
  @observable sceneId = undefined

  // 选择标签id
  @observable tagId = undefined

  // 标签详情
  @observable tagInfo = {}

  // 添加目的数据源弹窗标识
  @observable selectTagVisible = false

  // API调用数趋势数据
  @observable apiTrendData = []

  // 标签调用次数趋势
  @observable tagTrendData = {
    dataList: [],
    nameList: [],
  }

  // 标签详情loading
  @observable tagInfoLoading = false

  // 标签模型时候存在对象标识；true 存在对象 false 不存在对象;
  @observable tagExistFlag = false
  @observable tagExistFlagLoading = false

  // 标签详情
  @action async getTagDetail() {
    this.tagInfoLoading = true
    try {
      const res = await io.getTagDetail({
        occasionId: this.sceneId,
        tagId: this.tagId,
        projectId: this.projectId,
      })

      runInAction(() => {
        this.tagInfo = res
        this.tagInfoLoading = false
      })
    } catch (e) {
      errorTip(e.message)
      runInAction(() => {
        this.tagInfoLoading = false
      })
    }
  }

  // API调用数趋势
  @action async getApiTrend(params, cb) {
    try {
      // const res = await io.getApiTrend({
      //   occasionId: this.sceneId,
      //   tagId: this.tagId,
      //   ...params,
      //   projectId: this.projectId,
      // })

      // runInAction(() => {
      //   this.apiTrendData.clear()
      //   this.apiTrendData = res
      //   if (cb) cb(toJS(res))
      // })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 标签调用次数趋势
  @action async getTagTrend(params, cb) {
    try {
      // const res = await io.getTagTrend({
      //   occasionId: this.sceneId,
      //   tagId: this.tagId,
      //   ...params,
      //   projectId: this.projectId,
      // })

      runInAction(() => {
        // this.tagTrendData.dataList.clear()
        // this.tagTrendData.nameList.clear()

        // this.tagTrendData.dataList.replace(res.dataList || [])
        // this.tagTrendData.nameList.replace(res.nameList || [])

        // if (cb) cb(res.dataList || [], res.nameList || [])
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

   // 判断标签模型是否有对象
   @action async isObjExist(cb) {
    this.tagExistFlagLoading = true
    try {
      // const res = await io.isObjExist({
      //   projectId: this.projectId,
      // })
      const res = true

      runInAction(() => {
        this.tagExistFlagLoading = false
        
        if (cb && res) {
          // 标签模型存在对象·
          this.tagExistFlag = true
          cb()
        } else {
          // 标签模型 不存在对象
          this.tagExistFlag = false
        }
      })
    } catch (e) {
      errorTip(e.message)
      runInAction(() => {
        this.tagExistFlagLoading = false
        this.tagExistFlag = false
      })
    }
  }
}

export default SelectTagStore
