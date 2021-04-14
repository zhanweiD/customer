import ioContext from '../common/io-context'
import {baseApi, get, post} from '../common/util'

const api = { 
  getPortrait: get(`${baseApi}/portrait`), // 画像列表
  getUnitList: post(`${baseApi}/portrait/individual`), // 画像个体列表
  getObjCloud: post(`${baseApi}/portrait/portrait`), // 画像个体画像
  getUnitTable: post(`${baseApi}/portrait/eventTables`), // 画像个体触点场景下拉
  getCusVoice: post(`${baseApi}/portrait/cusVoice`), // 客户心声

  // 客户档案
  getUnitBasic: post(`${baseApi}/portrait/basic`), // 画像个体基础信息
  actionFocus: post(`${baseApi}/portrait/attention`), // 关注取关

  getFollow: get(`${baseApi}/portrait/follow`), // 关注客户列表
  // getFollow: get('http://192.168.90.129:3000/mock/208/hub_api/portrait/follow/'), // 关注客户列表

  // 业务触点
  getUnitEvent: post(`${baseApi}/portrait/event`), // 画像个体触点表信息
  // getUnitEvent: post('http://192.168.90.129:3000/mock/208/hub_api/portrait/eventTrack'), // 画像个体触点表信息
  getBarChart: post(`${baseApi}/portrait/eventTypeChart`), // 触点类型分布
  // getBarChart: post('http://192.168.90.129:3000/mock/208/hub_api/portrait/eventTypeChart'), // 触点类型分布
  getPieChart: post(`${baseApi}/portrait/bizTypeChart`), // 业务类型分布
  // getPieChart: post('http://192.168.90.129:3000/mock/208/hub_api/portrait/bizTypeChart'), // 业务类型分布
  getBizType: get(`${baseApi}/portrait/bizTypeDropdown`), // 业务类型下拉
  // getBizType: get('http://192.168.90.129:3000/mock/208/hub_api/portrait/bizTypeDropdown'), // 业务类型下拉
}

ioContext.create('portrait', api)

export default ioContext.api.portrait
