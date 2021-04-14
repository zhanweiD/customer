import ioContext from '../common/io-context'
import {
  groupDetailsApi, get, groupConfigApi, baseApi, post,
} from '../common/util'

const api = {
  // 业态管理
  listFormat: post(`${baseApi}/adm-biz/listFirst`), // 获取业态列表
  addFormat: post(`${baseApi}/adm-biz/addFirst`), // 添加业态
  editFormat: post(`${baseApi}/adm-biz/editFirst`), // 编辑业态
  deteleFormat: post(`${baseApi}/adm-biz/delFirst`), // 删除业态
  checkFormatName: post(`${baseApi}/adm-biz/checkName`), // 检查名称重复
  checkFormatCode: post(`${baseApi}/adm-biz/checkCode`), // 检车code重复

  // 业务域
  listDomain: post(`${baseApi}/adm-biz/listSecond`), // 获取业务域列表
  addDomain: post(`${baseApi}/adm-biz/addSecond`), // 添加业务域
  editDomain: post(`${baseApi}/adm-biz/editSecond`), // 编辑业务域
  deleteDomain: post(`${baseApi}/adm-biz/delSecond`), // 删除业务域
  getFormatList: post(`${baseApi}/adm-biz/bizFirstList`), // 业态下拉

  // 场景
  listScene: post(`${baseApi}/adm-biz/listThird`), // 获取场景列表
  addScene: post(`${baseApi}/adm-biz/addThird`), // 添加场景
  editScene: post(`${baseApi}/adm-biz/editThird`), // 编辑场景
  deleteScene: post(`${baseApi}/adm-biz/delSecond`), // 删除场景
  getDomainList: post(`${baseApi}/adm-biz/bizSecondList`), // 获取业态域下拉
  getDomainFormatList: post(`${baseApi}/adm-biz/bizFirstSecondList`), // 获取业态和业态域下拉
}

ioContext.create('businessConfig', api)

export default ioContext.api.businessConfig
