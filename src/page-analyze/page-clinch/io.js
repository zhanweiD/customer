import ioContext from '../../common/io-context'
import {get, post, baseApi} from '../../common/util'

const api = {
  getClinch: post(`${baseApi}/deal/deal`), // 成交分析数据
  getList: post(`${baseApi}/deal/unconverted_customer`), // 未转换客户列表
} 

ioContext.create('clinch', api) 

export default ioContext.api.clinch
