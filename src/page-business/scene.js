import React, {useEffect} from 'react'
import {Button, Input, Table, Cascader, Drawer, Popconfirm} from 'antd'
import {inject} from 'mobx-react'
import {useObserver} from 'mobx-react-lite'
import _ from 'lodash'
import MyForm from './scene-form'

const {Search} = Input

export default inject('store')(({store}) => {
  const showEdit = record => {
    store.isEdit = true
    store.domainOption = _.filter(store.domainList, e => e.parentCode === record.pp_bizCode)
    store.formInitValue = record

    store.drawerVis = true
  }

  const columns = [
    {
      title: '场景名称',
      dataIndex: 'bizName',
    }, {
      title: '场景Code',
      dataIndex: 'bizCode',
    }, {
      title: '所属业态',
      dataIndex: 'pp_bizName',
    }, {
      title: '所属业务域',
      dataIndex: 'p_bizName', // 要自己查找处理
    }, {
      title: '场景描述',
      dataIndex: 'descr',
    }, {
      title: '操作',
      render: (text, record) => {
        return (
          <div>
            <span className="ac hand mr8" onClick={() => showEdit(record)}>编辑</span>
            <Popconfirm
              title="你确定要删除该业务域吗？"
              onConfirm={() => store.deleteScene([record.bizCode])}
            >
              <span className="ac hand">删除</span>
            </Popconfirm>
          </div>
        )
      },
    },
  ]

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      store.selectedRows = selectedRows
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  }

  const multiDelete = () => {
    store.deleteScene(_.map(store.selectedRows, 'bizCode'))
  }

  const handlePageChange = (curPage, pageSize) => {
    store.pagination.pageSize = pageSize
    store.pagination.currentPage = curPage
    store.getList()
  }

  const cascaderChange = e => {
    if (e.length > 0) {
      [, store.tableParentCode] = e
    } else {
      store.tableParentCode = undefined
    }

    store.pagination.currentPage = 1
    store.getList()
  }

  useEffect(() => {
    store.getList()
    store.getDomainFormatList()
  }, [])

  return useObserver(() => (
    <div className="tab-box">
      <div className="FBH FBJB mb8">
        <div className="FBH">
          <Button 
            type="primary" 
            onClick={() => {
              store.formInitValue = {}
              store.isEdit = false
              store.drawerVis = true
            }}
          >
            添加场景
          </Button>
          <Popconfirm
            title="你确定要删除该业态吗？"
            onConfirm={() => multiDelete()}
          >
            <Button 
              className="ml8"
              disabled={store.selectedRows.length === 0}
            >
              {`删除场景(${store.selectedRows.length})`}
            </Button>
          </Popconfirm>
        </div>
        <div className="FBH">
          <Cascader 
            options={store.domainFormatOption} 
            placeholder="请选择" 
            onChange={e => cascaderChange(e)}
          />
          <Search placeholder="请输入场景名称" className="ml8" />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={store.tableData}
        loading={store.tableLoading}
        rowSelection={{
          ...rowSelection,
        }}
        pagination={{
          pageSize: store.pagination.pageSize,
          current: store.pagination.currentPage,
          total: store.pagination.totalCount,
          onChange: handlePageChange,
          // onChange={() => console.log(111)}
          showTotal: () => `合计${store.pagination.totalCount}条记录`,
        }}
      />
      <Drawer
        title={store.isEdit ? '编辑场景' : '添加场景'}
        width={560}
        visible={store.drawerVis}
        onClose={() => store.drawerVis = false}
        maskClosable={false}
        destroyOnClose
      >
        <MyForm />
      </Drawer>
    </div>
  ))
})
