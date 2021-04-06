import ioContext from '../../../common/io-context'
import {
  baseApi, get, post,
} from '../../../common/util'

const api = {
  getList: post(`${baseApi}/tag/list_tag`), // 标签列表
  getTagCateTree: post(`${baseApi}/tag/cate_tree`), // 标签类目数据
  cateCheckName: post(`${baseApi}/tag/cat_name_check`), // 标签类目重命名
  tagCheckName: post(`${baseApi}/tag/name_check`), // 标签重命名
  addTagCate: post(`${baseApi}/tag/create_cate`), // 新建标签类目
  editTagCate: post(`${baseApi}/tag/update_cate`), // 编辑标签类目
  delTagCate: post(`${baseApi}/tag/delete_cate`), // 删除标签类目

  getTagDetail: get(`${baseApi}/tag/tag_detail`), // 标签详情
  createTag: post(`${baseApi}/tag/create_tag`), // 创建标签
  updateTag: post(`${baseApi}/tag/update_tag`), // 编辑标签
  deleteTag: post(`${baseApi}/tag/delete_tag`), // 删除标签
  tagMove: post(`${baseApi}/tag/move_tag`), // 标签移动
  // getObjectSelectList: get(`${baseApi}/project/object/pro_obj_list`), // 创建标签 - 所属对象下拉数据
  getTagCateSelectList: post(`${baseApi}/tag/cate_tree`), // 创建标签 - 所属类目下拉数据

  tagApply: post(`${baseApi}/tag/update_tag_status`), // 上下架申请
  updateTagStatus: post(`${baseApi}/tag/update_tag_status`), // 修改标签发布状态

  checkName: post(`${baseApi}/tag/name_check`), // 重名校验

  cancelTagConfig: post(`${baseApi}/tagConfig/delete_filed_tag_relation`), // 解绑标签绑定

  // 权限code
  getAuthCode: get(`${baseApi}/project/getFunctionCodes`),
} 

ioContext.create('overview', api) 

export default ioContext.api.overview
