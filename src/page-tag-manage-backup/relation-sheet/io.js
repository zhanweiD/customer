import ioContext from '../../common/io-context'
import {baseApi, get, post} from '../../common/util'

const api = {
  //* ------------------------------ 添加关联字段 ------------------------------*//
  getList: post(`${baseApi}/objEventTableConfig/list`), // 对象配置 - 关系表列表
  getEntityDataSource: post(`${baseApi}/objEventTableConfig/tables`), // 可添加关系表列表
  getFieldList: post(`${baseApi}/objEventTableConfig/filed`), // 添加关联字段 - 字段列表
  checkTableName: post(`${baseApi}/objEventTableConfig/check_obj_name`), // 表中文名查重
  checkFieldName: post(`${baseApi}/objEventTableConfig/check_obj_field_name`), // 字段中文名查重
  saveEntityTable: post(`${baseApi}/objEventTableConfig/add`), // 添加关联字段(实体)
  getConfigFields: post(`${baseApi}/objEventTableConfig/details`), // 配置字段列表
  saveEntityField: post(`${baseApi}/objEventTableConfig/config`), // 配置字段
  removeList: post(`${baseApi}/objEventTableConfig/del`), // 移除数据表


  getDataSource: get(`${baseApi}/tagConfig/datasource/pro_datasource`), // 添加关联字段 - 数据源列表（当前项目下）
  getDataSheet: get(`${baseApi}/tagConfig/listUncorrelatedSourceTable`), // 添加关联字段 - 数据表列表 (数据源下所有数据比爱(排除已关联))


  // 添加
  // saveRelField: post(`${baseApi}/tagConfig/add_rel_field_ass`), // 添加关联字段(关系)
  // fieldSuccessInfo: get(`${baseApi}/project/object/storage_detail`), // 表添加成功后展示内容

  getMappingKey: get(`${baseApi}/project/object/mapping_key`), // 根据实体、数据表获取实体主标签在该表对应的主键

} 

ioContext.create('RelationTable', api) 

export default ioContext.api.RelationTable
