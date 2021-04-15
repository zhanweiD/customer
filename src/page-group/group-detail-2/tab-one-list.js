import React from 'react'
import {Table, Button} from 'antd'
import {toJS} from 'mobx'
import {inject} from 'mobx-react'
import {useObserver} from 'mobx-react-lite'

const colors = ['#1a98f3', '#59b7fb', '#a9d8fa', '#f3f4f9']


export default inject('store')(({store}) => {
  const columns = [
    {
      key: 'name',
      title: '',
      dataIndex: 'name',
      render: (text, record, i) => {
        return <div style={{color: i > 2 ? 'rgba(0,0,0,.65)' : '#fff', backgroundColor: colors[i > 3 ? 3 : i]}} className="table-box">{i + 1}</div>
      },
    }, {
      title: '标签',
      dataIndex: 'tagName',
      render: (text, record) => {
        return <a onClick={() => store.getDistributionByTag([record.tagId])}>{text}</a>
      },
    },
    // {
    //   key: 'tagValue',
    //   title: '标签属性',
    //   dataIndex: 'tagValue',
    // }, 
    {
      title: '标签用户数',
      dataIndex: 'nums',
    },
  ]

  return useObserver(() => (
    <div>
      <Button onClick={() => store.setData()}>设置 mock 数据</Button>
      <Table
        // onRow={record => {
        //   return {
        //     onClick: event => { 
        //       console.log('点击修改特征分布')
        //       console.log(record)
        //     }, // 点击行
        //   }
        // }}
        columns={columns}
        dataSource={store.topList}
        loading={store.tableLoading}
        pagination={false}
      />
    </div>
  ))
})
