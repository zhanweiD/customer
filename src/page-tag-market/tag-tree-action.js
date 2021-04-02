import React from 'react'
import {NoBorderInput} from '../component'

export default () => {
  const searchTree = () => {}
  
  return (
    <div>
      <NoBorderInput
        placeholder="请输入名称搜索"
        onChange={searchTree}
        onPressEnter={searchTree}
      />
    </div>
  )
}
