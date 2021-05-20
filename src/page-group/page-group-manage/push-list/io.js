import ioContext from '../../../common/io-context'
import {baseApi, get, post} from '../../../common/util'

const api = {
  getList: post(`${baseApi}/group/transList`), // 推送列表
  getGroupList: post(`${baseApi}/groupAnalysis/groups`), // 客群列表
  getStorages: post(`${baseApi}/group/toStorage`), // 目的数据源列表
  getTables: post(`${baseApi}/group/toTables`), // 数据表列表
  getTransDetai: post(`${baseApi}/group/transDetails`), // 映射结果 编辑回显详情
  getFieldData: post(`${baseApi}/group/toFields`), // 字段列表
  getTagData: post(`${baseApi}/group/transTags`), // 标签列表

  addPush: post(`${baseApi}/group/transAdd`), // 新增推送
  editPush: post(`${baseApi}/group/transEdit`), // 编辑推送
  delPush: post(`${baseApi}/group/transDel`), // 删除推送
  detailPush: post(`${baseApi}/group/transDetails`), // 推送详情
} 

ioContext.create('pushList', api) 

export default ioContext.api.pushList
