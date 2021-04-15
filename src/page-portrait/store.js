import {
  observable, action, runInAction, toJS,
} from 'mobx'
import {message} from 'antd'

import {errorTip, successTip} from '../common/util'
import io from './io'

const dateFormat = 'YYYY-MM-DD'
const date = new Date()
const nowDate = moment(+date.getTime()).format(dateFormat)

function listToTree(data) {
  const newData = _.cloneDeep(data)

  newData.forEach(item => {
    const children = newData.filter(sitem => sitem.parentCode === item.bizCode)
    if (children.length && !item.children) item.children = children
  })

  return newData.filter(item => item.parentCode === '-1')
}

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
 
  @observable unitList = [] // 画像个体列表
  @observable tabLoading = false // 切换loading
  @observable ident = null // 画像个体id
  @observable isCustomer = true // 客户对象 顾问对象 ？
  @observable currentPage = 1 // 页数
  @observable searchKey = '' // 
  @observable isLast = false // 是否是最后一页
  @observable isFirst = true // 是否是第一页

  @observable followList = [] // 关注客户列表

  // 客户档案
  @observable unitBasic = [] // 画像个体基础信息
  @observable basicLoading = false // 画像个体基础信息loading
  @observable attention = 0 // 关注取关

  // 标签描摹
  @observable cloudData = [] // 标签
  @observable toAllTag = true // 切换标签描摹模式 默认全量

  // 业务触点
  @observable contactLoading = false // 触点加载
  @observable chartLoading = false // 类型分布加载
  @observable cateList = [] // 全部触点key
  @observable openKeys = [] // 触点展开列表
  @observable unitTableList = [] // 画像个体触点
  @observable unitEvents = [] // 画像个体触点信息
  @observable businessList = [] // 业务类型
  @observable pieData = [] // 业务类型分布图
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
        // id: 34323626329648,
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

  // 客户档案
  // 获取基础信息
  @action async getUnitBasic() {
    this.basicLoading = true
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
      this.basicLoading = false
    }
  }
  // 获取基础信息
  @action async actionFocus(type = 0) {
    try {
      await io.actionFocus({
        id: this.portraitId,
        ident: this.ident,
        type,
      })
      runInAction(() => {
        successTip(type ? '关注成功' : '取关成功')
        this.getUnitBasic()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 业务触点
  // 获取业务类型分布
  @action async getPieChart(cb) {
    this.pieTotal = 0
    this.chartLoading = true
    try {
      const res = await io.getPieChart({
        // ident: this.ident,
        // ...this.businessParams,
        ident: '2RnX1YmRme2VkchQ7scc4g2tNCijVQ3KCyZFLAYYjBgnAp8pmX',
        startTime: '2021-01-01',
        endTime: '2021-05-01',
        eventType: 1,
        bizCode: 'DC',
      })
      runInAction(() => {
        this.getBarChart(cb)
        this.pieData = res || []
        this.pieData.forEach(item => this.pieTotal += item.value)
        // cb(this.pieData, this.pieTotal)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 获取触点类型分布
  @action async getBarChart(cb) {
    try {
      const res = await io.getBarChart({
        // ident: this.ident,
        // ...this.businessParams,
        ident: '2RnX1YmRme2VkchQ7scc4g2tNCijVQ3KCyZFLAYYjBgnAp8pmX',
        startTime: '2021-01-01',
        endTime: '2021-05-01',
        eventType: 1,
        bizCode: 'DC',
      })
      runInAction(() => {
        cb(this.pieData, this.pieTotal, res)
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.chartLoading = false
    }
  }

  // 获取业务类型下拉
  @action async getBizType() {
    try {
      const res = await io.getBizType({
        // id: this.portraitId,
        // ident: this.ident,
      })
      runInAction(() => {
        this.businessList = listToTree(res)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 获取触点
  @action.bound async getUnitEvent() {
    this.contactLoading = true
    try {
      const res = await io.getUnitEvent({
        // id: this.portraitId,
        // ident: this.ident,
        ident: '2RnX1YmRme2VkchQ7scc4g2tNCijVQ3KCyZFLAYYjBgnAp8pmX',
        startTime: '2021-01-01',
        endTime: '2021-05-01',
        eventType: 1,
        bizCode: 'DC',
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
}

export default new Store()
