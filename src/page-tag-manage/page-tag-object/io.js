import ioContext from '../../common/io-context'
import {
  get, post, baseApi,
} from '../../common/util'

const api = {
  addObject: post(`${baseApi}/object/create_object`), // 添加对象
  checkName: post(`${baseApi}/object/name_check`), // 名称校验
  editObject: post(`${baseApi}/object/update_object`), // 编辑对象
  deleteObject: post(`${baseApi}/object/delete_object`), // 删除对象
  getTreeData: get(`${baseApi}/object/get_objs`), // 对象列表
  getObjectDetail: get(`${baseApi}/object/object_basic`), // 获取对象详情
}

ioContext.create('tagObject', api)

export default ioContext.api.tagObject
