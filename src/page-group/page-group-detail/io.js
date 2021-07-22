import ioContext from '../../common/io-context'
import {get, post, baseApi, groupApi, groupConfigApi} from '../../common/util'

const api = {
  getGroupDetail: post(`${groupApi}/base`), // 客群基本信息
  getTopList: post(`${baseApi}/groupAnalysis/topListOfTag`), // 客群标签 top 榜单
  getDistributionByTag: post(`${baseApi}/groupAnalysis/distributionByTag`, {overrideSelfConcurrent: true}), // 客群下标签值分布
  getTagTree: post(`${baseApi}/tag/tag_tree`), // 获取标签树
  getOutputTags: post(`${groupApi}/tag_list`), // 获取输出标签
  getUsableTag: post(`${baseApi}/groupAnalysis/usableTag`), // 可用标签合集
  getUnitList: post(`${groupApi}/individuals_list`), // 获取个体列表
  getConfigTagList: post(`${groupApi}/obj_target_tag_list`), // 获取对象对应已同步的标签列表
}

ioContext.create('groupDetail', api)

export default ioContext.api.groupDetail
