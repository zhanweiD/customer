import ioContext from '../../common/io-context'
import {baseRole, basePerm, get, post, del, put} from '../../common/util'

const api = {
  getList: post(`${baseRole}/list`), // 获取角色列表
  getPerm: get(`${basePerm}/tree`), // 获取权限列表
  addRole: post(`${baseRole}/modify`), // 创建角色
  delRole: del(`${baseRole}/modify`), // 删除角色
  putRole: put(`${baseRole}/modify`), // 编辑角色
  getInfoRole: post(`${baseRole}/get`), // 角色详情
  checkName: post(`${baseRole}/checkName`), // 角色名查重
} 

ioContext.create('roleManage', api) 

export default ioContext.api.roleManage
