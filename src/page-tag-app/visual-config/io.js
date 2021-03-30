import ioContext from '../../common/io-context'
import {
  post, get, derivativeApi, baseApi,
} from '../../common/util'


const api = {
  getDetail: post(`${derivativeApi}/visual_derivative_schema_info`), // 编辑方案显示内容
  // 基本信息
  getObjList: post(`${derivativeApi}/underVisualObjList`), // 基础信息 - 对象下拉列表
  getAssObj: post(`${derivativeApi}/ass_obj`), // 查询源标签对象限制
  saveBaseInfo: post(`${derivativeApi}/save_visual_derivative_scheme`), // 保存可视化方案（第一个页面
  updateBaseInfo: post(`${derivativeApi}/update_visual_derivative_scheme`), // 更新可视化方案（第一个页面

  // 逻辑配置-标签树
  createTag: post(`${derivativeApi}/create_derivative_tag`), // 创建标签
  getTagCateSelectList: post(`${derivativeApi}/cate_tree`), // 创建标签 - 所属类目下拉数据

  getDerivativeTagList: post(`${derivativeApi}/list_derivative_tag`), // 查询衍生标签
  getTagDetail: get(`${baseApi}/tag/tag_detail`), // 标签详情

  checkName: post(`${derivativeApi}/checkName`), // 基础信息 - 方案名称查重
  checkTagName: post(`${derivativeApi}/name_check`), // 基础信息 - 方案名称查重

  // 逻辑配置-配置框
  getFunction: post(`${derivativeApi}/function_list`), // 获取函数
  getSelectTag: post(`${derivativeApi}/tag_list`), // 获取全部标签

  deleteVisualExt: post(`${derivativeApi}/delete_visual_ext`), // 删除条件表达式
  saveVisualExt: post(`${derivativeApi}/save_visual_ext`), // 保存可视化条件表达式（条件页面）
  updateVisualExt: post(`${derivativeApi}/update_visual_ext`), // 修改可视化条件表达式（条件页面）
  submitVisual: post(`${derivativeApi}/submit_visual`), // 保存可视化条件表达式（条件页面）

  saveVisualRule: post(`${derivativeApi}/save_visual_filter_condition`), // 保存可视化过滤条件
  updateVisualRule: post(`${derivativeApi}/update_visual_filter_condition`), // 修改可视化过滤条件
  getVisualRuleDetail: post(`${derivativeApi}/visual_filter_condition`), // 数据过滤规则查看
} 

ioContext.create('visualConfig', api) 

export default ioContext.api.visualConfig
