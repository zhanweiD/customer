import ioContext from '../../../common/io-context'
import {tagModalApi, get, post, baseApi} from '../../../common/util'

const api = {
  // 基础标签
  getResultData: get(`${baseApi}/tag/tag_field_mapping`), // 获取映射结果数据
  getFieldData: get(`${baseApi}/tag/field_list`), // 获取字段列表
  getTagData: post(`${baseApi}/tag/tag_list`), // 获取标签列表
  saveMappingResult: post(`${baseApi}/tag/add_tag_field_rel`), // 保存映射结果

  // 衍生标签
  getDeriveResultData: get(`${baseApi}/tagConfig/derivative_field_mapping`), // 获取映射结果数据
  getDeriveFieldData: get(`${baseApi}/tagConfig/scheme_field`), // 获取字段列表
  getDeriveTagData: post(`${baseApi}/tagConfig/produce_tag`), // 获取标签列表
  saveDeriveMappingResult: post(`${baseApi}/tagConfig/addTagRel`), // 保存映射结果

  getTableList: get(`${baseApi}/tag/table_obj`), // 获取对象下数据表
  getSchemeList: get(`${baseApi}/derivative/schema/derivative_scheme`), // 获取衍生方案名称列表
}

ioContext.create('tagConfig', api) 

export default ioContext.api.tagConfig
