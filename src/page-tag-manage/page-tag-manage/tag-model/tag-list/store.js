import {
  observable, action, runInAction, toJS,
} from 'mobx'
import _ from 'lodash'
import {
  successTip, failureTip, errorTip, changeToOptions, listToTree, userLog,
} from '../../../../common/util'
import {ListContentStore} from '../../../../component/list-content'
import io from './io'

const listToCascader = data => {
  const newData = _.cloneDeep(data)

  newData.forEach(item => {
    const children = newData.filter(sitem => sitem.parentCode === item.bizCode)
    if (children.length && !item.children) item.children = children
  })

  return newData.filter(item => item.parentCode === '-1')
}
class Store {
  // 创建标签
  @observable drawerTagVisible = false
  @observable detailVisible = true
  @observable drawerTagType = 'add' // 创建标签弹窗类型 添加 & 编辑
  @observable drawerTagInfo = {} // 编辑标签时 标签详情
  @observable objectSelectList = [] // 所属对象下拉数据
  @observable tagCateSelectList = [] // 所属类目下拉数据
  @observable tagCateList = [] // 所属类目下拉数据(无层级)
  @observable objStore = null // 对象store

  @observable isEnum = false // 是否枚举
  @observable ownObject = undefined // 所属对象

  @observable editDetail = {} // 编辑标签事的详情数据 
  @observable detailLoading = false // 请求标签详情时loading

  // 标签配置
  @observable drawerTagConfigVisible = false
  @observable drawerTagConfigInfo = {}
  @observable drawerTagConfigType = 'one' // 单个绑定

  // 批量绑定
  @observable batchConfigVisible = false

  // 上下架申请操作
  @observable tagApplyVisible = false // 上下架申请弹窗控制
  @observable applyInfo = {} // 标签信息

  @observable confirmLoading = false // 提交loading

  // @observable selectedRows = []
  // @observable rowKeys = []

  // 批量发布
  @observable publishRowKeys = []

  // 上下架申请modal
  @action.bound openModal() {
    this.tagApplyVisible = true
    this.getTagCateSelectList()
    // this.getTagDetail({
    //   id: info.id,
    // })
    // this.applyInfo = info
  }

  // 上下架申请modal
  @action.bound closeModal() {
    this.tagApplyVisible = false
    this.applyInfo = {}
    this.publishRowKeys = []
  }

  // 创建标签Drawer
  @action.bound openDrawer(type, data) {
    this.drawerTagType = type
    this.getTagCateSelectList()
    
    // 要处理业务类型的数据
    if (data) {
      const {biz, ...rest} = data
      const bizValue = []

      if (biz && biz.length) {
        biz.forEach(item => {
          bizValue.push(item.pop())
        })

        this.drawerTagInfo = {biz: bizValue, ...rest}
      } else if (rest.bizText === '全部') {
        this.drawerTagInfo = {biz: ['ALL'], ...rest}
      }
    } else {
      this.drawerTagInfo = {}
    }
    
    // if (type === 'edit') {
    //   // 获取对象详情
    //   this.getTagDetail({
    //     id: data.id,
    //   })
    //   // 根据所属对象id 查询所属类目下拉框数据
    // }

    this.drawerTagVisible = true
  }

  // 创建标签Drawer
  @action.bound closeDrawer() {
    this.drawerTagInfo = {}
    this.drawerTagVisible = false
    this.isEnum = false
    this.ownObject = undefined
  }

  // 标签配置Drawer
  @action.bound openTagConfig(type, data) {
    this.drawerTagConfigType = type
    this.drawerTagConfigInfo = data
    // drawerTagInfo
    this.drawerTagConfigVisible = true
  }

  // 标签配置Drawer
  @action.bound closeTagConfig() {
    this.drawerTagConfigInfo = {}
    this.drawerTagConfigVisible = false
    this.drawerTagConfigType = 'one'
  }

  // 更新标签配置
  @action.bound updateTagConfig() {
    this.closeTagConfig()
    // this.getList()
  }


  // 批量创建标签
  @action.bound openBatchConfig() {
    this.batchConfigVisible = true
  }

  @action.bound closeBatchConfig() {
    this.batchConfigVisible = false
  }


  // 更新标签配置
  @action.bound updateBatchConfig() {
    this.closeBatchConfig()
    // this.getList()
  }

  /**
   * @description 上下架申请
   * @param {*} params 
   */
  @action async tagMove(params, cb) {
    this.confirmLoading = true

    try {
      const res = await io.tagMove({
        ids: this.publishRowKeys,
        ...params,
      })
      runInAction(() => {
        if (res.success) {
          successTip('操作成功')
          this.closeModal()
          if (cb) cb()
        } else {
          failureTip('操作失败')
        }
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.confirmLoading = false
    }
  }

  /**
   * @description 修改标签发布状态
   * @param {*} params 
   */
  @action async updateTagStatus(params, cb) {
    this.confirmLoading = true
    try {
      const res = await io.updateTagStatus({
        ...params,
      })
      runInAction(() => {
        if (res.success) {
          successTip('操作成功')
          if (cb) cb()
        } else {
          failureTip('操作失败')
        }
        if (params.status === 1) {
          userLog('标签管理/下线标签')
        } else if (params.status === 2) {
          userLog('标签管理/发布标签')
        }
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.confirmLoading = false
    }
  }

  // 批量发布
  @action async batchPublish(cb) {
    this.confirmLoading = true
    try {
      const res = await io.updateTagStatus({
        status: 2,
        tagIdList: toJS(this.publishRowKeys),
      })
      runInAction(() => {
        if (res.success) {
          successTip('操作成功')
          if (cb) cb()
          this.publishRowKeys.clear()
        } else {
          failureTip('操作失败')
        }
        userLog('标签管理/发布标签')
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.confirmLoading = false
    }
  }
  
  /**
   * @description 获取所属对象下拉数据
   */
  @action async getObjectSelectList() {
    try {
      const res = await io.getObjectSelectList({
      })
      runInAction(() => {
        this.objectSelectList = changeToOptions(res)('name', 'id')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 获取所属类目下拉数据
   */
  @action async getTagCateSelectList(params) {
    try {
      const res = await io.getTagCateTree({
        ...params,
        id: this.objId,
      })
      runInAction(() => {
        this.tagCateList = res
        this.tagCateSelectList = listToTree(res)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 标签详情
   */
  @action async getTagDetail(params, data, cb = () => {}) {
    this.detailLoading = true

    try {
      const res = await io.getTagDetail({
        ...params,
      })
      runInAction(() => {
        this.drawerTagInfo = {...res, bizText: data.bizText}
        this.applyInfo = res
        this.isEnum = res.isEnum
        this.ownObject = res.objId
        if (cb) cb()
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.detailLoading = false
    }
  }

  /**
   * @description 创建标签
   */
  @action async createTag(params, cb) {
    this.confirmLoading = true

    try {
      const res = await io.createTag({
        ...params,
      })
      runInAction(() => {
        if (res.success) {
          successTip('操作成功')
          if (cb) cb()
          this.objStore.getTreeData()
        } else {
          failureTip('操作失败')
        }
        userLog('标签管理/新建标签')
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.confirmLoading = false
    }
  }

  /**
   * @description 编辑标签
   */
  @action async updateTag(params, cb) {
    this.confirmLoading = true

    try {
      const res = await io.updateTag({
        ...params,
      })
      runInAction(() => {
        if (res.success) {
          successTip('操作成功')
          if (cb) cb()
        } else {
          failureTip('操作失败')
        }
        userLog('标签管理/编辑标签')
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.confirmLoading = false
    }
  }

  /**
   * @description 删除标签
   */
  @action async deleteTag(params, cb) {
    this.confirmLoading = true
    try {
      const res = await io.deleteTag({
        ...params,
      })
      runInAction(() => {
        if (res) {
          successTip('操作成功')
          if (cb) cb()
          this.objStore.getTreeData()
        } else {
          failureTip('操作失败')
        }
        userLog('标签管理/删除标签')
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.confirmLoading = false
    }
  }

  /**
   * @description 重名校验
   */
  @action async checkName(params, cb) {
    try {
      const res = await io.tagCheckName({
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
  @action async checkKeyWord() {
    try {
      const res = await io.checkKeyWord({
      })
      runInAction(() => {
        this.nameKeyWord = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async cancelTagConfig(params) {
    this.confirmLoading = true
    try {
      const res = await io.cancelTagConfig({
        ...params,
      })
      runInAction(() => {
        if (res) {
          successTip('操作成功')
          this.getList()
        } else {
          failureTip('操作失败')
        }
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.confirmLoading = false
    }
  }

  @observable functionCodes = []

  @observable bizList = []
  @observable bizOriginList = []

  @observable updateBizVisible = false
  
  /**
 * 描述 获取业务类型下拉列表数据
 * @date 2021-04-17
 * @returns {any} void
 */
  @action async getBizList() {
    try {
      const res = await io.getBizList()

      res.forEach(item => {
        item.title = item.bizName
        item.value = item.bizCode

        if (item.parentCode === '-1') {
          item.parentCode = 'ALL'
        }
      })

      res.push({
        bizCode: 'ALL',
        bizName: '全部',
        parentCode: '-1',
        title: '全部',
        value: 'ALL',
      })

      this.bizOriginList = res
      this.bizList = listToCascader(res)
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async batchUpdateBiz(params, cb = () => {}) {
    try {
      const res = await io.batchUpdateBiz(params)

      successTip('操作成功')
      cb()
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
