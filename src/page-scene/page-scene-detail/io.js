import ioContext from '../../common/io-context'
import {
  sceneApi, post, baseApi,
} from '../../common/util'

const api = {
  getDetail: post(`${sceneApi}/detail`), // 场景详情
  editScene: post(`${sceneApi}/edit`), // 场景编辑
  checkName: post(`${sceneApi}/check_name`), // 名称校验

  getObjList: post(`${sceneApi}/obj`), // 添加/编辑场景对象下拉列表

  getTagDetail: post(`${sceneApi}/tagDetail`), // 标签详情
  getApiTrend: post(`${sceneApi}/treeObj/cat/tag/apiCount`), // API调用数趋势
  getTagTrend: post(`${sceneApi}/treeObj/cat/tag/invoke`), // 标签调用次数趋势

  isObjExist: post('/api/tagmodel/1_0_0/tag/pool/obj_exist'), // 判断标签模型是否有对象

  // 权限code
  // getAuthCode: post(`${baseApi}/project/getFunctionCodes`),
}

ioContext.create('sceneDetail', api)

export default ioContext.api.sceneDetail
