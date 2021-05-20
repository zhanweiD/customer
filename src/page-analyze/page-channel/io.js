import ioContext from '../../common/io-context'
import {get, post, baseApi} from '../../common/util'

const api = {
  getChannel: post(`${baseApi}/expand/expand`), // 渠道分析数据
  getList: post(`${baseApi}/expand/unconverted_customer`), // 未转换客户列表
  getAllChannel: get(`${baseApi}/channel/all`), // 全部渠道
} 

ioContext.create('channel', api) 

export default ioContext.api.channel
