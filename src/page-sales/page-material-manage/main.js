import {useEffect, useState} from 'react'
import {Button, Table, Popconfirm, Spin, Modal} from 'antd'
import {successTip, changeToOptions, errorTip} from '@util'
import {Search} from '../../component'
import AddModal from './add-modal'
import searchParams from './search'
import groupImg from '../../icon/new-group1.svg'
import io from './io'

export default () => {
  const [addVisible, setAddVisible] = useState(false) // add visible
  const [previewVisible, setPreviewVisible] = useState(false) // add visible
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
  // 删除计划
  const delPlan = async id => {
    try {
      await io.delPlan({
        id,
      })
      getList({currentPage: 1})
      successTip('删除成功')
    } catch (error) {
      errorTip(error.message)
    }
  }

  const showAdd = v => {
    setAddVisible(v)
  }
  
  useEffect(() => {
    getChannelList()
  }, [])
  useEffect(() => {
    getList({currentPage: 1})
  }, [searchParam])

  const columns = [
    {
      title: '素材名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'touchCount',
      key: 'touchCount',
    },
    {
      title: '内容',
      dataIndex: 'targetRate',
      key: 'targetRate',
    },
    {
      title: '描述',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '大小',
      dataIndex: 'ctime',
      key: 'ctime',
    },
    {
      title: '创建人',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: '创建时间',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => ([
        <a className="mr16" onClick={() => setPreviewVisible(true)}>查看</a>,
        <a className="mr16" onClick={() => console.log(record)}>编辑</a>,
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

  return (
    <div className="oa">
      <div className="content-header">素材管理</div>
      <div className="m16 bgf p16 pt0" style={{minHeight: 'calc(100vh - 137px)'}}>
        <Search
          onReset={() => console.log('重置')}
          onSearch={setSearchParam}
          params={searchParams(channelList)}
        />
        <Button
          type="primary"
          style={{marginBottom: '8px'}}
          onClick={() => showAdd(true)}
        >
          上传素材
        </Button>
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
        <AddModal 
          visible={addVisible} 
          setVisible={showAdd}
        />
        <Modal
          visible={previewVisible}
          // title="素材"
          footer={null}
          onCancel={() => setPreviewVisible(false)}
        >
          <img className="mb16" alt="example" style={{width: '100%'}} src={groupImg} />
        </Modal>
      </div>
    </div>
  )
}
