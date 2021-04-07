import {
  observable, action, runInAction,
} from 'mobx'
import {
  successTip, errorTip, failureTip, listToTree, changeToOptions, userLog,
} from '../../../common/util'
import {ListContentStore} from '../../../component/list-content'

import io from './io'

class Store extends ListContentStore(io.getList) {
  @observable modalSelectTagVisible = false // 选择标签弹窗控制标识
  objId
  // 标签类目
  @observable tagClassVisible = false
  @observable tagClassObjId // 标签类目选中的对象id  

  @observable status = '' // 标签状态
  @observable keyword = '' // 标签关键字搜索
  @observable tableLoading = false // 
  @observable pagination = {
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
  }

  @observable treeLoading = false
  @observable confirmLoading = false
  @observable categoryModal = {
    visible: false,
    title: '',
    editType: 'add',
    detail: {},
  }

  // 标签类目树
  @observable searchKey = undefined
  @observable expandAll = false
  @observable treeData = [] // 类目树数据
  @observable nowCateIds = [] // 当前选中类目
  @observable searchExpandedKeys = [] // 关键字搜索展开的树节点
  @observable currentSelectKeys = undefined // 选中
  @observable defaultCate = {}// 默认类目
  @observable categoryData = [] // 所有类目
  @observable keyword = undefined // 标签列表搜索关键字

  // 选择标签弹窗 - 标签列表
  @observable tagListModal = {
    list: [],
    loading: false,
    currentPage: 1,
    pageSize: 5,
  }

  // 标签列表
  @observable tagList = {
    list: [],
    loading: false,
    currentPage: 1,
    pageSize: 10,
  }

  // 弹窗移动至
  @observable modalMove = {
    selectKeys: [],
    visible: false,
  }

  @action findParentId(id, data, expandedKeys) {
    data.forEach(item => {
      if (item.parentId !== 0 && item.id === id) {
        expandedKeys.push(item.parentId)
        this.findParentId(item.parentId, data, this.searchExpandedKeys)
      }
    })
  }

  // @action.bound async getList(params) {
  //   this.tableLoading = true
  //   try {
  //     const res = await io.getList({
  //       cateId: this.currentSelectKeys,
  //       status: this.status,
  //       keyword: this.keyword,
  //       ...this.pagination,
  //       ...params,
  //     })
  //     runInAction(() => {
  //       this.list = res.data
  //       this.pagination = {
  //         pageSize: res.pageSize || 10,
  //         totalCount: res.totalCount,
  //         currentPage: res.currentPage,
  //       }
  //     })
  //   } catch (e) {
  //     errorTip(e.message)
  //   } finally {
  //     this.tableLoading = false
  //   }
  // }

  // 标签类目
  @action.bound async getTagCateTree(cb) {
    this.treeLoading = true

    try {
      const res = await io.getTagCateTree({
        id: this.objId,
        searchKey: this.searchKey,
        // ...window.defaultParams,
      })
      runInAction(() => {
        this.treeLoading = false
        this.searchExpandedKeys.clear()

        const list = res || []
        let data = list

        // 判断是否进行搜索
        if (this.searchKey) {
          data = list.map(item => {
            // 关键字搜索定位
            if (this.searchKey && item.name.includes(this.searchKey)) {
              this.findParentId(item.id, list, this.searchExpandedKeys)
            }
            return item
          })
        }

        if (!this.currentSelectKeys) {
          // 默认类目
          [this.defaultCate] = list.filter(d => d.aId === -1)
          this.currentSelectKeys = this.defaultCate.id
          this.nowCateIds = [this.defaultCate.id]
        }
        this.categoryData = list.filter(d => d.isLeaf !== 1) // 叶子类目
        this.treeData = listToTree(data)
      })
      if (cb) cb()
      this.getList({currentPage: 1})
    } catch (e) {
      runInAction(() => {
        this.treeLoading = false
      })
      errorTip(e.message)
    }
  }

  /**
   * @description 添加标签类目
   */
  @action async addNode(params, cb) {
    this.confirmLoading = true
    try {
      const res = await io.addTagCate({
        // ...window.defaultParams,
        objId: this.objId,
        ...params,
      })

      runInAction(() => {
        this.confirmLoading = false
        if (res.success) {
          successTip('操作成功')
          // 刷新类目树
          this.getTagCateTree(cb)
        } else {
          failureTip('操作失败')
        }
        userLog('标签管理/新建类目')
      })
    } catch (e) {
      runInAction(() => {
        this.confirmLoading = false
      })
      errorTip(e.message)
    }
  }

  /**
   * @description 编辑标签类目
   */
  @action async editNode(params, cb) {
    this.confirmLoading = true
    try {
      await io.editTagCate({
        // ...window.defaultParams,
        objId: this.objId,
        ...params,
      })

      runInAction(() => {
        this.confirmLoading = false
        successTip('操作成功')
        // 刷新类目树
        this.getTagCateTree()
        userLog('标签管理/编辑类目')
        if (cb) cb()
      })
    } catch (e) {
      runInAction(() => {
        this.confirmLoading = false
      })
      errorTip(e.message)
    }
  }

  /**
   * @description 删除标签类目
   * @param {*} params 
   * @param {*} cb 
   */
  @action async delNode(deleteIds, cb) {
    try {
      await io.delTagCate({
        deleteIds: [deleteIds],
      })
      successTip('操作成功')
      // 刷新类目树
      this.getTagCateTree()
      userLog('标签管理/删除类目')
      if (cb) cb()
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * @description 重名校验
   */
  @action async cateCheckName(params, cb) {
    try {
      const res = await io.cateCheckName({
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

  @action async checkName(params, cb) {
    try {
      const res = await io.checkTagCateName({
        objId: this.tagClassObjId,
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

  /**
   * @description 移动标签
   */
  @action async moveTag(params, cb) {
    this.confirmLoading = true
    try {
      const res = await io.moveTag(params)
      runInAction(() => {
        this.confirmLoading = false
        if (res.success) {
          successTip('操作成功')
          this.getTagCateTree()
          if (cb) cb()
        } else {
          failureTip('操作失败')
        }
      })
    } catch (e) {
      runInAction(() => {
        this.confirmLoading = false
      })
      errorTip(e.message)
    }
  }

  // 对象列表 - 对象类目
  @observable objCateList = []

  @action async getObjCate() {
    try {
      const res = await io.getObjCate()
      runInAction(() => {
        this.objCateList = changeToOptions(res)('name', 'id')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
