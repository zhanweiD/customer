import ioContext from '../../common/io-context'
import {baseApi, groupApi, marketingApi, get, post} from '../../common/util'

const api = {
  getList: post(`${marketingApi}/planStrategy/list`), // 获取策略列表
  getStrategyDetail: post(`${marketingApi}/planStrategy/details`), // 获取策略详情
  addStrategy: post(`${marketingApi}/planStrategy/add`), // 新增策略
  editStrategy: post(`${marketingApi}/planStrategy/edit`), // 编辑策略
  deleteStrategy: post(`${marketingApi}/planStrategy/delete`), // 删除策略
  checkName: post(`${marketingApi}/planStrategy/checkName`), // 策略名查重
  delPlan: post(`${marketingApi}/plan/delete`), // 删除计划
  copyPlan: post(`${marketingApi}/plan/copy`), // 复制计划
  getUserList: post(`${marketingApi}/plan/getUserList`), // 创建人列表
  getChannelList: post(`${marketingApi}/plan/getChannelList`), // 渠道列表
  getTargetChannelList: post(`${marketingApi}/planInfo/getTargetChannelList`), // 目标事件

  getStrChannelList: post(`${marketingApi}/planStrategy/getChannelList`), // 触达渠道列表
  getChannelActions: post(`${marketingApi}/planStrategy/getChannelActions`), // 营销动作列表

  detailPlan: post(`${marketingApi}/planInfo/details`), // 计划详情
  getGroupList: post(`${marketingApi}/planInfo/clientGroupList`), // 人群列表
  getPromptTag: post(`${groupApi}/obj_target_tag/values`), // 获取提示值
  getFilterChannelList: post(`${marketingApi}/planStrategy/getFilterChannelList`), // 行为筛选事件
  getConditionChannelList: post(`${marketingApi}/planStrategy/getConditionChannelList`), // 触发条件事件

  getTemplate: get(`${marketingApi}/wechat/get_all_private_template`), // 微信模板
  getThumbMediaList: get(`${marketingApi}/wechat/get_all_news`), // 微信模板
  getTagList: post(`${baseApi}/group/obj_target_tag_list`), // 标签列表
} 

ioContext.create('createSales', api) 

export default ioContext.api.createSales
