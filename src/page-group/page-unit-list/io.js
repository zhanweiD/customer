import ioContext from '../../common/io-context'
import {get, post, groupApi, baseApi} from '../../common/util'

const api = {
  getUnitList: post(`${groupApi}/individuals_list`), // 获取个体列表
  
  outputUnitList: get(`${baseApi}/export/individuals`), // 导出个体列表
  saveUnitList: post(`${groupApi}/add_individuals_group`), // 保存群体
  checkName: post(`${groupApi}/checkName`), // 群体名称查重
} 

ioContext.create('groupUnit', api) 

export default ioContext.api.groupUnit
