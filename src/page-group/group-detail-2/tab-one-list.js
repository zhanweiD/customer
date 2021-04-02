import React from 'react'
import {Table} from 'antd'

const colors = ['#1a98f3', '#59b7fb', '#a9d8fa', '#f3f4f9']

const columns = [
  {
    key: 'name',
    title: '',
    dataIndex: 'name',
    render: (record, index, i) => {
      return <div style={{color: i > 2 ? 'rgba(0,0,0,.65)' : '#fff', backgroundColor: colors[i > 3 ? 3 : i]}} className="table-box">{i + 1}</div>
    },
  }, {
    key: 'tag',
    title: '标签',
    dataIndex: 'tag',
  }, 
  // {
  //   key: 'tagValue',
  //   title: '标签属性',
  //   dataIndex: 'tagValue',
  // }, 
  {
    key: 'count',
    title: '标签用户数',
    dataIndex: 'count',
  },
]

const datas = [
  {
    tag: '热爱户外类活动',
    count: 12344444,
  }, {
    tag: '仓前一号',
    count: 300,
  }, {
    tag: '仓前一号',
    count: 500,
  }, {
    tag: '仓前一号',
    count: 600,
  }, {
    tag: '仓前一号',
    count: 700,
  }, {
    tag: '仓前一号',
    count: 900,
  },
]

export default () => {
  return (
    <Table
      columns={columns}
      dataSource={datas}
      // loading={tgiLoading}
      pagination={false}
      showHeader={false}
      // onRow={record => ({
      //   onClick: () => this.selectField(record),
      // })}
    />
  )
}
