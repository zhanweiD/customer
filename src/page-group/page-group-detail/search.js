const searchParams = tagList => {
  return [
    {
      label: '输出标签',
      key: 'outputTag',
      control: {
        mode: 'multiple',

        options: [
          ...tagList,
        ],
      },
      component: 'select',
    }, 
  ]
}
export default searchParams
