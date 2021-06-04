const searchParams = channelList => {
  return [
    {
      label: '渠道类型',
      key: 'type',
      initialValue: '',
      control: {
        defaultAll: true,
        options: [
          {name: '全部', value: ''},
          {name: '微信公众号', value: 0},
        ],
      },
      component: 'select',
    }, 
    {
      label: '渠道名称',
      key: 'channelId',
      // initialValue: '',
      control: {
        placeholder: '请选择计划',
        options: [
          ...channelList,
        ],
      },
      component: 'select',
    },
    {
      label: '触发事件',
      key: 'touchEvent',
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
      key: 'targetEvent',
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
