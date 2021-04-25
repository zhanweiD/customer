import ioContext from '../../../common/io-context'
import {get, post, groupApi, baseApi} from '../../../common/util'

const api = {
  getGroupList: post(`${groupApi}/list`), // 客群分页列表
  getEntityList: post(`${groupApi}/obj_list`), // 实体列表
  getTagList: post(`${baseApi}/obj_target_tag_list`), // 标签列表
  getUserList: post(`${groupApi}/user`), // 创建人
  checkName: post(`${groupApi}/checkName`), // 客群名称查重
  performGroup: post(`${groupApi}/manual_run`), // 规则实时执行
  removeGroup: post(`${groupApi}/delete_group`), // 删除客群
  removeGroupList: post(`${groupApi}/batch_del_group`), // 批量删除客群

  addGroup: post(`${groupApi}/add_id_group`), // 新建客群
  addIdGroup: post(`${groupApi}/add_id_group`), // 新建id客群
  editGroup: post(`${groupApi}/edit_id_group`), // 编辑客群
  editIdGroup: post(`${groupApi}/edit_id_group`), // 编辑id客群
  getEditGroup: get(`${groupApi}/get_group_edit`), // 获取规则编辑客群信息
  getEditIdGroup: get(`${groupApi}/get_id_group_edit`), // 获取ID编辑客群信息
} 

ioContext.create('group', api) 

export default ioContext.api.group
