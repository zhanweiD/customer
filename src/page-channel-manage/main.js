import {useEffect, useState} from 'react'
import {Button, Table, Switch, Spin, Select} from 'antd'
import {successTip, changeToOptions, errorTip} from '@util'
import io from './io'

const {Option} = Select

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

  const enable = v => {
    console.log(v)
  }
  const authorization = v => {
    console.log(v)
  }

  useEffect(() => {
    getChannelList()
  }, [])
  useEffect(() => {
    getList({currentPage: 1})
  }, [searchParam])

  const columns = [
    {
      title: '微信公众号名称',
      dataIndex: 'touchCount',
      key: 'touchCount',
    },
    {
      title: '公众号类型',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '创建人',
      dataIndex: 'targetRate',
      key: 'targetRate',
    },
    {
      title: '更新时间',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: '账号状态',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: '是否启用',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => ([
        <a className="mr16" onClick={() => enable(record)}>启用</a>,
        <a onClick={() => authorization(record)}>重新授权</a>,
      ]),
    },
  ]

  return (
    <div className="oa">
      <div className="content-header">渠道管理</div>
      <div className="m16 mt72 bgf p16 pt0" style={{minHeight: 'calc(100vh - 137px)'}}>
        <div className="pt16 mb8 FBH FBJB">
          <Button
            type="primary"
            onClick={() => console.log(111)}
          >
            授权账号
          </Button>
          <Select style={{width: 160}} defaultValue="">
            <Option value="">全部</Option>
            <Option value="1">微信公众号</Option>
            <Option value="2">邮件</Option>
            <Option value="3">短信</Option>
            <Option value="4">App推送</Option>
            <Option value="5">WebHook</Option>
          </Select>
        </div>
        
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
