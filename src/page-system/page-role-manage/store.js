import {
  observable, action, runInAction, 
} from 'mobx'
import {
  successTip, errorTip, userLog,
} from '../../common/util'
import io from './io'
import {ListContentStore} from '../../component/list-content'

class Store extends ListContentStore(io.getList) {
  @observable tableLoading = false
  @observable drawerVisible = false
  @observable confirmLoading = false
  @observable expandedKeys = []
  @observable menuCheckedKeys = []
  @observable dataCheckedKeys = []
  @observable selectedKeys = []
  @observable publishRowKeys = []
  @observable autoExpandParent = true
  @observable roleId = null // 角色id 编辑用
  @observable infoRole = {} // 角色详情
  @observable roleStatus = 0 // 0新增 1编辑 2详情 3复制

  @observable menuTree = []
  @observable dataTree = []

  // 将权限列表解析为树结构
  listToTree(data) {
    const newData = _.cloneDeep(data)

    newData.forEach(item => {
      const children = newData.filter(sitem => sitem.parentId === item.id)
      if (children.length && !item.children) {
        item.children = children
      }
    })

    return newData.filter(item => item.parentId === -1)
  }

  // 获取权限列表
  @action async getPerm(cb) {
    this.tableLoading = true
    try {
      const res = await io.getPerm()

      runInAction(() => {
        this.menuTree = this.listToTree(res.menuTree)
        this.dataTree = this.listToTree(res.dataTree)
        if (cb) cb()
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.tableLoading = false
    }
  }

  // 创建角色
  @action async addRole(params, cb) {
    this.confirmLoading = true
    try {
      const res = await io.addRole(params)
      runInAction(() => {
        successTip('创建成功')
        userLog('系统管理/角色管理/新增角色')
        this.getList()
        if (cb) cb()
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.confirmLoading = false
    }
  }

  // 删除角色
  @action async delRole(params) {
    this.confirmLoading = true
    try {
      const res = await io.delRole({
        ids: params,
      })
      runInAction(() => {
        successTip('删除成功')
        userLog('系统管理/角色管理/删除角色')
        this.getList()
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.confirmLoading = false
    }
  }

  // 编辑角色
  @action async putRole(params, cb) {
    this.confirmLoading = true
    try {
      const res = await io.putRole({
        id: this.roleId,
        ...params,
      })
      runInAction(() => {
        if (this.roleStatus === 3) {
          this.infoRole = {}
          userLog('系统管理/角色管理/复制角色')
        } else {
          this.infoRole = res
          userLog('系统管理/角色管理/编辑角色')
        }
        successTip('编辑成功')
        this.getList()
        if (cb) cb()
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.confirmLoading = false
    }
  }

  // 角色详情
  @action async getInfoRole(params) {
    try {
      const res = await io.getInfoRole({
        id: params,
      })
      runInAction(() => {
        this.menuCheckedKeys = res.menuIds.map(String)
        // this.dataCheckedKeys = res.dataIds.map(String)
        this.drawerVisible = true
      })
    } catch (e) {
      errorTip(e.message)
    } 
  }

  // 重名校验
  @action async checkName(name, cb) {
    try {
      const res = await io.checkName({
        id: this.roleId,
        name,
      })
      runInAction(() => {
        if (res) {
          cb('角色名称重复')
        } else {
          cb()
        }
      })
    } catch (e) {
      errorTip(e.message)
    } 
  }
}
export default new Store()
