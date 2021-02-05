import ioContext from '../../common/io-context'
import {derivativeApi, get, post} from '../../common/util'

const api = {
  getDetail: post(`${derivativeApi}/visual_basic_info`), // 可视化方案基础信息
  getConfigInfo: post(`${derivativeApi}/visual_config_info`), // 可视化方案配置信息
  getRuleInfo: post(`${derivativeApi}/where_info`), // 数据过滤规则查看
  getTagDetail: post(`${derivativeApi}/visual_derivative_schema_info`), // 编辑方案显示内容
  getSelectTag: post(`${derivativeApi}/tag_list`), // 获取全部标签
} 

ioContext.create('visualDetail', api) 

export default ioContext.api.visualDetail
