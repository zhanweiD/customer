import {
  observable, action, runInAction, toJS,
} from 'mobx'
import {message} from 'antd'

import {errorTip} from '../common/util'
import io from './io'

const dateFormat = 'YYYY-MM-DD'
const date = new Date()
const nowDate = moment(+date.getTime()).format(dateFormat)

class Store {
  projectId // 项目ID
  @observable isJump = false // 是否是跳转进来的
  @observable loading = false
  // 暂无数据状态
  @observable noData = true
  // 场景列表
  @observable entityName = '客户'

  @observable portraits = [] // 画像列表
  @observable defaultPortrait // 画像列表默认值
  @observable portraitId = null // 画像列表默认值
  @observable placeholder = '请输入' // 输入提示
  @observable porLoading = false // 画像列表加载
  @observable changeLoading = false // 画像列表加载
  @observable contactLoading = false // 画像列表加载

  @observable unitList = [] // 画像个体列表
  @observable tabLoading = false // 切换loading
  @observable ident = null // 画像个体id
  @observable chartData = [] // 雷达图
  @observable cloudData = [] // 彰泰标签
  @observable cloud1Data = [] // 客户评价/客户心声
  @observable isCustomer = true // 客户对象 顾问对象 ？
  @observable currentPage = 1 // 页数
  @observable searchKey = '' // 

  @observable unitBasic = [] // 画像个体基础信息

  @observable unitTableList = [] // 画像个体触点
  @observable unitTables = [] // 画像个体触点场景下拉
  @observable unitEvents = [] // 画像个体触点信息
  @observable queryStartTime = null
  @observable queryEndTime = nowDate // 筛选时间
  @observable tableName = null // 筛选业务场景
  @observable isLast = false // 是否是最后一页
  @observable isFirst = true // 是否是第一页

  @action pastDate(v) {
    this.queryStartTime = moment(+date.getTime() - 1000 * 60 * 60 * 24 * v).format(dateFormat)
  }
  // 获取画像个体(对象)
  @action async getPortrait() {
    this.porLoading = true
    try {
      const res = await io.getPortrait()
      runInAction(() => {
        this.portraits = res
        this.defaultPortrait = res[0] ? res[0].id : undefined 
        this.portraitId = res[0] ? res[0].id : undefined
        this.placeholder = res[0] ? res[0].placeholder : '请输入'
        this.isCustomer = true

        // 演示环境默认展示
        this.getUnitList()
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.porLoading = false
    }
  }

  // 获取个体列表
  @action async getUnitList() {
    this.tabLoading = true
    try {
      const res = await io.getUnitList({
        id: this.portraitId,
        searchKey: this.searchKey,
        currentPage: this.currentPage,
      })
      runInAction(() => {
        if (res.data.length === 0) {
          this.isLast = true
          message.warning('已经到底了！')
          return
        }
        if (res.data.length < 10) this.isLast = true
        if (res.data.length === 10) this.isLast = false
        this.unitList = res.data
        this.ident = this.unitList[0].ident
        this.getUnitBasic()
        // if (res.data[0] && res.data[0].ident) {
        //   this.unitList = res.data
        //   this.ident = this.unitList[0].ident
        //   // this.unitName = this.unitList[0].姓名
        //   this.getUnitBasic()
        // } 
        // else if (this.currentPage > 1) {
        //   this.isLast = true
        //   message.warning('已经到底了！')
        // } else {
        //   this.unitList = res.data
        //   this.ident = null
        // }
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.tabLoading = false
    }
  }

  // 获取基础信息
  @action async getUnitBasic() {
    this.changeLoading = true
    try {
      const res = await io.getUnitBasic({
        id: this.portraitId,
        ident: this.ident,
      })
      runInAction(() => {
        this.unitBasic = res || []
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.changeLoading = false
    }
  }

  // 获取触点
  @action async getUnitEvent() {
    this.contactLoading = true
    try {
      const res = await io.getUnitEvent({
        id: this.portraitId,
        ident: this.ident,
        queryStartTime: this.queryStartTime,
        queryEndTime: this.queryEndTime,
        tableName: this.tableName,
      })
      runInAction(() => {
        console.log(res)
        this.unitEvents = res.map(item => {
          item.detailsList.unshift({monthDay: item.year})
          return item
        })
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.contactLoading = false
    }
  }

  // 获取触点业务场景
  @action async getUnitTable() {
    try {
      const res = await io.getUnitTable({
        id: this.portraitId,
        // ident: this.ident,
      })
      runInAction(() => {
        this.unitTables = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 获取标签云图
  @action async getObjCloud(cb) {
    this.loading = true
    try {
      const res = await io.getObjCloud({
        id: this.portraitId,
        ident: this.ident,
      })
      runInAction(() => {
        this.cloudData = []
        const list = res || []
        list.forEach(item => {
          if (item.list) {
            this.cloudData = [...this.cloudData, ...item.list]
          }
        })
        cb(this.cloudData, 2)
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }

  // 获取客户心声评价
  @action async getObjCloud1(cb) {
    this.loading = true
    try {
      const res = await io.getCusVoice({
        id: this.portraitId,
        ident: this.ident,
      })

      runInAction(() => {
        this.cloud1Data = []
        res.forEach(item => {
          if (item.list) {
            this.cloud1Data = [...this.cloud1Data, ...item.list]
          }
        })
        cb(this.cloud1Data, 2)
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }

  // 获取个体象限
  @action async getChart(cb) {
    try {
      const res = this.isCustomer ? await io.getChart1({
        id: this.portraitId,
        ident: this.ident,
      }) : await io.getChart({
        id: this.portraitId,
        ident: this.ident,
      })
      runInAction(() => {
        this.chartData = res
        cb(this.chartData)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
