import {
  action, runInAction, observable, toJS,
} from 'mobx'
import {Select} from 'antd'
import {errorTip, changeToOptions, successTip, userLog} from '../../../common/util'
import {ListContentStore} from '../../../component/list-content'
import io from './io'

const {Option} = Select
class Store extends ListContentStore(io.getGroupList) {
  // 只有实时规则创建群体，其他两种暂时不用
  @observable projectId = 0 // 项目id
  @observable objId = 0 // 实体id
  @observable mode = 0 // 创建方式
  @observable type = 0 // 群体类型
  @observable isCreate = 0 // 是否选中创建群体方式
  @observable current = 0 // 是否选中创建群体方式
  @observable submitLoading = false // 推送loading

  @observable recordObj = {} // 当前编辑群体 无输出标签信息
  @observable nowGroup = {} // 当前编辑群体 有输出标签信息
  @observable fileRes = '' // 上传的文件返回数据
  @observable uploadList = [] // 上传文件列表
  @observable entityList = [] // 实体列表
  @observable entityOptions = [] // 实体option列表
  @observable tagOptions = [] // 标签option列表

  @observable uploadData = false // 是否有上传文件
  @observable visible = false // 新建群体
  @observable drawerVisible = false // id新建群体
  @observable modalVisible = false // 文件解析结果
  @observable isAdd = true // 判断编辑还是新建
  // @observable isPerform = false // id集合执行
  @observable confirmLoading = false // 确认按钮loading
  @observable pushDrawerVis = false // 推送抽屉

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

  // 添加id群体
  @action async addIdGroup(obj) {
    try {
      const res = {}
      // const res = await io.addIdGroup({
      //   ...obj,
      // })
      runInAction(() => {
        if (res) {
          successTip('添加成功')
          this.handleCancel()
          this.getList()
        }
      })
    } catch (e) {
      this.confirmLoading = false
      errorTip(e.message)
    }
  }
  
  // 编辑id群体
  @action async editIdGroup(obj) {
    try {
      const res = {}
      // const res = await io.editIdGroup({
      //   id: this.recordObj.id, // 群体ID
      //   ...obj,
      // })
      runInAction(() => {
        if (res) {
          successTip('编辑成功')
          this.handleCancel()
          this.getList()
        }
      })
    } catch (e) {
      this.confirmLoading = false
      errorTip(e.message)
    }
  }

  // 获取ID编辑群体信息
  @action async getEditIdGroup(cb) {
    try {
      const res = {}
      // const res = await io.getEditIdGroup({
      //   id: this.recordObj.id, // 群体ID
      // })
      runInAction(() => {
        res.outputTags = res.outputTags.map(String)
        cb(res.outputTags)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 删除群体
  @action async removeGroup(id) {
    try {
      const res = await io.removeGroup({
        id, // 群体ID
      })
      runInAction(() => {
        if (res) {
          successTip('删除成功')
          this.getList()
          userLog('群体管理/删除群体')
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
        id, // 群体ID
      })
      runInAction(() => {
        if (res) {
          successTip('正在执行')
          this.getList()
        } else {
          errorTip('执行失败')
        }
        userLog('群体管理/执行群体')
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
          callback('群体名称重复')
        } else {
          callback()
        }
      })
    } catch (error) {
      errorTip(error)
    }
  }
}

export default new Store()
