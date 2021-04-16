import ioContext from '../../common/io-context'
import {get, post, baseApi, groupApi, groupConfigApi} from '../../common/util'

const api = {
  getGroupDetail: post(`${groupApi}/base`), // 客群基本信息
  getTopList: post(`${baseApi}/groupAnalysis/topListOfTag`), // 客群标签 top 榜单
  getDistributionByTag: post(`${baseApi}/groupAnalysis/distributionByTag`), // 客群下标签值分布
  getTagTree: post(`${baseApi}/tag/tag_tree`), // 获取标签树
  getUsableTag: post(`${baseApi}/groupAnalysis/usableTag`), // 可用标签合集
}

ioContext.create('groupDetail', api)

export default ioContext.api.groupDetail
