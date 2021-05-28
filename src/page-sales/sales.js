import {useEffect, useState} from 'react'
import {Button, Table, Popconfirm} from 'antd'
import {successTip, changeToOptions} from '@util'
import {Search} from '../component'
import searchParams from './search'
import io from './io'

export default () => {
  const [listDate, setListDate] = useState([]) // 表格数据
  const [userList, setUserList] = useState([]) // 用户列表
  const [channelList, setChannelList] = useState([]) // 渠道列表
  const [searchParam, setSearchParam] = useState({}) // 搜索
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    totle: 0,
  }) // 列表分页
  
  // 获取列表
  const getList = async params => {
    try {
      const res = await io.getList({
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
        ...params,
      })
      const {data, currentPage, pageSize, totalCount} = res
      setListDate(data)
      setPagination({
        current: currentPage,
        pageSize,
        totle: totalCount,
      })
    } catch (error) {
      console.log(error)
    } 
  }
  // 获取创建人
  const getUserList = async () => {
    try {
      const res = await io.getUserList()
      setUserList(changeToOptions(res || [])('userAccount', 'userId'))
    } catch (error) {
      console.log(error)
    }
  } 
  // 获取渠道
  const getChannelList = async () => {
    try {
      const res = await io.getChannelList()
      setChannelList(changeToOptions(res || [])('name', 'id'))
    } catch (error) {
      console.log(error)
    }
  }
  // 删除计划
  const delPlan = async id => {
    try {
      await io.delPlan({
        id,
      })
      getList({currentPage: 1})
      successTip('删除成功')
    } catch (error) {
      console.log(error)
    }
  }
  // 复制计划
  const copyPlan = async id => {
    try {
      await io.copyPlan({
        id,
      })
      getList({currentPage: 1})
      successTip('复制成功')
    } catch (error) {
      console.log(error)
    }
  }
  
  const editPlan = id => {
    window.open(`${window.__keeper.pathHrefPrefix}/sales/create/${id}`)
  }

  const columns = [
    {
      title: '营销计划名称',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
    },
    {
      title: '计划触达数',
      dataIndex: 'touchCount',
      key: 'touchCount',
    },
    {
      title: '目标完成率',
      dataIndex: 'targetRate',
      key: 'targetRate',
    },
    {
      title: '计划状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '创建时间',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: '结束时间',
      dataIndex: 'mTime',
      key: 'mTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => ([
        <a className="mr16" onClick={() => copyPlan(record.id)}>复制</a>,
        <a className="mr16" onClick={() => editPlan(record.id)}>编辑</a>,
        <Popconfirm
          title="确认删除计划吗?"
          onConfirm={() => delPlan(record.id)}
          onCancel={() => {}}
          okText="确定"
          cancelText="取消"
        >
          <a>删除</a>
        </Popconfirm>,
      ]),
    },
  ]

  const toCreate = () => {
    window.open(`${window.__keeper.pathHrefPrefix}/sales/create`)
  }
  
  useEffect(() => {
    getUserList()
    getChannelList()
  }, [])
  useEffect(() => {
    getList({currentPage: 1})
  }, [searchParam])

  return (
    <div className="oa">
      <div className="content-header">营销计划</div>
      <div className="m16 mt72 bgf p16" style={{height: 'calc(100vh - 137px)'}}>
        <Search
          onReset={() => console.log('重置')}
          onSearch={setSearchParam}
          params={searchParams(userList, channelList)}
        />
        <Button
          type="primary"
          style={{marginBottom: '8px'}}
          onClick={toCreate}
        >
          创建计划
        </Button>
        <Table 
          columns={columns} 
          dataSource={listDate} 
          scroll={{x: 960}} 
          pagination={{
            ...pagination,
            onChange: v => getList({currentPage: v}),
          }}
        />
      </div>
    </div>
  )
}
