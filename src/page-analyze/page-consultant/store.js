import {
  action, observable, runInAction, toJS,
} from 'mobx'
import {errorTip} from '../../common/util'
import io from './io'
import {ListContentStore} from '../../component/list-content'

class Store extends ListContentStore(io.getList) {
  @observable tableLoading = false 
  @observable loading = true 
  @observable projectList = []
  @observable reqProData = { // 区域筛选
    projectArea: null,
    projectCity: null,
    projectName: null,
  } 
  @observable consultantData = {
    card: {},
    columnChart: {},
    radarChart: {},
  } // 顾问分析数据

  // 顾问分析信息
  @action async getChannel(cb) {
    this.loading = true
    try {
      const res = await io.getChannel(this.reqProData)
      runInAction(() => {
        this.consultantData = res
        if (cb) cb(toJS(this.consultantData))
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.loading = false
    }
  }

  listToTreePro(data) {
    const newData = _.cloneDeep(data)
  
    newData.forEach(item => {
      const children = newData.filter(sitem => sitem.parent === item.name)
      if (children.length && !item.children) item.children = children
    })
    return newData.filter(item => item.parent === -1)
  }

  // 全部项目
  @action async getProject() {
    try {
      const res = await io.getProject()
      runInAction(() => {
        this.projectList = this.listToTreePro(res)
      })
    } catch (e) {
      errorTip(e.message)
    } 
  }
}

export default new Store()
