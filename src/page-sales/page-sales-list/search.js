const searchParams = userList => {
  return [
    // {
    //   label: '计划类型',
    //   key: 'type',
    //   initialValue: '',
    //   control: {
    //     defaultAll: true,
    //     options: [
    //       {name: '全部', value: ''},
    //       {name: '定时触发', value: 0},
    //       {name: '事件触发', value: 1},
    //     ],
    //   },
    //   component: 'select',
    // }, 
    {
      label: '创建人',
      key: 'userAccount',
      initialValue: null,
      control: {
        defaultAll: true,
        options: [
          {name: '全部', value: null},
          ...userList,
        ],
      },
      component: 'select',
    }, 
    {
      label: '最近状态',
      key: 'planStatus',
      initialValue: null,
      control: {
        defaultAll: true,
        options: [
          {name: '全部', value: null},
          {name: '未生效', value: '0'},
          {name: '已生效', value: '1'},
          {name: '暂停', value: '2'},
          {name: '已结束', value: '3'},
        ],
      },
      component: 'select',
    },
    // {
    //   label: '触达渠道',
    //   key: 'channelId',
    //   initialValue: '',
    //   control: {
    //     defaultAll: true,
    //     options: [
    //       {name: '全部', value: ''},
    //       ...channelList,
    //     ],
    //   },
    //   component: 'select',
    // },
    {
      label: '计划名称',
      key: 'planName',
      control: {
        placeholder: '请输入计划名称',
      },
      component: 'input',
    },
  ]
}
export default searchParams
