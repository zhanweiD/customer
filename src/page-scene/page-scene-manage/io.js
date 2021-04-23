import ioContext from '../../common/io-context'
import {sceneApi, projectApi, baseApi, post} from '../../common/util'

const api = { 
  getList: post(`${sceneApi}/listOcc`), // 场景列表
  getDetail: post(`${sceneApi}/detail`), // 场景详情
  addScene: post(`${sceneApi}/add`), // 场景新增
  editScene: post(`${sceneApi}/edit`), // 场景编辑
  delScene: post(`${sceneApi}/del`), // 场景删除
  checkName: post(`${sceneApi}/check_name`), // 重名校验

  // getStorageType: post(`${projectApi}/targetDataStorageType`), // 数据源类型下拉
  // getStorageList: post(`${projectApi}/projectDataStorageListByStorageType`), // 项目内已有的目的数据源列表--场景添加
  getObjList: post(`${sceneApi}/obj`), // 添加/编辑场景对象下拉列表

  // 权限code
  // getAuthCode: post(`${baseApi}/project/getFunctionCodes`),
}

ioContext.create('scene', api)

export default ioContext.api.scene
