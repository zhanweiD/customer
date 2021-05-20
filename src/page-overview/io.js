import ioContext from '../common/io-context'
import {get, post, baseApi} from '../common/util'

const api = {
  getOrg: post(`${baseApi}/index/org`), // 组织下拉
  getCard: post(`${baseApi}/index/card`), // 指标卡
  getMap: post(`${baseApi}/index/map`), // 地图
  getContrast: post(`${baseApi}/index/conversionRateComparison`), // 转化对比
  getTrend: post(`${baseApi}/index/conversionTrendComparison`), // 转化趋势
  getSunburst: post(`${baseApi}/index/sunburst`), // 渠道分布
  getFunnel: post(`${baseApi}/index/funnel`), // 客户状态漏斗图
  getCloud: post(`${baseApi}/index/hot`), // 心声
 
  getClinch: post(`${baseApi}/deal/deal`), // 成交分析数据
  getObjCloud: post(`${baseApi}/portrait/portrait`), // 画像个体画像
} 

ioContext.create('overview', api) 

export default ioContext.api.overview
