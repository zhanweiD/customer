import ioContext from '../../common/io-context'
import {get, post, groupApi, baseApi} from '../../common/util'

const api = {
  getEntityList: post(`${groupApi}/obj_list`), // 实体列表
  addGroup: post(`${groupApi}/add_group_byrun`), // 新建群体
  // addGroup: post(`${groupApi}/add_group`), // 新建群体
  editGroup: post(`${groupApi}/edit_group`), // 编辑群体
  getOutputTags: post(`${groupApi}/tag_list`), // 获取输出标签
  getConfigTagList: post(`${groupApi}/obj_target_tag_list`), // 获取对象对应已同步的标签列表
  getDetail: post(`${groupApi}/get_group_edit`), // 编辑群体详情信息
  checkName: post(`${groupApi}/checkName`), // 群体名称查重

  getRelList: get(`${groupApi}/relation_list`), // 获取对象对应的关系列表
  getOtherEntity: get(`${groupApi}/other_entity`), // 获取另一个实体对象

  // 提示值
  getPromptTag: post(`${groupApi}/obj_target_tag/values`), // 获取提示值

  getGroup: post(`${baseApi}/groupAnalysis/groups`), // 客群下拉
  getTagTree: post(`${baseApi}/tag/tag_tree`), // 获取标签树
  getUseTag: post(`${baseApi}/groupAnalysis/usableTagByPre`), // 获取可分析标签
  getTagData: post(`${baseApi}/groupAnalysis/dsistributionOfTagByPre`), // 标签分析

}

ioContext.create('groupRule', api) 

export default ioContext.api.groupRule
