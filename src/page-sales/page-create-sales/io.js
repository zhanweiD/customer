import ioContext from '../../common/io-context'
import {baseApi, marketingApi, get, post} from '../../common/util'

const api = {
  getList: post(`${marketingApi}/plan/list`), // 获取列表
  delPlan: post(`${marketingApi}/plan/delete`), // 删除计划
  copyPlan: post(`${marketingApi}/plan/copy`), // 复制计划
  getUserList: post(`${marketingApi}/plan/getUserList`), // 创建人列表
  getChannelList: post(`${marketingApi}/plan/getChannelList`), // 渠道列表

  getTemplate: get(`${marketingApi}/wechat/get_all_private_template`), // 微信模板
  getTagList: post(`${baseApi}/group/obj_target_tag_list`), // 标签列表
} 

ioContext.create('createSales', api) 

export default ioContext.api.createSales
