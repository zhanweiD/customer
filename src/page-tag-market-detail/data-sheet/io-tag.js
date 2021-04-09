import ioContext from '../../common/io-context'
import {baseApi, get, post} from '../../common/util'

const api = {
  getFieldList: post(`${baseApi}/objTagTableConfig/tagConfField`), // 字段列表
  getCateList: post(`${baseApi}/tag/cate_tree`), // 标签可移动的标签类目树
  checkTagList: post(`${baseApi}/objTagTableConfig/check_tag_config`), // 校验标签列表
  saveTags: post(`${baseApi}/objTagTableConfig/create_batch_tag`), // 批量创建标签
  checkName: post(`${baseApi}/tag/name_check`), // 重名校验

  getStorageDetail: get(`${baseApi}/tagConfig/storage_detail`), // 创建成功结果
  checkKeyWord: get(`${baseApi}/list_keyword`),
  getTagTypeList: get(`${baseApi}/tag/tag_type`), // 根据字段类型获取标签类型
}

ioContext.create('tagConfigData', api) 

export default ioContext.api.tagConfigData
