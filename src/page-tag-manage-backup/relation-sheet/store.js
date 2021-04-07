import {
  observable, action, runInAction, toJS,
} from 'mobx'
import {
  successTip, failureTip, errorTip, userLog,
} from '../../common/util'
import {ListContentStore} from '../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getList) {
  objId
  relationType // 区分 2实体 & 0简单关系 & 1复杂关系
  typeCode // 区分实体&关系

  bothTypeCode // 区分 2实体 & 0简单关系 & 1复杂关系

  @observable confirmLoading = false
  @observable modalVisible = false
  @observable editSelectedItem = {}
  
  @observable storageId = undefined
  @observable tableName = undefined
  @observable majorKeyField = undefined
  @observable entity1Key = undefined
  @observable entity2Key = undefined
  
  @observable dataSourceList = [] // 数据源下拉列表数据
  @observable configFieldList = [] // 编辑后的字段列表数据
  @observable secondTableList = [] // 字段列表
  @observable dataSheetList = [] // 数据表下拉列表数据
  @observable fieldList = [] // 字段列表下拉列表数据
  @observable fieldList1 = [] // 字段列表下拉列表数据
  @observable fieldList2 = [] // 字段列表下拉列表数据

  @action.bound closeModal(cb) {
    this.modalVisible = false

    this.storageId = undefined
    this.tableName = undefined
    this.majorKeyField = undefined
    if (cb) cb()
  }

  /**
   * @description 移除关系表
   */
  @action async removeList(params, cb) {
    try {
      const res = await io.removeList({
        objId: this.objId,
        ids: [params.id],
      })

      runInAction(() => {
        if (res) {
          successTip('操作成功')
          if (cb)cb()
        } else {
          failureTip('操作失败')
        }
        userLog('标签管理/移除关系表')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 数据源列表(从关联实体的数据表中选择)
   */
  @action async getEntityDataSource() {
    try {
      const res = await io.getEntityDataSource({
        objId: this.objId,
      })
      runInAction(() => {
        const data = res && res.map(d => ({
          dataTableNameAlias: d,
        }))

        this.dataSheetList.replace(data)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  
  @action async checkTableName(value, cb) {
    try {
      const res = await io.checkTableName({
        objId: this.objId,
        dataTableName: this.tableName,
        dataTableNameAlias: value,
      })
      runInAction(() => {
        if (res.success) {
          cb('表中文名重复')
        } else {
          cb()
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
  @action.bound async checkFieldName(recode, value, cb) {
    try {
      const res = await io.checkFieldName({
        objId: recode.objId,
        dataTableName: recode.dataTableName,
        dataFieldName: recode.dataFieldName,
        dataFieldNameAlias: value,
      })
      runInAction(() => {
        if (res.success) {
          cb('字段中文名重复')
        } else {
          cb()
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 字段列表
   */
  @action async getFieldList() {
    try {
      const res = await io.getFieldList({
        dataTableName: this.tableName,
        objId: this.objId,
      })
      runInAction(() => {
        this.fieldList = res || []
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async getConfigFields(params) {
    try {
      const res = await io.getConfigFields({
        dataTableName: params.dataTableName,
        objId: this.objId,
      })
      runInAction(() => {
        this.secondTableList = res || []
        this.configFieldList = res || []
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 字段列表
   */
  @action async getMappingKey(objId, cb) {
    try {
      const res = await io.getMappingKey({
        objId,
        tableName: this.tableName,
      })
      runInAction(() => {
        if (cb) cb(res)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 保存添加实体关系表
   */
  @action async saveEntityTable(params, cb) {
    this.confirmLoading = true
    try {
      const res = await io.saveEntityTable({
        objId: this.objId,
        ...params,
      })
      runInAction(() => {
        if (res.success && cb) {
          if (cb)cb()
          successTip('操作成功')
        } else {
          failureTip('操作失败')
        }
        userLog('标签管理/新增关系表')
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.confirmLoading = false
      })
    }
  }

  /**
   * @description 保存添加关系关联字段
   */
  @action.bound async saveEntityField(cb) {
    this.configFieldList.forEach(item => item.objId = this.objId)
    try {
      const res = await io.saveEntityField({list: this.configFieldList})
      runInAction(() => {
        if (res.success) {
          if (cb) cb()
          successTip('操作成功')
          userLog('标签管理/配置字段')
        } else {
          failureTip('操作失败')
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
