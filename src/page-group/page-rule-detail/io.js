import ioContext from '../../common/io-context'
import {get, post, baseApi, groupApi} from '../../common/util'

const api = {
  // getEntityList: get(`${groupApi}/obj_list`), // 实体列表
  // addGroup: post(`${groupApi}/add_group`), // 新建群体
  // editGroup: post(`${groupApi}/edit_group`), // 编辑群体
  
  getDetail: get(`${baseApi}/groupDetails/rule`), // 规则查看

  // checkName: post(`${groupApi}/checkName`), // 群体名称查重

  getConfigTagList: get(`${groupApi}/obj_target_tag_list`), // 获取对象对应已同步的标签列表
  getRelList: get(`${groupApi}/relation_list`), // 获取对象对应的关系列表
  getOtherEntity: get(`${groupApi}/other_entity`), // 获取另一个实体对象

  // getOutputTags: get(`${groupConfigApi}/tag_list`), // 获取输出标签
}

ioContext.create('ruleDetail', api) 

export default ioContext.api.ruleDetail
