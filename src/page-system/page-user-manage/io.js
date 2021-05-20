import ioContext from '../../common/io-context'
import {baseZtOrg, baseRole, baseUser, baseApi, get, post, put} from '../../common/util'

const api = {
  getTreeList: post(`${baseZtOrg}/tree`), // 获取部门树
  getList: post(`${baseUser}/list`), // 获取用户列表
  getRoleList: post(`${baseRole}/list`), // 获取角色列表
  updateRole: put(`${baseUser}/modifyRoles`), // 授权角色
  updateData: post(`${baseApi}/userProject/addOrUpdate`), // 数据授权
  dataDetail: post(`${baseApi}/userProject/hasRightProjects`), // 数据授权详情
} 

ioContext.create('userManage', api) 

export default ioContext.api.userManage
