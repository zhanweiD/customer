import ioContext from '../common/io-context'
import {baseApi, marketingApi, get, post} from '../common/util'

const api = {
  getList: post(`${marketingApi}/planInfo/list`), // 获取列表
  addPlan: post(`${marketingApi}/planInfo/add`), // 创建计划
  checkName: post(`${marketingApi}/planInfo/checkName`), // 计划查重
  editPlan: post(`${marketingApi}/planInfo/edit`), // 编辑计划
  detailPlan: post(`${marketingApi}/planInfo/details`), // 计划详情
  delPlan: post(`${marketingApi}/planInfo/delete`), // 删除计划
  copyPlan: post(`${marketingApi}/plan/copy`), // 复制计划
  startPlan: post(`${marketingApi}/planInfo/start`), // 启动计划
  stopPlan: post(`${marketingApi}/planInfo/stop`), // 暂停计划
  getUserList: post(`${marketingApi}/plan/getUserList`), // 创建人列表
  getChannelList: post(`${marketingApi}/plan/getChannelList`), // 渠道列表
  getGroupList: post(`${marketingApi}/plan/clientGroupList`), // 人群列表
  getTargetChannelList: post(`${marketingApi}/planInfo/getTargetChannelList`), // 目标事件
} 

ioContext.create('sales', api) 

export default ioContext.api.sales
