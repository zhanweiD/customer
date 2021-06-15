import ioContext from '../../common/io-context'
import {baseApi, marketingApi, get, post} from '../../common/util'

const api = {
  getList: post(`${marketingApi}/plan/list`), // 获取列表
  delPlan: post(`${marketingApi}/plan/delete`), // 删除计划
  copyPlan: post(`${marketingApi}/plan/copy`), // 复制计划
  getUserList: post(`${marketingApi}/plan/getUserList`), // 创建人列表
  getChannelList: post(`${marketingApi}/plan/getChannelList`), // 渠道列表

  getTargetChannelList: post(`${marketingApi}/planInfo/getTargetChannelList`), // 目标事件
  getConditionChannelList: post(`${marketingApi}/planStrategy/getConditionChannelList`), // 触发条件事件
  getStrChannelList: post(`${marketingApi}/planStrategy/getChannelList`), // 触达渠道列表
  getChannelActions: post(`${marketingApi}/planStrategy/getChannelActions`), // 营销动作列表
  getTemplate: get(`${marketingApi}/wechat/get_all_private_template`), // 微信模板
} 

ioContext.create('salesDetail', api) 

export default ioContext.api.salesDetail
