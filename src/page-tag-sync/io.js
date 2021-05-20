import ioContext from '../common/io-context'
import {baseSyncApi, get, post} from '../common/util'

const api = {
  getObjList: post(`${baseSyncApi}/underObjList`), // 下拉对象列表
  checkName: post(`${baseSyncApi}/checkName`), // 重名校验
  getList: post(`${baseSyncApi}/getSchemePage`), // 同步计划列表
  getTagTree: post(`${baseSyncApi}/tagTree`), // 标签树
  addSync: post(`${baseSyncApi}/schemeSave`), // 新增同步计划
  editSync: post(`${baseSyncApi}/schemeUpdate`), // 编辑同步计划
  delList: post(`${baseSyncApi}/schemeDelete`), // 删除同步计划
  startSync: post(`${baseSyncApi}/startScheme`), // 启动
  pauseSync: post(`${baseSyncApi}/pauseScheme`), // 暂停
  runSync: post(`${baseSyncApi}/manualRunScheme`), // 执行
  getLog: post(`${baseSyncApi}/submitLog`), // 提交日志

  // 添加同步
  // getStorageType: get(`${baseSyncApi}/scheme/dataStorageType`), // 下拉数据源类型列表
  // getStorageList: get(`${baseSyncApi}/scheme/storageList`), // 下拉数据源列表
  // getStorageDetail: get(`${baseSyncApi}/project/storageDetails`), // 数据源详情

  // tableNameCheck: post(`${baseSyncApi}/scheme/checkTableName`), // 数据表重名校验
} 

ioContext.create('syncList', api) 

export default ioContext.api.syncList
