import {
  action, observable, runInAction, toJS,
} from 'mobx'
import {errorTip} from '../../common/util'
import io from './io'
import {ListContentStore} from '../../component/list-content'

const dateFormat = 'YYYY-MM-DD'
const date = new Date()
const nowDate = moment(+date.getTime()).format(dateFormat)
// const pastDate = moment(+date.getTime() - 1000 * 60 * 60 * 24 * 90).format(dateFormat)
const pastDate = '2021-01-01'

class Store extends ListContentStore(io.getList) {
  @observable tableLoading = false 
  @observable loading = true 
  @observable isScroll = false 
  @observable treeDate = [] // 全部渠道
  @observable reqData = { // 时间筛选
    reportTimeStart: pastDate,
    reportTimeEnd: nowDate,
  } 
  @observable reqChaData = { // 列表筛选
    channelId: null,
    channelType: null,
    customerType: null,
  } 
  @observable reqProData = { // 区域筛选
    projectArea: null,
    projectCity: null,
    projectName: null,
  } 
  @observable channelData = {
    card: {},
    sankeyChart: {},
    pieChart: [],
  } // 渠道分析数据

  // 渠道分析信息
  @action async getChannel(cb) {
    this.loading = true
    try {
      const res = await io.getChannel({...this.reqData, ...this.reqProData})
      runInAction(() => {
        this.channelData = res
        if (cb) cb(toJS(this.channelData))
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.loading = false
    }
  }

  listToTree(data) {
    const newData = _.cloneDeep(data)
  
    newData.forEach(item => {
      const children = newData.filter(sitem => sitem.parentId === item.channelId)
      if (children.length && !item.children) item.children = children
    })
    return newData.filter(item => item.parentId === '-1')
  }

  // 全部渠道
  @action async getAllChannel(cb) {
    try {
      const res = await io.getAllChannel()
      runInAction(() => {
        this.treeDate = this.listToTree(res)
      })
    } catch (e) {
      errorTip(e.message)
    } 
  }
}

export default new Store()
