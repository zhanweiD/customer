import {
  action, runInAction, observable, toJS,
} from 'mobx'
import {Select} from 'antd'
import {errorTip, changeToOptions, successTip, userLog} from '../../../common/util'
import {ListContentStore} from '../../../component/list-content'
import io from './io'

const {Option} = Select
class Store extends ListContentStore(io.getGroupList) {
  // 只有实时规则创建客群，其他两种暂时不用
  @observable projectId = 0 // 项目id
  @observable objId = 0 // 实体id
  @observable mode = 0 // 创建方式
  @observable type = 0 // 客群类型
  @observable isCreate = 0 // 是否选中创建客群方式
  @observable current = 0 // 是否选中创建客群方式
  @observable submitLoading = false // 推送loading

  @observable recordObj = {} // 当前编辑客群 无输出标签信息
  @observable nowGroup = {} // 当前编辑客群 有输出标签信息
  @observable fileRes = '' // 上传的文件返回数据
  @observable uploadList = [] // 上传文件列表
  @observable entityList = [] // 实体列表
  @observable userList = [] // 创建人列表
  @observable entityOptions = [] // 实体option列表
  @observable tagOptions = [] // 标签option列表

  @observable uploadData = false // 是否有上传文件
  @observable visible = false // 新建客群
  @observable drawerVisible = false // id新建客群
  @observable modalVisible = false // 文件解析结果
  @observable isAdd = true // 判断编辑还是新建
  @observable confirmLoading = false // 确认按钮loading
  @observable pushDrawerVis = false // 推送抽屉

  @observable selectedRows = [] // 选中表格

  @action handleCancel = () => {
    this.drawerVisible = false
    this.isPerform = false
    this.recordObj = {}
    this.nowGroup = {}
    this.objId = 0
    this.uploadList = []
    this.uploadData = false
    this.confirmLoading = false
  }

  // 获取实体列表
  @action async getEntityList() {
    try {
      const res = await io.getEntityList({
      })
      runInAction(() => {
        this.entityOptions = res.map(item => {
          return (<Option key={item.objId}>{item.name}</Option>)
        })
        this.entityList = changeToOptions(toJS(res || []))('name', 'objId')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 获取标签列表
  @action async getTagList() {
    try {
      const res = await io.getTagList({
        objId: this.objId || this.recordObj.objId,
      })
      runInAction(() => {
        this.tagOptions = res.map(item => {
          return (<Option key={item.tagId}>{item.tagName}</Option>)
        })
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 获取标签列表
  @action async getUserList() {
    try {
      const res = await io.getUserList()
      runInAction(() => {
        this.userList = changeToOptions(toJS(res || []))('userName', 'userAccount')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 删除客群
  @action async removeGroup(id) {
    try {
      const res = await io.removeGroup({
        id, // 客群ID
      })
      runInAction(() => {
        if (res) {
          successTip('删除成功')
          this.getList()
          userLog('客群管理/删除客群')
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 批量删除客群
  @action.bound async removeGroupList() {
    try {
      const res = await io.removeGroupList({
        ids: this.selectedRows, // 客群ID
      })
      runInAction(() => {
        if (res) {
          successTip('删除成功')
          this.getList()
          userLog('客群管理/删除客群')
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 规则实时执行
  @action async performGroup(id) {
    try {
      const res = await io.performGroup({
        id, // 客群ID
      })
      runInAction(() => {
        if (res) {
          successTip('正在执行')
          this.getList()
        } else {
          errorTip('执行失败')
        }
        userLog('客群管理/执行客群')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 重命名校验
  @action async checkName(name, callback) {
    if (!this.isAdd) {
      callback()
      return
    }
    try {
      const res = await io.checkName({
        objId: this.objId,
        name,
      })
      runInAction(() => {
        if (res.isExist) {
          callback('客群名称重复')
        } else {
          callback()
        }
      })
    } catch (error) {
      errorTip(error.message)
    }
  }
}

export default new Store()
