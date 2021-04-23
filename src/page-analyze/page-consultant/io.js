import ioContext from '../../common/io-context'
import {post, get, baseApi} from '../../common/util'

const api = {
  getChannel: post(`${baseApi}/salesman/indicator`), // 顾客分析数据
  getList: post(`${baseApi}/salesman/list`), // 顾问列表
  getProject: get(`${baseApi}/sales/project/all`), // 顾问列表
} 

ioContext.create('consultant', api) 

export default ioContext.api.consultant
