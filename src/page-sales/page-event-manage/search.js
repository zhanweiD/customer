const searchParams = (channelList, accountList) => {
  return [
    {
      label: '渠道类型',
      key: 'channelId',
      initialValue: '',
      control: {
        defaultAll: true,
        options: [
          {name: '全部', value: ''},
          ...channelList,
        ],
      },
      component: 'select',
    }, 
    {
      label: '渠道名称',
      key: 'accountId',
      initialValue: '',
      control: {
        defaultAll: true,
        options: [
          {name: '全部', value: ''},
          ...accountList,
        ],
      },
      component: 'select',
    },
    {
      label: '触发事件',
      key: 'isTrigger',
      initialValue: '',
      control: {
        defaultAll: true,
        options: [
          {name: '全部', value: ''},
          {name: '否', value: 0},
          {name: '是', value: 1},
        ],
      },
      component: 'select',
    }, 
    {
      label: '目标事件',
      key: 'isTarget',
      initialValue: '',
      control: {
        defaultAll: true,
        options: [
          {name: '全部', value: ''},
          {name: '否', value: 0},
          {name: '是', value: 1},
        ],
      },
      component: 'select',
    }, 
    {
      label: '事件名称',
      key: 'name',
      control: {
        placeholder: '请输入事件名称',
      },
      component: 'input',
    },
  ]
}
export default searchParams
