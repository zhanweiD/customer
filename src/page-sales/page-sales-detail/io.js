import ioContext from '../../common/io-context'
import {baseApi, marketingApi, get, post} from '../../common/util'

const api = {
  getList: post(`${marketingApi}/plan/list`), // 获取列表
  delPlan: post(`${marketingApi}/plan/delete`), // 删除计划
  copyPlan: post(`${marketingApi}/plan/copy`), // 复制计划
  getUserList: post(`${marketingApi}/plan/getUserList`), // 创建人列表
  getChannelList: post(`${marketingApi}/plan/getChannelList`), // 渠道列表
} 

ioContext.create('salesDetail', api) 

export default ioContext.api.salesDetail
