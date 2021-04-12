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
  @observable contactLoading = false // 触点加载

  @observable cateList = [] // 触点展开列表
  @observable openKeys = [] // 触点展开列表

  @observable unitList = [] // 画像个体列表
  @observable tabLoading = false // 切换loading
  @observable ident = null // 画像个体id
  @observable chartData = [] // 雷达图
  @observable cloudData = [] // 标签
  @observable isCustomer = true // 客户对象 顾问对象 ？
  @observable currentPage = 1 // 页数
  @observable searchKey = '' // 

  @observable toAllTag = true // 切换标签描摹模式 默认全量

  @observable unitBasic = [] // 画像个体基础信息

  @observable unitTableList = [] // 画像个体触点
  @observable unitTables = [] // 画像个体触点场景下拉
  @observable unitEvents = [] // 画像个体触点信息
  @observable businessList = [] // 业务类型


  @observable tableName = null // 筛选业务场景
  @observable isLast = false // 是否是最后一页
  @observable isFirst = true // 是否是第一页

  @observable followList = [] // 关注客户列表

  @observable businessParams = {
    startTime: null,
    endTime: null,
    eventType: null,
    bizCode: null,
  } // 业务触点搜索参数

  // 标签云图
  @observable cateTitle = [] // 搜索同类目标签标题
  color = ['#1cd389', '#668eff', '#ff6e73', '#8683e6', '#06d3c4', '#42b1cc']

  // @action pastDate(v) {
  //   this.queryStartTime = moment(+date.getTime() - 1000 * 60 * 60 * 24 * v).format(dateFormat)
  // }

  // 获取关注客户列表
  @action async getFollow(currentPage = 1) {
    this.followLoading = true
    try {
      const res = await io.getFollow({currentPage})
      runInAction(() => {
        this.followList = res.data
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.followLoading = false
    }
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
        // this.getUnitList()
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
  @action.bound async getUnitEvent() {
    this.contactLoading = true
    try {
      const res = await io.getUnitEvent({
        id: this.portraitId,
        ident: this.ident,
        tableName: this.tableName,
      })
      runInAction(() => {
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

  // 获取业务类型
  @action async getBizType() {
    try {
      const res = await io.getBizType({
        // id: this.portraitId,
        // ident: this.ident,
      })
      runInAction(() => {
        this.businessList = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 获取标签云图
  @action async getObjCloud(cb) {
    this.loading = true
    this.cateTitle = []
    try {
      const res = await io.getObjCloud({
        id: this.portraitId,
        ident: this.ident,
      })
      runInAction(() => {
        this.cloudData = []
        const list = res || []
        list.forEach((item, i) => {
          this.cateTitle.push({text: item.cat, color: this.color[i]})
          if (item.list) {
            // 同类标签颜色生成
            const newList = item.list.map(text => {
              text.color = this.color[i]
              return text
            })
            this.cloudData = [...this.cloudData, ...newList]
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

  // 获取业务类型
  @action async getChart(cb) {
    try {
      const res = await io.getChart({
        reportTimeEnd: '2021-04-09',
        reportTimeStart: '2020-04-09',
      })
      runInAction(() => {
        this.chartData = res.pieChart
        cb(this.chartData)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
