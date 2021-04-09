import ioContext from '../../../common/io-context'
import {get, post, groupApi, baseApi} from '../../../common/util'

const api = {
  getGroupList: post(`${groupApi}/list`), // 群体分页列表
  getEntityList: post(`${groupApi}/obj_list`), // 实体列表
  getTagList: post(`${baseApi}/obj_target_tag_list`), // 标签列表
  checkName: post(`${groupApi}/checkName`), // 群体名称查重
  performGroup: post(`${groupApi}/manual_run`), // 规则实时执行
  removeGroup: post(`${groupApi}/delete_group`), // 删除群体
  removeGroupList: post(`${groupApi}/batch_del_group`), // 批量删除群体

  addGroup: post(`${groupApi}/add_id_group`), // 新建群体
  addIdGroup: post(`${groupApi}/add_id_group`), // 新建id群体
  editGroup: post(`${groupApi}/edit_id_group`), // 编辑群体
  editIdGroup: post(`${groupApi}/edit_id_group`), // 编辑id群体
  getEditGroup: get(`${groupApi}/get_group_edit`), // 获取规则编辑群体信息
  getEditIdGroup: get(`${groupApi}/get_id_group_edit`), // 获取ID编辑群体信息
} 

ioContext.create('group', api) 

export default ioContext.api.group
