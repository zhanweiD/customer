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
  @observable isScroll = false 
  @observable reqCliData = { // 列表筛选
    customerType: null,
  } 
  // @observable limitTime = { // 用于限制时间
  //   reportTimeStart: moment(+date.getTime()),
  //   reportTimeEnd: moment(+date.getTime() - 1000 * 60 * 60 * 24 * 1),
  // } 
  @observable reqData = { // 初始时间
    reportTimeStart: pastDate,
    reportTimeEnd: nowDate,
  } 
  @observable reqProData = { // 区域筛选
    projectArea: null,
    projectCity: null,
    projectName: null,
  } 
  @observable clinchData = {
    card: {},
    funnelChart: [],
    pieChart: [],
  } // 成交分析数据

  // 成交分析信息
  @action async getClinch(cb) {
    this.loading = true
    try {
      const res = await io.getClinch({...this.reqData, ...this.reqProData})
      runInAction(() => {
        this.clinchData = res
        if (cb) cb(toJS(this.clinchData))
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.loading = false
    }
  }
}

export default new Store()
