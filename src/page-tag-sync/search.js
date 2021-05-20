import {syncStatus} from './util'

const serach = ({
  objList,
}) => [
  {
    label: '计划名称',
    key: 'name',
    control: {
      placeholder: '请输入计划名称关键字',
    },
    component: 'input',
  }, {
    label: '对象',
    key: 'objId',
    initialValue: '',
    control: {
      defaultAll: true,
      options: objList,
    },
    component: 'select',
  }, {
    label: '计划状态',
    key: 'status',
    initialValue: '',
    control: {
      defaultAll: true,
      options: syncStatus,
    },
    component: 'select',
  }, 
]
export default serach
