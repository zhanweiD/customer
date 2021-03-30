import ioContext from '../../common/io-context'
import {derivativeApi, get, post} from '../../common/util'

const api = {
  getList: post(`${derivativeApi}/derivative_tag_list`), // 衍生标签列表
  getObjList: post(`${derivativeApi}/underObjList`), // 下拉对象列表
  getSchemeList: post(`${derivativeApi}/derivative_scheme_list`), // 获取方案下拉框
} 

ioContext.create('visualTagList', api) 

export default ioContext.api.visualTagList
