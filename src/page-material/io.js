import ioContext from '../common/io-context'
import {baseApi, marketingApi, get, post} from '../common/util'

const api = {
  getList: post(`${marketingApi}/plan/list`), // 获取列表
} 

ioContext.create('material', api) 

export default ioContext.api.material
