import {Badge} from 'antd'

// 最后一次运行状态 0 运行中  1 成功  2 失败
export const getLastStatus = ({status}, fn) => {
  let color 
  let text
  switch (+status) {
    case 0: color = '#108ee9'; text = '运行中'; break
    case 1: color = '#87d068'; text = '运行成功'; break
    case 2: color = '#f50'; text = '运行失败'; break
    default: color = '#108ee9'; text = '运行中'; break
  }

  return <Badge color={color} text={text} />
}

// 方案状态 0 未完成、1 提交成功 2 提交失败 3提交中 4更新成功 5更新失败 6更新中
export const geVisualStatus = ({status}) => {
  let color 
  let text
  switch (+status) {
    case 0: color = '#d9d9d9'; text = '未完成'; break
    case 1: color = '#87d068'; text = '提交成功'; break
    case 2: color = '#f50'; text = '提交失败'; break
    default: color = '#d9d9d9'; text = '未完成'; break
  }

  return <Badge color={color} text={text} />
}

// 调度类型 0暂停 1启动
export const getScheduleType = ({status}, fn) => {
  let color 
  let text
  switch (+status) {
    case 0: color = '#d9d9d9'; text = '暂停'; break
    case 1: color = '#87d068'; text = '启动'; break
    default: color = '#d9d9d9'; text = '暂停'; break
  }

  return <Badge color={color} text={text} />
}

export const status = [
  {
    name: '未完成',
    value: 0,
  }, 
  {
    name: '提交成功',
    value: 1,
  }, {
    name: '提交失败',
    value: 2,
  }]
  
// 调度类型 0暂停 1启动
export const getTagStatus = ({status}, fn) => {
  let color 
  let text
  switch (+status) {
    case 0: color = '#d9d9d9'; text = '未使用'; break
    case 1: color = '#87d068'; text = '使用中'; break
    default: color = '#d9d9d9'; text = '未使用'; break
  }

  return <Badge color={color} text={text} />
}

export const tagStatusMap = [{
  name: '未使用',
  value: 0,
}, {
  name: '使用中',
  value: 1,
}]
