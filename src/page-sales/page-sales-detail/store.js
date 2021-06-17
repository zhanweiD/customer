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
    }
  }

  // 计划触达，目标完成率
  async getStatistics(cb = () => {}) {
    try {
      const res = await io.getStatistics({
        id: this.id,
      })

      if (!_.isEmpty(res)) {
        this.touchCount = res.touchCount
        this.targetRate = res.targetRate
      }

      cb()
    } catch (e) {
      errorTip(e.message)
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
      /* this.lineChartData = [
        {
          dateStr: '2021-06-15',
          targetCount: 80,
        },
        {
          dateStr: '2021-06-16',
          targetCount: 50,
        },
        {
          dateStr: '2021-06-17',
          targetCount: 60,
        },
        {
          dateStr: '2021-06-18',
          targetCount: 90,
        },
        {
          dateStr: '2021-06-19',
          targetCount: 100,
        },
        {
          dateStr: '2021-06-20',
          targetCount: 110,
        },
      ] */

      cb()
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 事件人数统计
  async getEventStatistics(cb = () => {}) {
    try {
      const res = await io.getEventStatistics({
        id: this.id,
      })

      this.eventStatistics = res
      /*
      this.eventStatistics = [
        {
          targetCount: 4000,
          eventName: '计划触达',
          rate: 1,
        },
        {
          targetCount: 2500,
          channelName: '微信公众号',
          accountName: 'dtwave自动化营销',
          eventName: '接收用户文本消息',
          rate: 0,
        },
        {
          targetCount: 2000,
          channelName: '微信公众号',
          accountName: 'dtwave自动化营销',
          eventName: '接收用户取消订阅',
          rate: 0,
        },
        {
          targetCount: 1000,
          eventName: '接收用户扫描带参数的二维码',
          rate: 43.65,
        },
      ]
      */

      this.eventStatistics.forEach(item => {
        item.name = item.eventName
        item.value = item.targetCount
      })

      cb()
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 可分析渠道事件下拉
  async getAllAnalysisEvents(cb = () => {}) {
    try {
      const res = await io.getAllAnalysisEvents({
        id: this.id,
      })

      this.eventList = res
      /*
      this.eventList = [
        { // type :0 目标事件 1 完成事件 2 未完成事件 100 渠道 101 渠道账号
          id: 1,
          name: '微信公众号',
          code: 'wxe2b3f176ba1a4f33',
          parentId: -1,
          type: 100,
          descr: '渠道',
        },
        {
          id: 11,
          name: '接收用户扫描带参数的二维码',
          code: 'SCAN',
          parentId: 8207207676424,
          type: 0, 
          descr: '目标事件',
        },
        {
          id: 10,
          name: '接收用户取消订阅',
          code: 'UNSUBSCRIBE',
          parentId: 8207207676424,
          type: 2,
          descr: '未完成条件事件',
        },
        {
          id: 1,
          name: '接收用户文本消息',
          code: 'MSG_TEXT',
          parentId: 8207207676424,
          type: 1,
          descr: '完成条件事件',
        },
        {
          id: 8207207676424,
          name: 'dtwave自动化营销',
          code: 'wxe2b3f176ba1a4f33',
          parentId: 1,
          type: 101,
          descr: '渠道账号',
        },
      ]
      */

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
    }
  }

  // 已配置分析渠道事件
  async getConfiguredAnalysisEvents(cb = () => {}) {
    try {
      const res = await io.getConfiguredAnalysisEvents({
        id: this.id,
      })

      this.analysisedEventList = res
      /* this.analysisedEventList = [
        {
          channelId: 1,
          channelCode: 'wxe2b3f176ba1a4f33',
          accountId: 8207207676424,
          accountCode: 'wxe2b3f176ba1a4f33',
          eventId: 1,
          eventCode: 'MSG_TEXT',
        },
        {
          accountCode: 'wxe2b3f176ba1a4f33',
          accountId: 8207207676424,
          channelCode: 'wxe2b3f176ba1a4f33',
          channelId: 1,
          eventCode: 'UNSUBSCRIBE',
          eventId: 10,
        },
        {
          channelId: 1,
          channelCode: 'wxe2b3f176ba1a4f33',
          accountId: 8207207676424,
          accountCode: 'wxe2b3f176ba1a4f33',
          eventId: 10,
          eventCode: 'UNSUBSCRIBE',
        },
      ] */

      // 对配置过的数据进行处理
      if (this.analysisedEventList.length && this.analysisedEventList.length > 0) {
        const dataCopy = _.cloneDeep(this.analysisedEventList)

        const datas = []
        dataCopy.forEach(item => {
          const targetChannel = _.find(this.eventList, e => e.code === item.channelCode && e.id === item.channelId)
          const targetAccount = _.find(this.eventList, e => e.code === item.accountCode && e.id === item.accountId)
          const targetEvent = _.find(this.eventList, e => e.code === item.eventCode && item.eventId)

          datas.push(`${targetChannel.name}-${targetAccount.name}-${targetEvent.name}`)
        })

        this.initAnalisysValue = datas
      }

      cb()
    } catch (e) {
      errorTip(e.message)
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
    }
  }

  // 获取策略列表
  async getStrategyList(planId) {
    try {
      const res = await io.getStrategyList({planId})

      // 展示暂无数据
      this.strategyList = res
      /*
      this.strategyList = [
        {
          id: 8369739904128,
          planId: 8361565201672,
          clientGroupFilterType: 0,
          strategyName: '侧444首',
          strategyConditionType: 1,
          strategyEventConditionContent: {
            startTime: '2021-06-08 20:52:16',
            endTime: '2021-06-08 20:52:16',
            doneLogic: 0,
            doneEvents: [
              {
                channelId: 1,
                channelCode: '',
                accountId: '',
                eventId: 1001,
                eventCode: '',
              },
            ],
            timeGap: 2.2,
            timeUnit: 'DAYS',
            notDoneLogic: 0,
            notDoneEvents: [
              {
                channelId: 1,
                channelCode: '',
                accountId: '',
                eventId: 1001,
                eventCode: '',
              },
            ],
          },
          strategyStartTime: '2021-06-08 20:52:16',
          strategyEndTime: '2021-06-08 20:52:16',
          strategyRestrict: 0,
          sendOutContent: {
            isDelay: 1,
            timeGap: 1.2,
            timeUnit: 'DAYS',
            channel: {
              channelId: 0,
              channelCode: '',
              accountId: '',
            },
            actionId: 0,
            templateId: '',
            templateJson: '模版json',
          },
        },
        {
          id: 8370371328656,
          planId: 8361565201672,
          clientGroupId: 321312321312,
          clientGroupFilterType: 0,
          strategyName: '543534543',
          strategyConditionType: 1,
          strategyEventConditionContent: {
            startTime: '2021-06-08 20:52:16',
            endTime: '2021-06-08 20:52:16',
            doneLogic: 0,
            doneEvents: [
              {
                channelId: 1,
                channelCode: '',
                accountId: '',
                eventId: 0,
                eventCode: '',
              },
            ],
            timeGap: 2.2,
            timeUnit: 'DAYS',
            notDoneLogic: 0,
            notDoneEvents: [
              {
                channelId: 1,
                channelCode: '',
                accountId: '',
                eventId: 0,
                eventCode: '',
              },
            ],
          },
          strategyStartTime: '2021-06-08 20:52:16',
          strategyEndTime: '2021-06-08 20:52:16',
          strategyRestrict: 0,
          sendOutContent: {
            isDelay: 1,
            timeGap: 1.2,
            timeUnit: 'DAYS',
            channel: {
              channelId: 1,
              channelCode: '',
              accountId: '',
            },
            actionId: 0,
            templateId: '',
            templateJson: '模版json',
          },
        },
      ]
      */
    } catch (e) {
      errorTip(e.message)
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
    }
  }
}
