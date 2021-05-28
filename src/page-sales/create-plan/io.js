import ioContext from '../../common/io-context'
import {marketingApi, get, post} from '../../common/util'

const api = {
  getGroupList: post(`${marketingApi}/plan/clientGroupList`), // 人群列表
  getEventList: post(`${marketingApi}/event/list`), // 事件列表
  getPlanInfo: post(`${marketingApi}/plan/info`), // 计划详情
  addPlan: post(`${marketingApi}/plan/add`), // 创建计划
} 

ioContext.create('createPlan', api) 

export default ioContext.api.createPlan
