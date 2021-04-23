import {toJS} from 'mobx'

const serach = store => [
  // {
  //   label: '选择页面',
  //   key: 'selectPage',
  //   initialValue: '',
  //   control: {
  //     defaultAll: true,
  //     options: [
  //       {name: '全部', value: ''},
  //       {name: '其他', value: 1},
  //       // ...toJS(store.entityList),
  //     ],
  //   },
  //   component: 'select',
  // }, 
  // {
  //   label: '操作类型',
  //   key: 'operationType',
  //   initialValue: '',
  //   control: {
  //     defaultAll: true,
  //     mode: 'multiple',
  //     showArrow: true,
  //     allowClear: true,
  //     options: [
  //       {name: '全部', value: ''},
  //       {name: '登陆系统', value: 1},
  //       {name: '退出系统', value: 2},
  //       {name: '增加', value: 3},
  //       {name: '修改', value: 4},
  //       {name: '删除', value: 5},
  //     ],
  //   },
  //   component: 'select',
  // },
  {
    label: '搜索',
    key: 'keyWord',
    control: {
      placeholder: '请输入用户名或账号',
    },
    component: 'input',
  },
  {
    label: '选择时间',
    key: 'selectTime',
    control: {
      // defaultAll: true,
      onChange: value => {
        store.reqDate = {
          startTime: value ? value[0].format('YYYY-MM-DD') : '',
          endTime: value ? value[1].format('YYYY-MM-DD') : '',
        }
      }, 
    },
    component: 'rangePicker',
  }, 
]
export default serach
