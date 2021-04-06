import treeUnfold from '../../icon/tree-unfold.svg'
import treeFold from '../../icon/tree-fold.svg'

export const deleteTipsMap = {
  category: {
    title: '删除对象类目',
    content: '对象类目被删除后不可恢复，确定删除？',
  },
  obj: {
    title: '删除对象',
    content: '对象被删除后不可恢复，确定删除？',
  },
}

// 类型映射:0 类目 1 对象
export const targetTypeMap = {
  obj: 1,
  category: 0,
}

// 名称类型映射: 1 中文名 2 英文名
export const nameTypeMap = {
  name: 1,
  enName: 2,
  objPk: 3,
}

export const TARGET_CATEGORY = 'category' // 对象类目
export const TARGET_OBJECT = 'obj' // 对象
export const REL_CODE = '3'
export const ENTITY_CODE = '4'

// 弹窗默认配置
export const modalDefaultConfig = {
  width: 525,
  maskClosable: false,
  destroyOnClose: true,
}

export const getIconNodeSrc = e => (e ? treeUnfold : treeFold)

// 对象类目带有对象数量提示
export const TreeNodeTitle = ({node}) => (
  <span>
    {
      node.parentId ? node.name : `${node.name} (${node.count || 0})`
    }
  </span>
)

export const judgeEditType = (data, editType) => (editType === 'edit' ? data : undefined)
//* --------------- 对象详情 ---------------*//
// 根据 实体/对象 类型code() 映射对应文字
export const typeCodeMap = {
  4: '实体',
  3: '关系',
  '4～': '关系',
  '3～': '实体',
}

// 对象发布状态值映射
export const objStatusMap = {
  release: 1,
  cancel: 0,
}

// 对象类型映射
export const objTypeMap = {
  0: '简单关系',
  1: '复杂关系',
  2: '实体',
}

export const objTypeList = [{
  name: '简单关系',
  value: 0,
}, {
  name: '复杂关系',
  value: 1,
}, {
  name: '实体',
  value: 2,
}]
