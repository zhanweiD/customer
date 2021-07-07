import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {Button, Table, Popconfirm, Badge, Tooltip} from 'antd'
import {QuestionCircleFilled} from '@ant-design/icons'
import {successTip, changeToOptions, errorTip} from '@util'
import {authView, Search, Tag} from '../../component'
import searchParams from './search'
import AddDrawer from './add-drawer'
import io from './io'

const Sales = () => {
  const [listDate, setListDate] = useState([]) // 表格数据
  const [userList, setUserList] = useState([]) // 用户列表
  const [planInfo, setPlanInfo] = useState({}) // 计划详情
  const [detailLoading, setDetailLoading] = useState(false) // 计划详情loading
  const [addLoading, setAddLoading] = useState(false) // addloading
  const [searchParam, setSearchParam] = useState({}) // 搜索
  const [tableLoading, setTableLoading] = useState(false) // 搜索
  const [showModal, setShowModal] = useState(false) // 创建计划
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
  const setModal = v => {
    setShowModal(v)
  }
  // 获取创建人
  const getUserList = async () => {
    try {
      const res = await io.getUserList()
      setUserList(changeToOptions(res || [])('userName', 'userAccount'))
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
  // 复制计划
  const copyPlan = async id => {
    try {
      await io.copyPlan({
        id,
      })
      getList({currentPage: 1})
      successTip('复制成功')
    } catch (error) {
      errorTip(error.message)
    }
  }
  // 创建计划
  const addPlan = async params => {
    setAddLoading(true)
    try {
      const res = await io.addPlan({
        ...params,
      })
      if (res) {
        successTip('创建成功')
        setModal(false)
        window.location.href = `${window.__keeper.pathHrefPrefix}/sales/list/create/${res}`
      }
    } catch (error) {
      errorTip(error.message)
    } finally {
      setAddLoading(false)
    }
  }
  // 编辑计划
  const editPlan = async params => {
    setAddLoading(true)
    try {
      await io.editPlan({
        ...params,
      })
      successTip('编辑成功')
      setModal(false)
    } catch (error) {
      errorTip(error.message)
    } finally {
      setAddLoading(false)
    }
  }
  // 计划详情
  const detailPlan = async id => {
    setModal(true)
    setDetailLoading(true)
    try {
      const res = await io.detailPlan({
        id,
      })
      setPlanInfo(res)
      setDetailLoading(false)
    } catch (error) {
      errorTip(error.message)
    }
  }
  // 启动计划
  const startPlan = async id => {
    try {
      await io.startPlan({
        id,
      })
      getList()
      successTip('启动成功')
    } catch (error) {
      errorTip(error.message)
    }
  }
  // 暂停计划
  const stopPlan = async id => {
    try {
      await io.stopPlan({
        id,
      })
      getList()
      successTip('暂停成功')
    } catch (error) {
      errorTip(error.message)
    }
  }

  const toStrategy = record => {
    window.location.href = `${window.__keeper.pathHrefPrefix}/sales/list/create/${record.id}`
  }

  const columns = [
    {
      title: '营销计划名称',
      dataIndex: 'planName',
      key: 'planName',
      width: 200,
      render: (text, record) => (
        record.targetStatisticsStatus === 0 ? (
          <div>
            <Link target="_blank" to={`/sales/list/detail/${record.id}`}>
              <span className="mr4">{text}</span>
            </Link>
            <Tag text="结果统计中" status="process" />
          </div>
        ) : (
          <div>
            <Link target="_blank" to={`/sales/list/detail/${record.id}`}>
              <span className="mr4">{text}</span>
            </Link>
          </div>
        )
      ),
    },
    {
      title: '计划触达数',
      dataIndex: 'touchCount',
      key: 'touchCount',
      width: 110,
      render: text => text || '-',
    },
    {
      title: '目标完成率',
      dataIndex: 'targetRate',
      key: 'targetRate',
      width: 110,
      render: text => (text ? `${text}%` : '-'),
    },
    {
      title: '计划状态',
      dataIndex: 'planStatus',
      key: 'planStatus',
      width: 140,
      render: (text, record) => {
        let status = ''
        let color = ''
        switch (text) {
          case 0:
            status = '未生效'
            color = 'default'
            break
          case 1:
            status = '已生效'
            color = 'green'
            break
          case 2:
            status = '已暂停'
            color = 'orange'
            break
          default:
            status = '已结束'
            color = 'blue'
            break
        }
        if (record.remark && text === 2) {
          return (
            <div className="FBH">
              <Badge status="red" text={status} />
              <Tooltip title={record.remark}>
                <QuestionCircleFilled style={{color: 'red', marginLeft: 4, marginTop: 4, fontSize: 14}} />
              </Tooltip>
            </div>
          )
        }
        return <Badge status={color} text={status} />
      },
    },
    // {
    //   title: '创建时间',
    //   dataIndex: 'ctime',
    //   key: 'ctime',
    // },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 200,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 200,
    },
    {
      title: '修改时间',
      dataIndex: 'mtime',
      key: 'mtime',
      width: 200,
    },
    {
      title: '操作',
      key: 'action',
      width: 240,
      render: (text, record) => ([
        <a 
          className="mr16" 
          style={{display: record.planStatus === 3 ? 'none' : 'inline-block'}}
          onClick={() => (record.planStatus === 1 ? stopPlan(record.id) : startPlan(record.id))}
        >
          {record.planStatus === 1 ? '暂停' : '启动'}
        </a>,
        record.planStatus === 0 ? (
          <a className="mr16" onClick={() => detailPlan(record.id)}>编辑</a>
        ) : <a className="disabled mr16">编辑</a>,
        // <a className="mr16" onClick={() => copyPlan(record.id)}>复制</a>,
        record.planStatus === 0 ? (
          <a className="mr16" onClick={() => toStrategy(record)}>策略管理</a>
        ) : (<a className="disabled mr16">策略管理</a>),
        record.planStatus === 1 ? (<a className="disabled">删除</a>) : (
          <Popconfirm
            title="确认删除计划吗?"
            onConfirm={() => delPlan(record.id)}
            onCancel={() => {}}
            okText="确定"
            cancelText="取消"
          >
            <a>删除</a>
          </Popconfirm>
        ),
      ]),
    },
  ]

  useEffect(() => {
    getUserList()
  }, [])
  useEffect(() => {
    getList({currentPage: 1})
  }, [searchParam])

  return (
    <div className="oa FBV">
      <div className="content-header">营销计划</div>
      <div 
        className="m16 bgf p24 pt0 custom-border FB1" 
        style={{
          position: 'relative',
          overflowY: 'auto',
        }}
      >
        <Search
          onReset={() => console.log('重置')}
          onSearch={setSearchParam}
          params={searchParams(userList)}
        />
        <Button
          type="primary"
          style={{marginBottom: '8px'}}
          onClick={() => {
            setPlanInfo({})
            setModal(true)
          }}
        >
          创建计划
        </Button>
        <div className="ant-table-custom-wrapper">
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
          <AddDrawer 
            showModal={showModal}
            setModal={setModal}
            addPlan={addPlan}
            editPlan={editPlan}
            planInfo={planInfo}
            detailLoading={detailLoading}
            addLoading={addLoading}
          />
        </div>
      </div>        
    </div>
  )
}
export default authView(Sales)
