import ioContext from '../../common/io-context'
import {get, post, baseApi} from '../../common/util'

const api = {
  getChart: post(`${baseApi}/repurchase/tgiDetails`), // 饼图数据
  getCard: post(`${baseApi}/repurchase/card`), // 渠道分析数据
  getTgiList: post(`${baseApi}/repurchase/tgi`), // tgi列表
  getTgiMerit: get(`${baseApi}/repurchase/tgiMerit`), // tgi纬度
  getFormat: get(`${baseApi}/repurchase/format`), // tgi纬度
  getList: post(`${baseApi}/repurchase/potentialList`), // 未转换客户列表
} 

ioContext.create('purchase', api) 

export default ioContext.api.purchase
