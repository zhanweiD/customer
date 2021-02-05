import {toJS} from 'mobx'

const serach = store => [
  {
    label: '应用名称',
    key: 'storageId',
    initialValue: '',
    control: {
      defaultAll: true,
      options: [
        ...toJS(store.sourceList),
      ],
    },
    component: 'select',
  }, 
  {
    label: '群体名称',
    key: 'groupId',
    initialValue: '',
    control: {
      defaultAll: true,
      options: [
        ...toJS(store.groupList),
      ],
    },
    component: 'select',
  },
]
export default serach
