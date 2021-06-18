import {observable, action, toJS} from 'mobx'
import _ from 'lodash'
import {errorTip, changeToOptions, userLog, listToTree} from '../../common/util'
import io from './io'

export default class Store {
  @observable id

  @observable planDetail
  @observable planName
  @observable planGroup
  @observable planTime
  @observable planTarget

  @observable groupList = [] // 受众用户列表

  @observable touchCount = 0 // 计划触达
  @observable targetRate = 0 // 目标完成率

  @observable lineChartData = [] // 目标完成人数折线图

  @observable eventStatistics = [] // 事件人数统计

  // 分析事件
  @observable eventList = [] // 可分析渠道事件
  @observable eventListFormatter = [] // 可分析渠道事件转化的，下拉框里的
  @observable analysisStart = '计划触达'
  @observable analysisEnd = ''

  @observable analysisedEventList = [] // 已配置的分析渠道事件
  @observable initAnalisysValue = []

  @observable strategyList = [] // 策略列表

  circleOneChart
  circleTwoChart
  lineChart
  barChart
  funnelChart

  @observable isStrategyDone = false

  // 计划详情
  @action async getDetail() {
    try {
      const res = await io.detailPlan({
        id: this.id,
      })

      if (!_.isEmpty(res)) {
        this.planDetail = res
        this.planName = res.planName
        this.planStatus = res.planStatus
        if (res.startTime) {
          this.planTime = `${res.startTime} ~ ${res.endTime}`
        }

        const groupTarget = _.find(this.groupList, e => e.id === res.clientGroupId)

        if (groupTarget) {
          this.planGroup = groupTarget.name
        }

        this.getTargetChannelList()
      }
    } catch (e) {
      errorTip(e.message)
      console.error('getDetail')
    }
  }

  // 计划触达，目标完成率
  async getStatistics(cb = () => {}) {
    try {
      const res = await io.getStatistics({
        id: this.id,
      })

      if (!_.isEmpty(res)) {
        if (res.touchCount) {
          this.touchCount = res.touchCount
        }
        if (res.targetRate) {
          this.targetRate = res.targetRate
        }
      }

      cb()
    } catch (e) {
      errorTip(e.message)
      console.error('getStatistics')
    }
  }

  // 目标完成人数折线图
  // id
  // chartBeginDate
  // chartEndDate
  async getTargetCount(params, cb = () => {}) {
    try {
      const res = await io.getTargetCount({
        id: this.id,
        ...params,
      })

      this.lineChartData = res

      cb()
    } catch (e) {
      errorTip(e.message)
      console.error('getTargetCount')
    }
  }

  // 事件人数统计
  async getEventStatistics(cb = () => {}) {
    try {
      const res = await io.getEventStatistics({
        id: this.id,
      })

      this.eventStatistics = res

      this.eventStatistics.forEach(item => {
        item.name = item.eventName
        item.value = item.targetCount
      })

      cb()
    } catch (e) {
      errorTip(e.message)
      console.error('getEventStatistics')
    }
  }

  // 可分析渠道事件下拉
  async getAllAnalysisEvents(cb = () => {}) {
    try {
      const res = await io.getAllAnalysisEvents({
        id: this.id,
      })

      this.eventList = res

      const result = []
      this.eventList.forEach(item => {
        // 找到第一节点
        if (item.parentId === -1) {
          // 第一节点的子节点
          const childs = _.filter(this.eventList, e => e.parentId === item.id)

          if (childs && childs.length && childs.length > 0) {
            childs.forEach(e => {
              const childChilds = _.filter(this.eventList, j => j.parentId === e.id)

              if (childChilds && childChilds.length && childChilds.length > 0) {
                // 找到第三级
                childChilds.forEach(t => {
                  // 判断是否是目标事件
                  if (t.type !== 0) {
                    result.push({
                      name: `${item.name}-${e.name}-${t.name}`,
                    })
                  } else {
                    this.analysisEnd = `${item.name}-${e.name}-${t.name}`
                  }
                })
              }
            })
          }
        }
      })

      this.eventListFormatter = result
      cb()
    } catch (e) {
      errorTip(e.message)
      console.error('getAllAnalysisEvents')
    }
  }

  // 已配置分析渠道事件
  async getConfiguredAnalysisEvents(cb = () => {}) {
    try {
      const res = await io.getConfiguredAnalysisEvents({
        id: this.id,
      })

      this.analysisedEventList = res

      // 对配置过的数据进行处理
      if (this.analysisedEventList.length && this.analysisedEventList.length > 0) {
        const dataCopy = _.cloneDeep(this.analysisedEventList)

        const datas = []
        dataCopy.forEach(item => {
          const targetChannel = _.find(this.eventList, e => e.code === item.channelCode && e.id === item.channelId)
          const targetAccount = _.find(this.eventList, e => e.code === item.accountCode && e.id === item.accountId)
          const targetEvent = _.find(this.eventList, e => e.code === item.eventCode && item.eventId)

          if (targetChannel && targetAccount && targetEvent) {
            datas.push(`${targetChannel.name}-${targetAccount.name}-${targetEvent.name}`)
          }
        })

        this.initAnalisysValue = datas
      }

      cb()
    } catch (e) {
      errorTip(e.message)
      console.error('getConfiguredAnalysisEvents')
    }
  }

  // 编辑分析渠道事件
  async editAnalysis(params, cb = () => {}) {
    try {
      const res = await io.editAnalysis(params)

      // 获取分析详情。。。。
      cb()
    } catch (e) {
      errorTip(e.message)
      console.error('editAnalysis')
    }
  }

  // 获取策略列表
  async getStrategyList(planId) {
    try {
      const res = await io.getStrategyList({planId})

      // 展示暂无数据
      this.strategyList = res
      this.isStrategyDone = true
    } catch (e) {
      errorTip(e.message)
      console.error('getStrategyList')
    } finally {
      this.isStrategyDone = true
    }
  }

  // 获得目标事件
  async getTargetChannelList() {
    try {
      const res = await io.getTargetChannelList()

      const {firstTargetContent} = this.planDetail
      const {timeGap, timeUnit} = firstTargetContent
      const {event: {accountCode, accountId, channelCode, channelId, eventCode, eventId}} = firstTargetContent
      const timeMap = {
        MINUTES: '分钟',
        HOURS: '小时',
        DAYS: '天',
      }

      const channelName = _.find(res, e => e.id === channelId).name
      const accountName = _.find(res, e => e.id === accountId).name
      const eventName = _.find(res, e => e.id === eventId).name

      this.planTarget = `${timeGap}${timeMap[timeUnit]}内完成 ${channelName}-${accountName}-${eventName}`
    } catch (e) {
      errorTip(e.message)
      console.error('getTargetChannelList')
    }
  }

  // 获得受众用户
  async getGroupList(cb = () => {}) {
    try {
      const res = await io.getGroupList()

      this.groupList = res

      cb()
    } catch (e) {
      errorTip(e.message)
      console.error('getGroupList')
    }
  }
}
