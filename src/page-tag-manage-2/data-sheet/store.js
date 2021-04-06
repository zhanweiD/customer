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
  
  // 批量发布
  @observable publishRowKeys = []
  @observable dataSourceList = [] // 数据源下拉列表数据
  @observable dataSheetList = [] // 数据表下拉列表数据
  @observable fieldList = [] // 字段列表下拉列表数据
  @observable fieldList1 = [] // 字段列表下拉列表数据
  @observable fieldList2 = [] // 字段列表下拉列表数据

  @action.bound closeModal(cb) {
    this.modalVisible = false

    this.storageId = undefined
    this.tableName = undefined
    this.majorKeyField = undefined

    this.entity1Key = undefined
    this.entity2Key = undefined

    this.editSelectedItem = {}

    this.dataSourceList.clear()
    this.dataSheetList.clear()
    this.fieldList.clear()
    this.fieldList1.clear()
    this.fieldList2.clear()

    if (cb) cb()
  }

  /**
   * @description 移除数据表
   */
  @action async removeList(params, cb) {
    try {
      const res = await io.removeList({
        objId: this.objId,
        ...params,
      })

      runInAction(() => {
        if (res) {
          successTip('操作成功')
          if (cb)cb()
        } else {
          failureTip('操作失败')
        }
        userLog('标签管理/移除数据表')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 数据源列表
   */
  @action async getDataSource() {
    try {
      const res = await io.getDataSource({
      })
      runInAction(() => {
        this.dataSourceList = res ? [res] : []
        if (res) {
          this.storageId = res.storageId
          this.getDataSheet()
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 数据源列表(从关联实体的数据表中选择)
   */
  @action async getEntityDataSource(cb) {
    try {
      const res = await io.getEntityDataSource({
        objId: this.objId,
      })
      runInAction(() => {
        const data = res && res.map(d => ({
          tableName: d.tableName,
          isUsed: d.isUsed,
        }))

        this.dataSheetList.replace(data)
        if (cb) cb()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 数据表列表
   */
  @action async getDataSheet(params) {
    try {
      const res = await io.getDataSheet({
        objId: this.objId,
        storageId: this.storageId,
        ...params,
      })
      runInAction(() => {
        this.dataSheetList = res || []
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 字段列表
   */
  @action async getFieldList(cb) {
    try {
      const res = await io.getFieldList({
        tableName: this.tableName,
        objId: this.objId,
      })
      runInAction(() => {
        this.fieldList = res || []
        if (cb) cb(res)
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
   * @description 保存添加实体关联字段
   */
  @action async saveEntityField(cb) {
    this.confirmLoading = true

    const majorKeyInfo = this.fieldList.filter(d => d.field === this.majorKeyField)[0]

    const selectFields = this.fieldList.filter(d => d.field !== this.majorKeyField)

    const filedObjReqList = selectFields.map(d => ({
      // dataDbName: dataDbInfo.storageName,
      dataStorageId: window.defaultParams.hiveStorageId,
      // dataDbType: dataDbInfo.storageType,
      dataTableName: this.tableName,
      dataFieldName: d.field,
      dataFieldType: d.type,
      mappingKey: majorKeyInfo.field,
      mappingKeyType: majorKeyInfo.type,
    }))

    try {
      const res = await io.saveEntityField({
        objId: this.objId,
        filedObjReqList,
      })
      runInAction(() => {
        if (res && cb) {
          if (cb)cb()
          successTip('操作成功')
        } else {
          failureTip('操作失败')
        }
        userLog('标签管理/添加数据表')
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
  @action async saveRelField(fieldParams, cb) {
    this.confirmLoading = true

    const dataDbInfo = this.dataSourceList.filter(d => d.storageId === this.storageId)[0]


    const mappingKeys1 = toJS(this.fieldList1)
      .filter(d => d.field === this.entity1Key)
      .map(d => ({
        obj_id: `${d.objId}`,
        field_name: d.field,
        field_type: d.type,
      }))

    const mappingKeys2 = toJS(this.fieldList2)
      .filter(d => d.field === this.entity2Key)
      .map(d => ({
        obj_id: `${d.objId}`,
        field_name: d.field,
        field_type: d.type,
      }))
    const mappingKeys = mappingKeys1.concat(mappingKeys2)
    const fieldList = toJS(this.fieldList1).concat(toJS(this.fieldList2))
    const uniqFieldList = _.unionBy(fieldList, 'field')
    const selectFields = uniqFieldList.filter(d => (d.field !== this.entity1Key) && (d.field !== this.entity2Key))

    const filedObjAssReqList = selectFields.map(d => ({
      dataDbName: dataDbInfo.storageName,
      dataStorageId: dataDbInfo.storageId,
      dataDbType: dataDbInfo.storageType,
      dataTableName: this.tableName,
      dataFieldName: d.field,
      dataFieldType: d.type,
      mappingKeys: JSON.stringify(mappingKeys),
      ...fieldParams,
    }))

    try {
      const res = await io.saveRelField({
        objId: this.objId,
        filedObjAssReqList,
      })
      runInAction(() => {
        if (res && cb) {
          if (cb)cb()
          successTip('操作成功')
        } else {
          failureTip('操作失败')
        }
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.confirmLoading = false
      })
    }
  }
}

export default new Store()
