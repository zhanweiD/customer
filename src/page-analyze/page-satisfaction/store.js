import {
  action, observable, runInAction, toJS,
} from 'mobx'
import {errorTip} from '../../common/util'
import io from './io'
import {ListContentStore} from '../../component/list-content'

const dateFormat = 'YYYY-MM-DD'
const date = new Date()
const nowDate = moment(+date.getTime()).format(dateFormat)
const pastDate = moment(+date.getTime() - 1000 * 60 * 60 * 24 * 365).format(dateFormat)

class Store extends ListContentStore(io.getList) {
  @observable tableLoading = false 
  @observable evaluationPeo // 人数
  @observable evaluationNum // 次数
  @observable satisfactionPer // 比例
  @observable satisfaction // 评价类型
  @observable loading = true 
  @observable reqData = {
    reportTimeStart: pastDate,
    reportTimeEnd: nowDate,
    customerType: null,
    format: null,
    evaluateType: null,
    projectArea: null,
    projectCity: null,
    projectName: null,
  } 

  @action resetReqDate() {
    this.reqData = {}
    this.reqData.reportTimeStart = nowDate
    this.reqData.reportTimeEnd = pastDate
    this.satisfaction = null
  }

  @action getAllData(cb1, cb2) {
    this.getEvaluationPeo()
    this.getEvaluationNum()
    this.getSatisfactionPer()
    this.getChartData(cb1)
    this.getScatterData(cb2)
  }

  // 人数
  @action async getEvaluationPeo() {
    try {
      const res = await io.getEvaluationPeo(this.reqData)
      runInAction(() => {
        this.evaluationPeo = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 次数
  @action async getEvaluationNum() {
    try {
      const res = await io.getEvaluationNum(this.reqData)
      runInAction(() => {
        this.evaluationNum = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 满意度
  @action async getSatisfactionPer() {
    try {
      const res = await io.getSatisfactionPer(this.reqData)
      runInAction(() => {
        this.satisfactionPer = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 客户心声
  @action async getScatterData(cb) {
    this.loading = true
    try {
      const res = await io.getScatterData(this.reqData)
      runInAction(() => {
        // this.scatterData = res
        if (cb) cb(res)
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.loading = false
    }
  }

  // 评价分布
  @action async getChartData(cb) {
    this.loading = true
    try {
      const res = await io.getChartData(this.reqData)
      runInAction(() => {
        // this.consultantData = res
        if (cb) cb(toJS(res))
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.loading = false
    }
  }
}

export default new Store()
