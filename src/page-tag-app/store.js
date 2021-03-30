import {
  action, runInAction, observable, toJS,
} from 'mobx'
import {errorTip, successTip} from '../common/util'
import io from './io'

const listToTree = data => {
  const newData = _.cloneDeep(data)

  newData.forEach(item => {
    const children = newData.filter(sitem => sitem.parentId === item.id)
    if (children.length && !item.children) item.children = children
  })

  return newData.filter(item => item.parentId === 0)
}
class Store {
  //* *********** tree start ****************/
  @observable searchKey // 类目树搜索值
  @observable selectedKey = null // 选中的标签id
  @observable selectChild = null // 选中的标签
  @observable cardDetail = {} // 指标卡信息
  @observable list = [] // 
  
  @observable treeLoading = false
  @observable currentKey = undefined
  @observable expandAll = false
  @observable detailLoading = true // 详情加载
  @observable treeData = [] // 类目树数据
  @observable searchExpandedKeys = [] // 关键字搜索展开的树节点
  @observable currentSelectKeys = [] // 默认展开的树节点
  @observable selectTags = []
  @observable treeList = []
  @observable objId = null // 对象id

  defaultKey = data => {
    return data.children.find(item => item.aid === -1)
  }

  @action async getTreeData() {
    this.treeLoading = true
    this.currentSelectKeys = []
    this.selectTags = []
    try {
      const res = await io.getTreeData({
        keyword: this.searchKey,
      })
      runInAction(() => {
        this.treeList = res || []
        this.treeData = this.treeList.filter(item => item.parentId === 0)
        this.objId = this.treeData[0].aid
        this.selectedKey = this.treeData[0].aid
        this.getDetail()
      })
      // runInAction(() => {
      //   this.treeList = res || []
      //   this.treeData = listToTree(toJS(res)) || []
      //   this.objId = this.treeData[0].aid
      //   if (this.treeData.length) {
      //     if (!this.selectedKey) {
      //       this.selectChild = this.defaultKey(toJS(this.treeData[0])) // 生成默认选中的标签
      //       if (!this.selectChild) return
      //       this.selectedKey = this.selectChild.id
      //     }
      //     this.getDetail()
      //   }
      // })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.treeLoading = false
    }
  }

  @action async getDetail() {
    this.detailLoading = true
    try {
      const res = await io.getDetail({
        id: this.selectedKey,
      })
      runInAction(() => {
        this.cardDetail = res
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.detailLoading = false
      })
    }
  }
}

export default new Store()
