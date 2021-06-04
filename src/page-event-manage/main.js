import {useEffect, useState} from 'react'
import {Button, Table, Switch, Spin, Modal} from 'antd'
import {successTip, changeToOptions, errorTip} from '@util'
import {Search} from '../component'
import searchParams from './search'
import io from './io'

export default () => {
  const [listDate, setListDate] = useState([]) // 表格数据
  const [channelList, setChannelList] = useState([]) // 渠道列表
  const [searchParam, setSearchParam] = useState({}) // 搜索
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
        ...searchParam,
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

  useEffect(() => {
    getChannelList()
  }, [])
  useEffect(() => {
    getList({currentPage: 1})
  }, [searchParam])

  const columns = [
    {
      title: '渠道类型',
      dataIndex: 'touchCount',
      key: 'touchCount',
    },
    {
      title: '渠道名称',
      dataIndex: 'name',
      key: 'name',
    },
    
    {
      title: '事件名称',
      dataIndex: 'targetRate',
      key: 'targetRate',
    },
    {
      title: '事件描述',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '更新时间',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: '设为触发事件',
      dataIndex: 'touchEvent',
      key: 'touchEvent',
      render: (text, record) => <Switch defaultChecked onChange={() => console.log(record)} />,
    },
    {
      title: '设为目标事件',
      dataIndex: 'targetEvent',
      key: 'targetEvent',
      render: (text, record) => <Switch defaultChecked onChange={() => console.log(record)} />,
    },
  ]

  return (
    <div className="oa">
      <div className="content-header">事件管理</div>
      <div className="m16 mt72 bgf p16 pt0" style={{minHeight: 'calc(100vh - 137px)'}}>
        <Search
          onReset={() => console.log('重置')}
          onSearch={setSearchParam}
          params={searchParams(channelList)}
        />
        <Table 
          columns={columns} 
          dataSource={listDate} 
          rowClassName={(rowData, index) => `ant-table-row-${index % 2}`}
          scroll={{x: 1280}} 
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
