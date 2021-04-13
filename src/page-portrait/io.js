import ioContext from '../common/io-context'
import {baseApi, get, post} from '../common/util'

const api = { 
  getPortrait: get(`${baseApi}/portrait`), // 画像列表
  getUnitList: post(`${baseApi}/portrait/individual`), // 画像个体列表
  getUnitBasic: post(`${baseApi}/portrait/basic`), // 画像个体基础信息
  getObjCloud: post(`${baseApi}/portrait/portrait`), // 画像个体画像
  getChart: post(`${baseApi}/deal/deal`), // 业务类型分布
  getChart1: post(`${baseApi}/portrait/satisfaction`), // 客户满意度
  getUnitTable: post(`${baseApi}/portrait/eventTables`), // 画像个体触点场景下拉
  getUnitEvent: post(`${baseApi}/portrait/event`), // 画像个体触点表信息
  getCusVoice: post(`${baseApi}/portrait/cusVoice`), // 客户心声

  // getFollow: get(`${baseApi}/portrait/follow`), // 关注客户列表
  getFollow: get('http://192.168.90.129:3000/mock/208/hub_api/portrait/follow/'), // 关注客户列表
  // getBizType: get(`${baseApi}/portrait/bizTypeDropdown`), // 业务类型下拉
  getBizType: get('http://192.168.90.129:3000/mock/208/hub_api/portrait/bizTypeDropdown'), // 业务类型下拉
}

ioContext.create('portrait', api)

export default ioContext.api.portrait
