import ioContext from '../common/io-context'
import {baseApi, marketingApi, get, post} from '../common/util'

const api = {
  getList: post(`${marketingApi}/bas-channel-account/page`), // 获取列表
  getAccount: post(`${marketingApi}/bas-channel-account/count`), // 获取渠道下账号个数
  setEnable: post(`${marketingApi}/bas-channel-account/enable`), // 启停用
  authoriza: get(`${marketingApi}/wechat/pc_auth`), // 授权跳转
} 

ioContext.create('channelManage', api) 

export default ioContext.api.channelManage
