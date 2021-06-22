import {useEffect, useState} from 'react'
import {Button, Table, Tabs, Badge, Select} from 'antd'
import {successTip, errorTip} from '@util'
import io from './io'
import {authView} from '../component'

const {TabPane} = Tabs

const ChannelManage = props => {
  const [listDate, setListDate] = useState([]) // 表格数据
  const [channelList, setChannelList] = useState([]) // 渠道列表
  const [channelCode, setChannelCode] = useState() // channelCode
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
        channelCode,
        ...params,
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

  // 获取渠道下账号个数
  const getAccount = async () => {
    try {
      const res = await io.getAccount()
      const item = res[0] || {}
      setChannelList(res || [])
      setChannelCode(item.code)
    } catch (error) {
      errorTip(error.message)
    }
  }

  // 启停用
  const setEnable = async record => {
    try {
      await io.setEnable({
        enable: !record.enable,
        id: record.id,
      })
      successTip(record.enable ? '暂停成功' : '启用成功')
      getList()
    } catch (error) {
      errorTip(error.message)
    }
  }

  // 授权跳转
  const authoriza = async () => {
    // const host = window.location.href.split('#')
    const host = window.location.href.split('/')
    // console.log(host[0])
    // window.open(`${host[0]}customer/index.html#/weappCode/${host[0]}`)
    // window.history.go(-3)
    // window.location.reload()
    window.open(`http://zdhyx.dc.dtwave.com/customer/index.html#/weappCode/${localStorage.getItem('userAccount')}/${host[2]}`)
    // window.open(`http://192.168.90.135:8173/customer_dev/index.html#/weappCode/${localStorage.getItem('userAccount')}/${host}`)
  }

  const changeTabs = v => {
    setChannelCode(v)
  }
  const columns = (name, type) => {
    return (
      [
        {
          title: name,
          dataIndex: 'accountName',
          key: 'accountName',
        },
        {
          title: type,
          dataIndex: 'accountType',
          key: 'accountType',
        },
        {
          title: '创建人',
          dataIndex: 'cuserName',
          key: 'cuserName',
        },
        {
          title: '更新时间',
          dataIndex: 'mtime',
          key: 'mtime',
        },
        {
          title: '账号状态',
          dataIndex: 'accountStatus',
          key: 'accountStatus',
          render: text => {
            if (text) {
              return <Badge color="green" text="授权成功" />
            }
            return <Badge color="default" text="授权失败" />
          },
        },
        {
          title: '是否启用',
          dataIndex: 'enable',
          key: 'enable',
          render: text => (text ? '启用' : '暂停'),
        },
        {
          title: '操作',
          key: 'action',
          render: (text, record) => ([
            <a onClick={() => setEnable(record)}>{record.enable ? '暂停' : '启用'}</a>,
            // <a onClick={() => authorization(record)}>重新授权</a>,
          ]),
        },
      ]
    )
  }
  const setTab = item => {
    const {name} = item
    let type = ''
    switch (name) {
      case '微信公众号':
        type = '公众号类型'
        break
      default:
        type = '短信'
        break
    }
    return (
      <Table 
        columns={columns(name, type)} 
        dataSource={listDate} 
        rowClassName={(rowData, index) => `ant-table-row-${index % 2}`}
        scroll={{x: 720}} 
        loading={tableLoading}
        pagination={{
          ...pagination,
          showTotal: () => `合计${pagination.total}条记录`,
          onChange: v => getList({currentPage: v}),
        }}
      />
    )
  }

  useEffect(() => {
    getAccount()
  }, [])
  useEffect(() => {
    if (channelCode) getList({currentPage: 1})
  }, [channelCode])

  return (
    <div className="oa">
      <div className="content-header">渠道管理</div>
      <div className="m16 mt72 bgf p16 pt0" style={{minHeight: 'calc(100vh - 137px)'}}>
        <div className="pt16 pr">
          <Button
            type="primary"
            style={{position: 'absolute', right: 0, zIndex: 1}}
            onClick={authoriza}
          >
            授权账号
          </Button>
        </div>
        <Tabs onChange={changeTabs} type="card">
          {
            channelList.map(item => (
              <TabPane tab={`${item.name}(${item.cnt})`} key={item.code}>
                {setTab(item)}
              </TabPane>
            ))
          }
        </Tabs>
      </div>
    </div>
  )
}
export default authView(ChannelManage)
