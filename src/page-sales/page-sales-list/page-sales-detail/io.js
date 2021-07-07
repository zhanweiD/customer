import ioContext from '../../../common/io-context'
import {baseApi, marketingApi, get, post} from '../../../common/util'

const api = {
  detailPlan: post(`${marketingApi}/planInfo/details`), // 计划详情
  getStatistics: post(`${marketingApi}/statistics/getStatistics`), // 计划触达，目标完成率
  getTargetCount: post(`${marketingApi}/statistics/getTargetCount`), // 目标完成人数折线图
  getEventStatistics: post(`${marketingApi}/statistics/getEventStatistics`), // 事件人数统计
  getAllAnalysisEvents: post(`${marketingApi}/planAnalysis/getAllAnalysisEvents`), // 计划分析，可分析渠道事件下拉
  getConfiguredAnalysisEvents: post(`${marketingApi}/planAnalysis/getConfiguredAnalysisEvents`), // 已配置分析渠道事件
  editAnalysis: post(`${marketingApi}/planAnalysis/edit`), // 计划分析，编辑分析渠道事件
  getStrategyList: post(`${marketingApi}/planStrategy/list`), // 策略列表
  getGroupList: post(`${marketingApi}/planInfo/clientGroupList`), // 人群列表
  
  getChannelActions: post(`${marketingApi}/planStrategy/getChannelActions`), // 营销动作列表
  getConditionChannelList: post(`${marketingApi}/planStrategy/getConditionChannelList`), // 触发条件事件
  getStrChannelList: post(`${marketingApi}/planStrategy/getChannelList`), // 触达渠道列表
  getTemplate: get(`${marketingApi}/wechat/get_all_private_template`), // 微信模板
  getTargetChannelList: post(`${marketingApi}/planInfo/getTargetChannelList`), // 目标事件
  getFilterChannelList: post(`${marketingApi}/planStrategy/getFilterChannelList`), // 行为筛选事件
  getTagList: post(`${baseApi}/group/obj_target_tag_list`), // 标签列表
} 

ioContext.create('salesDetail', api) 

export default ioContext.api.salesDetail
