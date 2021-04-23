import {
  observable, action, runInAction,
} from 'mobx'
import {successTip, errorTip, listToTree, userLog} from '../../../common/util'
import io from './io'

class TagCategoryStore {
  constructor(props) {
    this.props = props
    // 场景id
    this.sceneId = props.sceneId
    // 项目id
    this.projectId = props.projectId
  }

  @observable id = undefined

  @observable cateList = [] // 类目列表(平铺)
  @observable treeData = [] // 类目列表(树结构)

  @observable treeLoading = false // 获取类目树
  @observable expandAll = false // 是否展开全部树节点
  @observable searchExpandedKeys = [] // 关键字搜索展开的树节点

  @observable searchKey = undefined // 类目搜索关键词
  @observable currentTreeItemKey = false // 当前的类目key
  @observable getTagList // 刷新标签列表
  

  // 编辑状态
  @observable eStatus = {
    editObject: true,

    editCategory: false,
    editTag: false,
    moveTag: false,
  }

  // 弹窗显示控制
  @observable modalVisible = {
    // 对象操作弹窗标识
    editObject: false,
    // 类目操作弹窗标识
    editCategory: false,
    editTag: false,
    readCategory: false,

    // 选择标签弹窗标识
    selectTag: false,
  }

  // 选择对象
  @observable selectObj = []

  // 对象详情
  @observable objName = []

  // 类目详情
  @observable cateDetail = false
  // 标签详情
  @observable tagDetail = false

  // 弹框loading
  @observable detailLoading = false
  @observable confirmLoading = false

  // 可移动的标签类目树
  @observable moveTreeData = []


  // 当前选中的类目 用于添加类目展开
  currSelectCategory = undefined

  @action destory() {
    this.expandAll = false
    this.searchExpandedKeys = []
    this.searchKey = undefined
    this.currentTreeItemKey = false
    this.currSelectCategory = undefined
  }

  @action findParentId(id, data, expandedKeys) {
    data.forEach(item => {
      if (item.parentId !== 0 && item.id === id) {
        expandedKeys.push(item.parentId)
        this.findParentId(item.parentId, data, this.searchExpandedKeys)
      }
    })
  }

  // 获取类目数据
  @action.bound async getCategoryList(cb) {
    try {
      this.treeLoading = true
      let res = []

      if (this.searchKey) {
        res = await io.searchCategory({
          occasionId: this.sceneId,
          searchKey: this.searchKey,
        })
      } else {
        res = await io.getCategoryList({
          occasionId: +this.sceneId,
        })
      }


      runInAction(() => {
        this.treeLoading = false
        this.searchExpandedKeys.clear()
        let data = []
        let objId = []

        if (res.length) {
          if (res.length > 1) {
            // 对象id
            objId = res.filter(item => item.parentId === 0).map(item => item.id)
          }

          data = res.map(item => {
            // 关键字搜索定位
            if (this.searchKey && item.name.includes(this.searchKey)) {
              this.findParentId(item.id, res, this.searchExpandedKeys)
            }

            // 只有一个对象时 默认展开一级类目
            if (objId.length === 1 && objId.includes(item.parentId)) {
              this.findParentId(item.id, res, this.searchExpandedKeys)
            }
            return item
          })

          // 获取对象名字
          this.objName = res.filter(item => item.type === 2).map(item => item.name)
        }

        this.cateList.replace(data)
        this.treeData.replace(listToTree(data))

        if (cb) cb(data, listToTree(data))
      })
    } catch (e) {
      runInAction(() => {
        this.treeLoading = false
      })
      errorTip(e.message)
    }
  }

  // 选择对象 - 下拉框内容 
  @action async getSelectObj() {
    try {
      const res = await io.getSelectObj({
        projectId: this.projectId,
        occasionId: this.sceneId,
        searchKey: this.searchKey,
      })

      runInAction(() => {
        this.selectObj.replace(res)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 选择对象 - 保存
  @action async saveObj(params) {
    this.confirmLoading = true
    try {
      await io.saveObj({
        occasionId: this.sceneId,
        ...params,
        projectId: this.projectId,
      })

      runInAction(() => {
        successTip('操作成功')
        this.modalVisible.editObject = false
        this.confirmLoading = false
        // 刷新类目树 ？ 
        this.getCategoryList()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 类目 - 类目详情
  @action async getCategoryDetail() {
    try {
      this.detailLoading = true
      const res = await io.getCategoryDetail({
        occasionId: this.sceneId,
        catId: this.currentTreeItemKey,
        projectId: this.projectId,
      })
      runInAction(() => {
        this.cateDetail = res
        this.detailLoading = false
      })
    } catch (e) {
      runInAction(() => {
        this.detailLoading = false
      })
      errorTip(e.message)
    }
  }

  // 类目 - 更新类目(添加 / 编辑)
  @action async updateCategory(param, parentIsObj) {
    const params = {
      occasionId: this.sceneId,
      ...param,
      projectId: this.projectId,
    }
    this.confirmLoading = true

    try {
      // 编辑类目
      if (this.eStatus.editCategory) {
        await io.editCategory(params)
      } else if (parentIsObj) {
        // 对象-添加类目
        await io.addObjCategory(params)
      } else {
        // 类目-添加类目
        await io.addCategory(params)
      }

      runInAction(() => {
        successTip('操作成功')
        this.confirmLoading = false
        this.modalVisible.editCategory = false
        // this.objectDetail = false
        return this.getCategoryList()
      })
    } catch (e) {
      runInAction(() => {
        this.confirmLoading = false
      })
      errorTip(e.message)
    }
  }

  // 对象/类目/标签 - 删除节点
  @action async deleteNode(type, cb) {
    try {
      // type: 0 标签 1 类目 2 对象
      if (type === 2) {
        await io.deleteObject({
          occasionId: this.sceneId,
          projectId: this.projectId,
        })
      } else if (type === 1) {
        await io.deleteCategory({
          occasionId: this.sceneId,
          catId: this.currentTreeItemKey,
          projectId: this.projectId,
        })
      } else {
        await io.deleteTag({
          occasionId: this.sceneId,
          tagId: this.currentTreeItemKey,
          projectId: this.projectId,
        })
      }
      runInAction(() => {
        successTip('删除成功')
        if (type === 2) {
          userLog('场景管理/移除对象')
        } else if (type === 1) {
          userLog('场景管理/移除类目')
        } else {
          userLog('场景管理/移除标签')
        }
        // 删除对象
        if (type === 2) this.destory()

        this.getCategoryList(() => {
          // 删除标签重新请求 场景详情 因为场景详情里面有 标签数这个扑街
          if (cb) cb()
        })
        // // 如果要删除的节点和当前选中的是同一个, 则要跳转路由，且清空选中节点
        // if (this.cateId !== this.currentTreeItemKey) {
        //   this.getCategoryList(() => {
        //     // 父类目、跨父类目删除
        //     if (!toJS(this.cateList).filter(item => item.id === this.cateId).length) {
        //       this.props.history.push('/-1')
        //     }
        //   })
        // } else {
        //   this.props.history.push('/-1')
        //   this.getCategoryList()
        // }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 类目重命名校验
  @action async checkIsExist(params, cb) {
    try {
      const res = await io.checkIsExist({
        occasionId: this.sceneId,
        ...params,
        projectId: this.projectId,
      })

      runInAction(() => {
        if (cb) cb(res)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable selectObjLoading = false

  // 选择标签 - 树结构 
  // 所有标签
  @observable selectTagData = []
  // 树结构数据
  @observable selectTagTreeData = []
  @observable selectTagLoading = false
  // 标签列表
  @observable selectTagTableData = []
  @observable checkedKeys = []
  @observable checkedTagData = []
  @observable disabledKeys = []
  @observable disabledTagKeys = []

  // 标签 - 选择标签树结构
  @action async getSelectTag() {
    this.selectTagLoading = true

    try {
      const res = await io.selectTag({
        occasionId: this.sceneId,
        catId: this.currentTreeItemKey,
        projectId: this.projectId,
      })
      runInAction(() => {
        this.selectTagData.replace(res)
        this.selectTagTreeData.replace(listToTree(res))
        const usedList = res.filter(d => d.type === 0 && d.used).map(d => d && d.tag)
        const usedKeys = usedList.map(d => d.id)
        this.checkedTagData.replace(usedList)
        this.selectTagTableData.replace(usedList)
        this.checkedKeys.replace(usedKeys)
        this.disabledTagKeys = res.filter(d => (d.type === 0) && !d.status).map(d => d.id)
        this.disabledKeys = res.filter(d => (d.type === 0) && (!d.status || d.used)).map(d => d.id)
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.selectTagLoading = false
      })
    }
  }

  // 标签 - 选择标签保存
  @action async saveTag(param, cb) {
    this.confirmLoading = true
    try {
      await io.saveTag({
        occasionId: this.sceneId,
        catId: this.currentTreeItemKey,
        tagIdList: param,
        projectId: this.projectId,
      })
      runInAction(() => {
        if (cb) cb()
        successTip('操作成功')
        this.modalVisible.selectTag = false
        this.getCategoryList()
        if (this.getTagList) this.getTagList()
        userLog('场景管理/选择标签')
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

export default TagCategoryStore
