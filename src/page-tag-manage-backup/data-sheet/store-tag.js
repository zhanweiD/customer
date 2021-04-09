import {observable, action, toJS, runInAction} from 'mobx'
import io from './io-tag'
import {errorTip, successTip, listToTree, userLog} from '../../common/util'

class Store {
  objId
  tableName
  storageId
  tagId

  @observable initialList = [] // 第一步拿到的初始数据
  @observable tableData = [] // 用于第一步表格渲染

  @observable secondTableList = [] // 第二步的表格数据，来源于第一步表格的选中数据

  @observable cateList = [] // 第二步，格式转换后所属类目列表（可直接作为级联选择的options）

  @observable cateMap = {} // 第二步，类目列表id到name的映射对象

  @observable defaultCateId = undefined // 默认类目的id，如果标签没有选择类目，那么就放在默认类目下

  @observable secondSelectedRows = [] // 第二步选中的行数据，用于批量“选择所属类目”

  @observable successResult = {} // 第三步，成功时的数据

  @observable checkedPulish = true

  @observable loadings = {
    firstTable: false, // 第一步表格的Loading
    tagSaving: false, // 第二步，保存标签时的加载状态
    result: false, // 第三步，结果展示
  }

  @observable forceUpdateKey = Math.random() // 有时候需要强制刷新表格，比如要更新所属类目

  // // 创建实例时需要传入一些数据
  // constructor({
  //   treeId, objId, storageId, tableName,
  // } = {}) {
  //   this.treeId = treeId // 树节点id
  //   this.objId = objId // 对象id
  //   this.storageId = storageId // 数据源id
  //   this.tableName = tableName // 数据表名
  // }


  // 请求初始时的字段列表
  @action async getInitialList() {
    try {
      this.loadings.firstTable = true
      const res = await io.getFieldList({
        objId: this.objId,
        storageId: this.storageId,
        tableName: this.tableName,
      })

      this.initialList = res || []
      this.tableData = this.initialList.filter(d => d.status !== 2) || []
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.loadings.firstTable = false
    }
  }

  // 请求类目列表
  @action async getCateList() {
    try {
      const res = await io.getCateList({
        id: this.objId,
      }) || []

      // id -> name的映射
      const cateMap = {}
      // 默认类目
      let defaultCate = {}

      // 加上value\label属性，用于antd的级联组件
      res.forEach(node => {
        const {id, name} = node
        node.value = id
        node.label = name

        cateMap[id] = name

        // aId为-1的类目是默认类目
        if (node.aId === -1) {
          defaultCate = node
        }
      })

      this.defaultCateId = defaultCate.id
      this.cateMap = cateMap
      this.cateList = listToTree(res)

      // 强制更新key
      this.forceUpdateKey = Math.random()
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 批量创建标签
  @action async saveTags(successCallback, errorCallack) {
    try {
      this.loadings.tagSaving = true

      // 给没有类目的标签加上默认类目id
      const checkList = toJS(this.secondTableList)
      checkList.forEach(item => {
        // 没有parentId，且没有pathIds
        // item.isEnum = 0
        if (!item.parentId && (!item.pathIds || !item.pathIds.length)) {
          item.parentId = this.defaultCateId
        }
      })

      const res = await io.saveTags({
        checkList,
        isPublish: this.checkedPulish ? 1 : 0,
      })

      // 如果content是false，也是保存失败
      if (res === false) {
        throw new Error('创建失败')
      } else {
        successTip('创建成功')
        userLog('标签管理/生成标签')
        if (successCallback) successCallback()
      }
    } catch (e) {
      errorTip(e.message)
      if (errorCallack) errorCallack()
    } finally {
      this.loadings.tagSaving = false
    }
  }

  // 校验标签是否可创建， params是有需要时自定义的参数，successCallback是请求成功的回调函数，errorCallback是失败回调
  @action async checkTagList(params, successCallback, errorCallack) {
    // 如果第一个参数是函数，说明只给了回调函数（只简单检验一下）
    if (typeof params === 'function') {
      errorCallack = successCallback
      successCallback = params
      params = undefined
    }

    // console.log('checkTagList params', params)

    try {
      const res = await io.checkTagList({
        // 有传入参数，那就用；没有就将当前列表传上去; 注意params需要是原生数组
        checkList: params || toJS(this.secondTableList),
      })

      typeof successCallback === 'function' && successCallback()
      
      this.secondTableList = res || []
    } catch (e) {
      errorTip(e.message)
      typeof errorCallack === 'function' && errorCallack()
    }
  }

  // 获取成功结果
  @action async getStorageDetail() {
    try {
      this.loadings.result = true
      const res = await io.getStorageDetail({
        objId: this.objId,
        storageId: this.storageId,
        tableName: this.tableName,
      })

      this.successResult = res || {}
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.loadings.result = false
    }
  }

  // 更新第二步表格的数据；注意：不直接将第一步选中项赋值给secondTableList，因为后者可能修改，仅仅做增加或减少
  @action.bound updateSecondTableList(selectedRows = []) {
    // 映射对象，方便快速判断某个标签是不是已被添加，避免反复遍历；唯一识别字段是 字段名dataFieldName
    const secondTableListMap = {}
    const selectedRowsMap = {}

    selectedRows.forEach(field => {
      selectedRowsMap[field.dataFieldName] = field
    })

    // 移除被取消选中的标签
    this.secondTableList = this.secondTableList.filter(tag => {
      const {dataFieldName} = tag
      return !!selectedRowsMap[dataFieldName]
    })

    this.secondTableList.forEach(tag => {
      secondTableListMap[tag.dataFieldName] = tag
    })

    // 加入新增的标签
    selectedRows.forEach((field, index) => {
      const {dataFieldName} = field
      // 没有就添加
      if (!secondTableListMap[dataFieldName]) {
        this.secondTableList.splice(index, 0, field)
      } 
    })

    // 把第二步选中数组也清空掉
    this.secondSelectedRows = []
  }

  /**
   * @description 重名校验
   */
  @action async checkName(params, cb) {
    try {
      const res = await io.checkName({
        objId: this.objId,
        ...params,
      })
      runInAction(() => {
        if (res.success) {
          cb('名称已存在')
        } else {
          cb()
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable nameKeyWord = []
  // @action async checkKeyWord() {
  //   try {
  //     const res = await io.checkKeyWord({
  //     })
  //     runInAction(() => {
  //       this.nameKeyWord = res
  //     })
  //   } catch (e) {
  //     errorTip(e.message)
  //   }
  // }

  @observable tagTypeList = []
  // @action async getTagTypeList(params) {
  //   try {
  //     const res = await io.getTagTypeList({
  //       fieldType: params,
  //     })
  //     runInAction(() => {
  //       this.tagTypeList = res
  //     })
  //   } catch (e) {
  //     errorTip(e.message)
  //   }
  // }
}

export default new Store()
