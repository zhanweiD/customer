import ioContext from '../../common/io-context'
import {baseApi, marketingApi, get, post} from '../../common/util'

const api = {
  getList: post(`${marketingApi}/event/page`), // 获取列表
  getChannelList: get(`${marketingApi}/event/channelDropDown`), // 获取渠道类型列表
  getAccountlList: get(`${marketingApi}/event/accountDropDown`), // 获取渠道名称列表
  setTrigger: post(`${marketingApi}/event/trigger`), // 设为触发事件
  setTarget: post(`${marketingApi}/event/target`), // 设为目标事件
} 

ioContext.create('eventManage', api) 

export default ioContext.api.eventManage
