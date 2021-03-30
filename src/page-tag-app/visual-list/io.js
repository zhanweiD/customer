import ioContext from '../../common/io-context'
import {derivativeApi, get, post} from '../../common/util'

const api = {
  getList: post(`${derivativeApi}/visual_scheme_page`), // 可视化方案列表
  delList: post(`${derivativeApi}/delete_scheme`), // 删除方案
  getObjList: post(`${derivativeApi}/underObjList`), // 下拉对象列表
  runVisual: post(`${derivativeApi}/manual_run`), // 方案手动执行
  getLog: post(`${derivativeApi}/submit_log`), // 提交日志
  cloneVisual: post(`${derivativeApi}/clone_scheme`), // 克隆方案
} 

ioContext.create('visualList', api) 

export default ioContext.api.visualList
