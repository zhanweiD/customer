import ioContext from '../../common/io-context'
import {get, post, baseApi} from '../../common/util'

const api = {
  getGroup: post(`${baseApi}/groupAnalysis/groups`), // 客群下拉
  getTagList: post(`${baseApi}/groupAnalysis/enumTags`), // 枚举标签
  getTagData: post(`${baseApi}/groupAnalysis/chart`), // 标签分析
} 

ioContext.create('analyzeGroup', api) 

export default ioContext.api.analyzeGroup
