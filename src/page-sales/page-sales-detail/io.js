import ioContext from '../../common/io-context'
import {baseApi, marketingApi, get, post} from '../../common/util'

const api = {
  detailPlan: post(`${marketingApi}/planInfo/details`), // 计划详情
  getStatistics: post(`${marketingApi}/statistics/getStatistics`), // 计划触达，目标完成率
  getTargetCount: post(`${marketingApi}/statistics/getTargetCount`), // 目标完成人数折线图
  getEventStatistics: post(`${marketingApi}/statistics/getEventStatistics`), // 事件人数统计
  getAllAnalysisEvents: post(`${marketingApi}/planAnalysis/getAllAnalysisEvents`), // 计划分析，可分析渠道事件下拉
  getConfiguredAnalysisEvents: post(`${marketingApi}/planAnalysis/getConfiguredAnalysisEvents`), // 已配置分析渠道事件
  editAnalysis: post(`${marketingApi}/planAnalysis/edit`), // 计划分析，编辑分析渠道事件
} 

ioContext.create('salesDetail', api) 

export default ioContext.api.salesDetail
