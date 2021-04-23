import ioContext from '../../common/io-context'
import {get, post, baseApi} from '../../common/util'

const api = {
  getEvaluationPeo: post(`${baseApi}/satisfaction/total`), // 人数
  getEvaluationNum: post(`${baseApi}/satisfaction/evaluate`), // 次数
  getSatisfactionPer: post(`${baseApi}/satisfaction/satisfactionRate`), // 比例
  getChartData: post(`${baseApi}/satisfaction/pieChart`), // 饼图
  getScatterData: post(`${baseApi}/satisfaction/punchChart`), // 散点图
  getList: post(`${baseApi}/satisfaction/list`), // 未转换客户列表
} 

ioContext.create('satisfaction', api) 

export default ioContext.api.satisfaction
