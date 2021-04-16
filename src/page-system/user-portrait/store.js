import {
  observable, action, runInAction,
} from 'mobx'
import {successTip, errorTip, userLog} from '../../common/util'
import io from './io'
import {ListContentStore} from '../../component/list-content'

class Store extends ListContentStore(io.getList) {
  @observable tableLoading = false
  @observable drawerVisible = false
  @observable loading = true
  @observable formLoading = false // 加载表单loading
  @observable confirmLoading = false // 表单确认loading

  @observable status = 0 // 1 禁用 0 启用
  @observable addstatus = false // 添加画像状态
  @observable objId = '' // 对象id
  @observable id = '' // id
  @observable eventTableInfo = 0 // 触点下拉表信息

  @observable detailObj = {} // 配置详情数据
  @observable objList = [] // 对象列表
  @observable tagList = [] // 标签列表
  @observable catList = [] // 类目列表
  @observable addList = [] // 新增列表
  @observable relTablesList = [] // 触点表下拉
  @observable existTablesList = [] // 已经添加的触点表下拉项
  @observable relTableFieldsList = [] // 触点时间下拉
  @observable relTableFieldsContent = {}

  // 重置表单数据
  @action resetValue = () => {
    this.detailObj = {}
    this.tagList = []
    this.catList = []
    this.relTablesList = []
    this.relTableFieldsList = []
  }

  // 显示配置详情 
  @action async showDrawer(params) {
    // this.loading = true
    this.formLoading = true
    this.drawerVisible = true
    this.relTableFieldsList = []
    try {
      const res = await io.getDetails(params)
      runInAction(() => {
        this.detailObj = res
        this.objId = res.objId
        this.eventTableInfo = res.eventTableInfo || []

        this.getTagList({id: this.objId})
        this.getCatList({id: this.objId})
        this.getRelTables({objId: this.objId})
        this.eventTableInfo.map(item => (
          this.getRelTableFields({objId: this.objId, tableName: item.table})
        ))
        userLog('系统管理/画像配置/配置画像')
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      setTimeout(() => this.formLoading = false, 200)
    }
  }

  // 禁用启用
  @action async disable(ids, status) {
    try {
      const res = await io.getTaggle({
        ids,
        status,
      })
      successTip(`${status ? '禁用成功' : '启用成功'}`)
      userLog(`系统管理/画像配置/${status ? '禁用画像' : '启用画像'}`)
      this.getList()
    } catch (error) {
      errorTip(error.message)
    }
  }

  // 获取对象列表
  @action async getObjList() {
    try {
      const res = await io.getObjList()
      runInAction(() => {
        this.objList = res
      })
    } catch (e) {
      errorTip(e.message)
    } 
  }

  // 类目标签树
  @action async getTagTree() {
    try {
      const res = await io.getTagTree()
      runInAction(() => {
        console.log(res)
      })
    } catch (e) {
      errorTip(e.message)
    } 
  }

  // 获取标签列表
  @action async getTagList(params) {
    try {
      const res = await io.getTagList(params)
      runInAction(() => {
        this.tagList = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
  // 获取类目列表
  @action async getCatList(params) {
    try {
      const res = await io.getCatList(params)
      runInAction(() => {
        this.catList = res
      })
    } catch (e) {
      errorTip(e.message)
    } 
  }
  // 获取触点表列表
  @action async getRelTables(params) {
    try {
      const res = await io.getRelTables(params)
      runInAction(() => {
        this.relTablesList = res
      })
    } catch (e) {
      errorTip(e.message)
    } 
  }
  // 获取触点表时间段
  @action async getRelTableFields(params) {
    try {
      const res = await io.getRelTableFields(params)
      runInAction(() => {
        this.relTableFieldsList = [].concat(this.relTableFieldsList, res)
        
        this.relTableFieldsContent[params.tableName] = res
      })
    } catch (e) {
      errorTip(e.message)
    } 
  }
  // 配置新增
  @action async getAdd(params) {
    this.confirmLoading = true
    try {
      const res = await io.getAdd(params)
      runInAction(() => {
        this.addstatus = false
        this.drawerVisible = false
        this.getList()
        successTip('添加成功')
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.confirmLoading = false
    }
  }
  // 配置编辑
  @action async getUpdate(params) {
    this.confirmLoading = true
    try {
      const res = await io.getUpdate(params)
      runInAction(() => {
        this.drawerVisible = false
        this.getList()
        successTip('编辑成功')
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.confirmLoading = false
    }
  }
  // 删除画像
  @action async getDel(params) {
    try {
      const res = await io.getDel(params)
      if (res.success) {
        successTip('删除成功')
        this.getList()
      } else {
        errorTip('操作失败')
      }
    } catch (e) {
      errorTip(e.message)
    }
  }
  // // 启用画像
  // @action async enableButton(params) {
  //   try {
  //     const res = await io.getTaggle(params)
  //     if (res.success) {
  //       successTip('启用成功')
  //     } else {
  //       errorTip('操作失败')
  //     }
  //   } catch (e) {
  //     errorTip(e.message)
  //   }
  // }
  // // 禁用画像
  // @action async disableButton(params) {
  //   try {
  //     const res = await io.getTaggle(params)
  //     if (res.success) {
  //       successTip('禁用成功')
  //     } else {
  //       errorTip('操作失败')
  //     }
  //   } catch (e) {
  //     errorTip(e.message)
  //   }
  // }
}

export default new Store()
