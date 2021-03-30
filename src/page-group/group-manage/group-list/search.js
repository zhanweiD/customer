import {toJS} from 'mobx'

const serach = store => [
  {
    label: '实体',
    key: 'objId',
    initialValue: '',
    control: {
      defaultAll: true,
      options: [
        {name: '全部', value: ''},
        ...toJS(store.entityList),
      ],
    },
    component: 'select',
  }, 
  {
    label: '最近更新状态',
    key: 'status',
    initialValue: '',
    control: {
      defaultAll: true,
      options: [
        {name: '全部', value: ''},
        {name: '正常', value: 1},
        {name: '失败', value: 2},
        {name: '计算中', value: 3},
      ],
    },
    component: 'select',
  },
  {
    label: '群体名称',
    key: 'keyword',
    control: {
      placeholder: '请输入群体名称关键字搜索',
    },
    component: 'input',
  },
]
export default serach
