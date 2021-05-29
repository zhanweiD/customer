import ioContext from '../../common/io-context'
import {baseApi, marketingApi, get, post} from '../../common/util'

const {pathPrefix} = window.__keeper

const api = {
  getGroupList: post(`${marketingApi}/plan/clientGroupList`), // 人群列表
  getEventList: post(`${marketingApi}/event/list`), // 事件列表
  getPlanInfo: post(`${marketingApi}/plan/info`), // 计划详情
  addPlan: post(`${marketingApi}/plan/add`), // 创建计划
  updatePlan: post(`${marketingApi}/plan/update`), // 创建计划
  // getTemplate: get(`${marketingApi}/wechat/api/get_all_private_template`),
  getTemplate: get(`${marketingApi}/wechat/get_all_private_template`), // 微信模板
  getTagList: post(`${baseApi}/group/obj_target_tag_list`), // 标签列表
} 

ioContext.create('createPlan', api) 

export default ioContext.api.createPlan
