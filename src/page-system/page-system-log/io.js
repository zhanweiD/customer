import ioContext from '../../common/io-context'
import {baseUser, get, post} from '../../common/util'

const api = {
  getList: post(`${baseUser}/logList`), // 日志列表
} 

ioContext.create('systemLog', api) 

export default ioContext.api.systemLog
