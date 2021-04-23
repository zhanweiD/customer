import ioContext from '../../../common/io-context'
import {
  sceneApi, post,
} from '../../../common/util'

const api = {
  getCategoryList: post(`${sceneApi}/listTree`), // 获取类目列表
  searchCategory: post(`${sceneApi}/treeSearch`), // 搜索
  
  //* ------------------------------ 对象-相关接口 ------------------------------*//
  getSelectObj: post(`${sceneApi}/selectObj`), // 选择对象-下拉框内容 
  saveObj: post(`${sceneApi}/saveObj`), // 选择对象-保存
  deleteObject: post(`${sceneApi}/tree/obj/delObj`), // 对象-移除对象

  //* ------------------------------ 类目-相关接口 ------------------------------*//
  getCategoryDetail: post(`${sceneApi}/catDetail`), // 类目详情
  addObjCategory: post(`${sceneApi}/objAddCat`), // 对象-添加类目
  addCategory: post(`${sceneApi}/catAddCat`), // 类目-添加类目
  editCategory: post(`${sceneApi}/editCat`), //  类目-编辑类目
  deleteCategory: post(`${sceneApi}/catDel`), // 类目-删除类目

  //* ------------------------------ 标签-相关接口 ------------------------------*//
  selectTag: post(`${sceneApi}/selectTags`), // 选择标签-树
  saveTag: post(`${sceneApi}/catSaveTag`), // 选择标签-保存
  deleteTag: post(`${sceneApi}/tagDel`), // 标签 - 移除
  checkIsExist: post(`${sceneApi}/checkCatName`), // 重名校验
}

ioContext.create('sceneTagCategory', api)

export default ioContext.api.sceneTagCategory
