import ioContext from '../../common/io-context'
import {baseApi, get, post} from '../../common/util'

const api = { 
  getList: post(`${baseApi}/portrait/config/list`), // 列表
  getDel: get(`${baseApi}/portrait/config/del`), // 删除
  getTaggle: post(`${baseApi}/portrait/config/flag`), // 禁用启用
  getDetails: get(`${baseApi}/portrait/config/details`), // 配置详情
  getAdd: post(`${baseApi}/portrait/config/add`), // 配置新增
  getUpdate: post(`${baseApi}/portrait/config/update`), // 配置编辑
  getObjList: post(`${baseApi}/portrait/config/objList`), // 对象下拉列表
  getTagList: post(`${baseApi}/portrait/config/tagList`), // 标签下拉列表


  getTagTree: post(`${baseApi}/tag/tag_tree`), // 类目标签树
  // getTagTree: post('http://192.168.90.129:3000/mock/208/hub_api/tag/tag_tree'), // 类目标签树


  getRelTables: get(`${baseApi}/portrait/config/relTables`), // 触点表下拉
  getRelTableFields: get(`${baseApi}/portrait/config/relTableFields`), // 触点表时间段下拉
  getCatList: post(`${baseApi}/portrait/config/catList`), // 类目下拉列表

}

ioContext.create('portraitConfig', api)

export default ioContext.api.portraitConfig
