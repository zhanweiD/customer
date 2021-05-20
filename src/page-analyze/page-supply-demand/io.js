import ioContext from '../../common/io-context'
import {get, post, baseApi} from '../../common/util'

const api = {
  getFitList: post(`${baseApi}/supply/fitList`), // 匹配列表
  getList: post(`${baseApi}/supply/unFitList`), // 不匹配列表
  getSupplyXY: post(`${baseApi}/supply/xy`), // 明细坐标
  getSupply: get(`${baseApi}/supply/index`), // 所有指标
} 

ioContext.create('supply', api) 

export default ioContext.api.supply
