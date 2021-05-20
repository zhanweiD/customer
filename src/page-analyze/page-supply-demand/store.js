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
  @observable loading = true 
  @observable lineLoading = true
  @observable unFitList = [] 
  
  @observable indicators = null

  @observable reqData = {
    reportTimeStart: pastDate,
    reportTimeEnd: nowDate,
    projectArea: null,
    projectCity: null,
    projectName: null,
  } 

  // 供需所有指标select
  @action async getSupply() {
    try {
      const res = await io.getSupply()
      runInAction(() => {
        this.unFitList = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 总览列表
  @action async getFitList(cb, cb1) {
    this.loading = true
    try {
      const res = await io.getFitList(this.reqData)
      runInAction(() => {
        if (!res[0]) {
          this.lineLoading = false
          cb1({})
        } else {
          res.reverse()
          const param = res[6] ? res[6].index : null
          this.getSupplyXY(param, cb1)
        }

        if (cb) cb(toJS(res || []))
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.loading = false
    }
  }

  // 明细坐标
  @action async getSupplyXY(param, cb) {
    if (!param) return
    this.lineLoading = true
    try {
      const res = await io.getSupplyXY({
        index: param,
        ...this.reqData,
      })
      runInAction(() => {
        if (cb) cb(toJS(res || []))
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.lineLoading = false
    }
  }
}

export default new Store()
