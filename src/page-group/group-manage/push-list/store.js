import {
  observable, action, runInAction, toJS,
} from 'mobx'
import {successTip, errorTip, changeToOptions, userLog} from '../../../common/util'
import io from './io'
import {ListContentStore} from '../../../component/list-content'

class Store extends ListContentStore(io.getList) {
  @observable tableLoading = true
  @observable drawerVisible = false
  @observable submitLoading = false

  @observable current = 0
  @observable isEdit = false // 是否编辑
  @observable publishRowKeys = [] // 选中table

  @observable detail = {} // 推送详情

  // step-one
  @observable groupList = [] // 群体list
  @observable sourceList = [] // 目的源list
  @observable tableList = [] // 数据表list
  @observable storageId = null // 目的源id
  @observable storageName = null // 目的源name
  @observable tableName = null // 数据表
  @observable groupId = null // 客群id
  @observable detail = {} // 推送详情 
  @observable formLoading = false // 推送详情loading 

  // 获取客群列表
  @action async getGroupList() {
    try {
      const res = await io.getGroupList()
      runInAction(() => {
        this.groupList = changeToOptions(toJS(res || []))('groupName', 'groupId')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 获取数据源
  @action async getStorages() {
    try {
      const res = await io.getStorages()
      runInAction(() => {
        this.sourceList = changeToOptions(toJS(res || []))('storageName', 'storageId')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 获取数据表
  @action async getTables() {
    try {
      const res = await io.getTables({
        storageId: this.storageId || this.detail.toStorageId, 
      })
      runInAction(() => {
        this.tableList = res || []
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 映射相关
  @observable source = [] // 标签
  @observable target = [] // 字段
  @observable result = [] // 映射详情
  @observable reader = [] // 映射标签详情
  @observable writer = [] // 映射字段详情
  @observable changeList = [] // 映射改变list
  @observable logicExper = {} // 映射结果
  @observable formValue = {} // 表单数据
  @observable loading = true
  @observable pushId = null // 推送记录id

  // 获取字段列表
  @action async getFieldData() {
    try {
      const res = await io.getFieldData({
        storageId: this.storageId,
        tableName: this.tableName,
      })

      runInAction(() => {
        this.target = res || []
        if (this.isEdit) {
          const list = JSON.parse(this.detail.logicExper) || {writer: []}
          this.writer = res.filter(item => list.writer.indexOf(item.fieldName) >= 0)
        }
      })
      await this.getTagData()
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 获取标签列表
  @action async getTagData() {
    try {
      const res = await io.getTagData({
        groupId: this.groupId,
      })

      runInAction(() => {
        this.source = res || []
        if (this.isEdit) {
          const list = JSON.parse(this.detail.logicExper) || {reader: []}
          this.reader = res.filter(item => list.reader.indexOf(item.fieldName) >= 0)

          this.result = this.reader.map((item, index) => {
            const fieldData = this.writer[index] || {}
            item.tagFieldName = item.fieldName
            item.fieldName = fieldData.fieldName
            item.fieldNameType = fieldData.fieldNameType
            item.matching = fieldData.matching
            item.tableName = fieldData.tableName

            return item
          })
          this.changeList = this.result
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action setParams() {
    let reader = []
    let writer = []
    reader = this.changeList.map(item => item.tagFieldName)
    writer = this.changeList.map(item => item.fieldName)
    
    this.logicExper = {reader, writer}
  }

  // 推送curd
  // 新增推送
  @action async addPush() {
    this.submitLoading = true
    try {
      const res = await io.addPush({
        ...this.formValue,
        logicExper: JSON.stringify(this.logicExper),
      })

      runInAction(() => {
        successTip('新建成功')
        this.getList()
        userLog('群体管理/新建推送')
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.submitLoading = false
      this.drawerVisible = false
      this.current = 0
    }
  }

  // 推送详情
  @action async detailPush() {
    this.formLoading = true
    try {
      const res = await io.detailPush({
        id: this.pushId,
      })

      runInAction(() => {
        this.detail = res
        this.groupId = res.groupId
        this.storageId = res.toStorageId
        this.tableName = res.toTableName
        this.storageName = res.name

        this.getStorages()
        this.getTables()
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.formLoading = false
    }
  }
  
  // 编辑推送
  @action async editPush() {
    this.submitLoading = true
    try {
      const res = await io.editPush({
        id: this.pushId,
        logicExper: JSON.stringify(this.logicExper),
        ...this.formValue,
      })

      runInAction(() => {
        successTip('编辑成功')
        this.getList()
        userLog('群体管理/编辑推送')
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.submitLoading = false
      this.drawerVisible = false
      this.current = 0
    }
  }

  // 删除推送
  @action async delPush(id) {
    try {
      const res = await io.delPush({
        id,
      })

      runInAction(() => {
        successTip('删除成功')
        this.getList()
        userLog('群体管理/删除推送')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
