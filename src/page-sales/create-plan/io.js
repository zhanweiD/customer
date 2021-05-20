import ioContext from '../common/io-context'
import {baseUser, get, post} from '../common/util'

const api = {
  goLogin: post(`${baseUser}/login`), // 登录
} 

ioContext.create('login', api) 

export default ioContext.api.login
