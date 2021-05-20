import {
  action, observable, runInAction, toJS,
} from 'mobx'
import {errorTip} from '../../common/util'
import io from './io'
import {ListContentStore} from '../../component/list-content'

class Store extends ListContentStore(io.getList) {
  @observable tgiLoading = true 
  @observable tabLoading = true 
  @observable chartLoading = true 
  @observable loading = true 

  @observable getDrawSaveTrend // 绘制饼图
  
  @observable defaultProject = [] // 搜索默认项目
  @observable defaultNames = [] // 搜索默认项目
  @observable merit = '' // 纬度

  @observable cardData = [] // card数据
  @observable tgiMerit = [] // select数据
  @observable listDate = []
  @observable formatList = []
  @observable reqData = {
    projectArea: null,
    projectCity: null,
    projectName: null,
    format: null,
  } 

  // tgi列表
  @action async getTgiList() {
    this.tgiLoading = true
    try {
      const res = await io.getTgiList(this.reqData)
      runInAction(() => {
        this.listDate = res.sort((a, b) => (+b.count) - (+a.count))
        const param = res[0] ? res[0].tag : null
        this.getChart(param)
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.tgiLoading = false
    }
  }

  // tgi纬度
  @action async getTgiMerit() {
    try {
      const res = await io.getTgiMerit()
      runInAction(() => {
        this.tgiMerit = res
        this.merit = res[0]
        this.getList({...this.reqData, tag: res[0], currentPage: 1})
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 业态
  @action async getFormat() {
    try {
      const res = await io.getFormat()
      runInAction(() => {
        this.formatList = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 指标卡信息
  @action async getCard(cb) {
    this.loading = true
    try {
      const res = await io.getCard(this.reqData)
      runInAction(() => {
        this.cardData = res
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.loading = false
    }
  }

  // 饼图数据
  @action async getChart(tag) {
    this.chartLoading = true
    try {
      const res = await io.getChart({
        ...this.reqData,
        tag,
      })
      runInAction(() => {
        if (res.length > 20) res.length = 20
        const chart = res.sort((a, b) => a.value - b.value)
        this.getDrawSaveTrend(res || [], tag)
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.chartLoading = false
    }
  }
}

export default new Store()
