import {
  observable, action, runInAction, toJS, observe,
} from 'mobx'
import {
  successTip, errorTip, userLog,
} from '../../common/util'
import io from './io'
import {ListContentStore} from '../../component/list-content'

class Store extends ListContentStore() {
  @observable tableLoading = false
  @observable visible = false
  @observable detailVisible = false
  @observable nowRecord = {} // 当前操作用户

  @observable searchKey // 类目树搜索值
  @observable selectedKeys = [] // 选中的标签id
  @observable publishRowKeys = [] // 选中用户
  @observable userIdList = [] // 授权用户
  @observable selectChild = 0 // 选中的标签
  @observable treeData = [] // 类目树数据
  @observable expandAll = false // 类目树是否全部展开
  @observable searchExpandedKeys = [] // 关键字搜索展开的树节点
  @observable roleList = [] // 角色列表

  @observable dataStatus = 0 // 新增编辑
  @observable confirmLoading = false // 确认
  @observable dataCheckedKeys = [] // 选中的项目id
  @observable drawerVisible = false // 抽屉
  @observable projectList = [] // 数据权限树
  @observable detailLoading = false // 数据权限详情
  @observable userAcc = null // 用户账号

  @observable pagination = {
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
  }

  // 将后端打平的数据结构处理成树组件需要的数据结构
  listToTree(data) {
    const newData = _.cloneDeep(data)

    newData.forEach(item => {
      const children = newData.filter(sitem => sitem.parentOrgId === item.orgId)
      if (children.length && !item.children) item.children = children
    })

    return newData.filter(item => item.parentOrgId === '-1')
  }

  @observable firstChildrens = [] // 存放第一个孩子集

  @action defaultKey = data => {
    for (const item of data) {
      if (item.children) {
        this.defaultKey(item.children) 
      } else if (item.parentOrgId) { // 判断条件不定，使用场景有限
        return this.firstChildrens.push(item)
      }
    }
  }

  // 获取部门列表
  @action async getTreeList(params) {
    this.tableLoading = true
    try {
      const res = await io.getTreeList(params)

      runInAction(() => {
        this.treeData = this.listToTree(res)
        this.defaultKey(this.treeData)
        const firstObject = this.firstChildrens[0]
        this.selectedKeys = [firstObject && firstObject.orgId]
        this.getList()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 获取用户列表
  @action.bound async getList(searchKey) {
    this.tableLoading = true
    try {
      const res = await io.getList({
        orgId: this.selectedKeys[0],
        searchKey,
        ...this.pagination,
      })

      runInAction(() => {
        this.list = res.data
        this.pagination = {
          pageSize: res.pageSize || 10,
          totalCount: res.totalCount,
          currentPage: res.currentPage,
        }
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.tableLoading = false
    }
  }

  // 获取角色
  @action.bound async getRoleList() {
    try {
      const res = await io.getRoleList()

      runInAction(() => {
        this.roleList = res.data
      })
    } catch (e) {
      errorTip(e.message)
    } 
  }

  // 功能授权
  @action.bound async updateRole(params, cb) {
    try {
      const res = await io.updateRole({
        list: params,
      })
      runInAction(() => {
        successTip('授权成功')
        userLog('系统管理/用户管理/功能授权')
        this.publishRowKeys = []
        if (cb) cb()
      })
    } catch (e) {
      errorTip(e.message)
    } 
  }

  // 数据授权
  @action.bound async updateData(param, cb) {
    try {
      const res = await io.updateData({
        projectIds: param,
        userAcc: this.userAcc,
      })
      runInAction(() => {
        successTip('授权成功')
        userLog('系统管理/用户管理/数据授权')
        if (cb) cb()
      })
    } catch (e) {
      errorTip(e.message)
    } 
  }

  listToTreePro(data) {
    const newData = _.cloneDeep(data)
  
    newData.forEach(item => {
      const children = newData.filter(sitem => sitem.parent === item.name)
      if (children.length && !item.children) item.children = children
    })
    return newData.filter(item => item.parent === -1)
  }

  // 数据授权详情
  @action.bound async dataDetail() {
    this.detailLoading = true
    try {
      const res = await io.dataDetail({
        userAcc: this.userAcc,
      })
      runInAction(() => {
        const proList = res.filter(item => item.name !== '')
        const checkItem = proList.filter(item => item.flag === 1)
        // 去重
        // const list = new Map()
        // const setList = proList.filter(item => !list.has(item.name) && list.set(item.name, 1))
        this.dataCheckedKeys = checkItem.map(item => {
          if (item.projectId) return item.projectId
          return item.name
        })
        this.projectList = this.listToTreePro(proList || [])
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.detailLoading = false
    }
  }
}
export default new Store()
