// 名称类型映射: 1 中文名 2 英文名
export const nameTypeMap = {
  name: 1,
  enName: 2,
}

// 标签配置方式 基础标签&衍生标签
export const tagConfigMethodTableMap = {
  0: '基础标签',
  1: '衍生标签',
}

export const getWhenData = data => {
  const newData = _.cloneDeep(data)

  newData.forEach(d => {
    const comparisionList = newData.filter(sd => sd.type === 2
       && (+sd.source[0] === d.x + 44) 
      && (+sd.source[1] === d.y + 16))

    const comparisionListResult = comparisionList.map(sd => ({
      comparision: sd.comparision,
      left: {
        function: sd.leftFunction,
        params: [
          sd.leftTagId,
        ],
      },
      right: {
        function: sd.rightFunction,
        params: [
          sd.rightParams,
        ],
      },
    }))

    if (comparisionListResult.length && !d.comparisionList) d.comparisionList = comparisionListResult

    const childList = newData.filter(sd => sd.type === 1 
      && sd.source
      && (+sd.source[0] === d.x + 44) 
      && (+sd.source[1] === d.y + 16))

    if (childList.length && !d.childList) {
      d.childList = childList
    }

    if (d.type === 1) {
      delete d.flag
      delete d.level
      delete d.source
      delete d.target
      delete d.type
      delete d.rightFunction
      delete d.rightParams
      delete d.leftFunction
      delete d.leftTagId
      delete d.y
      delete d.comparision
    }
  })

  return newData.filter(d => d.x === 0)
}
