import {tagStatusMap} from '../util'

const serach = ({
  objList,
  schemeList,
}) => [
  {
    label: '对象名称',
    key: 'objIdList',
    control: {
      mode: 'multiple',
      options: objList,
    },
    component: 'select',
  }, {
    label: '衍生标签方案',
    key: 'tagDerivativeSchemeId',
    initialValue: '',
    control: {
      defaultAll: true,
      options: schemeList,
    },
    component: 'select',
  }, {
    label: '使用状态',
    key: 'isUsed',
    initialValue: '',
    control: {
      defaultAll: true,
      options: tagStatusMap,
    },
    component: 'select',
  }, {
    label: '标签名称',
    key: 'name',
    control: {
      placeholder: '请输入标签名称关键字',
    },
    component: 'input', 
  },
]
export default serach
