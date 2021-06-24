import {useEffect, useState} from 'react'
import {Button, Table, Switch, Spin, Modal} from 'antd'
import {successTip, changeToOptions, errorTip} from '@util'
import {authView, Search} from '../component'
import searchParams from './search'
import io from './io'

const EventManage = () => {
  const [listDate, setListDate] = useState([]) // 表格数据
  const [channelList, setChannelList] = useState([]) // 渠道列表
  const [accountList, setAccountList] = useState([]) // 渠道名称列表
  const [seaParams, setSeaParams] = useState({}) // 搜索
  const [tableLoading, setTableLoading] = useState(false) // 搜索loading
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  }) // 列表分页
  
  // 获取列表
  const getList = async params => {
    setTableLoading(true)
    try {
      const res = await io.getList({
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
        ...params,
        ...seaParams,
      })
      const {data, currentPage, pageSize, totalCount} = res
      setListDate(data)
      setPagination({
        current: currentPage,
        pageSize,
        total: totalCount,
      })
    } catch (error) {
      errorTip(error.message)
    } finally {
      setTableLoading(false)
    } 
  }

  // 获取渠道
  const getChannelList = async () => {
    try {
      const res = await io.getChannelList()
      setChannelList(changeToOptions(res || [])('name', 'id'))
    } catch (error) {
      errorTip(error.message)
    }
  }

  // 获取渠道名称
  const getAccountlList = async () => {
    try {
      const res = await io.getAccountlList()
      setAccountList(changeToOptions(res || [])('accountName', 'id'))
    } catch (error) {
      errorTip(error.message)
    }
  }

  // 设为目标事件
  const setTarget = async record => {
    try {
      await io.setTarget({
        id: record.id,
        isTarget: !record.isTarget,
      })
      getList()
    } catch (error) {
      errorTip(error.message)
    }
  }

  // 设为触发事件
  const setTrigger = async record => {
    try {
      await io.setTrigger({
        id: record.id,
        isTrigger: !record.isTrigger,
      })
      getList()
    } catch (error) {
      errorTip(error.message)
    }
  }

  useEffect(() => {
    getAccountlList()
    getChannelList()
  }, [])
  useEffect(() => {
    getList({currentPage: 1})
  }, [seaParams])

  const columns = [
    {
      title: '渠道类型',
      dataIndex: 'channelName',
      key: 'channelName',
    },
    {
      title: '渠道名称',
      dataIndex: 'accountName',
      key: 'accountName',
    },
    
    {
      title: '事件名称',
      dataIndex: 'eventName',
      key: 'eventName',
    },
    {
      title: '事件描述',
      dataIndex: 'eventDesc',
      key: 'eventDesc',
    },
    {
      title: '更新时间',
      dataIndex: 'mtime',
      key: 'mtime',
    },
    {
      title: '设为触发事件',
      dataIndex: 'isTrigger',
      key: 'isTrigger',
      render: (text, record) => <Switch defaultChecked={text} onChange={() => setTrigger(record)} />,
    },
    {
      title: '设为目标事件',
      dataIndex: 'isTarget',
      key: 'isTarget',
      render: (text, record) => <Switch defaultChecked={text} onChange={() => setTarget(record)} />,
    },
  ]

  return (
    <div className="oa FBV">
      <div className="content-header">事件管理</div>
      <div className="m16 bgf p16 pt0 custom-border FB1">
        <Search
          onReset={() => console.log('重置')}
          onSearch={setSeaParams}
          params={searchParams(channelList, accountList)}
        />
        <Table 
          columns={columns} 
          dataSource={listDate} 
          rowClassName={(rowData, index) => `ant-table-row-${index % 2}`}
          scroll={{x: 960}} 
          loading={tableLoading}
          pagination={{
            ...pagination,
            showTotal: () => `合计${pagination.total}条记录`,
            onChange: v => getList({currentPage: v}),
          }}
        />
      </div>
    </div>
  )
}
export default authView(EventManage)
