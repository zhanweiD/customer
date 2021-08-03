const searchParams = tagList => {
  return [
    {
      label: '输出标签',
      key: 'outputTags',
      width: 720,
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
