import ioContext from '../common/io-context'
import {get, post, baseApi} from '../common/util'

const api = {
  getClinch: post(`${baseApi}/deal/deal`), // 成交分析数据
  getObjCloud: post(`${baseApi}/portrait/portrait`), // 画像个体画像
} 

ioContext.create('overview', api) 

export default ioContext.api.overview
