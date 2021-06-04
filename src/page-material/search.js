const searchParams = channelList => {
  return [
    {
      label: '素材类型',
      key: 'type',
      initialValue: '',
      control: {
        defaultAll: true,
        options: [
          {name: '全部', value: ''},
          {name: '图片', value: 0},
          {name: '二维码', value: 1},
          {name: '音频', value: 2},
          {name: '视频', value: 3},
        ],
      },
      component: 'select',
    }, 
    {
      label: '营销计划',
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
      label: '素材名称',
      key: 'name',
      control: {
        placeholder: '请输入素材名称',
      },
      component: 'input',
    },
  ]
}
export default searchParams
