import React from 'react'
import {Table} from 'antd'

const columns = [
  {
    title: '客户ID',
    dataIndex: 'id',
    key: 'id',
    render: text => <a>{text}</a>,
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '性别',
    dataIndex: 'sex',
    key: 'sex',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
]

const data = [
  {
    id: '13423',
    name: '卡卡',
    sex: 'male',
    age: 88,
  },
]

export default () => {
  return (
    <div className="p16" style={{minHeight: 'calc(100vh - 204px)'}}>
      <Table
        columns={columns}
        dataSource={data}
      />
    </div>
  )
}
