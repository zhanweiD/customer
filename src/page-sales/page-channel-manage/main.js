import {useEffect, useState} from 'react'
import {Button, Table, Tabs, Badge} from 'antd'
import {successTip, errorTip} from '@util'
import io from './io'
import {authView} from '../../component'
import {setColumns} from './util'
import AddDrawer from './add-drawer'

const {TabPane} = Tabs

const ChannelManage = () => {
  const [listDate, setListDate] = useState([]) // 表格数据
  const [channelList, setChannelList] = useState([]) // 渠道列表
  const [channelCode, setChannelCode] = useState() // channelCode
  const [tableLoading, setTableLoading] = useState(false) // 搜索loading
  const [drawerVisible, setDrawerVisible] = useState(false) // 搜索loading
  const [nowRecord, setNowRecord] = useState({}) // 搜索loading
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

  const setDrawer = v => {
    setDrawerVisible(v)
  }

  const editPermissions = record => {
    setDrawerVisible(true)
    setNowRecord(record)
  }

  // 授权跳转
  const authoriza = async name => {
    setNowRecord({})
    if (name === '微信公众号') {
      const host = window.location.href.split('/')
      window.open(`https://zdhyx.dtwave.com/customer/index.html#/weappCode/${localStorage.getItem('userAccount')}/${host[2]}/${1}`)
    }
    if (name === '微信小程序') {
      const host = window.location.href.split('/')
      window.open(`https://zdhyx.dtwave.com/customer/index.html#/weappCode/${localStorage.getItem('userAccount')}/${host[2]}/${2}`)
    }
    if (name === '阿里云短信') {
      setDrawer(true)
    }
  }

  const changeTabs = v => {
    setChannelCode(v)
  }

  const setTab = item => {
    const {name} = item
    let type = ''
    switch (name) {
      case '微信公众号':
        type = '公众号类型'
        break
      case '微信小程序':
        type = '微信小程序'
        break
      default:
        type = '短信'
        break
    }
    return (
      <div className="custom-border h-100">
        <div className="far pr16 mb8 mt16">
          <Button type="primary" onClick={() => authoriza(name)}>
            授权账号
          </Button>
        </div>
        <Table 
          columns={setColumns(editPermissions, setEnable, name, type)} 
          dataSource={listDate} 
          rowClassName={(rowData, index) => `ant-table-row-${index % 2}`}
          scroll={{x: 720}} 
          style={{margin: '0px 16px'}}
          loading={tableLoading}
          pagination={{
            ...pagination,
            showTotal: () => `合计${pagination.total}条记录`,
            onChange: v => getList({currentPage: v}),
          }}
        />
      </div>
    )
  }

  useEffect(() => {
    getAccount()
  }, [])
  useEffect(() => {
    if (channelCode) getList({currentPage: 1})
  }, [channelCode])

  return (
    <div className="oa FBV channel-manage">
      <div className="content-header">渠道管理</div>
      <div className="m16 pt0 FB1">
        <Tabs onChange={changeTabs} style={{height: '100%'}}>
          {
            channelList.map(item => (
              <TabPane tab={`${item.name}(${item.cnt})`} key={item.code}>
                {setTab(item)}
              </TabPane>
            ))
          }
        </Tabs>
        <AddDrawer
          drawerVisible={drawerVisible}
          closeDrawer={() => setDrawer(false)}
          getList={getList}
          record={nowRecord}
        />
      </div>
    </div>
  )
}
export default authView(ChannelManage)
