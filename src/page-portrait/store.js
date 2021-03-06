import {
  observable, action, runInAction, toJS,
} from 'mobx'
import {message} from 'antd'

import {errorTip, successTip, listToTree} from '../common/util'
import io from './io'

// const dateFormat = 'YYYY-MM-DD'
// const date = new Date()
// const nowDate = moment(+date.getTime()).format(dateFormat)

function busListToTree(data) {
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
  @observable selectLoading = false // selectLoading
 
  @observable unitList = [] // 画像个体列表
  @observable unitKeys = [] // 存放个人对象key，key是可变的，直接obj.key有时会有问题
  @observable ident = null // 画像个体id
  @observable isCustomer = true // 客户对象 顾问对象 ？

  @observable followList = [] // 关注客户列表
  @observable followLoading = false // 关注客户列表
  @observable scanList = [] // 关注客户列表
  @observable bizList = [] // 业务下拉元数据

  // 客户档案
  @observable unitBasic = [] // 画像个体基础信息
  @observable defaultInfo = {} // 画像个体基础信息
  @observable basicLoading = false // 画像个体基础信息loading
  @observable attention = 0 // 关注取关

  // 标签描摹
  @observable cloudData = [] // 标签
  @observable toAllTag = false // 切换标签描摹模式 默认云图
  @observable treeData = [] // 切换标签描摹模式 默认全量
  @observable businessType = null // 业务类型
  @observable defPortraitList = [] // 已配置标签
  @observable tagList = [] // 标签列表
  @observable selectName = [] // 类目树选择的类目

  // 业务触点
  @observable contactLoading = false // 触点加载
  @observable chartLoading = false // 类型分布加载
  @observable cateList = [] // 全部触点key
  @observable openKeys = [] // 触点展开列表
  @observable isOpen = false // 是否展开
  @observable unitTableList = [] // 画像个体触点
  @observable unitEvents = [] // 画像个体触点信息
  @observable businessList = [] // 业务类型
  @observable pieData = [] // 业务类型分布图
  @observable barData = [] // 触点类型分布图
  @observable businessParams = {
    startTime: null,
    endTime: null,
    eventType: null,
    bizCode: null,
  } // 业务触点搜索参数

  // 标签云图
  @observable cateTitle = [] // 搜索同类目标签标题
  color = ['#2592FF', '#6C41FA', '#61BA46', '#FD5071', '#FFA44A']
  bgColor = ['rgba(134, 212, 255, 0.1)', 'rgba(196, 179, 255, 0.1)', 'rgba(191, 238, 169, 0.1)', 'rgba(253, 80, 113, 0.1)', 'rgba(255, 164, 74, 0.1)']

  // @action pastDate(v) {
  //   this.queryStartTime = moment(+date.getTime() - 1000 * 60 * 60 * 24 * v).format(dateFormat)
  // }

  // 显示配置详情 
  @action async showDrawer() {
    this.defPortraitList = []
    try {
      const res = await io.getDetails({
        id: this.portraitId,
      })
      runInAction(() => {
        res.portrait.forEach(item => {
          if (item.tagIdList.length > 1) {
            this.defPortraitList = [...this.defPortraitList, ...item.catIdList]
          }
        })
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 类目标签树
  @action async getTagTree() {
    try {
      const res = await io.getTagTree({
        objId: 9063199376998720,
      })
      runInAction(() => {
        const cates = res.filter(item => item.isCate) || []
        this.treeData = listToTree(cates)
      })
    } catch (e) {
      errorTip(e.message)
    } 
  }

  // 获取关注客户列表
  @action async getFollow(currentPage = 1) {
    this.followLoading = true
    try {
      const res = await io.getFollow({
        currentPage,
        id: this.portraitId,
      })
      runInAction(() => {
        this.followList = res.data
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 获取最近浏览客户列表
  @action async getScan(currentPage = 1) {
    try {
      const res = await io.getScan({
        currentPage,
        id: this.portraitId,
      })
      runInAction(() => {
        this.scanList = res.data
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

        if (this.portraitId) {
          this.getFollow()
          this.getScan()
        }
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.porLoading = false
    }
  }

  // 获取个体列表
  @action async getUnitList(searchKey) {
    this.selectLoading = true
    try {
      const res = await io.getUnitList({
        id: this.portraitId,
        searchKey,
        currentPage: 1,
      })
      runInAction(() => {
        this.unitList = res.data
        if (res.data.length) {
          this.unitKeys = Object.keys(res.data[0]) 
        }
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.selectLoading = false
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
        bizList: this.businessType,
      })
      runInAction(() => {
        this.cloudData = []
        const list = res || []
        list.forEach((item, i) => {
          this.cateTitle.push({text: item.biz, color: this.color[i % 5]})
          if (item.list) {
            // 同类标签颜色生成
            const newList = item.list.map(text => {
              text.name = `${text.tag}: ${text.val}`
              text.value = 14
              text.textStyle = {
                color: this.color[i % 5],
                backgroundColor: this.bgColor[i % 5],
                padding: [8, 12],
                fontSize: 14,
                // margin: [12, 8],
                borderRadius: 16,
              }
              return text
            })
            this.cloudData = [...this.cloudData, ...newList]
          }
        })
        if (cb) cb(this.cloudData)
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }

  // 获取标签列表
  @action async getTagList() {
    this.selectName = []
    try {
      const res = await io.getTagList({
        id: this.portraitId,
        ident: this.ident,
      })
      runInAction(() => {
        this.tagList = res || []
        this.tagList.forEach(item => this.selectName.push(item.cat))
      })
    } catch (e) {
      errorTip(e.message)
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
        this.unitBasic = res.basic || []
        this.defaultInfo = res.info || {}
        this.attention = res.attention
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.basicLoading = false
    }
  }
  // 取关关注
  @action async actionFocus() {
    try {
      await io.actionFocus({
        id: this.portraitId,
        ident: this.ident,
        type: this.attention ? 0 : 1,
      })
      runInAction(() => {
        successTip(this.attention ? '取关成功' : '关注成功')
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
        ident: this.ident,
        ...this.businessParams,
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
        ident: this.ident,
        ...this.businessParams,
      })
      runInAction(() => {
        this.barData = res
        cb(this.pieData, this.pieTotal, res)
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.chartLoading = false
    }
  }

  // 获取业务类型下拉
  @action async getBizType(cb) {
    try {
      const res = await io.getBizType({
        id: this.portraitId,
        ident: this.ident,
      })
      runInAction(() => {
        this.bizList = res || []
        this.bizList.forEach(item => {
          item.title = item.bizName
          item.value = item.bizCode
        })
        this.businessList = busListToTree(this.bizList)
        this.businessType = this.businessList.map(item => [item.bizCode])
      })
      if (cb) {
        this.getObjCloud(cb)
      }
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 获取触点
  @action.bound async getUnitEvent() {
    this.contactLoading = true
    try {
      const res = await io.getUnitEvent({
        id: this.portraitId,
        ident: this.ident,
        ...this.businessParams,
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
